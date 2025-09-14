const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validateRewardCreation, validateObjectId, validatePagination } = require('../middleware/validation');
const {
  getRewards,
  getReward,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
  getRedeemedRewards,
  getRewardAnalytics
} = require('../controllers/rewardController');

const router = express.Router();

// Public routes
router.get('/', validatePagination, getRewards);
router.get('/:id', validateObjectId('id'), getReward);

// Protected routes
router.use(protect);

// User actions
router.post('/:id/redeem', validateObjectId('id'), redeemReward);
router.get('/my/redeemed', getRedeemedRewards);

// Admin routes
router.use(authorize('admin'));

router.post('/', validateRewardCreation, createReward);
router.patch('/:id', validateObjectId('id'), updateReward);
router.delete('/:id', validateObjectId('id'), deleteReward);
router.get('/:id/analytics', validateObjectId('id'), getRewardAnalytics);

module.exports = router;
