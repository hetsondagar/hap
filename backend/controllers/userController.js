const User = require('../models/User');
const Event = require('../models/Event');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const Wallet = require('../models/Wallet');
const Badge = require('../models/Badge');
const Achievement = require('../models/Achievement');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .populate('gamification.badges.badgeId', 'name icon rarity')
      .populate('gamification.achievements.achievementId', 'name icon tier')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      count: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('gamification.badges.badgeId', 'name icon rarity')
      .populate('gamification.achievements.achievementId', 'name icon tier')
      .populate('social.friends', 'username avatar gamification.level');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get user stats
// @route   GET /api/users/:id/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user with populated data
    const user = await User.findById(userId)
      .populate('gamification.badges.badgeId', 'name icon rarity')
      .populate('gamification.achievements.achievementId', 'name icon tier');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional stats
    const eventsAttended = await Event.countDocuments({
      'attendees.user': userId,
      'attendees.status': 'confirmed'
    });

    const eventsCreated = await Event.countDocuments({
      organizer: userId
    });

    const groupsJoined = await Group.countDocuments({
      'members.user': userId,
      'members.status': 'active'
    });

    const wallet = await Wallet.findOne({ user: userId });

    const stats = {
      gamification: user.gamification,
      social: {
        friendsCount: user.social.friends.length,
        groupsJoined,
        eventsAttended,
        eventsCreated
      },
      wallet: {
        balance: wallet ? wallet.balance : 0,
        totalEarned: wallet ? wallet.totalEarned : 0,
        totalSpent: wallet ? wallet.totalSpent : 0
      },
      activity: {
        lastActive: user.lastActive,
        joinDate: user.createdAt
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error.message
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/:id/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const notifications = await Notification.getUserNotifications(req.params.id, {
      limit,
      offset,
      type: req.query.type,
      category: req.query.category,
      isRead: req.query.isRead ? req.query.isRead === 'true' : null
    });

    const unreadCount = await Notification.getUnreadCount(req.params.id);

    res.json({
      success: true,
      count: notifications.length,
      pagination: {
        page,
        limit,
        unreadCount
      },
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// @desc    Get user friends
// @route   GET /api/users/:id/friends
// @access  Private
const getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('social.friends', 'username avatar gamification.level gamification.points lastActive')
      .populate('social.friendRequests.from', 'username avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        friends: user.social.friends,
        friendRequests: user.social.friendRequests,
        friendsCount: user.social.friends.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching friends',
      error: error.message
    });
  }
};

// @desc    Add friend
// @route   POST /api/users/:id/friends
// @access  Private
const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.params.id;

    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add yourself as a friend'
      });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already friends
    if (user.social.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: 'Already friends'
      });
    }

    // Check if friend request already exists
    const existingRequest = user.social.friendRequests.find(
      req => req.from.toString() === friendId && req.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Friend request already sent'
      });
    }

    // Add friend request
    user.social.friendRequests.push({
      from: friendId,
      status: 'pending'
    });

    await user.save();

    // Send notification to friend
    await Notification.createFriendRequestNotification(friendId, user);

    res.json({
      success: true,
      message: 'Friend request sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding friend',
      error: error.message
    });
  }
};

// @desc    Remove friend
// @route   DELETE /api/users/:id/friends/:friendId
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const userId = req.params.id;
    const friendId = req.params.friendId;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove from friends list
    user.social.friends = user.social.friends.filter(
      id => id.toString() !== friendId
    );

    // Remove from friend's friends list
    friend.social.friends = friend.social.friends.filter(
      id => id.toString() !== userId
    );

    await Promise.all([user.save(), friend.save()]);

    res.json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing friend',
      error: error.message
    });
  }
};

// @desc    Get user groups
// @route   GET /api/users/:id/groups
// @access  Private
const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.findByUser(req.params.id);

    res.json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user groups',
      error: error.message
    });
  }
};

// @desc    Get user events
// @route   GET /api/users/:id/events
// @access  Private
const getUserEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({
      'attendees.user': req.params.id,
      'attendees.status': 'confirmed'
    })
      .populate('organizer', 'username avatar')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments({
      'attendees.user': req.params.id,
      'attendees.status': 'confirmed'
    });

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
      message: 'Error fetching user events',
      error: error.message
    });
  }
};

// @desc    Get user achievements
// @route   GET /api/users/:id/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('gamification.achievements.achievementId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.gamification.achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user achievements',
      error: error.message
    });
  }
};

// @desc    Get user badges
// @route   GET /api/users/:id/badges
// @access  Private
const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('gamification.badges.badgeId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.gamification.badges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user badges',
      error: error.message
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const users = await User.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { 'profile.firstName': { $regex: q, $options: 'i' } },
            { 'profile.lastName': { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .select('username avatar gamification.level gamification.points')
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message
    });
  }
};

module.exports = {
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
};
