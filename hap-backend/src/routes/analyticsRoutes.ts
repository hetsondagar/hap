import { Router } from 'express';
import {
  getUserAnalytics,
  getLeaderboard,
  getDepartmentStats,
  updateWeeklyGoal,
  getProgressTracking,
  validateUserId
} from '../controllers/analyticsController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.get('/:userId', authenticateToken, validateUserId, getUserAnalytics);
router.put('/:userId/weekly-goal', authenticateToken, validateUserId, updateWeeklyGoal);
router.get('/:userId/progress', authenticateToken, validateUserId, getProgressTracking);

// Public routes
router.get('/leaderboard', optionalAuth, getLeaderboard);
router.get('/departments/:department', getDepartmentStats);

export default router;
