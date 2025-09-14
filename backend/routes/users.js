const express = require('express');
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const { validateUserUpdate, validateObjectId, validatePagination } = require('../middleware/validation');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  getUserNotifications,
  getUserFriends,
  addFriend,
  removeFriend,
  getUserGroups,
  getUserEvents,
  getUserAchievements,
  getUserBadges,
  searchUsers
} = require('../controllers/userController');

const router = express.Router();

// Public routes
router.get('/search', searchUsers);
router.get('/:id', validateObjectId('id'), getUser);

// Protected routes
router.use(protect);

// User management
router.get('/', validatePagination, getUsers);
router.patch('/:id', validateObjectId('id'), checkOwnership(), validateUserUpdate, updateUser);
router.delete('/:id', validateObjectId('id'), authorize('admin'), deleteUser);

// User stats and data
router.get('/:id/stats', validateObjectId('id'), checkOwnership(), getUserStats);
router.get('/:id/notifications', validateObjectId('id'), checkOwnership(), getUserNotifications);
router.get('/:id/friends', validateObjectId('id'), checkOwnership(), getUserFriends);
router.get('/:id/groups', validateObjectId('id'), checkOwnership(), getUserGroups);
router.get('/:id/events', validateObjectId('id'), checkOwnership(), getUserEvents);
router.get('/:id/achievements', validateObjectId('id'), checkOwnership(), getUserAchievements);
router.get('/:id/badges', validateObjectId('id'), checkOwnership(), getUserBadges);

// Friend management
router.post('/:id/friends', validateObjectId('id'), addFriend);
router.delete('/:id/friends/:friendId', validateObjectId('id'), validateObjectId('friendId'), removeFriend);

module.exports = router;
