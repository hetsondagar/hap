const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');
const {
  getLeaderboard,
  getUserRank,
  getTopEarners,
  getTopSpenders,
  getCategoryLeaderboard,
  getMonthlyLeaderboard
} = require('../controllers/leaderboardController');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getLeaderboard);
router.get('/earners', validatePagination, getTopEarners);
router.get('/spenders', validatePagination, getTopSpenders);
router.get('/category/:category', validatePagination, getCategoryLeaderboard);
router.get('/monthly', validatePagination, getMonthlyLeaderboard);

// Protected routes
router.use(protect);

router.get('/my-rank', getUserRank);

module.exports = router;
