const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'organizer'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Gamification stats
  gamification: {
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    xpToNext: {
      type: Number,
      default: 100
    },
    eventsAttended: {
      type: Number,
      default: 0
    },
    badges: [{
      badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
      },
      unlockedAt: {
        type: Date,
        default: Date.now
      }
    }],
    achievements: [{
      achievementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
      },
      unlockedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Social features
  social: {
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    friendRequests: [{
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    groupsJoined: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }],
    preferences: {
      categories: [String],
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0]
        }
      },
      radius: {
        type: Number,
        default: 10 // km
      },
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        },
        eventReminders: {
          type: Boolean,
          default: true
        },
        friendActivity: {
          type: Boolean,
          default: true
        }
      }
    }
  },
  
  // Profile information
  profile: {
    firstName: String,
    lastName: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    dateOfBirth: Date,
    phone: String,
    website: String,
    socialLinks: {
      twitter: String,
      instagram: String,
      linkedin: String
    }
  },
  
  // Activity tracking
  lastActive: {
    type: Date,
    default: Date.now
  },
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'gamification.points': -1 });
userSchema.index({ 'gamification.level': -1 });
userSchema.index({ 'social.preferences.location': '2dsphere' });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Virtual for total friends count
userSchema.virtual('friendsCount').get(function() {
  return this.social.friends.length;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      username: this.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// Method to generate refresh token
userSchema.methods.getRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    }
  );
};

// Method to calculate level from XP
userSchema.methods.calculateLevel = function() {
  const xp = this.gamification.xp;
  const level = Math.floor(xp / 100) + 1;
  const xpToNext = 100 - (xp % 100);
  
  this.gamification.level = level;
  this.gamification.xpToNext = xpToNext;
  
  return { level, xpToNext };
};

// Method to add points and update level
userSchema.methods.addPoints = function(points) {
  this.gamification.points += points;
  this.gamification.xp += points;
  this.calculateLevel();
  return this.save();
};

// Method to check if user has badge
userSchema.methods.hasBadge = function(badgeId) {
  return this.gamification.badges.some(badge => 
    badge.badgeId.toString() === badgeId.toString()
  );
};

// Method to add badge
userSchema.methods.addBadge = function(badgeId) {
  if (!this.hasBadge(badgeId)) {
    this.gamification.badges.push({ badgeId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to get user stats for leaderboard
userSchema.methods.getLeaderboardStats = function() {
  return {
    _id: this._id,
    username: this.username,
    avatar: this.avatar,
    points: this.gamification.points,
    level: this.gamification.level,
    eventsAttended: this.gamification.eventsAttended,
    badgesCount: this.gamification.badges.length,
    friendsCount: this.social.friends.length
  };
};

module.exports = mongoose.model('User', userSchema);
