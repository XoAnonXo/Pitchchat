import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { storage } from '../storage';
import { chatWithAI } from '../aiModels';
import { calculatePlatformCost } from '../pricing';
import { sendInvestorEngagementAlert } from '../brevo';
import rateLimit from 'express-rate-limit';

const router = Router();

// Security constants
const MAX_MESSAGE_LENGTH = 5000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting for chat messages (20 per minute per IP)
const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Too many messages, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for other endpoints (60 per minute per IP)
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Get public chat link info
 * GET /api/chat/:slug
 */
router.get('/:slug', generalLimiter, async (req, res) => {
  try {
    const link = await storage.getLink(req.params.slug);

    if (!link || link.status !== 'active') {
      return res.status(404).json({ message: 'Chat link not found or expired' });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(404).json({ message: 'Chat link has expired' });
    }

    const project = await storage.getProject(link.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
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
    console.error('Error fetching chat link:', error);
    res.status(500).json({ message: 'Failed to fetch chat link' });
  }
});

/**
 * List documents available for download
 * GET /api/chat/:slug/download
 */
router.get('/:slug/download', generalLimiter, async (req, res) => {
  try {
    const link = await storage.getLink(req.params.slug);

    if (!link || link.status !== 'active') {
      return res.status(404).json({ message: 'Chat link not found or expired' });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(404).json({ message: 'Chat link has expired' });
    }

    if (!link.allowDownloads) {
      return res.status(403).json({ message: 'Downloads are not allowed for this link' });
    }

    const documents = await storage.getProjectDocuments(link.projectId);

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: 'No documents found' });
    }

    const downloadInfo = documents.map((doc) => ({
      id: doc.id,
      name: doc.originalName || doc.filename,
      type: doc.mimeType,
      size: doc.fileSize,
      downloadUrl: `/api/chat/${req.params.slug}/download/${doc.id}`,
    }));

    res.json({
      projectId: link.projectId,
      documents: downloadInfo,
    });
  } catch (error) {
    console.error('Error preparing downloads:', error);
    res.status(500).json({ message: 'Failed to prepare downloads' });
  }
});

/**
 * Download individual document
 * GET /api/chat/:slug/download/:documentId
 */
router.get('/:slug/download/:documentId', generalLimiter, async (req, res) => {
  try {
    const link = await storage.getLink(req.params.slug);

    if (!link || link.status !== 'active') {
      return res.status(404).json({ message: 'Chat link not found or expired' });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(404).json({ message: 'Chat link has expired' });
    }

    if (!link.allowDownloads) {
      return res.status(403).json({ message: 'Downloads are not allowed for this link' });
    }

    const document = await storage.getDocument(req.params.documentId);
    if (!document || document.projectId !== link.projectId) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Security: Use basename to prevent path traversal
    const safeFilename = path.basename(document.filename);
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, safeFilename);

    // Verify path is within uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({ message: 'Invalid file path' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Security: Sanitize filename for Content-Disposition header
    const displayName = (document.originalName || document.filename)
      .replace(/[^\w\s.-]/g, '_')
      .replace(/\s+/g, '_');

    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${displayName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ message: 'Failed to download document' });
  }
});

/**
 * Send message in investor chat
 * POST /api/chat/:slug/messages
 */
router.post('/:slug/messages', messageLimiter, async (req, res) => {
  try {
    const { message, conversationId, investorEmail } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ message: `Message must be under ${MAX_MESSAGE_LENGTH} characters` });
    }

    if (conversationId && !UUID_REGEX.test(conversationId)) {
      return res.status(400).json({ message: 'Invalid conversation ID format' });
    }

    if (investorEmail && !EMAIL_REGEX.test(investorEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const link = await storage.getLink(req.params.slug);

    if (!link || link.status !== 'active') {
      return res.status(404).json({ message: 'Chat link not found or expired' });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(404).json({ message: 'Chat link has expired' });
    }

    // Demo room message limit (3 messages)
    if (req.params.slug === 'demo' && conversationId) {
      const existingMessages = await storage.getConversationMessages(conversationId);
      const userMessages = existingMessages.filter((m: { role: string }) => m.role === 'user');
      if (userMessages.length >= 3) {
        return res.status(429).json({
          message: 'Demo limit reached',
          limit: 3,
          current: userMessages.length,
          upgradeUrl: '/auth'
        });
      }
    }

    let conversation;

    if (conversationId) {
      conversation = await storage.getConversation(conversationId);
      if (!conversation || conversation.linkId !== link.id) {
        return res.status(404).json({ message: 'Conversation not found' });
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
            sendInvestorEngagementAlert(
              user.email,
              project?.name || 'Unknown Project',
              investorEmail,
              conversation.id
            ).catch((err) => console.error('Failed to send email notification:', err));
          }
        }
      }
    }

    // Save user message
    const userMessage = await storage.createMessage({
      conversationId: conversation.id,
      role: 'user',
      content: message,
      tokenCount: Math.ceil(message.length / 4),
    });

    // Get project for context
    const project = await storage.getProject(link.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get relevant context
    const chunks = await storage.searchChunks(link.projectId, message, 5);

    const context = chunks.map((chunk) => ({
      content: chunk.content,
      source: String((chunk.metadata as Record<string, unknown>)?.filename || 'Unknown'),
      page: Number((chunk.metadata as Record<string, unknown>)?.page) || undefined,
    }));

    // Get AI response
    const aiResponse = await chatWithAI([{ role: 'user', content: message }], context, 'gemini-3-flash');

    // Save AI message
    const assistantMessage = await storage.createMessage({
      conversationId: conversation.id,
      role: 'assistant',
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
      costUsd: (conversation.costUsd || 0) + platformCost,
    });

    res.json({
      message: assistantMessage,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Error in investor chat:', error);
    res.status(500).json({ message: 'Failed to process message' });
  }
});

/**
 * Get conversation messages
 * GET /api/chat/:slug/messages/:conversationId
 */
router.get('/:slug/messages/:conversationId', generalLimiter, async (req, res) => {
  try {
    // Validate conversationId format
    if (!UUID_REGEX.test(req.params.conversationId)) {
      return res.status(400).json({ message: 'Invalid conversation ID format' });
    }

    const link = await storage.getLink(req.params.slug);

    if (!link || link.status !== 'active') {
      return res.status(404).json({ message: 'Chat link not found or expired' });
    }

    const conversation = await storage.getConversation(req.params.conversationId);
    if (!conversation || conversation.linkId !== link.id) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await storage.getConversationMessages(req.params.conversationId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

export default router;
