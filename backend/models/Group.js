const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [50, 'Group name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Event association
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  
  // Group creator
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  
  // Group settings
  settings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    maxMembers: {
      type: Number,
      default: 8,
      min: [2, 'Minimum 2 members required'],
      max: [20, 'Maximum 20 members allowed']
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    }
  },
  
  // Members
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'removed'],
      default: 'active'
    }
  }],
  
  // Invitations
  invitations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    },
    respondedAt: Date
  }],
  
  // Group status
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active'
  },
  
  // Group activities
  activities: [{
    type: {
      type: String,
      enum: ['message', 'member_joined', 'member_left', 'event_created', 'poll_created'],
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Group preferences
  preferences: {
    meetupLocation: String,
    meetupTime: Date,
    interests: [String],
    ageRange: {
      min: Number,
      max: Number
    }
  },
  
  // Analytics
  analytics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    activeMembers: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
groupSchema.index({ event: 1 });
groupSchema.index({ creator: 1 });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ status: 1 });
groupSchema.index({ 'analytics.lastActivity': -1 });

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.filter(member => member.status === 'active').length;
});

// Virtual for is full
groupSchema.virtual('isFull').get(function() {
  return this.memberCount >= this.settings.maxMembers;
});

// Virtual for available spots
groupSchema.virtual('availableSpots').get(function() {
  return Math.max(0, this.settings.maxMembers - this.memberCount);
});

// Virtual for is creator
groupSchema.virtual('isCreator').get(function() {
  return this.creator.toString();
});

// Method to add member
groupSchema.methods.addMember = function(userId, role = 'member') {
  // Check if user is already a member
  const existingMember = this.members.find(
    member => member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    if (existingMember.status === 'removed') {
      existingMember.status = 'active';
      existingMember.role = role;
      existingMember.joinedAt = new Date();
      return { message: 'Member reactivated' };
    }
    throw new Error('User is already a member of this group');
  }
  
  // Check if group is full
  if (this.isFull) {
    throw new Error('Group is full');
  }
  
  // Add member
  this.members.push({
    user: userId,
    role: role,
    joinedAt: new Date(),
    status: 'active'
  });
  
  // Add activity
  this.activities.push({
    type: 'member_joined',
    user: userId,
    content: 'joined the group'
  });
  
  this.analytics.activeMembers = this.memberCount;
  this.analytics.lastActivity = new Date();
  
  return { message: 'Successfully joined group' };
};

// Method to remove member
groupSchema.methods.removeMember = function(userId, removedBy = null) {
  const memberIndex = this.members.findIndex(
    member => member.user.toString() === userId.toString()
  );
  
  if (memberIndex === -1) {
    throw new Error('User is not a member of this group');
  }
  
  const member = this.members[memberIndex];
  
  // Check if trying to remove creator
  if (member.user.toString() === this.creator.toString()) {
    throw new Error('Cannot remove group creator');
  }
  
  // Remove member
  this.members[memberIndex].status = 'removed';
  
  // Add activity
  this.activities.push({
    type: 'member_left',
    user: userId,
    content: removedBy ? 'was removed from the group' : 'left the group'
  });
  
  this.analytics.activeMembers = this.memberCount;
  this.analytics.lastActivity = new Date();
  
  return { message: 'Member removed successfully' };
};

// Method to promote member to admin
groupSchema.methods.promoteToAdmin = function(userId) {
  const member = this.members.find(
    member => member.user.toString() === userId.toString()
  );
  
  if (!member) {
    throw new Error('User is not a member of this group');
  }
  
  if (member.role === 'admin') {
    throw new Error('User is already an admin');
  }
  
  member.role = 'admin';
  
  // Add activity
  this.activities.push({
    type: 'member_joined',
    user: userId,
    content: 'was promoted to admin'
  });
  
  this.analytics.lastActivity = new Date();
  
  return { message: 'Member promoted to admin' };
};

// Method to invite user
groupSchema.methods.inviteUser = function(userId, invitedBy) {
  // Check if user is already a member
  const existingMember = this.members.find(
    member => member.user.toString() === userId.toString() && member.status === 'active'
  );
  
  if (existingMember) {
    throw new Error('User is already a member of this group');
  }
  
  // Check if user already has pending invitation
  const existingInvitation = this.invitations.find(
    invitation => invitation.user.toString() === userId.toString() && invitation.status === 'pending'
  );
  
  if (existingInvitation) {
    throw new Error('User already has a pending invitation');
  }
  
  // Add invitation
  this.invitations.push({
    user: userId,
    invitedBy: invitedBy,
    status: 'pending',
    invitedAt: new Date()
  });
  
  return { message: 'Invitation sent successfully' };
};

// Method to respond to invitation
groupSchema.methods.respondToInvitation = function(userId, response) {
  const invitation = this.invitations.find(
    invitation => invitation.user.toString() === userId.toString() && invitation.status === 'pending'
  );
  
  if (!invitation) {
    throw new Error('No pending invitation found');
  }
  
  invitation.status = response;
  invitation.respondedAt = new Date();
  
  if (response === 'accepted') {
    // Add user to group
    this.addMember(userId);
  }
  
  return { message: `Invitation ${response} successfully` };
};

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.some(
    member => member.user.toString() === userId.toString() && member.status === 'active'
  );
};

// Method to check if user is admin
groupSchema.methods.isAdmin = function(userId) {
  return this.members.some(
    member => member.user.toString() === userId.toString() && 
              member.status === 'active' && 
              member.role === 'admin'
  );
};

// Method to get member role
groupSchema.methods.getMemberRole = function(userId) {
  const member = this.members.find(
    member => member.user.toString() === userId.toString() && member.status === 'active'
  );
  
  if (!member) return null;
  
  if (member.user.toString() === this.creator.toString()) {
    return 'creator';
  }
  
  return member.role;
};

// Static method to find groups by event
groupSchema.statics.findByEvent = function(eventId) {
  return this.find({ event: eventId, status: 'active' })
    .populate('creator', 'username avatar')
    .populate('members.user', 'username avatar')
    .sort({ createdAt: -1 });
};

// Static method to find user groups
groupSchema.statics.findByUser = function(userId) {
  return this.find({
    'members.user': userId,
    'members.status': 'active',
    status: 'active'
  })
    .populate('event', 'title startDate location')
    .populate('creator', 'username avatar')
    .sort({ 'analytics.lastActivity': -1 });
};

module.exports = mongoose.model('Group', groupSchema);
