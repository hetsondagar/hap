import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    // Check for MongoDB URI first
    const mongoURI = process.env.MONGO_URI;
    const databaseURL = process.env.DATABASE_URL;
    
    if (mongoURI) {
      // Use MongoDB
      const conn = await mongoose.connect(mongoURI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else if (databaseURL) {
      // Use PostgreSQL (you'll need to install pg and set up Sequelize/TypeORM)
      console.log('PostgreSQL URL detected, but MongoDB is currently configured.');
      console.log('Please set MONGO_URI environment variable for MongoDB connection.');
      throw new Error('MONGO_URI environment variable is not defined');
    } else {
      throw new Error('Neither MONGO_URI nor DATABASE_URL environment variables are defined');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

export default connectDB;
