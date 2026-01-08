import { Router } from 'express';
import { isAuthenticated, hashPassword, comparePasswords } from '../customAuth';
import { storage } from '../storage';
import { sendAccountDeletionEmail, sendPasswordChangedEmail } from '../brevo';

const router = Router();

/**
 * Update user notification preferences
 * PATCH /api/user/notifications
 */
router.patch('/notifications', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { emailAlerts, weeklyReports } = req.body;

    await storage.updateUserNotifications(userId, { emailAlerts, weeklyReports });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
});

/**
 * Update user profile
 * PATCH /api/user/profile
 */
router.patch('/profile', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await storage.upsertUser({
      ...user,
      email: email || user.email,
      firstName: name || user.firstName,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

/**
 * Delete user account
 * DELETE /api/user/delete
 */
router.delete('/delete', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store email before deletion for confirmation email
    const userEmail = user.email;

    // Delete all user data (projects, documents, links, conversations)
    await storage.deleteUserData(userId);

    // Send account deletion confirmation email
    if (userEmail) {
      sendAccountDeletionEmail(userEmail).catch(err =>
        console.error('Failed to send account deletion email:', err)
      );
    }

    // Logout the user
    req.logout((err: any) => {
      if (err) console.error('Logout error:', err);
    });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

/**
 * Export user data (GDPR compliance)
 * GET /api/user/export
 */
router.get('/export', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;

    // Get all user data
    const user = await storage.getUser(userId);
    const projects = await storage.getUserProjects(userId);

    const tokenUsage = await storage.getUserTokenUsage(userId);
    const tokenPurchases = await storage.getUserTokenPurchases(userId);

    // Get all project-related data
    const projectData = await Promise.all(
      projects.map(async (project) => {
        const documents = await storage.getProjectDocuments(project.id);
        const links = await storage.getProjectLinks(project.id);
        const integrations = await storage.getProjectIntegrations(project.id);

        // Get conversations and messages for each link
        const linkData = await Promise.all(
          links.map(async (link) => {
            const conversations = await storage.getLinkConversations(link.id);
            const conversationsWithMessages = await Promise.all(
              conversations.map(async (conversation) => {
                const conversationMessages = await storage.getConversationMessages(conversation.id);
                return {
                  id: conversation.id,
                  investorEmail: conversation.investorEmail,
                  startedAt: conversation.startedAt,
                  totalTokens: conversation.totalTokens,
                  costUsd: conversation.costUsd,
                  isActive: conversation.isActive,
                  contactName: conversation.contactName,
                  contactPhone: conversation.contactPhone,
                  contactCompany: conversation.contactCompany,
                  contactWebsite: conversation.contactWebsite,
                  contactProvidedAt: conversation.contactProvidedAt,
                  messages: conversationMessages.map((message) => ({
                    id: message.id,
                    conversationId: message.conversationId,
                    role: message.role,
                    content: message.content,
                    tokenCount: message.tokenCount,
                    citations: message.citations,
                    timestamp: message.timestamp,
                  })),
                };
              })
            );
            return {
              ...link,
              conversationCount: conversations.length,
              conversations: conversationsWithMessages,
            };
          })
        );

        return {
          ...project,
          documents: documents.map((doc) => ({
            id: doc.id,
            fileName: doc.filename,
            fileType: doc.mimeType,
            fileSize: doc.fileSize,
            createdAt: doc.createdAt,
            status: doc.status,
          })),
          links: linkData,
          integrations: integrations.map((integration) => ({
            id: integration.id,
            platform: integration.platform,
            status: integration.status,
            lastSyncedAt: integration.lastSyncedAt,
            createdAt: integration.createdAt,
            updatedAt: integration.updatedAt,
            hasCredentials: Boolean(integration.credentials),
          })),
        };
      })
    );

    const exportData = {
      format: {
        version: '1.0',
        note:
          'Projects include links with conversations. Conversations include investorEmail and contact fields (contactName, contactPhone, contactCompany, contactWebsite, contactProvidedAt) plus messages. Integrations include metadata with credentials redacted. Token usage and purchases included; payment intent IDs are redacted.',
      },
      exportDate: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        createdAt: user?.createdAt,
      },
      projects: projectData,
      tokenUsage: tokenUsage.map((usage) => ({
        id: usage.id,
        conversationId: usage.conversationId,
        tokensUsed: usage.tokensUsed,
        action: usage.action,
        model: usage.model,
        createdAt: usage.createdAt,
      })),
      tokenPurchases: tokenPurchases.map((purchase) => ({
        id: purchase.id,
        type: purchase.type,
        amount: purchase.amount,
        tokens: purchase.tokens,
        status: purchase.status,
        stripePaymentIntentId: purchase.stripePaymentIntentId ? 'redacted' : null,
        createdAt: purchase.createdAt,
      })),
      totalProjects: projects.length,
      totalLinks: projectData.reduce((acc, p) => acc + p.links.length, 0),
      totalDocuments: projectData.reduce((acc, p) => acc + p.documents.length, 0),
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ message: 'Failed to export data' });
  }
});

/**
 * Change password
 * POST /api/user/change-password
 */
router.post('/change-password', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    // Get user with password
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user uses social login (no password)
    if (!user.password) {
      return res.status(400).json({
        message: 'Password changes are not available for social login accounts. Please use your social provider to manage your password.'
      });
    }

    // Verify current password
    const isValid = await comparePasswords(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    await storage.updateUserPassword(userId, hashedPassword);

    // Send password changed notification email
    sendPasswordChangedEmail(user.email).catch(err =>
      console.error('Failed to send password changed email:', err)
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

export default router;
