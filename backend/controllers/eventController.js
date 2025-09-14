const Event = require('../models/Event');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const Chat = require('../models/Chat');
const Badge = require('../models/Badge');
const Achievement = require('../models/Achievement');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'published' };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by date range
    if (req.query.startDate) {
      query.startDate = { $gte: new Date(req.query.startDate) };
    }

    if (req.query.endDate) {
      query.endDate = { $lte: new Date(req.query.endDate) };
    }

    // Filter by price
    if (req.query.maxPrice) {
      query.price = { $lte: parseFloat(req.query.maxPrice) };
    }

    // Filter by availability
    if (req.query.available === 'true') {
      query.$expr = { $lt: ['$currentAttendees', '$capacity'] };
    }

    const events = await Event.find(query)
      .populate('organizer', 'username avatar')
      .populate('coOrganizers', 'username avatar')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username avatar gamification.level')
      .populate('coOrganizers', 'username avatar')
      .populate('attendees.user', 'username avatar gamification.level')
      .populate('waitlist.user', 'username avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Increment view count
    event.analytics.views += 1;
    await event.save();

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = async (req, res) => {
  try {
    // Add organizer to request body
    req.body.organizer = req.user._id;

    const event = await Event.create(req.body);

    // Populate organizer data
    await event.populate('organizer', 'username avatar');

    // Create chat for event
    await Chat.findOrCreateEventChat(event._id);

    // Add points for creating event
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (wallet) {
      await wallet.earn(100, 'Event Creation', 'event_creation', event._id);
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'gamification.eventsAttended': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PATCH /api/events/:id
// @access  Private (Organizer/Admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('organizer', 'username avatar')
      .populate('coOrganizers', 'username avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Notify attendees of event update
    const attendees = event.attendees.map(attendee => attendee.user);
    for (const attendeeId of attendees) {
      await Notification.create({
        user: attendeeId,
        type: 'event_updated',
        title: 'Event Updated',
        message: `${event.title} has been updated`,
        category: 'events',
        data: {
          reference: event._id,
          referenceModel: 'Event'
        }
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Notify attendees of event cancellation
    const attendees = event.attendees.map(attendee => attendee.user);
    for (const attendeeId of attendees) {
      await Notification.create({
        user: attendeeId,
        type: 'event_cancelled',
        title: 'Event Cancelled',
        message: `${event.title} has been cancelled`,
        category: 'events',
        data: {
          reference: event._id,
          referenceModel: 'Event'
        }
      });
    }

    // Soft delete - mark as cancelled
    event.status = 'cancelled';
    await event.save();

    res.json({
      success: true,
      message: 'Event cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// @desc    Join event
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Event is not available for joining'
      });
    }

    const result = event.addAttendee(req.user._id);
    await event.save();

    // Add points for joining event
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (wallet) {
      await wallet.earn(event.gamification.pointsReward, `Joined ${event.title}`, 'event_attendance', event._id);
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'gamification.eventsAttended': 1 }
    });

    // Check for achievements
    await checkAndAwardAchievements(req.user._id);

    res.json({
      success: true,
      message: result.message,
      data: {
        status: result.status,
        event: {
          _id: event._id,
          title: event.title,
          currentAttendees: event.currentAttendees,
          capacity: event.capacity
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error joining event',
      error: error.message
    });
  }
};

// @desc    Leave event
// @route   DELETE /api/events/:id/leave
// @access  Private
const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const result = event.removeAttendee(req.user._id);
    await event.save();

    res.json({
      success: true,
      message: result.message,
      data: {
        event: {
          _id: event._id,
          title: event.title,
          currentAttendees: event.currentAttendees,
          capacity: event.capacity
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error leaving event',
      error: error.message
    });
  }
};

// @desc    Check in to event
// @route   POST /api/events/:id/checkin
// @access  Private
const checkInEvent = async (req, res) => {
  try {
    const { qrCode } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find attendee with matching QR code
    const attendee = event.attendees.find(
      a => a.user.toString() === req.user._id.toString() && a.qrCode === qrCode
    );

    if (!attendee) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code or not registered for this event'
      });
    }

    const result = event.checkInAttendee(req.user._id);
    await event.save();

    // Add check-in bonus points
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (wallet) {
      await wallet.earn(event.gamification.checkInBonus, `Checked in to ${event.title}`, 'check_in', event._id);
    }

    // Check for check-in achievements
    await checkAndAwardAchievements(req.user._id);

    res.json({
      success: true,
      message: result.message,
      data: {
        event: {
          _id: event._id,
          title: event.title,
          checkIns: event.analytics.checkIns
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking in',
      error: error.message
    });
  }
};

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Public
const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees.user', 'username avatar gamification.level')
      .populate('waitlist.user', 'username avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: {
        attendees: event.attendees,
        waitlist: event.waitlist,
        totalAttendees: event.currentAttendees,
        capacity: event.capacity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendees',
      error: error.message
    });
  }
};

// @desc    Get event chat
// @route   GET /api/events/:id/chat
// @access  Private
const getEventChat = async (req, res) => {
  try {
    const chat = await Chat.findOrCreateEventChat(req.params.id);
    
    // Check if user is attendee
    const event = await Event.findById(req.params.id);
    const isAttendee = event.attendees.some(
      attendee => attendee.user.toString() === req.user._id.toString()
    );

    if (!isAttendee && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Must be an attendee to access event chat'
      });
    }

    const messages = chat.getMessages({
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    });

    res.json({
      success: true,
      data: {
        chat: {
          _id: chat._id,
          type: chat.type,
          participantCount: chat.participantCount
        },
        messages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event chat',
      error: error.message
    });
  }
};

// @desc    Get nearby events
// @route   GET /api/events/nearby
// @access  Public
const getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    const events = await Event.findNearby(parseFloat(lng), parseFloat(lat), parseFloat(radius));

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby events',
      error: error.message
    });
  }
};

// @desc    Get trending events
// @route   GET /api/events/trending
// @access  Public
const getTrendingEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await Event.findTrending(limit);

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending events',
      error: error.message
    });
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
const searchEvents = async (req, res) => {
  try {
    const { q, category, location, date } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'published' };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Date filter
    if (date) {
      const searchDate = new Date(date);
      query.startDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const events = await Event.find(query)
      .populate('organizer', 'username avatar')
      .sort({ score: { $meta: 'textScore' }, startDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching events',
      error: error.message
    });
  }
};

// @desc    Get event analytics
// @route   GET /api/events/:id/analytics
// @access  Private (Organizer/Admin)
const getEventAnalytics = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const analytics = {
      overview: {
        totalViews: event.analytics.views,
        totalShares: event.analytics.shares,
        totalLikes: event.analytics.likes,
        totalCheckIns: event.analytics.checkIns,
        averageRating: event.analytics.averageRating,
        totalRatings: event.analytics.totalRatings
      },
      attendance: {
        currentAttendees: event.currentAttendees,
        capacity: event.capacity,
        attendanceRate: event.attendanceRate,
        waitlistCount: event.waitlistCount
      },
      engagement: {
        checkInRate: event.currentAttendees > 0 ? (event.analytics.checkIns / event.currentAttendees) * 100 : 0,
        shareRate: event.analytics.views > 0 ? (event.analytics.shares / event.analytics.views) * 100 : 0
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event analytics',
      error: error.message
    });
  }
};

// Helper function to check and award achievements
const checkAndAwardAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userStats = {
      eventsAttended: user.gamification.eventsAttended,
      points: user.gamification.points,
      level: user.gamification.level
    };

    const availableAchievements = await Achievement.getAvailableForUser(userStats, user.gamification.level);

    for (const achievement of availableAchievements) {
      if (!user.gamification.achievements.some(a => a.achievementId.toString() === achievement._id.toString())) {
        // Award achievement
        user.gamification.achievements.push({ achievementId: achievement._id });
        
        // Add points if any
        if (achievement.rewards.points > 0) {
          await user.addPoints(achievement.rewards.points);
        }

        // Create notification
        await Notification.createAchievementNotification(userId, achievement);
      }
    }

    await user.save();
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

module.exports = {
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
};
