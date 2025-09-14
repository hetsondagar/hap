const express = require('express');
const { protect, checkOwnership } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createNotification
} = require('../controllers/notificationController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Notification management
router.get('/:userId', validateObjectId('userId'), checkOwnership(), validatePagination, getNotifications);
router.get('/:userId/unread-count', validateObjectId('userId'), checkOwnership(), getUnreadCount);
router.patch('/:id/read', validateObjectId('id'), markAsRead);
router.patch('/:userId/read-all', validateObjectId('userId'), checkOwnership(), markAllAsRead);
router.delete('/:id', validateObjectId('id'), deleteNotification);

// Create notification (for system use)
router.post('/', createNotification);

module.exports = router;
