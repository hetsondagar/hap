const express = require('express');
const { protect, checkGroupAdmin } = require('../middleware/auth');
const { validateGroupCreation, validateObjectId, validatePagination } = require('../middleware/validation');
const {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  inviteToGroup,
  respondToInvitation,
  promoteToAdmin,
  getGroupMembers,
  getGroupChat
} = require('../controllers/groupController');

const router = express.Router();

// Public routes
router.get('/', validatePagination, getGroups);
router.get('/:id', validateObjectId('id'), getGroup);
router.get('/:id/members', validateObjectId('id'), getGroupMembers);

// Protected routes
router.use(protect);

// Group management
router.post('/', validateGroupCreation, createGroup);
router.patch('/:id', validateObjectId('id'), checkGroupAdmin, updateGroup);
router.delete('/:id', validateObjectId('id'), checkGroupAdmin, deleteGroup);

// Group participation
router.post('/:id/join', validateObjectId('id'), joinGroup);
router.delete('/:id/leave', validateObjectId('id'), leaveGroup);
router.post('/:id/invite', validateObjectId('id'), inviteToGroup);
router.post('/:id/respond', validateObjectId('id'), respondToInvitation);
router.patch('/:id/promote/:userId', validateObjectId('id'), validateObjectId('userId'), checkGroupAdmin, promoteToAdmin);

// Group data
router.get('/:id/chat', validateObjectId('id'), getGroupChat);

module.exports = router;
