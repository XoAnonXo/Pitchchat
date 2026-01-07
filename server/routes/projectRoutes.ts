import { Router } from 'express';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';
import { insertProjectSchema } from '@shared/schema';

const router = Router();

/**
 * Get all projects for the authenticated user
 * GET /api/projects
 */
router.get('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const projects = await storage.getUserProjects(userId);
    // Cache for 30 seconds - project list with stale-while-revalidate for better UX
    res.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

/**
 * Create a new project
 * POST /api/projects
 */
router.post('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const projectData = insertProjectSchema.parse({ ...req.body, userId });
    const project = await storage.createProject(projectData);
    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

/**
 * Get a specific project by ID
 * GET /api/projects/:id
 */
router.get('/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const project = await storage.getProject(req.params.id);

    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

/**
 * Update a project
 * PATCH /api/projects/:id
 */
router.patch('/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { name, description, status } = req.body;

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Build updates object with only provided fields
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedProject = await storage.updateProject(projectId, updates);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
router.delete('/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await storage.deleteProject(projectId);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
