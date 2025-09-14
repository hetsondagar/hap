const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['earned', 'spent', 'bonus', 'penalty', 'refund', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  source: {
    type: String,
    enum: [
      'event_attendance', 'event_creation', 'friend_invite', 'check_in',
      'early_bird', 'streak_bonus', 'achievement', 'badge',
      'reward_redemption', 'admin_bonus', 'penalty', 'refund'
    ],
    required: true
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['Event', 'Reward', 'Badge', 'Achievement', 'User']
  },
  metadata: {
    eventTitle: String,
    rewardTitle: String,
    badgeName: String,
    achievementName: String,
    friendUsername: String
  },
  balance: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'completed'
  }
}, {
  timestamps: true
});

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema],
  
  // Monthly stats
  monthlyStats: [{
    month: {
      type: String, // YYYY-MM format
      required: true
    },
    earned: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    transactions: {
      type: Number,
      default: 0
    }
  }],
  
  // Settings
  settings: {
    autoSave: {
      type: Boolean,
      default: true
    },
    notifications: {
      lowBalance: {
        type: Boolean,
        default: true
      },
      largeTransaction: {
        type: Boolean,
        default: true
      },
      monthlyReport: {
        type: Boolean,
        default: true
      }
    },
    lowBalanceThreshold: {
      type: Number,
      default: 100
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
walletSchema.index({ user: 1 });
walletSchema.index({ balance: -1 });
walletSchema.index({ 'transactions.createdAt': -1 });
walletSchema.index({ 'transactions.type': 1 });
walletSchema.index({ 'transactions.source': 1 });

// Virtual for transaction count
walletSchema.virtual('transactionCount').get(function() {
  return this.transactions.length;
});

// Virtual for net worth
walletSchema.virtual('netWorth').get(function() {
  return this.totalEarned - this.totalSpent;
});

// Method to add transaction
walletSchema.methods.addTransaction = function(transactionData) {
  const transaction = {
    ...transactionData,
    balance: this.balance + transactionData.amount
  };
  
  // Update balance
  this.balance += transactionData.amount;
  
  // Update totals
  if (transactionData.amount > 0) {
    this.totalEarned += transactionData.amount;
  } else {
    this.totalSpent += Math.abs(transactionData.amount);
  }
  
  // Add transaction
  this.transactions.push(transaction);
  
  // Update monthly stats
  this.updateMonthlyStats(transactionData);
  
  return transaction;
};

// Method to update monthly stats
walletSchema.methods.updateMonthlyStats = function(transactionData) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  let monthlyStat = this.monthlyStats.find(stat => stat.month === currentMonth);
  
  if (!monthlyStat) {
    monthlyStat = {
      month: currentMonth,
      earned: 0,
      spent: 0,
      transactions: 0
    };
    this.monthlyStats.push(monthlyStat);
  }
  
  monthlyStat.transactions += 1;
  
  if (transactionData.amount > 0) {
    monthlyStat.earned += transactionData.amount;
  } else {
    monthlyStat.spent += Math.abs(transactionData.amount);
  }
};

// Method to get transaction history
walletSchema.methods.getTransactionHistory = function(options = {}) {
  const {
    limit = 50,
    offset = 0,
    type = null,
    source = null,
    startDate = null,
    endDate = null
  } = options;
  
  let query = {};
  
  if (type) query.type = type;
  if (source) query.source = source;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return this.transactions
    .filter(transaction => {
      return Object.keys(query).every(key => {
        if (key === 'createdAt') {
          const date = new Date(transaction.createdAt);
          if (query.createdAt.$gte && date < query.createdAt.$gte) return false;
          if (query.createdAt.$lte && date > query.createdAt.$lte) return false;
          return true;
        }
        return transaction[key] === query[key];
      });
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(offset, offset + limit);
};

// Method to get monthly summary
walletSchema.methods.getMonthlySummary = function(month = null) {
  const targetMonth = month || new Date().toISOString().slice(0, 7);
  
  const monthlyStat = this.monthlyStats.find(stat => stat.month === targetMonth);
  
  if (!monthlyStat) {
    return {
      month: targetMonth,
      earned: 0,
      spent: 0,
      transactions: 0,
      net: 0
    };
  }
  
  return {
    ...monthlyStat.toObject(),
    net: monthlyStat.earned - monthlyStat.spent
  };
};

// Method to check if user can afford
walletSchema.methods.canAfford = function(amount) {
  return this.balance >= amount;
};

// Method to spend points
walletSchema.methods.spend = function(amount, description, source, reference = null) {
  if (!this.canAfford(amount)) {
    throw new Error('Insufficient balance');
  }
  
  return this.addTransaction({
    type: 'spent',
    amount: -amount,
    description,
    source,
    reference
  });
};

// Method to earn points
walletSchema.methods.earn = function(amount, description, source, reference = null) {
  return this.addTransaction({
    type: 'earned',
    amount,
    description,
    source,
    reference
  });
};

// Method to add bonus
walletSchema.methods.addBonus = function(amount, description, source, reference = null) {
  return this.addTransaction({
    type: 'bonus',
    amount,
    description,
    source,
    reference
  });
};

// Static method to get top earners
walletSchema.statics.getTopEarners = function(limit = 10) {
  return this.find()
    .populate('user', 'username avatar gamification.level')
    .sort({ totalEarned: -1 })
    .limit(limit);
};

// Static method to get top spenders
walletSchema.statics.getTopSpenders = function(limit = 10) {
  return this.find()
    .populate('user', 'username avatar gamification.level')
    .sort({ totalSpent: -1 })
    .limit(limit);
};

// Static method to get wallet by user
walletSchema.statics.getByUser = function(userId) {
  return this.findOne({ user: userId });
};

// Pre-save middleware to ensure balance is not negative
walletSchema.pre('save', function(next) {
  if (this.balance < 0) {
    return next(new Error('Wallet balance cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('Wallet', walletSchema);
