const express = require('express');
const { protect, authorize, checkEventOrganizer } = require('../middleware/auth');
const { validateEventCreation, validateEventUpdate, validateObjectId, validatePagination, validateLocationQuery } = require('../middleware/validation');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  checkInEvent,
  getEventAttendees,
  getEventChat,
  getNearbyEvents,
  getTrendingEvents,
  searchEvents,
  getEventAnalytics
} = require('../controllers/eventController');

const router = express.Router();

// Public routes
router.get('/', validatePagination, getEvents);
router.get('/search', searchEvents);
router.get('/nearby', validateLocationQuery, getNearbyEvents);
router.get('/trending', getTrendingEvents);
router.get('/:id', validateObjectId('id'), getEvent);
router.get('/:id/attendees', validateObjectId('id'), getEventAttendees);

// Protected routes
router.use(protect);

// Event management
router.post('/', validateEventCreation, createEvent);
router.patch('/:id', validateObjectId('id'), checkEventOrganizer, validateEventUpdate, updateEvent);
router.delete('/:id', validateObjectId('id'), checkEventOrganizer, deleteEvent);

// Event participation
router.post('/:id/join', validateObjectId('id'), joinEvent);
router.delete('/:id/leave', validateObjectId('id'), leaveEvent);
router.post('/:id/checkin', validateObjectId('id'), checkInEvent);

// Event data
router.get('/:id/chat', validateObjectId('id'), getEventChat);
router.get('/:id/analytics', validateObjectId('id'), checkEventOrganizer, getEventAnalytics);

module.exports = router;
