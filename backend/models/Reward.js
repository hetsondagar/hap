const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Reward title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Reward description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: [
      'discount', 'freebie', 'experience', 'merchandise', 
      'subscription', 'gift_card', 'special_access', 'badge'
    ],
    required: [true, 'Reward category is required']
  },
  cost: {
    type: Number,
    required: [true, 'Reward cost is required'],
    min: [1, 'Cost must be at least 1 point']
  },
  originalValue: {
    type: Number,
    required: [true, 'Original value is required'],
    min: [0, 'Original value cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  image: {
    type: String,
    required: [true, 'Reward image is required']
  },
  images: [String],
  
  // Availability
  isActive: {
    type: Boolean,
    default: true
  },
  isLimited: {
    type: Boolean,
    default: false
  },
  totalQuantity: {
    type: Number,
    default: null
  },
  remainingQuantity: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  
  // Requirements
  requirements: {
    minLevel: {
      type: Number,
      default: 1
    },
    minPoints: {
      type: Number,
      default: 0
    },
    categories: [String],
    badges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    }]
  },
  
  // Redemption details
  redemptionDetails: {
    type: {
      type: String,
      enum: ['code', 'link', 'contact', 'automatic'],
      default: 'code'
    },
    instructions: String,
    contactInfo: {
      email: String,
      phone: String,
      address: String
    },
    terms: String,
    validityPeriod: {
      type: Number, // days
      default: 30
    }
  },
  
  // Partner information
  partner: {
    name: String,
    logo: String,
    website: String,
    contact: {
      email: String,
      phone: String
    }
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    redemptions: {
      type: Number,
      default: 0
    },
    totalPointsSpent: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  
  // Tags for search
  tags: [String],
  
  // Featured status
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredUntil: Date,
  
  // Redemption history
  redemptions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    redeemedAt: {
      type: Date,
      default: Date.now
    },
    pointsSpent: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'expired', 'cancelled'],
      default: 'pending'
    },
    redemptionCode: String,
    expiresAt: Date,
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
rewardSchema.index({ category: 1 });
rewardSchema.index({ cost: 1 });
rewardSchema.index({ isActive: 1 });
rewardSchema.index({ isFeatured: 1 });
rewardSchema.index({ 'analytics.redemptions': -1 });
rewardSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for availability
rewardSchema.virtual('isAvailable').get(function() {
  if (!this.isActive) return false;
  if (this.endDate && new Date() > this.endDate) return false;
  if (this.isLimited && this.remainingQuantity <= 0) return false;
  return true;
});

// Virtual for savings percentage
rewardSchema.virtual('savingsPercentage').get(function() {
  if (this.originalValue <= 0) return 0;
  return Math.round(((this.originalValue - this.cost) / this.originalValue) * 100);
});

// Virtual for popularity score
rewardSchema.virtual('popularityScore').get(function() {
  const views = this.analytics.views || 0;
  const redemptions = this.analytics.redemptions || 0;
  const rating = this.analytics.averageRating || 0;
  
  return (views * 0.1) + (redemptions * 2) + (rating * 10);
});

// Method to check if user can redeem
rewardSchema.methods.canRedeem = function(user) {
  // Check if reward is available
  if (!this.isAvailable) {
    return { canRedeem: false, reason: 'Reward is not available' };
  }
  
  // Check user level
  if (user.gamification.level < this.requirements.minLevel) {
    return { canRedeem: false, reason: `Minimum level ${this.requirements.minLevel} required` };
  }
  
  // Check user points
  if (user.gamification.points < this.cost) {
    return { canRedeem: false, reason: 'Insufficient points' };
  }
  
  // Check if user already redeemed (for non-repeatable rewards)
  const existingRedemption = this.redemptions.find(
    redemption => redemption.user.toString() === user._id.toString() && 
                  redemption.status === 'completed'
  );
  
  if (existingRedemption && !this.isRepeatable) {
    return { canRedeem: false, reason: 'Already redeemed this reward' };
  }
  
  return { canRedeem: true };
};

// Method to redeem reward
rewardSchema.methods.redeem = function(user) {
  const eligibility = this.canRedeem(user);
  
  if (!eligibility.canRedeem) {
    throw new Error(eligibility.reason);
  }
  
  // Generate redemption code
  const redemptionCode = `${this._id.toString().slice(-6)}-${Date.now().toString().slice(-6)}`;
  
  // Add redemption record
  const redemption = {
    user: user._id,
    pointsSpent: this.cost,
    redemptionCode: redemptionCode,
    expiresAt: new Date(Date.now() + (this.redemptionDetails.validityPeriod * 24 * 60 * 60 * 1000)),
    status: 'pending'
  };
  
  this.redemptions.push(redemption);
  
  // Update analytics
  this.analytics.redemptions += 1;
  this.analytics.totalPointsSpent += this.cost;
  
  // Update remaining quantity if limited
  if (this.isLimited && this.remainingQuantity > 0) {
    this.remainingQuantity -= 1;
  }
  
  return {
    redemptionCode,
    expiresAt: redemption.expiresAt,
    instructions: this.redemptionDetails.instructions
  };
};

// Method to complete redemption
rewardSchema.methods.completeRedemption = function(redemptionCode) {
  const redemption = this.redemptions.find(
    r => r.redemptionCode === redemptionCode && r.status === 'pending'
  );
  
  if (!redemption) {
    throw new Error('Invalid redemption code');
  }
  
  if (new Date() > redemption.expiresAt) {
    redemption.status = 'expired';
    throw new Error('Redemption code has expired');
  }
  
  redemption.status = 'completed';
  return redemption;
};

// Static method to get available rewards
rewardSchema.statics.getAvailable = function(user = null) {
  let query = { isActive: true };
  
  if (user) {
    query['requirements.minLevel'] = { $lte: user.gamification.level };
    query['requirements.minPoints'] = { $lte: user.gamification.points };
  }
  
  return this.find(query)
    .where('startDate').lte(new Date())
    .where(function() {
      return this.endDate == null || this.endDate > new Date();
    })
    .where(function() {
      return !this.isLimited || this.remainingQuantity > 0;
    });
};

// Static method to get featured rewards
rewardSchema.statics.getFeatured = function() {
  return this.find({
    isFeatured: true,
    isActive: true,
    $or: [
      { featuredUntil: { $gt: new Date() } },
      { featuredUntil: { $exists: false } }
    ]
  }).sort({ 'analytics.redemptions': -1 });
};

module.exports = mongoose.model('Reward', rewardSchema);
