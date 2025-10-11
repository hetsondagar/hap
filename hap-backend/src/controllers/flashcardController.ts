import { Request, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import Flashcard from '../models/Flashcard';
import Deck from '../models/Deck';
import User from '../models/User';

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
    .optional()
    .isIn(['cse', 'mechanical', 'electrical', 'chemical', 'civil', 'other'])
    .withMessage('Invalid department'),
  body('year')
    .optional()
    .isIn(['1st-year', '2nd-year', '3rd-year', '4th-year'])
    .withMessage('Invalid year'),
  body('subjectId')
    .optional()
    .isString()
    .withMessage('Subject ID must be a string'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('public')
    .optional()
    .isBoolean()
    .withMessage('Public must be a boolean')
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

    const { front, back, department, year, subjectId, difficulty = 'medium', tags = [], public: isPublic = false } = req.body;
    const ownerId = req.user?.userId;

    const flashcard = new Flashcard({
      front,
      back,
      department,
      year,
      subjectId,
      difficulty,
      tags,
      public: isPublic,
      ownerId
    });

    await flashcard.save();

    // Update user stats and award XP
    if (ownerId) {
      const user = await User.findById(ownerId);
      if (user) {
        user.totalFlashcardsCreated += 1;
        
        // Award XP for flashcard creation
        user.xp = (user.xp || 0) + 10;
        
        // Simple level calculation
        if (user.xp >= 23000) user.level = 20;
        else if (user.xp >= 19500) user.level = 19;
        else if (user.xp >= 16500) user.level = 18;
        else if (user.xp >= 14000) user.level = 17;
        else if (user.xp >= 12000) user.level = 16;
        else if (user.xp >= 10200) user.level = 15;
        else if (user.xp >= 8600) user.level = 14;
        else if (user.xp >= 7200) user.level = 13;
        else if (user.xp >= 6000) user.level = 12;
        else if (user.xp >= 5000) user.level = 11;
        else if (user.xp >= 4100) user.level = 10;
        else if (user.xp >= 3250) user.level = 9;
        else if (user.xp >= 2500) user.level = 8;
        else if (user.xp >= 1850) user.level = 7;
        else if (user.xp >= 1300) user.level = 6;
        else if (user.xp >= 850) user.level = 5;
        else if (user.xp >= 500) user.level = 4;
        else if (user.xp >= 250) user.level = 3;
        else if (user.xp >= 100) user.level = 2;
        else user.level = 1;
        
        await user.save();
      }
    }

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
    if (flashcard.ownerId.toString() !== userId && !(flashcard as any).public) {
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
    const { q, department, year, subjectId, difficulty, tags, public: publicOnly, page = 1, limit = 20 } = req.query;
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

    // Year filter
    if (year) {
      filter.year = year;
    }

    // Subject filter
    if (subjectId) {
      filter.subjectId = subjectId;
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
    if (publicOnly === 'true' || String(publicOnly) === 'true') {
      filter.public = true;
    } else if (userId) {
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
