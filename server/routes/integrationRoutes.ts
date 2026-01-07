import { Router } from 'express';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';
import { integrationManager, ImportedDocument } from '../integrations';

const router = Router();

/**
 * Import from GitHub
 * POST /api/projects/:projectId/integrations/github
 */
router.post('/:projectId/integrations/github', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'GitHub token is required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const documents = await integrationManager.importFromGitHub({
      type: 'github',
      credentials: { token },
      userId,
      projectId: req.params.projectId,
    });

    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    res.json({
      message: 'GitHub import completed',
      documentsImported: documents.length,
    });
  } catch (error) {
    console.error('GitHub integration error:', error);
    res.status(500).json({ message: 'Failed to import from GitHub' });
  }
});

/**
 * Import from Notion
 * POST /api/projects/:projectId/integrations/notion
 */
router.post('/:projectId/integrations/notion', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Notion token is required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const documents = await integrationManager.importFromNotion({
      type: 'notion',
      credentials: { token },
      userId,
      projectId: req.params.projectId,
    });

    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    res.json({
      message: 'Notion import completed',
      documentsImported: documents.length,
    });
  } catch (error) {
    console.error('Notion integration error:', error);
    res.status(500).json({ message: 'Failed to import from Notion' });
  }
});

/**
 * Import from Google Drive
 * POST /api/projects/:projectId/integrations/google-drive
 */
router.post('/:projectId/integrations/google-drive', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { accessToken, refreshToken, clientId, clientSecret } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Google Drive access token is required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const documents = await integrationManager.importFromGoogleDrive({
      type: 'google-drive',
      credentials: {
        accessToken,
        refreshToken,
        clientId: clientId || process.env.GOOGLE_DRIVE_CLIENT_ID,
        clientSecret: clientSecret || process.env.GOOGLE_DRIVE_CLIENT_SECRET,
        redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
      },
      userId,
      projectId: req.params.projectId,
    });

    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    res.json({
      message: 'Google Drive import completed',
      documentsImported: documents.length,
    });
  } catch (error) {
    console.error('Google Drive integration error:', error);
    res.status(500).json({ message: 'Failed to import from Google Drive' });
  }
});

/**
 * Get project integrations
 * GET /api/projects/:projectId/integrations
 */
router.get('/:projectId/integrations', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const integrations = await storage.getProjectIntegrations(req.params.projectId);
    res.json(integrations);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ message: 'Failed to fetch integrations' });
  }
});

/**
 * Sync integration
 * POST /api/projects/:projectId/integrations/:integrationId/sync
 */
router.post('/:projectId/integrations/:integrationId/sync', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { projectId, integrationId } = req.params;

    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const integration = await storage.getIntegration(projectId, integrationId);
    if (!integration || integration.status !== 'connected') {
      return res.status(400).json({ message: 'Integration not connected' });
    }

    console.log(`Starting sync for ${integrationId} integration on project ${projectId}`);

    let documents: ImportedDocument[] = [];
    try {
      switch (integrationId) {
        case 'dropbox':
          documents = await integrationManager.importFromDropbox({
            type: 'dropbox',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        case 'github':
          documents = await integrationManager.importFromGitHub({
            type: 'github',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        case 'notion':
          documents = await integrationManager.importFromNotion({
            type: 'notion',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        case 'google-drive':
          documents = await integrationManager.importFromGoogleDrive({
            type: 'google-drive',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        case 'asana':
          documents = await integrationManager.importFromAsana({
            type: 'asana',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        case 'jira':
          documents = await integrationManager.importFromJira({
            type: 'jira',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        case 'figma':
          documents = await integrationManager.importFromFigma({
            type: 'figma',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        case 'slack':
          documents = await integrationManager.importFromSlack({
            type: 'slack',
            credentials: integration.credentials as Record<string, string>,
            userId,
            projectId,
          });
          break;
        default:
          return res.status(400).json({ message: `Sync not supported for ${integrationId}` });
      }

      console.log(`Processing ${documents.length} documents from ${integrationId}`);
      await integrationManager.processImportedDocuments(documents, projectId);

      await storage.updateIntegration(integration.id, {
        lastSyncedAt: new Date(),
      });

      console.log(`${integrationId} sync completed successfully. ${documents.length} documents processed.`);
      res.json({
        message: 'Sync completed',
        documentsImported: documents.length,
        success: true,
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`${integrationId} sync error:`, error);
      res.status(500).json({
        message: err.message || `Failed to sync ${integrationId}`,
        success: false,
      });
    }
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Failed to sync integration' });
  }
});

/**
 * Import from Dropbox
 * POST /api/projects/:projectId/integrations/dropbox
 */
router.post('/:projectId/integrations/dropbox', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Dropbox access token is required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingIntegration = await storage.getIntegration(req.params.projectId, 'dropbox');

    if (existingIntegration) {
      await storage.updateIntegration(existingIntegration.id, {
        status: 'connected',
        credentials: { accessToken },
        lastSyncedAt: new Date(),
      });
    } else {
      await storage.createIntegration({
        projectId: req.params.projectId,
        platform: 'dropbox',
        status: 'connected',
        credentials: { accessToken },
        lastSyncedAt: new Date(),
      });
    }

    console.log(`Starting Dropbox import for project ${req.params.projectId}`);
    const documents = await integrationManager.importFromDropbox({
      type: 'dropbox',
      credentials: { accessToken },
      userId,
      projectId: req.params.projectId,
    });

    console.log(`Processing ${documents.length} documents from Dropbox`);
    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    console.log(`Dropbox import completed successfully. ${documents.length} documents processed.`);
    res.json({
      message: 'Dropbox import completed',
      documentsImported: documents.length,
      success: true,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Dropbox integration error:', error);
    res.status(500).json({
      message: err.message || 'Failed to import from Dropbox',
      success: false,
    });
  }
});

/**
 * Import from Asana
 * POST /api/projects/:projectId/integrations/asana
 */
router.post('/:projectId/integrations/asana', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Asana access token is required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const documents = await integrationManager.importFromAsana({
      type: 'asana',
      credentials: { accessToken },
      userId,
      projectId: req.params.projectId,
    });

    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    res.json({
      message: 'Asana import completed',
      documentsImported: documents.length,
    });
  } catch (error) {
    console.error('Asana integration error:', error);
    res.status(500).json({ message: 'Failed to import from Asana' });
  }
});

/**
 * Import from Jira
 * POST /api/projects/:projectId/integrations/jira
 */
router.post('/:projectId/integrations/jira', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { domain, email, apiToken } = req.body;

    if (!domain || !email || !apiToken) {
      return res.status(400).json({ message: 'Jira domain, email, and API token are required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const documents = await integrationManager.importFromJira({
      type: 'jira',
      credentials: { domain, email, apiToken },
      userId,
      projectId: req.params.projectId,
    });

    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    res.json({
      message: 'Jira import completed',
      documentsImported: documents.length,
    });
  } catch (error) {
    console.error('Jira integration error:', error);
    res.status(500).json({ message: 'Failed to import from Jira' });
  }
});

/**
 * Import from Slack
 * POST /api/projects/:projectId/integrations/slack
 */
router.post('/:projectId/integrations/slack', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { botToken, channelId } = req.body;

    if (!botToken || !channelId) {
      return res.status(400).json({ message: 'Bot Token and Channel ID are required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingIntegration = await storage.getIntegration(req.params.projectId, 'slack');

    if (existingIntegration) {
      await storage.updateIntegration(existingIntegration.id, {
        status: 'connected',
        credentials: { botToken, channelId },
        lastSyncedAt: new Date(),
      });
    } else {
      await storage.createIntegration({
        projectId: req.params.projectId,
        platform: 'slack',
        status: 'connected',
        credentials: { botToken, channelId },
        lastSyncedAt: new Date(),
      });
    }

    const documents = await integrationManager.importFromSlack({
      type: 'slack',
      credentials: { botToken, channelId },
      userId,
      projectId: req.params.projectId,
    });

    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    res.json({
      message: 'Slack integration connected successfully',
      documentsImported: documents.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Slack integration error:', error);
    res.status(500).json({ message: err.message || 'Failed to connect to Slack' });
  }
});

/**
 * Import from Figma
 * POST /api/projects/:projectId/integrations/figma
 */
router.post('/:projectId/integrations/figma', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Figma access token is required' });
    }

    const project = await storage.getProject(req.params.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingIntegration = await storage.getIntegration(req.params.projectId, 'figma');

    if (existingIntegration) {
      await storage.updateIntegration(existingIntegration.id, {
        status: 'connected',
        credentials: { accessToken },
        lastSyncedAt: new Date(),
      });
    } else {
      await storage.createIntegration({
        projectId: req.params.projectId,
        platform: 'figma',
        status: 'connected',
        credentials: { accessToken },
        lastSyncedAt: new Date(),
      });
    }

    console.log(`Starting Figma import for project ${req.params.projectId}`);
    const documents = await integrationManager.importFromFigma({
      type: 'figma',
      credentials: { accessToken },
      userId,
      projectId: req.params.projectId,
    });

    console.log(`Processing ${documents.length} documents from Figma`);
    await integrationManager.processImportedDocuments(documents, req.params.projectId);

    console.log(`Figma import completed successfully. ${documents.length} documents processed.`);
    res.json({
      message: 'Figma import completed',
      documentsImported: documents.length,
      success: true,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Figma integration error:', error);
    res.status(500).json({
      message: err.message || 'Failed to import from Figma',
      success: false,
    });
  }
});

export default router;
