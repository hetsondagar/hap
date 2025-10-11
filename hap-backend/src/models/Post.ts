import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  department?: string;
  year?: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    username: string;
    year?: string;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000
    },
    department: {
      type: String,
      enum: ['cse', 'mechanical', 'electrical', 'chemical', 'civil', 'other']
    },
    year: {
      type: String,
      enum: ['1st-year', '2nd-year', '3rd-year', '4th-year']
    },
    tags: {
      type: [String],
      default: []
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
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
        required: true,
        maxlength: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true
  }
);

// Optimized indexes for efficient queries
PostSchema.index({ department: 1, year: 1, createdAt: -1 }); // Main query - compound index
PostSchema.index({ userId: 1, createdAt: -1 }); // User's posts
PostSchema.index({ title: 'text', content: 'text' }); // Text search

export default mongoose.model<IPost>('Post', PostSchema);

