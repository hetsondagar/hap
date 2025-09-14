const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Badge name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Badge description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Badge icon is required']
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  category: {
    type: String,
    enum: [
      'attendance', 'social', 'explorer', 'organizer', 
      'streak', 'special', 'milestone', 'achievement'
    ],
    required: [true, 'Badge category is required']
  },
  requirements: {
    type: {
      type: String,
      enum: ['events_attended', 'points_earned', 'friends_invited', 'events_created', 'streak_days', 'custom'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    description: String
  },
  pointsReward: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  unlockConditions: {
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    categories: [String],
    locations: [String],
    timeRestrictions: {
      startDate: Date,
      endDate: Date
    }
  },
  metadata: {
    color: {
      type: String,
      default: '#3B82F6'
    },
    glowEffect: {
      type: Boolean,
      default: false
    },
    animation: {
      type: String,
      enum: ['none', 'pulse', 'rotate', 'bounce'],
      default: 'none'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
badgeSchema.index({ category: 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ isActive: 1 });
badgeSchema.index({ 'requirements.type': 1 });

// Virtual for rarity color
badgeSchema.virtual('rarityColor').get(function() {
  const colors = {
    common: '#6B7280',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[this.rarity] || colors.common;
});

// Method to check if user qualifies for badge
badgeSchema.methods.checkEligibility = function(userStats) {
  switch (this.requirements.type) {
    case 'events_attended':
      return userStats.eventsAttended >= this.requirements.value;
    case 'points_earned':
      return userStats.points >= this.requirements.value;
    case 'friends_invited':
      return userStats.friendsInvited >= this.requirements.value;
    case 'events_created':
      return userStats.eventsCreated >= this.requirements.value;
    case 'streak_days':
      return userStats.currentStreak >= this.requirements.value;
    default:
      return false;
  }
};

// Static method to get badges by category
badgeSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ rarity: 1, name: 1 });
};

// Static method to get available badges for user
badgeSchema.statics.getAvailableForUser = function(userStats) {
  return this.find({ isActive: true, isHidden: false })
    .then(badges => {
      return badges.filter(badge => badge.checkEligibility(userStats));
    });
};

module.exports = mongoose.model('Badge', badgeSchema);
