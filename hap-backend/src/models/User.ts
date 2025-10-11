import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  bio?: string;
  department: string;
  year: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  badges: string[];
  likedFlashcards: mongoose.Types.ObjectId[];
  likedDecks: mongoose.Types.ObjectId[];
  likedPosts: mongoose.Types.ObjectId[];
  xp: number;
  level: number;
  streak: number;
  lastStudyDate?: Date;
  totalFlashcardsCreated: number;
  totalDecksCreated: number;
  totalQuizzesTaken: number;
  totalCommentsPosted: number;
  perfectQuizzes: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: [
      'cse',
      'mechanical',
      'electrical',
      'chemical',
      'civil',
      'other'
    ]
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: [
      '1st-year',
      '2nd-year',
      '3rd-year',
      '4th-year'
    ]
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  badges: [{
    type: String,
    enum: [
      'first_quiz',
      'streak_7',
      'streak_30',
      'perfect_score',
      'social_butterfly',
      'quiz_master',
      'flashcard_creator',
      'community_helper'
    ]
  }],
  likedFlashcards: [{
    type: Schema.Types.ObjectId,
    ref: 'Flashcard'
  }],
  likedDecks: [{
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }],
  likedPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastStudyDate: {
    type: Date
  },
  totalFlashcardsCreated: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDecksCreated: {
    type: Number,
    default: 0,
    min: 0
  },
  totalQuizzesTaken: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCommentsPosted: {
    type: Number,
    default: 0,
    min: 0
  },
  perfectQuizzes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

export default mongoose.model<IUser>('User', userSchema);
