const express = require('express');
const { protect } = require('../middleware/auth');
const { validateObjectId, validateMessage, validatePagination } = require('../middleware/validation');
const {
  getChats,
  getChat,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  markAsRead
} = require('../controllers/chatController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Chat management
router.get('/', validatePagination, getChats);
router.get('/:id', validateObjectId('id'), getChat);
router.get('/:id/messages', validateObjectId('id'), validatePagination, getChat);

// Message operations
router.post('/:id/messages', validateObjectId('id'), validateMessage, sendMessage);
router.patch('/:id/messages/:messageId', validateObjectId('id'), validateObjectId('messageId'), editMessage);
router.delete('/:id/messages/:messageId', validateObjectId('id'), validateObjectId('messageId'), deleteMessage);

// Reactions
router.post('/:id/messages/:messageId/reactions', validateObjectId('id'), validateObjectId('messageId'), addReaction);
router.delete('/:id/messages/:messageId/reactions', validateObjectId('id'), validateObjectId('messageId'), removeReaction);

// Chat status
router.patch('/:id/read', validateObjectId('id'), markAsRead);

module.exports = router;
