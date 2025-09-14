const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'technology', 'music', 'sports', 'art', 'business', 
      'education', 'social', 'gaming', 'food', 'health',
      'travel', 'fashion', 'photography', 'theater', 'dance'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Date and time
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Location
  location: {
    name: {
      type: String,
      required: [true, 'Location name is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required']
      }
    },
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  
  // Event details
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Media
  poster: {
    type: String,
    default: null
  },
  images: [String],
  videos: [String],
  
  // Capacity and pricing
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Gamification
  gamification: {
    pointsReward: {
      type: Number,
      default: 50
    },
    earlyBirdBonus: {
      type: Number,
      default: 25
    },
    referralBonus: {
      type: Number,
      default: 100
    },
    checkInBonus: {
      type: Number,
      default: 25
    },
    badges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    }]
  },
  
  // Event settings
  settings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    allowWaitlist: {
      type: Boolean,
      default: true
    },
    allowChat: {
      type: Boolean,
      default: true
    },
    allowPhotos: {
      type: Boolean,
      default: true
    },
    sendReminders: {
      type: Boolean,
      default: true
    },
    reminderTimes: [{
      type: Number, // hours before event
      default: [24, 2, 1]
    }]
  },
  
  // Attendees and waitlist
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'waitlist', 'cancelled'],
      default: 'confirmed'
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkedInAt: Date,
    qrCode: String
  }],
  
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    priority: {
      type: Number,
      default: 0
    }
  }],
  
  // Event status
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    checkIns: {
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
  
  // Tags for search and discovery
  tags: [String],
  
  // External links
  links: {
    website: String,
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  
  // Cancellation policy
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  refundDeadline: Date,
  
  // Recurring events
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: Number,
    daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
    endDate: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ startDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'analytics.views': -1 });
eventSchema.index({ 'analytics.likes': -1 });

// Virtual for availability
eventSchema.virtual('isAvailable').get(function() {
  return this.currentAttendees < this.capacity;
});

// Virtual for waitlist count
eventSchema.virtual('waitlistCount').get(function() {
  return this.waitlist.length;
});

// Virtual for attendance rate
eventSchema.virtual('attendanceRate').get(function() {
  if (this.capacity === 0) return 0;
  return (this.currentAttendees / this.capacity) * 100;
});

// Virtual for days until event
eventSchema.virtual('daysUntilEvent').get(function() {
  const now = new Date();
  const eventDate = new Date(this.startDate);
  const diffTime = eventDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return new Date(this.startDate) > new Date();
});

// Virtual for is past
eventSchema.virtual('isPast').get(function() {
  return new Date(this.endDate) < new Date();
});

// Virtual for is live
eventSchema.virtual('isLive').get(function() {
  const now = new Date();
  return now >= new Date(this.startDate) && now <= new Date(this.endDate);
});

// Pre-save middleware to generate QR codes for attendees
eventSchema.pre('save', function(next) {
  if (this.isModified('attendees')) {
    this.attendees.forEach(attendee => {
      if (!attendee.qrCode) {
        attendee.qrCode = `${this._id}-${attendee.user}-${Date.now()}`;
      }
    });
  }
  next();
});

// Method to add attendee
eventSchema.methods.addAttendee = function(userId) {
  // Check if user is already attending
  const existingAttendee = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (existingAttendee) {
    throw new Error('User is already attending this event');
  }
  
  // Check capacity
  if (this.currentAttendees >= this.capacity) {
    if (this.settings.allowWaitlist) {
      // Add to waitlist
      this.waitlist.push({ user: userId });
      return { status: 'waitlist', message: 'Added to waitlist' };
    } else {
      throw new Error('Event is full');
    }
  }
  
  // Add to attendees
  this.attendees.push({ user: userId });
  this.currentAttendees += 1;
  
  return { status: 'confirmed', message: 'Successfully joined event' };
};

// Method to remove attendee
eventSchema.methods.removeAttendee = function(userId) {
  const attendeeIndex = this.attendees.findIndex(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (attendeeIndex === -1) {
    throw new Error('User is not attending this event');
  }
  
  this.attendees.splice(attendeeIndex, 1);
  this.currentAttendees -= 1;
  
  // Move someone from waitlist if available
  if (this.waitlist.length > 0) {
    const nextInWaitlist = this.waitlist.shift();
    this.attendees.push({ user: nextInWaitlist.user });
    this.currentAttendees += 1;
  }
  
  return { message: 'Successfully left event' };
};

// Method to check in attendee
eventSchema.methods.checkInAttendee = function(userId) {
  const attendee = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (!attendee) {
    throw new Error('User is not attending this event');
  }
  
  if (attendee.checkedIn) {
    throw new Error('User has already checked in');
  }
  
  attendee.checkedIn = true;
  attendee.checkedInAt = new Date();
  this.analytics.checkIns += 1;
  
  return { message: 'Successfully checked in' };
};

// Method to get nearby events (static method)
eventSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    status: 'published',
    startDate: { $gte: new Date() }
  });
};

// Method to get trending events
eventSchema.statics.findTrending = function(limit = 10) {
  return this.find({
    status: 'published',
    startDate: { $gte: new Date() }
  })
  .sort({ 'analytics.views': -1, 'analytics.likes': -1 })
  .limit(limit);
};

module.exports = mongoose.model('Event', eventSchema);
