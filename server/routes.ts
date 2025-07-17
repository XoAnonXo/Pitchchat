import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { saveUploadedFile, processDocument, deleteUploadedFile } from "./fileProcessor";
import { chatWithAI, generateEmbedding } from "./openai";
import { insertProjectSchema, insertDocumentSchema, insertLinkSchema, insertMessageSchema } from "@shared/schema";

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
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Project routes
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const project = await storage.getProject(req.params.projectId);
      
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
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

      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  // Chat routes (for founder testing)
  app.post("/api/projects/:projectId/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;
      
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
      ], context);

      res.json(response);
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Link routes
  app.get("/api/projects/:projectId/links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const project = await storage.getProject(req.params.projectId);
      
      if (!project || project.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check user credits (simplified for MVP)
      const user = await storage.getUser(userId);
      if (!user || (user.credits || 0) < 25) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      const slug = nanoid(12);
      
      const linkData = insertLinkSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
        slug,
      });

      const link = await storage.createLink(linkData);

      // Deduct credits (simplified for MVP)
      await storage.upsertUser({
        ...user,
        credits: (user.credits || 0) - 25,
      });

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

      res.json({
        name: link.name,
        projectName: project.name,
        description: project.description,
      });
    } catch (error) {
      console.error("Error fetching chat link:", error);
      res.status(500).json({ message: "Failed to fetch chat link" });
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
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: "user",
        content: message,
        tokenCount: Math.ceil(message.length / 4),
      });

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
      ], context);

      // Save AI message
      const assistantMessage = await storage.createMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: aiResponse.content,
        tokenCount: aiResponse.tokenCount,
        citations: aiResponse.citations,
      });

      // Update conversation totals
      await storage.updateConversation(conversation.id, {
        totalTokens: (conversation.totalTokens || 0) + (userMessage.tokenCount || 0) + (assistantMessage.tokenCount || 0),
        costUsd: (conversation.costUsd || 0) + (aiResponse.tokenCount * 0.00002), // Rough cost estimate
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

  // Analytics routes
  app.get("/api/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analytics = await storage.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
