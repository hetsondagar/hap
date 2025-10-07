import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashcard extends Document {
  front: string;
  back: string;
  department: string;
  year: string;
  subjectId: mongoose.Types.ObjectId;
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
      '1st',
      '2nd',
      '3rd',
      '4th'
    ]
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
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

// Index for efficient queries
flashcardSchema.index({ ownerId: 1, department: 1, year: 1 });
flashcardSchema.index({ department: 1, year: 1 });
flashcardSchema.index({ subjectId: 1 });
flashcardSchema.index({ tags: 1 });

export default mongoose.model<IFlashcard>('Flashcard', flashcardSchema);
