import { Router } from 'express';
import {
  getUserGamificationStats,
  getDepartmentLeaderboard,
  getAllAchievements,
  checkAndAwardBadges
} from '../controllers/gamificationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/achievements', getAllAchievements);
router.get('/leaderboard/:department', getDepartmentLeaderboard);

// Protected routes
router.get('/stats', authenticateToken, getUserGamificationStats);
router.post('/check-badges', authenticateToken, checkAndAwardBadges);

export default router;

