import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  questions: IQuestion[];
  score: number;
  totalQuestions: number;
  percentage: number;
  attempts: number;
  userId: mongoose.Types.ObjectId;
  deckId?: mongoose.Types.ObjectId;
  department: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number; // in seconds
  completedAt: Date;
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  options: [{
    type: String,
    required: [true, 'Options are required'],
    trim: true,
    maxlength: [500, 'Option cannot exceed 500 characters']
  }],
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  }
});

const quizSchema = new Schema<IQuiz>({
  questions: [questionSchema],
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions is required'],
    min: 1
  },
  percentage: {
    type: Number,
    required: [true, 'Percentage is required'],
    min: 0,
    max: 100
  },
  attempts: {
    type: Number,
    default: 1,
    min: 1
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  deckId: {
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
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
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeSpent: {
    type: Number,
    required: [true, 'Time spent is required'],
    min: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
quizSchema.index({ userId: 1, completedAt: -1 });
quizSchema.index({ department: 1, difficulty: 1 });
quizSchema.index({ score: -1 });
quizSchema.index({ completedAt: -1 });

export default mongoose.model<IQuiz>('Quiz', quizSchema);
