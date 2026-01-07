import { Router } from 'express';
import { nanoid } from 'nanoid';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';
import { insertLinkSchema } from '@shared/schema';

const router = Router();

/**
 * Get all links for a project
 * GET /api/projects/:projectId/links
 */
router.get('/projects/:projectId/links', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const project = await storage.getProject(req.params.projectId);

    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const links = await storage.getProjectLinks(req.params.projectId);
    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ message: 'Failed to fetch links' });
  }
});

/**
 * Create a new shareable link for a project
 * POST /api/projects/:projectId/links
 */
router.post('/projects/:projectId/links', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const project = await storage.getProject(req.params.projectId);

    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check user subscription and link limits
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check link limits based on subscription
    const existingLinksCount = await storage.getUserLinksCount(userId);

    // Free users can only create 1 link
    if (user.subscriptionStatus !== 'active' && existingLinksCount >= 1) {
      return res.status(402).json({
        message: "You've reached your free plan limit",
        details:
          'Free users can create 1 pitch link. Upgrade to Premium for unlimited pitch links and share your startup with more investors.',
        upgradeUrl: '/settings#billing',
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
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Failed to create link' });
  }
});

/**
 * Update a link
 * PATCH /api/projects/:projectId/links/:id
 */
router.patch('/projects/:projectId/links/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { projectId, id: linkId } = req.params;

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify link belongs to project
    const link = await storage.getLinkById(linkId);
    if (!link || link.projectId !== projectId) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const { name, isActive, requireEmail, allowDownload, expiresAt, customMessage } = req.body;

    // Build updates object with only provided fields
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (isActive !== undefined) updates.isActive = isActive;
    if (requireEmail !== undefined) updates.requireEmail = requireEmail;
    if (allowDownload !== undefined) updates.allowDownload = allowDownload;
    if (customMessage !== undefined) updates.customMessage = customMessage;
    if (expiresAt !== undefined) {
      updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedLink = await storage.updateLink(linkId, updates);
    res.json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ message: 'Failed to update link' });
  }
});

/**
 * Delete a link
 * DELETE /api/projects/:projectId/links/:id
 */
router.delete('/projects/:projectId/links/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { projectId, id: linkId } = req.params;

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify link belongs to project
    const link = await storage.getLinkById(linkId);
    if (!link || link.projectId !== projectId) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Prevent deletion of demo link
    if (link.slug === 'demo') {
      return res.status(403).json({ message: 'Cannot delete demo link' });
    }

    await storage.deleteLink(linkId);
    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: 'Failed to delete link' });
  }
});

export default router;
