import { Router } from 'express';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';

const router = Router();

/**
 * Get all conversations for the authenticated user
 * GET /api/conversations
 */
router.get('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const conversations = await storage.getUserConversations(userId);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

/**
 * Get messages for a specific conversation
 * GET /api/conversations/:conversationId/messages
 */
router.get('/:conversationId/messages', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;

    // Verify conversation belongs to user
    const conversations = await storage.getUserConversations(userId);
    const conversation = conversations.find((c) => c.id === req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await storage.getConversationMessages(req.params.conversationId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

/**
 * Submit contact details for a conversation (investor side)
 * POST /api/conversations/:conversationId/contact
 */
router.post('/:conversationId/contact', async (req, res) => {
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
        if (project) {
          const user = await storage.getUser(project.userId);

          // Import email functions dynamically to avoid circular deps
          const { sendInvestorContactEmail, sendFounderContactAlert } = await import('../brevo');

          // Send email to investor confirming their contact details were shared
          if (conversation.investorEmail) {
            await sendInvestorContactEmail(conversation.investorEmail, project.name, link.slug, {
              name: name || undefined,
              phone: phone || undefined,
              company: company || undefined,
              website: website || undefined,
            });
          }

          // Send email to founder if they have email alerts enabled
          if (user?.emailAlerts) {
            await sendFounderContactAlert(user.email!, project.name, conversationId, {
              email: conversation.investorEmail || 'unknown',
              name: name || undefined,
              phone: phone || undefined,
              company: company || undefined,
              website: website || undefined,
            });
          }
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Contact details submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact details' });
  }
});

export default router;
