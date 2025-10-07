import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashcard extends Document {
  front: string;
  back: string;
  department?: string;
  year?: string;
  subjectId?: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  public?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const flashcardSchema = new Schema<IFlashcard>({
  front: {
    type: String,
    required: [true, 'Front side of flashcard is required'],
    trim: true,
    maxlength: [1000, 'Front side cannot exceed 1000 characters']
  },
  back: {
    type: String,
    required: [true, 'Back side of flashcard is required'],
    trim: true,
    maxlength: [1000, 'Back side cannot exceed 1000 characters']
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
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  public: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Optimized indexes for efficient queries
flashcardSchema.index({ ownerId: 1, createdAt: -1 }); // User's flashcards
flashcardSchema.index({ department: 1, year: 1, public: 1 }); // Browse public flashcards
flashcardSchema.index({ subjectId: 1, ownerId: 1 }); // Subject-specific flashcards

export default mongoose.model<IFlashcard>('Flashcard', flashcardSchema);
