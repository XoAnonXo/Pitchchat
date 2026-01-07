import { Router } from 'express';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';

const router = Router();

/**
 * Get user analytics overview
 * GET /api/analytics
 */
router.get('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const analytics = await storage.getUserAnalytics(userId);
    // Cache for 60 seconds - analytics data doesn't need real-time updates
    res.set('Cache-Control', 'private, max-age=60');
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

/**
 * Get detailed analytics with charts data
 * GET /api/analytics/detailed
 */
router.get('/detailed', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const detailedAnalytics = await storage.getDetailedAnalytics(userId);
    // Cache for 2 minutes - detailed analytics are heavier and don't need frequent refreshes
    res.set('Cache-Control', 'private, max-age=120');
    res.json(detailedAnalytics);
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    res.status(500).json({ message: 'Failed to fetch detailed analytics' });
  }
});

export default router;
