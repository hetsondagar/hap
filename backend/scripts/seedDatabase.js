const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Event = require('../models/Event');
const Badge = require('../models/Badge');
const Achievement = require('../models/Achievement');
const Reward = require('../models/Reward');
const Wallet = require('../models/Wallet');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Badge.deleteMany({});
    await Achievement.deleteMany({});
    await Reward.deleteMany({});
    await Wallet.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create badges
    const badges = await Badge.insertMany([
      {
        name: 'First Event',
        description: 'Attend your first event',
        icon: 'Star',
        rarity: 'common',
        category: 'attendance',
        requirements: { type: 'events_attended', value: 1 },
        pointsReward: 50
      },
      {
        name: 'Social Butterfly',
        description: 'Attend 10 events',
        icon: 'Users',
        rarity: 'rare',
        category: 'attendance',
        requirements: { type: 'events_attended', value: 10 },
        pointsReward: 100
      },
      {
        name: 'Tech Enthusiast',
        description: 'Attend 5 technology events',
        icon: 'Settings',
        rarity: 'rare',
        category: 'attendance',
        requirements: { type: 'events_attended', value: 5 },
        pointsReward: 150
      },
      {
        name: 'Event Master',
        description: 'Attend 50 events',
        icon: 'Trophy',
        rarity: 'epic',
        category: 'attendance',
        requirements: { type: 'events_attended', value: 50 },
        pointsReward: 500
      },
      {
        name: 'Streak Master',
        description: 'Attend events for 7 consecutive days',
        icon: 'Flame',
        rarity: 'epic',
        category: 'streak',
        requirements: { type: 'streak_days', value: 7 },
        pointsReward: 300
      }
    ]);

    console.log('🏆 Created badges');

    // Create achievements
    const achievements = await Achievement.insertMany([
      {
        name: 'Event Explorer',
        description: 'Attend your first event',
        icon: 'MapPin',
        category: 'milestone',
        tier: 'bronze',
        requirements: { type: 'events_attended', value: 1 },
        rewards: { points: 100, badge: badges[0]._id }
      },
      {
        name: 'Social Networker',
        description: 'Attend 10 events',
        icon: 'Users',
        category: 'milestone',
        tier: 'silver',
        requirements: { type: 'events_attended', value: 10 },
        rewards: { points: 250, badge: badges[1]._id }
      },
      {
        name: 'Tech Guru',
        description: 'Attend 5 technology events',
        icon: 'Settings',
        category: 'milestone',
        tier: 'gold',
        requirements: { type: 'events_attended', value: 5 },
        rewards: { points: 500, badge: badges[2]._id }
      }
    ]);

    console.log('🎯 Created achievements');

    // Create rewards
    const rewards = await Reward.insertMany([
      {
        title: 'Coffee Voucher',
        description: 'Get a free coffee at any partner cafe',
        category: 'discount',
        cost: 100,
        originalValue: 5,
        image: '/placeholder.svg',
        partner: { name: 'Coffee Corner', website: 'https://coffeecorner.com' }
      },
      {
        title: 'Event Ticket Discount',
        description: '20% off your next event ticket',
        category: 'discount',
        cost: 200,
        originalValue: 20,
        image: '/placeholder.svg'
      },
      {
        title: 'VIP Experience',
        description: 'Exclusive VIP access to premium events',
        category: 'special_access',
        cost: 500,
        originalValue: 50,
        image: '/placeholder.svg'
      }
    ]);

    console.log('🎁 Created rewards');

    // Create users
    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@hap.com',
        password: 'admin123',
        role: 'admin',
        gamification: {
          points: 1000,
          level: 15,
          xp: 1500,
          eventsAttended: 25,
          badges: [
            { badgeId: badges[0]._id },
            { badgeId: badges[1]._id }
          ]
        },
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          bio: 'Platform administrator'
        }
      },
      {
        username: 'alexchen',
        email: 'alex@example.com',
        password: 'password123',
        gamification: {
          points: 750,
          level: 12,
          xp: 1200,
          eventsAttended: 18,
          badges: [
            { badgeId: badges[0]._id }
          ]
        },
        profile: {
          firstName: 'Alex',
          lastName: 'Chen',
          bio: 'Tech enthusiast and event lover'
        }
      },
      {
        username: 'sarahkim',
        email: 'sarah@example.com',
        password: 'password123',
        gamification: {
          points: 600,
          level: 10,
          xp: 1000,
          eventsAttended: 15,
          badges: [
            { badgeId: badges[0]._id }
          ]
        },
        profile: {
          firstName: 'Sarah',
          lastName: 'Kim',
          bio: 'Music and art lover'
        }
      }
    ]);

    console.log('👥 Created users');

    // Create wallets for users
    for (const user of users) {
      await Wallet.create({
        user: user._id,
        balance: user.gamification.points,
        totalEarned: user.gamification.points + 500,
        totalSpent: 500
      });
    }

    console.log('💰 Created wallets');

    // Create events
    const events = await Event.insertMany([
      {
        title: 'Tech Innovation Summit 2024',
        description: 'Join us for the biggest technology summit of the year featuring AI, blockchain, and future tech discussions.',
        category: 'technology',
        startDate: new Date('2024-02-15T09:00:00Z'),
        endDate: new Date('2024-02-15T17:00:00Z'),
        location: {
          name: 'Convention Center',
          address: '123 Tech Street, San Francisco, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749]
          }
        },
        organizer: users[0]._id,
        capacity: 500,
        price: 0,
        gamification: {
          pointsReward: 100,
          earlyBirdBonus: 25,
          checkInBonus: 50
        },
        status: 'published'
      },
      {
        title: 'Music Festival 2024',
        description: 'Amazing live music performances from top artists across multiple genres.',
        category: 'music',
        startDate: new Date('2024-02-20T18:00:00Z'),
        endDate: new Date('2024-02-20T23:00:00Z'),
        location: {
          name: 'Music Hall',
          address: '456 Music Avenue, Los Angeles, CA',
          coordinates: {
            type: 'Point',
            coordinates: [-118.2437, 34.0522]
          }
        },
        organizer: users[1]._id,
        capacity: 1000,
        price: 25,
        gamification: {
          pointsReward: 75,
          earlyBirdBonus: 20,
          checkInBonus: 30
        },
        status: 'published'
      },
      {
        title: 'Art Exhibition Opening',
        description: 'Contemporary art exhibition featuring local and international artists.',
        category: 'art',
        startDate: new Date('2024-02-25T19:00:00Z'),
        endDate: new Date('2024-02-25T22:00:00Z'),
        location: {
          name: 'Downtown Gallery',
          address: '789 Art Street, New York, NY',
          coordinates: {
            type: 'Point',
            coordinates: [-74.0060, 40.7128]
          }
        },
        organizer: users[2]._id,
        capacity: 200,
        price: 15,
        gamification: {
          pointsReward: 60,
          earlyBirdBonus: 15,
          checkInBonus: 25
        },
        status: 'published'
      }
    ]);

    console.log('🎭 Created events');

    // Add some attendees to events
    for (const event of events) {
      // Add admin as attendee to all events
      event.addAttendee(users[0]._id);
      
      // Add other users to some events
      if (event.category === 'technology') {
        event.addAttendee(users[1]._id);
      }
      if (event.category === 'music') {
        event.addAttendee(users[2]._id);
      }
      
      await event.save();
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created ${users.length} users, ${events.length} events, ${badges.length} badges, ${achievements.length} achievements, and ${rewards.length} rewards`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
seedDatabase();
