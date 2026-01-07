import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./customAuth";
import { saveUploadedFile, processDocument, deleteUploadedFile } from "./fileProcessor";
import { chatWithAI, generateEmbedding, AIModel } from "./aiModels";
import { integrationManager } from "./integrations";
import { insertProjectSchema, insertDocumentSchema, insertLinkSchema, insertMessageSchema } from "@shared/schema";
import { calculatePlatformCost, calculateMessageCostInCents, dollarsToCredits } from "./pricing";
import { sendBrevoEmail, sendInvestorEngagementAlert, sendWeeklyReport, sendInvestorContactEmail, sendFounderContactAlert } from "./brevo";
import Stripe from "stripe";


// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/plain",
      "text/markdown", 
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel", // Added XLS support
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    
    console.log("File upload filter - filename:", file.originalname, "mimetype:", file.mimetype);
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error("Rejected file type:", file.mimetype, "for file:", file.originalname);
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to sync subscription status with Stripe
  async function syncUserSubscription(user: any) {
    try {
      const stripe = getStripeClient();
      if (user?.stripeCustomerId && stripe) {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active',
          limit: 1
        });
        
        if (subscriptions.data.length > 0) {
          const sub = subscriptions.data[0] as any;
          await storage.updateUserSubscription(user.id, {
            stripeSubscriptionId: sub.id,
            subscriptionStatus: sub.status,
            subscriptionCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            subscriptionIsAnnual: sub.items.data[0]?.price?.id === 'price_1Ruu7zFbfaTMQEZOUT3v0FeI'
          });
        } else if (user.subscriptionStatus === 'active') {
          // No active subscription found, update status
          await storage.updateUserSubscription(user.id, {
            subscriptionStatus: undefined
          });
        }
      }
    } catch (error) {
      console.log('Subscription sync error:', error);
    }
  }

  // Auth middleware
  await setupAuth(app);

  // Auth routes (handled by customAuth.ts)
  // /api/auth/register, /api/auth/login, /api/auth/logout, /api/auth/user are defined in customAuth.ts

  // Bootstrap route for initial dashboard data
  app.get("/api/bootstrap", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const bootstrap = await storage.getUserBootstrap(userId);
      res.json({
        user: req.user,
        ...bootstrap,
      });
    } catch (error) {
      console.error("Error fetching bootstrap data:", error);
      res.status(500).json({ message: "Failed to fetch bootstrap data" });
    }
  });

  // Project routes
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const projectData = insertProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const project = await storage.getProject(req.params.id);
      
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Document routes
  app.get("/api/projects/:projectId/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const project = await storage.getProject(req.params.projectId);
      
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const documents = await storage.getProjectDocuments(req.params.projectId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/projects/:projectId/documents", isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const project = await storage.getProject(req.params.projectId);
      
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File upload received:", {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      });

      // Check for duplicate
      const isDuplicate = await storage.checkDuplicateDocument(
        req.params.projectId, 
        req.file.originalname
      );

      if (isDuplicate) {
        return res.json({ 
          isDuplicate: true,
          originalName: req.file.originalname,
          message: "Document already exists" 
        });
      }

      // Save file
      const filename = await saveUploadedFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Create document record
      const documentData = insertDocumentSchema.parse({
        projectId: req.params.projectId,
        filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        status: "processing",
      });

      const document = await storage.createDocument(documentData);

      // Process document asynchronously
      processDocument(document.id).catch(error => {
        console.error("Error processing document:", error);
      });

      res.json({ ...document, isDuplicate: false });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const document = await storage.getDocument(req.params.id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const project = await storage.getProject(document.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Delete file
      await deleteUploadedFile(document.filename);
      
      // Delete document record
      await storage.deleteDocument(req.params.id);
      
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Download document route
  app.get("/api/projects/:projectId/documents/:documentId/download", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { projectId, documentId } = req.params;
      
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const document = await storage.getDocument(documentId);
      if (!document || document.projectId !== projectId) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'uploads', document.filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }
      
      res.download(filePath, document.originalName);
    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  // Chat routes (for founder testing)
  app.post("/api/projects/:projectId/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { message, model = 'gpt-4o' } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Get relevant chunks (simplified search for MVP)
      const chunks = await storage.searchChunks(req.params.projectId, message, 5);
      
      const context = chunks.map(chunk => ({
        content: chunk.content,
        source: (chunk.metadata as any)?.filename || "Unknown",
        page: (chunk.metadata as any)?.page,
      }));

      const response = await chatWithAI([
        { role: "user", content: message }
      ], context, model as AIModel);

      res.json(response);
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Link routes
  app.get("/api/projects/:projectId/links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const project = await storage.getProject(req.params.projectId);
      
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const links = await storage.getProjectLinks(req.params.projectId);
      res.json(links);
    } catch (error) {
      console.error("Error fetching links:", error);
      res.status(500).json({ message: "Failed to fetch links" });
    }
  });

  app.post("/api/projects/:projectId/links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const project = await storage.getProject(req.params.projectId);
      
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check user subscription and link limits
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check link limits based on subscription
      const existingLinksCount = await storage.getUserLinksCount(userId);
      
      // Free users can only create 1 link
      if (user.subscriptionStatus !== 'active' && existingLinksCount >= 1) {
        return res.status(402).json({ 
          message: "You've reached your free plan limit",
          details: "Free users can create 1 pitch link. Upgrade to Premium for unlimited pitch links and share your startup with more investors.",
          upgradeUrl: "/settings#billing"
        });
      }

      const slug = nanoid(12);
      
      // Parse the incoming data and convert expiresAt string to Date if present
      const requestBody = { ...req.body };
      if (requestBody.expiresAt && typeof requestBody.expiresAt === 'string') {
        requestBody.expiresAt = new Date(requestBody.expiresAt);
      }
      
      const linkData = insertLinkSchema.parse({
        ...requestBody,
        projectId: req.params.projectId,
        slug,
      });

      const link = await storage.createLink(linkData);

      res.json(link);
    } catch (error) {
      console.error("Error creating link:", error);
      res.status(500).json({ message: "Failed to create link" });
    }
  });

  // Public investor chat routes (no auth required)
  app.get("/api/chat/:slug", async (req, res) => {
    try {
      const link = await storage.getLink(req.params.slug);
      
      if (!link || link.status !== "active") {
        return res.status(404).json({ message: "Chat link not found or expired" });
      }

      if (link.expiresAt && new Date() > link.expiresAt) {
        return res.status(404).json({ message: "Chat link has expired" });
      }

      const project = await storage.getProject(link.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const documentCount = await storage.getProjectDocumentCount(link.projectId);
      
      res.json({
        name: link.name,
        projectName: project.name,
        description: project.description,
        documentCount,
        allowDownloads: link.allowDownloads || false,
      });
    } catch (error) {
      console.error("Error fetching chat link:", error);
      res.status(500).json({ message: "Failed to fetch chat link" });
    }
  });

  // Public document download endpoint
  app.get("/api/chat/:slug/download", async (req, res) => {
    try {
      const link = await storage.getLink(req.params.slug);
      
      if (!link || link.status !== "active") {
        return res.status(404).json({ message: "Chat link not found or expired" });
      }

      if (link.expiresAt && new Date() > link.expiresAt) {
        return res.status(404).json({ message: "Chat link has expired" });
      }

      if (!link.allowDownloads) {
        return res.status(403).json({ message: "Downloads are not allowed for this link" });
      }

      // Get all documents for the project
      const documents = await storage.getProjectDocuments(link.projectId);
      
      if (!documents || documents.length === 0) {
        return res.status(404).json({ message: "No documents found" });
      }

      // For now, we'll send a JSON response with download URLs
      // In a real implementation, you might want to create a ZIP file
      const downloadInfo = documents.map(doc => ({
        id: doc.id,
        name: doc.originalName || doc.filename,
        type: doc.mimeType,
        size: doc.fileSize,
        downloadUrl: `/api/chat/${req.params.slug}/download/${doc.id}`
      }));

      res.json({
        projectId: link.projectId,
        documents: downloadInfo
      });
    } catch (error) {
      console.error("Error preparing downloads:", error);
      res.status(500).json({ message: "Failed to prepare downloads" });
    }
  });

  // Individual document download endpoint
  app.get("/api/chat/:slug/download/:documentId", async (req, res) => {
    try {
      const link = await storage.getLink(req.params.slug);
      
      if (!link || link.status !== "active") {
        return res.status(404).json({ message: "Chat link not found or expired" });
      }

      if (link.expiresAt && new Date() > link.expiresAt) {
        return res.status(404).json({ message: "Chat link has expired" });
      }

      if (!link.allowDownloads) {
        return res.status(403).json({ message: "Downloads are not allowed for this link" });
      }

      const document = await storage.getDocument(req.params.documentId);
      if (!document || document.projectId !== link.projectId) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Stream the file to the client
      const filePath = path.join(process.cwd(), "uploads", document.filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on server" });
      }

      res.setHeader('Content-Type', document.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName || document.filename}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  app.post("/api/chat/:slug/messages", async (req, res) => {
    try {
      const { message, conversationId, investorEmail } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      const link = await storage.getLink(req.params.slug);
      
      if (!link || link.status !== "active") {
        return res.status(404).json({ message: "Chat link not found or expired" });
      }

      if (link.expiresAt && new Date() > link.expiresAt) {
        return res.status(404).json({ message: "Chat link has expired" });
      }

      let conversation;
      
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (!conversation || conversation.linkId !== link.id) {
          return res.status(404).json({ message: "Conversation not found" });
        }
      } else {
        // Create new conversation
        conversation = await storage.createConversation({
          linkId: link.id,
          investorEmail: investorEmail || null,
        });

        // Send email notification for new investor engagement
        if (investorEmail) {
          const project = await storage.getProject(link.projectId);
          const userId = await storage.getUserIdFromConversation(conversation.id);
          if (userId) {
            const user = await storage.getUserById(userId);
            if (user?.emailAlerts) {
              // Send email notification using Brevo
              sendInvestorEngagementAlert(
                user.email,
                project?.name || 'Unknown Project',
                investorEmail,
                conversation.id
              ).catch(err => console.error('Failed to send email notification:', err));
            }
          }
        }
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: "user",
        content: message,
        tokenCount: Math.ceil(message.length / 4),
      });

      // Get project for context
      const project = await storage.getProject(link.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Get relevant context
      const chunks = await storage.searchChunks(link.projectId, message, 5);
      
      const context = chunks.map(chunk => ({
        content: chunk.content,
        source: (chunk.metadata as any)?.filename || "Unknown",
        page: (chunk.metadata as any)?.page,
      }));

      // Get AI response  
      const aiResponse = await chatWithAI([
        { role: "user", content: message }
      ], context, 'gpt-4o');

      // Save AI message
      const assistantMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: aiResponse.content,
        tokenCount: aiResponse.tokenCount,
        citations: aiResponse.citations,
      });

      // Calculate platform cost for this message exchange
      const totalTokens = (userMessage.tokenCount || 0) + (assistantMessage.tokenCount || 0);
      const platformCost = calculatePlatformCost(totalTokens, 'gpt4o');
      
      // Update conversation totals
      await storage.updateConversation(conversation.id, {
        totalTokens: (conversation.totalTokens || 0) + totalTokens,
        costUsd: (conversation.costUsd || 0) + platformCost, // Platform cost with 10x margin
      });



      res.json({
        message: assistantMessage,
        conversationId: conversation.id,
      });
    } catch (error) {
      console.error("Error in investor chat:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  app.get("/api/chat/:slug/messages/:conversationId", async (req, res) => {
    try {
      const link = await storage.getLink(req.params.slug);
      
      if (!link || link.status !== "active") {
        return res.status(404).json({ message: "Chat link not found or expired" });
      }

      const conversation = await storage.getConversation(req.params.conversationId);
      if (!conversation || conversation.linkId !== link.id) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await storage.getConversationMessages(req.params.conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Investor chat - Submit contact details
  app.post("/api/conversations/:conversationId/contact", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { name, phone, company, website } = req.body;

      // Update conversation with contact details
      await storage.updateConversationContactDetails(conversationId, {
        contactName: name || null,
        contactPhone: phone || null,
        contactCompany: company || null,
        contactWebsite: website || null,
        contactProvidedAt: new Date(),
      });

      // Get the conversation to find the project owner
      const conversation = await storage.getConversationById(conversationId);
      if (conversation) {
        const link = await storage.getLink(conversation.linkId);
        if (link) {
          const project = await storage.getProject(link.projectId);
          if (project && conversation.investorEmail) {
            const user = await storage.getUser(project.userId);

            // Send email to investor confirming their contact details were shared
            await sendInvestorContactEmail(
              conversation.investorEmail,
              project.name,
              link.slug,
              {
                name: name || undefined,
                phone: phone || undefined,
                company: company || undefined,
                website: website || undefined,
              }
            );

            // Send email to founder if they have email alerts enabled
            if (user?.emailAlerts) {
              await sendFounderContactAlert(
                user.email!,
                project.name,
                conversationId,
                {
                  email: conversation.investorEmail,
                  name: name || undefined,
                  phone: phone || undefined,
                  company: company || undefined,
                  website: website || undefined,
                }
              );
            }
          }
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Contact details submission error:", error);
      res.status(500).json({ message: "Failed to submit contact details" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const analytics = await storage.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Pricing information endpoint
  app.get("/api/pricing", async (req, res) => {
    try {
      const { getPricingBreakdown, SUBSCRIPTION_PRICING } = await import("./pricing");
      res.json({
        ...getPricingBreakdown(),
        subscriptions: SUBSCRIPTION_PRICING,
      });
    } catch (error) {
      console.error("Error fetching pricing:", error);
      res.status(500).json({ message: "Failed to fetch pricing" });
    }
  });

  // Stripe subscription endpoints (lazy init so Stripe is only required for checkout/purchase)
  let stripeClient: Stripe | null = null;
  const getStripeClient = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return null;
    }
    if (!stripeClient) {
      stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-08-27.basil",
      });
    }
    return stripeClient;
  };
  
  // Define price IDs for subscription plans
  const STRIPE_PRICE_IDS = {
    monthly: 'price_1Ruu6pFbfaTMQEZORAhCEGnp', // $29/month
    annual: 'price_1Ruu7zFbfaTMQEZOUT3v0FeI', // $278.40/year
  };

  // Create checkout session for subscription
  app.post("/api/subscriptions/create-checkout", isAuthenticated, async (req: any, res) => {
    try {
      const stripe = getStripeClient();
      if (!stripe) {
        return res.status(503).json({ message: "Stripe is not configured" });
      }

      const { priceType } = req.body; // 'monthly' or 'annual'
      const user = req.user;
      const { SUBSCRIPTION_PRICING } = await import("./pricing");
      
      const pricing = SUBSCRIPTION_PRICING[priceType as keyof typeof SUBSCRIPTION_PRICING];
      if (!pricing || priceType === 'oneTime') {
        return res.status(400).json({ message: "Invalid subscription type" });
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        stripeCustomerId = customer.id;
        await storage.updateUserSubscription(user.id, { stripeCustomerId });
      }

      // Get the correct domain from request headers
      const protocol = req.get('x-forwarded-proto') || 'https';
      const host = req.get('host') || process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      
      console.log('Creating checkout with redirect URLs:', {
        success: `${baseUrl}/?subscription=success`,
        cancel: `${baseUrl}/settings?subscription=cancel`
      });

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price: pricing.priceId,
          quantity: 1,
        }],
        subscription_data: {
          metadata: {
            userId: user.id,
            isAnnual: priceType === 'annual' ? 'true' : 'false',
          },
        },
        success_url: `${baseUrl}/?subscription=success`,
        cancel_url: `${baseUrl}/settings?subscription=cancel`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });



  // Cancel subscription
  app.post("/api/subscriptions/cancel", isAuthenticated, async (req: any, res) => {
    try {
      const stripe = getStripeClient();
      if (!stripe) {
        return res.status(503).json({ message: "Stripe is not configured" });
      }

      const user = req.user;
      
      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription" });
      }

      // Cancel subscription at period end
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      await storage.updateUserSubscription(user.id, {
        subscriptionStatus: 'canceled',
      });

      res.json({
        message: "Subscription will be canceled at the end of the billing period",
        endsAt: new Date((subscription as any).current_period_end * 1000),
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Webhook endpoint for Stripe events
  app.post("/api/stripe/webhook", async (req, res) => {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({ message: "Stripe is not configured" });
    }

    const sig = req.headers['stripe-signature'] as string;
    let event;

    // If webhook secret is not configured, skip verification (development mode)
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('Warning: STRIPE_WEBHOOK_SECRET not configured, skipping webhook verification');
      event = req.body;
      // In production, you should always verify webhooks
      res.json({ received: true, warning: 'Webhook not verified' });
      return;
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const userId = session.subscription_metadata?.userId || session.customer_metadata?.userId;
          
          if (userId && session.subscription) {
            // Fetch subscription details
            const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;
            const isAnnual = subscription.metadata.isAnnual === 'true';

            // Update user subscription
            await storage.updateUserSubscription(userId, {
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              subscriptionIsAnnual: isAnnual,
            });
          }
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription) as any;
            const userId = subscription.metadata.userId;

            if (userId) {
              // Update subscription period end
              await storage.updateUserSubscription(userId, {
                subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                subscriptionStatus: subscription.status,
              });
            }
          }
          break;
        }



        case 'customer.subscription.deleted':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as any;
          const userId = subscription.metadata.userId;
          
          if (userId) {
            await storage.updateUserSubscription(userId, {
              subscriptionStatus: subscription.status,
              subscriptionCurrentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined,
            });
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ message: 'Webhook handler failed' });
    }
  });

  app.get("/api/analytics/detailed", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const detailedAnalytics = await storage.getDetailedAnalytics(userId);
      res.json(detailedAnalytics);
    } catch (error) {
      console.error("Error fetching detailed analytics:", error);
      res.status(500).json({ message: "Failed to fetch detailed analytics" });
    }
  });

  // Email Alert Routes
  app.post("/api/email/investor-engagement", async (req, res) => {
    try {
      const { conversationId, projectName, investorEmail, messageCount } = req.body;
      
      // This would be called internally when a new conversation starts
      const userId = await storage.getUserIdFromConversation(conversationId);
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const user = await storage.getUserById(userId);
      if (!user?.emailAlerts) {
        return res.json({ sent: false, reason: "Email alerts disabled" });
      }
      
      // Send email notification
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">New Investor Engagement! 🎉</h2>
          <p>An investor just started a conversation with your pitch for <strong>${projectName}</strong>.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Investor Email:</strong> ${investorEmail}</p>
            <p style="margin: 10px 0 0 0;"><strong>Messages Sent:</strong> ${messageCount}</p>
          </div>
          <p>Log in to your PitchChat dashboard to view the full conversation and respond to any questions.</p>
          <a href="${process.env.REPLIT_DOMAINS || 'https://pitchchat.replit.app'}" style="display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">View Conversation</a>
        </div>
      `;
      
      const success = await sendBrevoEmail({
        to: user.email,
        subject: `New investor engagement on ${projectName}`,
        htmlContent: emailHtml,
      });

      if (success) {
        res.json({ sent: true, recipient: user.email });
      } else {
        res.status(500).json({ message: "Failed to send email notification" });
      }
    } catch (error) {
      console.error("Error sending investor engagement email:", error);
      res.status(500).json({ message: "Failed to send email notification" });
    }
  });

  // Weekly Report Route
  app.post("/api/email/weekly-report", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const user = await storage.getUserById(userId);
      if (!user?.weeklyReports) {
        return res.json({ sent: false, reason: "Weekly reports disabled" });
      }
      
      // Get analytics for the past week
      const analytics = await storage.getDetailedAnalytics(userId);
      const projects = await storage.getUserProjects(userId);
      
      // Generate weekly report
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Your Weekly PitchChat Report 📊</h1>
          <p>Here's how your pitches performed this week:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Key Metrics</h3>
            <p><strong>Total Conversations:</strong> ${analytics.overview.totalConversations}</p>
            <p><strong>Unique Visitors:</strong> ${analytics.overview.totalVisitors}</p>
            <p><strong>Active Links:</strong> ${analytics.overview.activeLinks}</p>
            <p><strong>Total Cost:</strong> $${analytics.overview.totalCost.toFixed(2)}</p>
          </div>
          
          <h3>Top Performing Projects</h3>
          ${analytics.projectBreakdown.slice(0, 3).map((project: { projectName: string; conversations: number; totalTokens: number; totalCost: number }) => `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
              <h4 style="margin: 0;">${project.projectName}</h4>
              <p style="color: #666; margin: 5px 0;">
                ${project.conversations} conversations • ${project.totalTokens.toLocaleString()} tokens • $${project.totalCost.toFixed(2)}
              </p>
            </div>
          `).join('')}

          <h3>Most Engaged Visitors</h3>
          ${analytics.visitorEngagement.topVisitors.slice(0, 3).map((visitor: { email: string; conversations: number; totalTokens: number }) => `
            <p style="margin: 10px 0;">
              <strong>${visitor.email}</strong><br>
              ${visitor.conversations} conversations • ${visitor.totalTokens.toLocaleString()} tokens
            </p>
          `).join('')}
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p>You're receiving this because you have weekly reports enabled in your settings.</p>
            <a href="${process.env.REPLIT_DOMAINS || 'https://pitchchat.replit.app'}/settings" style="color: #000;">Manage Preferences</a>
          </div>
        </div>
      `;
      
      // Send weekly report using Brevo
      const success = await sendWeeklyReport(user.email, {
        totalQuestions: analytics.overview.totalConversations,
        activeLinks: analytics.overview.activeLinks,
        monthlyCost: analytics.overview.totalCost,
        weeklyConversations: analytics.overview.totalConversations,
        topPerformingProject: analytics.projectBreakdown[0]?.projectName,
      });
      
      if (success) {
        res.json({ sent: true, recipient: user.email, reportDate: new Date() });
      } else {
        res.status(500).json({ message: "Failed to send weekly report" });
      }
    } catch (error) {
      console.error("Error sending weekly report:", error);
      res.status(500).json({ message: "Failed to send weekly report" });
    }
  });

  // Simple test endpoint for debugging email
  app.post("/api/email/test-simple", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.email) {
        return res.status(400).json({ message: "No email address found for user" });
      }

      console.log("=== SIMPLE EMAIL TEST ===");
      console.log("Sending to:", user.email);
      console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);
      console.log("API Key first 10 chars:", process.env.BREVO_API_KEY?.substring(0, 10) + "...");

      const testHtml = `
        <html>
          <body>
            <h1>Test Email from PitchChat</h1>
            <p>This is a simple test email to verify Brevo integration is working.</p>
            <p>Time sent: ${new Date().toISOString()}</p>
          </body>
        </html>
      `;

      const result = await sendBrevoEmail({
        to: user.email,
        subject: "Test Email - PitchChat",
        htmlContent: testHtml,
      });

      console.log("Email send result:", result);
      console.log("=== END EMAIL TEST ===");

      res.json({ 
        success: result,
        sentTo: user.email,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Simple email test error:", error);
      res.status(500).json({ 
        message: "Failed to send test email", 
        error: error.message,
        stack: error.stack 
      });
    }
  });

  // Test endpoint to send all email types  
  app.post("/api/email/test-all", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.email) {
        return res.status(400).json({ message: "No email address found for user" });
      }

      // Get user's first project for testing
      const projects = await storage.getUserProjects(userId);
      const testProject = projects[0] || { name: "Test Project", id: "test-project-id" };
      
      // Get analytics for weekly report
      const analytics = await storage.getDetailedAnalytics(userId);

      const emailsSent = [];

      console.log("Sending test emails to:", user.email);

      // 1. Send investor engagement alert
      try {
        const success = await sendInvestorEngagementAlert(
          user.email,
          testProject.name,
          "investor@example.com",
          "test-conversation-id"
        );
        if (success) {
          emailsSent.push("Investor engagement alert");
          console.log("✓ Sent investor engagement alert");
        } else {
          console.error("Failed to send investor engagement alert - returned false");
        }
      } catch (error) {
        console.error("Failed to send investor engagement alert - exception:", error);
      }

      // 2. Send investor contact email  
      try {
        const success = await sendInvestorContactEmail(
          user.email, // Sending to user as test
          testProject.name,
          "test-link-slug",
          {
            name: "John Smith",
            phone: "+1 555-123-4567",
            company: "Venture Capital Inc.",
            website: "https://example.vc",
          }
        );
        if (success) {
          emailsSent.push("Investor contact confirmation");
          console.log("✓ Sent investor contact confirmation");
        } else {
          console.error("Failed to send investor contact email - returned false");
        }
      } catch (error) {
        console.error("Failed to send investor contact email - exception:", error);
      }

      // 3. Send founder contact alert
      try {
        const success = await sendFounderContactAlert(
          user.email,
          testProject.name,
          "test-conversation-id",
          {
            email: "investor@example.com",
            name: "Jane Doe",
            phone: "+1 555-987-6543",
            company: "Innovation Partners",
            website: "https://innovationpartners.com",
          }
        );
        if (success) {
          emailsSent.push("Founder contact alert");
          console.log("✓ Sent founder contact alert");
        } else {
          console.error("Failed to send founder contact alert - returned false");
        }
      } catch (error) {
        console.error("Failed to send founder contact alert - exception:", error);
      }

      // 4. Send weekly report
      try {
        const success = await sendWeeklyReport(
          user.email,
          {
            totalQuestions: analytics.summary?.totalConversations || 10,
            activeLinks: analytics.charts?.linkPerformance?.length || 5,
            monthlyCost: analytics.summary?.totalCost || 5.00,
            weeklyConversations: 5,
            topPerformingProject: testProject.name,
          }
        );
        if (success) {
          emailsSent.push("Weekly report");
          console.log("✓ Sent weekly report");
        } else {
          console.error("Failed to send weekly report - returned false");
        }
      } catch (error) {
        console.error("Failed to send weekly report - exception:", error);
      }

      res.json({ 
        message: "Test emails sent",
        emailsSent,
        sentTo: user.email,
        totalSent: emailsSent.length
      });
    } catch (error) {
      console.error("Error sending test emails:", error);
      res.status(500).json({ message: "Failed to send test emails", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Update user notification preferences
  app.patch("/api/user/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { emailAlerts, weeklyReports } = req.body;
      
      await storage.updateUserNotifications(userId, { emailAlerts, weeklyReports });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ message: "Failed to update notification preferences" });
    }
  });

  // Update user profile
  app.patch("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { name, email } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.upsertUser({
        ...user,
        email: email || user.email,
        firstName: name || user.firstName,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Delete user account
  app.delete("/api/user/delete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // In a production app, you would delete all user data here
      // For now, we'll just return success
      res.json({ success: true, message: "Account deletion request received" });
    } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Export user data
  app.get("/api/user/export", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get all user data
      const user = await storage.getUser(userId);
      const projects = await storage.getUserProjects(userId);
      
      // Get all project-related data
      const projectData = await Promise.all(projects.map(async (project) => {
        const documents = await storage.getProjectDocuments(project.id);
        const links = await storage.getProjectLinks(project.id);
        
        // Get conversations for each link
        const linkData = await Promise.all(links.map(async (link) => {
          const conversations = await storage.getLinkConversations(link.id);
          return {
            ...link,
            conversationCount: conversations.length,
          };
        }));
        
        return {
          ...project,
          documents: documents.map(doc => ({
            id: doc.id,
            fileName: doc.filename,
            fileType: doc.mimeType,
            fileSize: doc.fileSize,
            createdAt: doc.createdAt,
            status: doc.status,
          })),
          links: linkData,
        };
      }));

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          createdAt: user?.createdAt,
        },
        projects: projectData,
        totalProjects: projects.length,
        totalLinks: projectData.reduce((acc, p) => acc + p.links.length, 0),
        totalDocuments: projectData.reduce((acc, p) => acc + p.documents.length, 0),
      };

      res.json(exportData);
    } catch (error) {
      console.error("Error exporting user data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Change password - Note: Replit Auth doesn't support password changes
  // This is a placeholder endpoint
  app.post("/api/user/change-password", isAuthenticated, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Since we're using Replit Auth, we can't actually change passwords
      // In a production app with custom auth, you would:
      // 1. Verify the current password
      // 2. Hash the new password
      // 3. Update the user record
      
      res.status(400).json({ 
        message: "Password changes are managed through Replit Auth. Please use your Replit account settings to change your password." 
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Conversations routes
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:conversationId/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Verify conversation belongs to user
      const conversations = await storage.getUserConversations(userId);
      const conversation = conversations.find(c => c.id === req.params.conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getConversationMessages(req.params.conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Integration routes
  app.post("/api/projects/:projectId/integrations/github", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "GitHub token is required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      const documents = await integrationManager.importFromGitHub({
        type: 'github',
        credentials: { token },
        userId,
        projectId: req.params.projectId
      });

      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      res.json({ 
        message: "GitHub import completed", 
        documentsImported: documents.length 
      });
    } catch (error) {
      console.error("GitHub integration error:", error);
      res.status(500).json({ message: "Failed to import from GitHub" });
    }
  });

  app.post("/api/projects/:projectId/integrations/notion", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Notion token is required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      const documents = await integrationManager.importFromNotion({
        type: 'notion',
        credentials: { token },
        userId,
        projectId: req.params.projectId
      });

      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      res.json({ 
        message: "Notion import completed", 
        documentsImported: documents.length 
      });
    } catch (error) {
      console.error("Notion integration error:", error);
      res.status(500).json({ message: "Failed to import from Notion" });
    }
  });

  app.post("/api/projects/:projectId/integrations/google-drive", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { accessToken, refreshToken, clientId, clientSecret } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: "Google Drive access token is required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      const documents = await integrationManager.importFromGoogleDrive({
        type: 'google-drive',
        credentials: { 
          accessToken, 
          refreshToken, 
          clientId: clientId || process.env.GOOGLE_DRIVE_CLIENT_ID, 
          clientSecret: clientSecret || process.env.GOOGLE_DRIVE_CLIENT_SECRET,
          redirectUri: 'urn:ietf:wg:oauth:2.0:oob'
        },
        userId,
        projectId: req.params.projectId
      });

      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      res.json({ 
        message: "Google Drive import completed", 
        documentsImported: documents.length 
      });
    } catch (error) {
      console.error("Google Drive integration error:", error);
      res.status(500).json({ message: "Failed to import from Google Drive" });
    }
  });

  // Get project integrations
  app.get("/api/projects/:projectId/integrations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      const integrations = await storage.getProjectIntegrations(req.params.projectId);
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  // Sync integration
  app.post("/api/projects/:projectId/integrations/:integrationId/sync", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { projectId, integrationId } = req.params;
      
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Get the existing integration
      const integration = await storage.getIntegration(projectId, integrationId);
      if (!integration || integration.status !== 'connected') {
        return res.status(400).json({ message: "Integration not connected" });
      }

      console.log(`Starting sync for ${integrationId} integration on project ${projectId}`);

      let documents = [];
      try {
        // Call the appropriate import method based on integration type
        switch (integrationId) {
          case 'dropbox':
            documents = await integrationManager.importFromDropbox({
              type: 'dropbox',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          case 'github':
            documents = await integrationManager.importFromGitHub({
              type: 'github',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          case 'notion':
            documents = await integrationManager.importFromNotion({
              type: 'notion',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          case 'google-drive':
            documents = await integrationManager.importFromGoogleDrive({
              type: 'google-drive',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          case 'asana':
            documents = await integrationManager.importFromAsana({
              type: 'asana',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          case 'jira':
            documents = await integrationManager.importFromJira({
              type: 'jira',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          case 'figma':
            documents = await integrationManager.importFromFigma({
              type: 'figma',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          case 'slack':
            documents = await integrationManager.importFromSlack({
              type: 'slack',
              credentials: integration.credentials as Record<string, string>,
              userId,
              projectId
            });
            break;
          default:
            return res.status(400).json({ message: `Sync not supported for ${integrationId}` });
        }

        console.log(`Processing ${documents.length} documents from ${integrationId}`);
        await integrationManager.processImportedDocuments(documents, projectId);

        // Update last synced time
        await storage.updateIntegration(integration.id, {
          lastSyncedAt: new Date()
        });

        console.log(`${integrationId} sync completed successfully. ${documents.length} documents processed.`);
        res.json({ 
          message: "Sync completed", 
          documentsImported: documents.length,
          success: true
        });
      } catch (error) {
        console.error(`${integrationId} sync error:`, error);
        res.status(500).json({
          message: error instanceof Error ? error.message : `Failed to sync ${integrationId}`,
          success: false
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ message: "Failed to sync integration" });
    }
  });

  app.post("/api/projects/:projectId/integrations/dropbox", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: "Dropbox access token is required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if integration already exists
      const existingIntegration = await storage.getIntegration(req.params.projectId, 'dropbox');
      
      // Create or update integration record
      if (existingIntegration) {
        await storage.updateIntegration(existingIntegration.id, {
          status: 'connected',
          credentials: { accessToken },
          lastSyncedAt: new Date()
        });
      } else {
        await storage.createIntegration({
          projectId: req.params.projectId,
          platform: 'dropbox',
          status: 'connected',
          credentials: { accessToken },
          lastSyncedAt: new Date()
        });
      }

      console.log(`Starting Dropbox import for project ${req.params.projectId}`);
      const documents = await integrationManager.importFromDropbox({
        type: 'dropbox',
        credentials: { accessToken },
        userId,
        projectId: req.params.projectId
      });

      console.log(`Processing ${documents.length} documents from Dropbox`);
      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      console.log(`Dropbox import completed successfully. ${documents.length} documents processed.`);
      res.json({ 
        message: "Dropbox import completed", 
        documentsImported: documents.length,
        success: true
      });
    } catch (error) {
      console.error("Dropbox integration error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to import from Dropbox",
        success: false
      });
    }
  });

  app.post("/api/projects/:projectId/integrations/asana", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: "Asana access token is required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      const documents = await integrationManager.importFromAsana({
        type: 'asana',
        credentials: { accessToken },
        userId,
        projectId: req.params.projectId
      });

      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      res.json({ 
        message: "Asana import completed", 
        documentsImported: documents.length 
      });
    } catch (error) {
      console.error("Asana integration error:", error);
      res.status(500).json({ message: "Failed to import from Asana" });
    }
  });

  app.post("/api/projects/:projectId/integrations/jira", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { domain, email, apiToken } = req.body;
      
      if (!domain || !email || !apiToken) {
        return res.status(400).json({ message: "Jira domain, email, and API token are required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      const documents = await integrationManager.importFromJira({
        type: 'jira',
        credentials: { domain, email, apiToken },
        userId,
        projectId: req.params.projectId
      });

      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      res.json({ 
        message: "Jira import completed", 
        documentsImported: documents.length 
      });
    } catch (error) {
      console.error("Jira integration error:", error);
      res.status(500).json({ message: "Failed to import from Jira" });
    }
  });

  app.post("/api/projects/:projectId/integrations/slack", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { botToken, channelId } = req.body;
      
      if (!botToken || !channelId) {
        return res.status(400).json({ message: "Bot Token and Channel ID are required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if integration already exists
      const existingIntegration = await storage.getIntegration(req.params.projectId, 'slack');
      
      // Create or update integration record
      if (existingIntegration) {
        await storage.updateIntegration(existingIntegration.id, {
          status: 'connected',
          credentials: { botToken, channelId },
          lastSyncedAt: new Date()
        });
      } else {
        await storage.createIntegration({
          projectId: req.params.projectId,
          platform: 'slack',
          status: 'connected',
          credentials: { botToken, channelId },
          lastSyncedAt: new Date()
        });
      }

      // Import documents from Slack
      const documents = await integrationManager.importFromSlack({
        type: 'slack',
        credentials: { botToken, channelId },
        userId,
        projectId: req.params.projectId
      });

      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      res.json({ 
        message: "Slack integration connected successfully", 
        documentsImported: documents.length 
      });
    } catch (error) {
      console.error("Slack integration error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to connect to Slack" });
    }
  });

  app.post("/api/projects/:projectId/integrations/figma", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: "Figma access token is required" });
      }

      const project = await storage.getProject(req.params.projectId);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if integration already exists
      const existingIntegration = await storage.getIntegration(req.params.projectId, 'figma');
      
      // Create or update integration record
      if (existingIntegration) {
        await storage.updateIntegration(existingIntegration.id, {
          status: 'connected',
          credentials: { accessToken },
          lastSyncedAt: new Date()
        });
      } else {
        await storage.createIntegration({
          projectId: req.params.projectId,
          platform: 'figma',
          status: 'connected',
          credentials: { accessToken },
          lastSyncedAt: new Date()
        });
      }

      console.log(`Starting Figma import for project ${req.params.projectId}`);
      const documents = await integrationManager.importFromFigma({
        type: 'figma',
        credentials: { accessToken },
        userId,
        projectId: req.params.projectId
      });

      console.log(`Processing ${documents.length} documents from Figma`);
      await integrationManager.processImportedDocuments(documents, req.params.projectId);

      console.log(`Figma import completed successfully. ${documents.length} documents processed.`);
      res.json({ 
        message: "Figma import completed", 
        documentsImported: documents.length,
        success: true
      });
    } catch (error) {
      console.error("Figma integration error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to import from Figma",
        success: false
      });
    }
  });

  // Get available AI models
  app.get("/api/ai-models", async (req, res) => {
    const models = [
      { id: 'gpt-4o', name: 'GPT-4 Omni', provider: 'OpenAI' },
      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
      { id: 'o3-mini', name: 'O3 Mini', provider: 'OpenAI' },
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
      { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google' },
    ];
    res.json(models);
  });

  const httpServer = createServer(app);
  return httpServer;
}
