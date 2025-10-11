import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  userId: mongoose.Types.ObjectId;
  username: string;
  year?: string;
  text: string;
  createdAt: Date;
}

export interface IDeck extends Document {
  title: string;
  description: string;
  flashcards: mongoose.Types.ObjectId[];
  public: boolean;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  creatorId: mongoose.Types.ObjectId;
  department?: string;
  year?: string;
  subjectId?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  year: {
    type: String,
    enum: ['1st-year', '2nd-year', '3rd-year', '4th-year']
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

const deckSchema = new Schema<IDeck>({
  title: {
    type: String,
    required: [true, 'Deck title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Deck description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  flashcards: [{
    type: Schema.Types.ObjectId,
    ref: 'Flashcard',
    required: true
  }],
  public: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required']
  },
  department: {
    type: String,
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
    enum: [
      '1st-year',
      '2nd-year',
      '3rd-year',
      '4th-year'
    ]
  },
  subjectId: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  }
}, {
  timestamps: true
});

// Optimized indexes for efficient queries
deckSchema.index({ department: 1, year: 1, createdAt: -1 }); // Main browse query
deckSchema.index({ creatorId: 1, createdAt: -1 }); // User's decks
deckSchema.index({ public: 1, department: 1, year: 1 }); // Public decks filtering
deckSchema.index({ title: 'text', description: 'text' }); // Text search

export default mongoose.model<IDeck>('Deck', deckSchema);
