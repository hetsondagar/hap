const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'achievement', 'badge', 'event_reminder', 'event_invite',
      'friend_request', 'friend_accepted', 'group_invite',
      'group_activity', 'reward_available', 'points_earned',
      'event_cancelled', 'event_updated', 'new_message',
      'leaderboard_update', 'system', 'promotional'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    // Reference to related entity
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'data.referenceModel'
    },
    referenceModel: {
      type: String,
      enum: ['Event', 'User', 'Group', 'Reward', 'Badge', 'Achievement']
    },
    // Additional data
    metadata: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['social', 'gamification', 'events', 'system', 'promotional'],
    required: true
  },
  action: {
    type: {
      type: String,
      enum: ['navigate', 'dismiss', 'accept', 'decline', 'view', 'none'],
      default: 'view'
    },
    url: String,
    buttonText: String
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to mark as unread
notificationSchema.methods.markAsUnread = function() {
  this.isRead = false;
  this.readAt = undefined;
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(notificationData) {
  return this.create(notificationData);
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    limit = 20,
    offset = 0,
    type = null,
    category = null,
    isRead = null,
    priority = null
  } = options;
  
  let query = { user: userId, isActive: true };
  
  if (type) query.type = type;
  if (category) query.category = category;
  if (isRead !== null) query.isRead = isRead;
  if (priority) query.priority = priority;
  
  return this.find(query)
    .populate('data.reference')
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ user: userId, isRead: false, isActive: true });
};

// Static method to create achievement notification
notificationSchema.statics.createAchievementNotification = function(userId, achievement) {
  return this.create({
    user: userId,
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: `You've unlocked the "${achievement.name}" achievement!`,
    category: 'gamification',
    priority: 'high',
    data: {
      reference: achievement._id,
      referenceModel: 'Achievement',
      metadata: {
        achievementName: achievement.name,
        pointsReward: achievement.rewards.points
      }
    },
    action: {
      type: 'navigate',
      url: '/achievements',
      buttonText: 'View Achievement'
    }
  });
};

// Static method to create badge notification
notificationSchema.statics.createBadgeNotification = function(userId, badge) {
  return this.create({
    user: userId,
    type: 'badge',
    title: 'New Badge Earned!',
    message: `You've earned the "${badge.name}" badge!`,
    category: 'gamification',
    priority: 'high',
    data: {
      reference: badge._id,
      referenceModel: 'Badge',
      metadata: {
        badgeName: badge.name,
        rarity: badge.rarity
      }
    },
    action: {
      type: 'navigate',
      url: '/profile',
      buttonText: 'View Badge'
    }
  });
};

// Static method to create event reminder
notificationSchema.statics.createEventReminder = function(userId, event, hoursBefore = 1) {
  return this.create({
    user: userId,
    type: 'event_reminder',
    title: 'Event Reminder',
    message: `${event.title} starts in ${hoursBefore} hour${hoursBefore > 1 ? 's' : ''}!`,
    category: 'events',
    priority: 'medium',
    data: {
      reference: event._id,
      referenceModel: 'Event',
      metadata: {
        eventTitle: event.title,
        startDate: event.startDate,
        location: event.location.name
      }
    },
    action: {
      type: 'navigate',
      url: `/event/${event._id}`,
      buttonText: 'View Event'
    },
    expiresAt: new Date(event.startDate)
  });
};

// Static method to create friend request notification
notificationSchema.statics.createFriendRequestNotification = function(userId, fromUser) {
  return this.create({
    user: userId,
    type: 'friend_request',
    title: 'New Friend Request',
    message: `${fromUser.username} wants to be your friend!`,
    category: 'social',
    priority: 'medium',
    data: {
      reference: fromUser._id,
      referenceModel: 'User',
      metadata: {
        fromUsername: fromUser.username,
        fromAvatar: fromUser.avatar
      }
    },
    action: {
      type: 'navigate',
      url: '/friends',
      buttonText: 'View Request'
    }
  });
};

// Static method to create points earned notification
notificationSchema.statics.createPointsNotification = function(userId, points, source, reference = null) {
  return this.create({
    user: userId,
    type: 'points_earned',
    title: 'Points Earned!',
    message: `You earned ${points} points for ${source}!`,
    category: 'gamification',
    priority: 'low',
    data: {
      reference: reference,
      metadata: {
        points: points,
        source: source
      }
    },
    action: {
      type: 'navigate',
      url: '/wallet',
      buttonText: 'View Wallet'
    }
  });
};

// Static method to cleanup expired notifications
notificationSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
