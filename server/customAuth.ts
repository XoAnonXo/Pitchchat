import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Session configuration
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    pool,
    createTableIfMissing: true,
    tableName: "sessions",
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key-here",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for email/password
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.password) {
            return done(null, false, { message: "Please sign in with social provider" });
          }

          const isValid = await comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Configure Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // Use the production domain for Google OAuth
    // This must match what's configured in Google OAuth Console
    const baseUrl = process.env.PRODUCTION_URL || 'https://pitchchat.ai';
    
    console.log('Google OAuth callback URL:', `${baseUrl}/api/auth/google/callback`);
    
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${baseUrl}/api/auth/google/callback`,
      proxy: true,
      scope: ["profile", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
        
        if (!user) {
          // Create new user from Google profile
          user = await storage.createUser({
            email: profile.emails?.[0]?.value || "",
            username: profile.emails?.[0]?.value?.split("@")[0] || profile.displayName || "user",
            password: await hashPassword(randomBytes(32).toString("hex")), // Random password for OAuth users
            firstName: profile.name?.givenName || null,
            lastName: profile.name?.familyName || null,
            profileImageUrl: profile.photos?.[0]?.value || null,
            provider: "google",
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          // Link existing account to Google
          await storage.upsertUser({
            ...user,
            googleId: profile.id,
            profileImageUrl: user.profileImageUrl || profile.photos?.[0]?.value || null,
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }));
  }

  // Auth routes
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { email, password, confirmPassword } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        provider: "local",
      });

      // Send welcome email
      const { sendWelcomeEmail } = require("./brevo");
      sendWelcomeEmail(user.email, user.firstName).catch(err => 
        console.error('Failed to send welcome email:', err)
      );

      // Log them in
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    })(req, res, next);
  });

  app.get("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/auth");
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Sync subscription status with Stripe if customer exists
    const user = req.user as any;
    if (user?.stripeCustomerId && process.env.STRIPE_SECRET_KEY) {
      try {
        const Stripe = await import("stripe");
        const stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2024-12-18.acacia",
        });
        
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active',
          limit: 1
        });
        
        if (subscriptions.data.length > 0) {
          const sub = subscriptions.data[0];
          await storage.updateUserSubscription(user.id, {
            stripeSubscriptionId: sub.id,
            subscriptionStatus: sub.status,
            subscriptionCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            subscriptionIsAnnual: sub.items.data[0]?.price?.id === 'price_1Ruu7zFbfaTMQEZOUT3v0FeI'
          });
          // Update user object with latest subscription info
          user.stripeSubscriptionId = sub.id;
          user.subscriptionStatus = sub.status;
          user.subscriptionCurrentPeriodEnd = new Date(sub.current_period_end * 1000);
          user.subscriptionIsAnnual = sub.items.data[0]?.price?.id === 'price_1Ruu7zFbfaTMQEZOUT3v0FeI';
        }
      } catch (error: any) {
        console.log('Subscription sync skipped:', error.message);
      }
    }
    
    res.json(user);
  });

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth" }),
    (req, res) => {
      // Successful authentication, redirect to dashboard
      const baseUrl = process.env.PRODUCTION_URL || 'https://pitchchat.ai';
      res.redirect(baseUrl);
    }
  );

  // Forgot password
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: "If an account exists, a reset email has been sent" });
      }

      if (user.provider !== "local") {
        return res.status(400).json({ message: "Please sign in with your social provider" });
      }

      // Create reset token
      const resetToken = await storage.createPasswordResetToken(user.id);
      
      // Send email using Brevo
      const { sendPasswordResetEmail } = require("./brevo");
      await sendPasswordResetEmail(email, resetToken);

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Reset password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Get token
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Update password
      const hashedPassword = await hashPassword(password);
      await storage.updateUserPassword(resetToken.userId, hashedPassword);
      
      // Delete token
      await storage.deletePasswordResetToken(token);

      // Send password changed email
      const user = await storage.getUser(resetToken.userId);
      if (user && user.email) {
        const { sendPasswordChangedEmail } = require("./brevo");
        sendPasswordChangedEmail(user.email).catch(err => 
          console.error('Failed to send password changed email:', err)
        );
      }

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};