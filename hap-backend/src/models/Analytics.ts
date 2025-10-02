import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  userId: mongoose.Types.ObjectId;
  studiedCount: number;
  quizAccuracy: number;
  timeSpent: number; // in minutes
  streaks: {
    current: number;
    longest: number;
    lastStudyDate: Date;
  };
  departmentStats: {
    department: string;
    studiedCount: number;
    accuracy: number;
    timeSpent: number;
  }[];
  achievements: string[];
  weeklyGoal: number;
  weeklyProgress: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  studiedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  quizAccuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  streaks: {
    current: {
      type: Number,
      default: 0,
      min: 0
    },
    longest: {
      type: Number,
      default: 0,
      min: 0
    },
    lastStudyDate: {
      type: Date,
      default: null
    }
  },
  departmentStats: [{
    department: {
      type: String,
      required: true,
      enum: [
        'Computer Science',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Engineering',
        'Medicine',
        'Business',
        'Literature',
        'History',
        'Geography',
        'Art',
        'Music',
        'Sports',
        'Other'
      ]
    },
    studiedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  achievements: [{
    type: String,
    enum: [
      'first_quiz',
      'streak_7',
      'streak_30',
      'perfect_score',
      'social_butterfly',
      'quiz_master',
      'flashcard_creator',
      'community_helper',
      'speed_learner',
      'accuracy_master',
      'dedicated_student',
      'knowledge_seeker'
    ]
  }],
  weeklyGoal: {
    type: Number,
    default: 5, // 5 hours per week
    min: 1
  },
  weeklyProgress: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
analyticsSchema.index({ userId: 1 });
analyticsSchema.index({ 'streaks.current': -1 });
analyticsSchema.index({ studiedCount: -1 });
analyticsSchema.index({ quizAccuracy: -1 });

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
