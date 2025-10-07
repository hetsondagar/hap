import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  department: string;
  year: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    maxlength: [100, 'Subject name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true,
    maxlength: [20, 'Subject code cannot exceed 20 characters']
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
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
subjectSchema.index({ department: 1, year: 1 });
subjectSchema.index({ code: 1 }, { unique: true });

export default mongoose.model<ISubject>('Subject', subjectSchema);
