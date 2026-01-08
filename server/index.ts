import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log, runWithRequestContext } from "./vite";
import { registerPseoProxy } from "./pseoProxy";
import { randomUUID } from "crypto";

const app = express();

// Rate limiting configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
  skip: (req: Request) => {
    // Skip rate limiting for static assets and health checks
    return req.path.startsWith('/assets') || req.path === '/api/health';
  },
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

// Stricter rate limiting for email endpoints
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 email requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many email requests, please try again later.' },
});

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// Apply stricter rate limiting to auth endpoints
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/user/change-password', authLimiter);

// Apply stricter rate limiting to email endpoints
app.use('/api/email/', emailLimiter);

// Enable gzip compression for all responses
app.use(compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses larger than 1KB
}));

app.use(express.json({
  verify: (req: any, _res, buf) => {
    const url = req.originalUrl || req.url || "";
    if (url.startsWith("/api/stripe/webhook") || url.startsWith("/api/subscriptions/webhook")) {
      req.rawBody = buf;
    }
  },
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const headerId = req.header("x-request-id");
  const requestId = headerId && headerId.trim() !== "" ? headerId : randomUUID();
  res.setHeader("x-request-id", requestId);
  (req as Request & { requestId?: string }).requestId = requestId;
  runWithRequestContext(requestId, () => next());
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      const sensitivePrefixes = [
        "/api/auth",
        "/api/user",
        "/api/email",
        "/api/stripe",
        "/api/subscriptions",
        "/api/bootstrap",
      ];
      const shouldLogBody =
        capturedJsonResponse &&
        !sensitivePrefixes.some((prefix) => path.startsWith(prefix));
      if (shouldLogBody) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Reverse proxy for the standalone `pseo/` Next.js app (Option #1)
  // Enable by setting `PSEO_ORIGIN`, e.g.:
  // - local dev: http://localhost:3000
  // - prod: https://<your-pseo-deployment>
  registerPseoProxy(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    log(`error ${status}: ${message}`);
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
