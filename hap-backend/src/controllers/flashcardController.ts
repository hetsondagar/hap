import { Request, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import Flashcard from '../models/Flashcard';
import Deck from '../models/Deck';

// Validation rules
export const validateCreateFlashcard = [
  body('front')
    .notEmpty()
    .withMessage('Front side is required')
    .isLength({ max: 1000 })
    .withMessage('Front side cannot exceed 1000 characters'),
  body('back')
    .notEmpty()
    .withMessage('Back side is required')
    .isLength({ max: 1000 })
    .withMessage('Back side cannot exceed 1000 characters'),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn([
      'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'Engineering', 'Medicine', 'Business', 'Literature', 'History',
      'Geography', 'Art', 'Music', 'Sports', 'Other'
    ])
    .withMessage('Invalid department'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

export const validateFlashcardId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid flashcard ID')
];

// Create flashcard
export const createFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { front, back, department, difficulty = 'medium', tags = [] } = req.body;
    const ownerId = req.user?.userId;

    const flashcard = new Flashcard({
      front,
      back,
      department,
      difficulty,
      tags,
      ownerId
    });

    await flashcard.save();

    res.status(201).json({
      success: true,
      message: 'Flashcard created successfully',
      data: { flashcard }
    });
  } catch (error) {
    console.error('Create flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating flashcard'
    });
  }
};

// Get flashcards by department
export const getFlashcardsByDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dept } = req.params;
    const { page = 1, limit = 20, difficulty, tags } = req.query;
    const userId = req.user?.userId;

    // Build filter
    const filter: any = { department: dept };
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Add user's own flashcards or public flashcards
    if (userId) {
      filter.$or = [
        { ownerId: userId },
        { public: true }
      ];
    } else {
      filter.public = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const flashcards = await Flashcard.find(filter)
      .populate('ownerId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Flashcard.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        flashcards,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching flashcards'
    });
  }
};

// Get user's flashcards
export const getUserFlashcards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, department, difficulty } = req.query;
    const userId = req.user?.userId;

    const filter: any = { ownerId: userId };
    
    if (department) {
      filter.department = department;
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const flashcards = await Flashcard.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Flashcard.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        flashcards,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get user flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user flashcards'
    });
  }
};

// Get single flashcard
export const getFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const flashcard = await Flashcard.findById(id).populate('ownerId', 'username');

    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
      return;
    }

    // Check if user can access this flashcard
    if (flashcard.ownerId.toString() !== userId && !flashcard.public) {
      res.status(403).json({
        success: false,
        message: 'Access denied to this flashcard'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { flashcard }
    });
  } catch (error) {
    console.error('Get flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching flashcard'
    });
  }
};

// Update flashcard
export const updateFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const userId = req.user?.userId;
    const { front, back, department, difficulty, tags } = req.body;

    const flashcard = await Flashcard.findById(id);

    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
      return;
    }

    // Check ownership
    if (flashcard.ownerId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this flashcard'
      });
      return;
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      id,
      { front, back, department, difficulty, tags },
      { new: true, runValidators: true }
    ).populate('ownerId', 'username');

    res.status(200).json({
      success: true,
      message: 'Flashcard updated successfully',
      data: { flashcard: updatedFlashcard }
    });
  } catch (error) {
    console.error('Update flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating flashcard'
    });
  }
};

// Delete flashcard
export const deleteFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const flashcard = await Flashcard.findById(id);

    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
      return;
    }

    // Check ownership
    if (flashcard.ownerId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this flashcard'
      });
      return;
    }

    // Remove flashcard from any decks
    await Deck.updateMany(
      { flashcards: id },
      { $pull: { flashcards: id } }
    );

    await Flashcard.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Flashcard deleted successfully'
    });
  } catch (error) {
    console.error('Delete flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting flashcard'
    });
  }
};

// Search flashcards
export const searchFlashcards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, department, difficulty, tags, page = 1, limit = 20 } = req.query;
    const userId = req.user?.userId;

    const filter: any = {};

    // Text search
    if (q) {
      filter.$or = [
        { front: { $regex: q, $options: 'i' } },
        { back: { $regex: q, $options: 'i' } }
      ];
    }

    // Department filter
    if (department) {
      filter.department = department;
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Access control
    if (userId) {
      filter.$or = [
        { ownerId: userId },
        { public: true }
      ];
    } else {
      filter.public = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const flashcards = await Flashcard.find(filter)
      .populate('ownerId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Flashcard.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        flashcards,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Search flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching flashcards'
    });
  }
};
