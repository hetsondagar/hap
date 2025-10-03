import { Request, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import Deck from '../models/Deck';
import User from '../models/User';
import Flashcard from '../models/Flashcard';

// Validation rules
export const validateCreateDeck = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('flashcards')
    .isArray({ min: 1 })
    .withMessage('Deck must contain at least one flashcard'),
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
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

export const validateDeckId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid deck ID')
];

export const validateComment = [
  body('text')
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Browse public decks
export const browseDecks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      department, 
      difficulty, 
      tags, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter: any = { public: true };

    if (department) {
      filter.department = department;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const decks = await Deck.find(filter)
      .populate('creatorId', 'username')
      .populate('flashcards', 'front back')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Deck.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        decks,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Browse decks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while browsing decks'
    });
  }
};

// Create deck
export const createDeck = async (req: Request, res: Response): Promise<void> => {
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

    const { title, description, flashcards, department, difficulty = 'intermediate', tags = [] } = req.body;
    const creatorId = req.user?.userId;

    // Verify all flashcards exist and belong to user
    const flashcardDocs = await Flashcard.find({
      _id: { $in: flashcards },
      ownerId: creatorId
    });

    if (flashcardDocs.length !== flashcards.length) {
      res.status(400).json({
        success: false,
        message: 'Some flashcards not found or not owned by you'
      });
      return;
    }

    const deck = new Deck({
      title,
      description,
      flashcards,
      department,
      difficulty,
      tags,
      creatorId
    });

    await deck.save();

    const populatedDeck = await Deck.findById(deck._id)
      .populate('creatorId', 'username')
      .populate('flashcards', 'front back');

    res.status(201).json({
      success: true,
      message: 'Deck created successfully',
      data: { deck: populatedDeck }
    });
  } catch (error) {
    console.error('Create deck error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating deck'
    });
  }
};

// Get single deck
export const getDeck = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const deck = await Deck.findById(id)
      .populate('creatorId', 'username')
      .populate('flashcards', 'front back department difficulty tags')
      .populate('likes', 'username')
      .populate('comments.userId', 'username');

    if (!deck) {
      res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
      return;
    }

    // Check access
    if (!deck.public && deck.creatorId._id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied to this deck'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { deck }
    });
  } catch (error) {
    console.error('Get deck error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching deck'
    });
  }
};

// Like/unlike deck
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const deck = await Deck.findById(id);

    if (!deck) {
      res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
      return;
    }

    const isLiked = deck.likes.includes(userId as any);

    if (isLiked) {
      deck.likes = deck.likes.filter(likeId => likeId.toString() !== userId);
    } else {
      deck.likes.push(userId as any);
    }

    await deck.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Deck unliked' : 'Deck liked',
      data: {
        isLiked: !isLiked,
        likesCount: deck.likes.length
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while toggling like'
    });
  }
};

// Add comment to deck
export const addComment = async (req: Request, res: Response): Promise<void> => {
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
    const { text } = req.body;
    const userId = req.user?.userId;

    const deck = await Deck.findById(id);

    if (!deck) {
      res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
      return;
    }

    // Get user info
    const user = await User.findById(userId).select('username');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const comment = {
      userId: userId as any,
      username: user.username,
      text,
      createdAt: new Date()
    };

    deck.comments.push(comment);
    await deck.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding comment'
    });
  }
};

// Follow/unfollow user
export const toggleFollow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (id === userId) {
      res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
      return;
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (!userToFollow || !currentUser) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const isFollowing = currentUser.following.includes(id as any);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        followId => followId.toString() !== id
      );
      userToFollow.followers = userToFollow.followers.filter(
        followerId => followerId.toString() !== userId
      );
    } else {
      // Follow
      currentUser.following.push(id as any);
      userToFollow.followers.push(userId as any);
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'User unfollowed' : 'User followed',
      data: {
        isFollowing: !isFollowing,
        followersCount: userToFollow.followers.length,
        followingCount: currentUser.following.length
      }
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while toggling follow'
    });
  }
};

// Get user's decks
export const getUserDecks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const currentUserId = req.user?.userId;

    const filter: any = { creatorId: userId };

    // If not viewing own decks, only show public ones
    if (userId !== currentUserId) {
      filter.public = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const decks = await Deck.find(filter)
      .populate('creatorId', 'username')
      .populate('flashcards', 'front back')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Deck.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        decks,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get user decks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user decks'
    });
  }
};

// Search decks
export const searchDecks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      q, 
      department, 
      difficulty, 
      tags, 
      page = 1, 
      limit = 20 
    } = req.query;

    const filter: any = { public: true };

    // Text search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (department) {
      filter.department = department;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const decks = await Deck.find(filter)
      .populate('creatorId', 'username')
      .populate('flashcards', 'front back')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Deck.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        decks,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Search decks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching decks'
    });
  }
};
