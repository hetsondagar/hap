const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system', 'event_update'],
    default: 'text'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'link']
    },
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  metadata: {
    eventTitle: String,
    eventId: String,
    systemAction: String
  }
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'group', 'direct'],
    required: true
  },
  name: {
    type: String,
    required: function() {
      return this.type === 'group';
    }
  },
  description: String,
  
  // Reference to the related entity
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel',
    required: true
  },
  referenceModel: {
    type: String,
    enum: ['Event', 'Group', 'User']
  },
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'moderator'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Messages
  messages: [messageSchema],
  
  // Chat settings
  settings: {
    isActive: {
      type: Boolean,
      default: true
    },
    allowImages: {
      type: Boolean,
      default: true
    },
    allowFiles: {
      type: Boolean,
      default: false
    },
    maxFileSize: {
      type: Number,
      default: 10485760 // 10MB
    },
    allowedFileTypes: [String],
    messageRetention: {
      type: Number,
      default: 30 // days
    },
    moderation: {
      enabled: {
        type: Boolean,
        default: false
      },
      autoDelete: {
        type: Boolean,
        default: false
      },
      profanityFilter: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Analytics
  analytics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    activeUsers: {
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
chatSchema.index({ type: 1, reference: 1 });
chatSchema.index({ 'participants.user': 1 });
chatSchema.index({ 'analytics.lastActivity': -1 });
chatSchema.index({ 'messages.createdAt': -1 });

// Virtual for participant count
chatSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Virtual for last message
chatSchema.virtual('lastMessage').get(function() {
  return this.messages
    .filter(m => !m.isDeleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
});

// Virtual for unread count for a user
chatSchema.virtual('unreadCount').get(function() {
  return (userId) => {
    const participant = this.participants.find(p => p.user.toString() === userId.toString());
    if (!participant) return 0;
    
    return this.messages.filter(m => 
      !m.isDeleted && 
      new Date(m.createdAt) > new Date(participant.lastSeen) &&
      m.sender.toString() !== userId.toString()
    ).length;
  };
};

// Method to add participant
chatSchema.methods.addParticipant = function(userId, role = 'member') {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (existingParticipant) {
    if (!existingParticipant.isActive) {
      existingParticipant.isActive = true;
      existingParticipant.joinedAt = new Date();
      existingParticipant.lastSeen = new Date();
    }
    return existingParticipant;
  }
  
  const participant = {
    user: userId,
    role: role,
    joinedAt: new Date(),
    lastSeen: new Date(),
    isActive: true
  };
  
  this.participants.push(participant);
  this.analytics.activeUsers = this.participantCount;
  
  return participant;
};

// Method to remove participant
chatSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.isActive = false;
    this.analytics.activeUsers = this.participantCount;
  }
  
  return participant;
};

// Method to add message
chatSchema.methods.addMessage = function(messageData) {
  const message = {
    ...messageData,
    createdAt: new Date()
  };
  
  this.messages.push(message);
  this.analytics.totalMessages += 1;
  this.analytics.lastActivity = new Date();
  
  return message;
};

// Method to get messages
chatSchema.methods.getMessages = function(options = {}) {
  const {
    limit = 50,
    offset = 0,
    before = null,
    after = null
  } = options;
  
  let messages = this.messages.filter(m => !m.isDeleted);
  
  if (before) {
    messages = messages.filter(m => new Date(m.createdAt) < new Date(before));
  }
  
  if (after) {
    messages = messages.filter(m => new Date(m.createdAt) > new Date(after));
  }
  
  return messages
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(offset, offset + limit)
    .reverse();
};

// Method to mark as read
chatSchema.methods.markAsRead = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastSeen = new Date();
  }
  
  return participant;
};

// Method to check if user is participant
chatSchema.methods.isParticipant = function(userId) {
  return this.participants.some(
    p => p.user.toString() === userId.toString() && p.isActive
  );
};

// Method to get participant role
chatSchema.methods.getParticipantRole = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString() && p.isActive
  );
  
  return participant ? participant.role : null;
};

// Static method to find or create event chat
chatSchema.statics.findOrCreateEventChat = function(eventId) {
  return this.findOne({ type: 'event', reference: eventId })
    .then(chat => {
      if (chat) return chat;
      
      return this.create({
        type: 'event',
        reference: eventId,
        referenceModel: 'Event'
      });
    });
};

// Static method to find or create group chat
chatSchema.statics.findOrCreateGroupChat = function(groupId) {
  return this.findOne({ type: 'group', reference: groupId })
    .then(chat => {
      if (chat) return chat;
      
      return this.create({
        type: 'group',
        reference: groupId,
        referenceModel: 'Group'
      });
    });
};

// Static method to find user chats
chatSchema.statics.findUserChats = function(userId) {
  return this.find({
    'participants.user': userId,
    'participants.isActive': true,
    'settings.isActive': true
  })
    .populate('reference', 'title name')
    .populate('participants.user', 'username avatar')
    .sort({ 'analytics.lastActivity': -1 });
};

// Static method to cleanup old messages
chatSchema.statics.cleanupOldMessages = function() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days ago
  
  return this.updateMany(
    {},
    {
      $pull: {
        messages: {
          createdAt: { $lt: cutoffDate },
          type: { $ne: 'system' }
        }
      }
    }
  );
};

module.exports = mongoose.model('Chat', chatSchema);
