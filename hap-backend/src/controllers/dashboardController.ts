import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Flashcard from '../models/Flashcard';
import Deck from '../models/Deck';
import Post from '../models/Post';
import bcrypt from 'bcryptjs';

// Validation rules
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

export const validateUsernameChange = [
  body('newUsername')
    .notEmpty()
    .withMessage('New username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
];

// Get user dashboard data
export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Get user with liked items populated
    const user = await User.findById(userId)
      .populate('likedFlashcards')
      .populate('likedDecks');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get user's flashcards
    const myFlashcards = await Flashcard.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Get user's decks
    const myDecks = await Deck.find({ creatorId: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('flashcards');

    // Get user's posts
    const myPosts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        user: {
          username: user.username,
          email: user.email,
          department: user.department,
          year: user.year,
          bio: user.bio,
          badges: user.badges,
          createdAt: user.createdAt
        },
        myFlashcards,
        myDecks,
        likedFlashcards: user.likedFlashcards,
        likedDecks: user.likedDecks,
        myPosts
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching dashboard data'
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
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

    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while changing password'
    });
  }
};

// Change username
export const changeUsername = async (req: Request, res: Response): Promise<void> => {
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

    const userId = req.user?.userId;
    const { newUsername } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser && (existingUser._id as any).toString() !== userId) {
      res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Username updated successfully',
      data: { username: user.username }
    });
  } catch (error) {
    console.error('Change username error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while changing username'
    });
  }
};

// Toggle like flashcard
export const toggleLikeFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { flashcardId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if flashcard exists
    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
      return;
    }

    // Toggle like
    const likedIndex = user.likedFlashcards.findIndex(
      id => id.toString() === flashcardId
    );

    if (likedIndex > -1) {
      // Unlike
      user.likedFlashcards.splice(likedIndex, 1);
    } else {
      // Like
      user.likedFlashcards.push(flashcard._id as any);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: likedIndex > -1 ? 'Flashcard unliked' : 'Flashcard liked',
      data: { isLiked: likedIndex === -1 }
    });
  } catch (error) {
    console.error('Toggle like flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Toggle like deck
export const toggleLikeDeck = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { deckId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if deck exists
    const deck = await Deck.findById(deckId);
    if (!deck) {
      res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
      return;
    }

    // Toggle like in user's liked decks
    const likedIndex = user.likedDecks.findIndex(
      id => id.toString() === deckId
    );

    if (likedIndex > -1) {
      // Unlike
      user.likedDecks.splice(likedIndex, 1);
    } else {
      // Like
      user.likedDecks.push(deck._id as any);
    }

    // Also toggle in deck's likes array
    const deckLikedIndex = deck.likes.findIndex(
      id => id.toString() === userId
    );

    if (deckLikedIndex > -1) {
      deck.likes.splice(deckLikedIndex, 1);
    } else {
      deck.likes.push(user._id as any);
    }

    await user.save();
    await deck.save();

    res.status(200).json({
      success: true,
      message: likedIndex > -1 ? 'Deck unliked' : 'Deck liked',
      data: { isLiked: likedIndex === -1 }
    });
  } catch (error) {
    console.error('Toggle like deck error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get liked flashcards
export const getLikedFlashcards = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).populate('likedFlashcards');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { flashcards: user.likedFlashcards }
    });
  } catch (error) {
    console.error('Get liked flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get liked decks
export const getLikedDecks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).populate({
      path: 'likedDecks',
      populate: { path: 'flashcards' }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { decks: user.likedDecks }
    });
  } catch (error) {
    console.error('Get liked decks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

