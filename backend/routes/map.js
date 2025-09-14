const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');
const { validateLocationQuery, validatePagination } = require('../middleware/validation');
const {
  getNearbyEvents,
  getEventsByCategory,
  getEventsByDate,
  getPopularLocations,
  getEventDensity
} = require('../controllers/mapController');

const router = express.Router();

// Public routes
router.get('/nearby', validateLocationQuery, validatePagination, optionalAuth, getNearbyEvents);
router.get('/category/:category', validateLocationQuery, validatePagination, getEventsByCategory);
router.get('/date/:date', validateLocationQuery, validatePagination, getEventsByDate);
router.get('/popular-locations', validateLocationQuery, getPopularLocations);
router.get('/density', validateLocationQuery, getEventDensity);

module.exports = router;
