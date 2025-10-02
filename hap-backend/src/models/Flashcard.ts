import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashcard extends Document {
  front: string;
  back: string;
  department: string;
  ownerId: mongoose.Types.ObjectId;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
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
  }]
}, {
  timestamps: true
});

// Index for efficient queries
flashcardSchema.index({ ownerId: 1, department: 1 });
flashcardSchema.index({ department: 1 });
flashcardSchema.index({ tags: 1 });

export default mongoose.model<IFlashcard>('Flashcard', flashcardSchema);
