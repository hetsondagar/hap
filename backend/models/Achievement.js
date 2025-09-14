const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Achievement name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Achievement icon is required']
  },
  category: {
    type: String,
    enum: [
      'milestone', 'streak', 'social', 'explorer', 
      'organizer', 'special', 'seasonal', 'challenge'
    ],
    required: [true, 'Achievement category is required']
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  requirements: {
    type: {
      type: String,
      enum: [
        'events_attended', 'points_earned', 'friends_invited', 
        'events_created', 'streak_days', 'categories_explored',
        'locations_visited', 'reviews_written', 'groups_joined'
      ],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    description: String,
    timeLimit: {
      type: Number, // days
      default: null
    }
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    title: String,
    specialPrivileges: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  isRepeatable: {
    type: Boolean,
    default: false
  },
  unlockConditions: {
    level: {
      type: Number,
      default: 1
    },
    prerequisites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    }],
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    categories: [String],
    locations: [String]
  },
  metadata: {
    color: {
      type: String,
      default: '#10B981'
    },
    glowEffect: {
      type: Boolean,
      default: true
    },
    animation: {
      type: String,
      enum: ['none', 'pulse', 'rotate', 'bounce', 'sparkle'],
      default: 'sparkle'
    },
    soundEffect: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
achievementSchema.index({ category: 1 });
achievementSchema.index({ tier: 1 });
achievementSchema.index({ isActive: 1 });
achievementSchema.index({ 'requirements.type': 1 });

// Virtual for tier color
achievementSchema.virtual('tierColor').get(function() {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF'
  };
  return colors[this.tier] || colors.bronze;
});

// Method to check if user qualifies for achievement
achievementSchema.methods.checkEligibility = function(userStats, userLevel = 1) {
  // Check level requirement
  if (userLevel < this.unlockConditions.level) {
    return false;
  }
  
  // Check prerequisites
  if (this.unlockConditions.prerequisites.length > 0) {
    const hasPrerequisites = this.unlockConditions.prerequisites.every(
      prereqId => userStats.unlockedAchievements.includes(prereqId.toString())
    );
    if (!hasPrerequisites) {
      return false;
    }
  }
  
  // Check main requirement
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
    case 'categories_explored':
      return userStats.categoriesExplored >= this.requirements.value;
    case 'locations_visited':
      return userStats.locationsVisited >= this.requirements.value;
    case 'reviews_written':
      return userStats.reviewsWritten >= this.requirements.value;
    case 'groups_joined':
      return userStats.groupsJoined >= this.requirements.value;
    default:
      return false;
  }
};

// Static method to get achievements by category
achievementSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ tier: 1, name: 1 });
};

// Static method to get available achievements for user
achievementSchema.statics.getAvailableForUser = function(userStats, userLevel = 1) {
  return this.find({ isActive: true, isHidden: false })
    .then(achievements => {
      return achievements.filter(achievement => 
        achievement.checkEligibility(userStats, userLevel)
      );
    });
};

// Static method to get achievements by tier
achievementSchema.statics.getByTier = function(tier) {
  return this.find({ tier, isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Achievement', achievementSchema);
