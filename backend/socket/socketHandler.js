const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected with socket ${socket.id}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Join event chat rooms
    socket.on('join_event_chat', async (eventId) => {
      try {
        const chat = await Chat.findOrCreateEventChat(eventId);
        
        // Check if user is attendee
        const Event = require('../models/Event');
        const event = await Event.findById(eventId);
        const isAttendee = event.attendees.some(
          attendee => attendee.user.toString() === socket.userId
        );

        if (isAttendee || socket.user.role === 'admin') {
          socket.join(`event_${eventId}`);
          socket.emit('joined_event_chat', { eventId, chatId: chat._id });
        } else {
          socket.emit('error', { message: 'Must be an attendee to join event chat' });
        }
      } catch (error) {
        socket.emit('error', { message: 'Error joining event chat' });
      }
    });

    // Join group chat rooms
    socket.on('join_group_chat', async (groupId) => {
      try {
        const chat = await Chat.findOrCreateGroupChat(groupId);
        
        // Check if user is member
        const Group = require('../models/Group');
        const group = await Group.findById(groupId);
        const isMember = group.members.some(
          member => member.user.toString() === socket.userId && member.status === 'active'
        );

        if (isMember || socket.user.role === 'admin') {
          socket.join(`group_${groupId}`);
          socket.emit('joined_group_chat', { groupId, chatId: chat._id });
        } else {
          socket.emit('error', { message: 'Must be a member to join group chat' });
        }
      } catch (error) {
        socket.emit('error', { message: 'Error joining group chat' });
      }
    });

    // Leave chat rooms
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      socket.emit('left_chat', { chatId });
    });

    // Send message to event chat
    socket.on('send_event_message', async (data) => {
      try {
        const { eventId, content, type = 'text' } = data;

        // Verify user is attendee
        const Event = require('../models/Event');
        const event = await Event.findById(eventId);
        const isAttendee = event.attendees.some(
          attendee => attendee.user.toString() === socket.userId
        );

        if (!isAttendee && socket.user.role !== 'admin') {
          socket.emit('error', { message: 'Must be an attendee to send messages' });
          return;
        }

        const chat = await Chat.findOrCreateEventChat(eventId);
        const message = chat.addMessage({
          sender: socket.userId,
          content,
          type
        });

        await chat.save();

        // Emit message to all users in the event chat
        io.to(`event_${eventId}`).emit('new_message', {
          chatId: chat._id,
          message: {
            _id: message._id,
            sender: {
              _id: socket.user._id,
              username: socket.user.username,
              avatar: socket.user.avatar
            },
            content: message.content,
            type: message.type,
            createdAt: message.createdAt
          }
        });

        // Update last seen for sender
        chat.markAsRead(socket.userId);
        await chat.save();
      } catch (error) {
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Send message to group chat
    socket.on('send_group_message', async (data) => {
      try {
        const { groupId, content, type = 'text' } = data;

        // Verify user is member
        const Group = require('../models/Group');
        const group = await Group.findById(groupId);
        const isMember = group.members.some(
          member => member.user.toString() === socket.userId && member.status === 'active'
        );

        if (!isMember && socket.user.role !== 'admin') {
          socket.emit('error', { message: 'Must be a member to send messages' });
          return;
        }

        const chat = await Chat.findOrCreateGroupChat(groupId);
        const message = chat.addMessage({
          sender: socket.userId,
          content,
          type
        });

        await chat.save();

        // Emit message to all users in the group chat
        io.to(`group_${groupId}`).emit('new_message', {
          chatId: chat._id,
          message: {
            _id: message._id,
            sender: {
              _id: socket.user._id,
              username: socket.user.username,
              avatar: socket.user.avatar
            },
            content: message.content,
            type: message.type,
            createdAt: message.createdAt
          }
        });

        // Update last seen for sender
        chat.markAsRead(socket.userId);
        await chat.save();
      } catch (error) {
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Mark messages as read
    socket.on('mark_messages_read', async (data) => {
      try {
        const { chatId } = data;
        const chat = await Chat.findById(chatId);
        
        if (chat) {
          chat.markAsRead(socket.userId);
          await chat.save();
          
          socket.emit('messages_marked_read', { chatId });
        }
      } catch (error) {
        socket.emit('error', { message: 'Error marking messages as read' });
      }
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
      const { chatId, chatType } = data;
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        chatId
      });
    });

    socket.on('typing_stop', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user_stopped_typing', {
        userId: socket.userId,
        chatId
      });
    });

    // Live leaderboard updates
    socket.on('join_leaderboard', () => {
      socket.join('leaderboard');
      socket.emit('joined_leaderboard');
    });

    socket.on('leave_leaderboard', () => {
      socket.leave('leaderboard');
      socket.emit('left_leaderboard');
    });

    // Live notifications
    socket.on('join_notifications', () => {
      socket.join(`notifications_${socket.userId}`);
      socket.emit('joined_notifications');
    });

    socket.on('leave_notifications', () => {
      socket.leave(`notifications_${socket.userId}`);
      socket.emit('left_notifications');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`);
    });
  });

  // Helper function to send notification to user
  const sendNotificationToUser = async (userId, notification) => {
    try {
      io.to(`user_${userId}`).emit('new_notification', notification);
      io.to(`notifications_${userId}`).emit('notification_update', notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Helper function to broadcast leaderboard update
  const broadcastLeaderboardUpdate = (leaderboardData) => {
    io.to('leaderboard').emit('leaderboard_update', leaderboardData);
  };

  // Helper function to broadcast event update
  const broadcastEventUpdate = (eventId, eventData) => {
    io.to(`event_${eventId}`).emit('event_update', eventData);
  };

  // Helper function to broadcast group update
  const broadcastGroupUpdate = (groupId, groupData) => {
    io.to(`group_${groupId}`).emit('group_update', groupData);
  };

  return {
    sendNotificationToUser,
    broadcastLeaderboardUpdate,
    broadcastEventUpdate,
    broadcastGroupUpdate
  };
};

module.exports = socketHandler;
