import { Request, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import Quiz from '../models/Quiz';
import Flashcard from '../models/Flashcard';
import Deck from '../models/Deck';
import Analytics from '../models/Analytics';

// Validation rules
export const validateSubmitQuiz = [
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Questions array is required and must not be empty'),
  body('questions.*.question')
    .notEmpty()
    .withMessage('Question text is required'),
  body('questions.*.options')
    .isArray({ min: 2 })
    .withMessage('Each question must have at least 2 options'),
  body('questions.*.correctAnswer')
    .isInt({ min: 0 })
    .withMessage('Correct answer must be a valid index'),
  body('timeSpent')
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive number'),
  body('deckId')
    .optional()
    .isMongoId()
    .withMessage('Invalid deck ID')
];

export const validateQuizId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid quiz ID')
];

// Generate quiz from flashcards
export const generateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, difficulty, limit = 10, deckId } = req.query;
    const userId = req.user?.userId;

    let flashcards;

    if (deckId) {
      // Get flashcards from specific deck
      const deck = await Deck.findById(deckId).populate('flashcards');
      if (!deck) {
        res.status(404).json({
          success: false,
          message: 'Deck not found'
        });
        return;
      }

      // Check if deck is public or user owns it
      if (!deck.public && deck.creatorId.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this deck'
        });
        return;
      }

      flashcards = deck.flashcards;
    } else {
      // Get flashcards by filters
      const filter: any = {};

      if (department) {
        filter.department = department;
      }

      if (difficulty) {
        filter.difficulty = difficulty;
      }

      // Add access control
      if (userId) {
        filter.$or = [
          { ownerId: userId },
          { public: true }
        ];
      } else {
        filter.public = true;
      }

      flashcards = await Flashcard.find(filter)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    }

    if (flashcards.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No flashcards found for quiz generation'
      });
      return;
    }

    // Convert flashcards to quiz questions
    const questions = flashcards.map(flashcard => {
      // Create multiple choice options
      const options = [flashcard.back];
      
      // Add some random options (simplified - in real app, you'd want smarter options)
      const otherOptions = flashcards
        .filter(f => f._id.toString() !== flashcard._id.toString())
        .map(f => f.back)
        .slice(0, 3);
      
      options.push(...otherOptions);
      
      // Shuffle options
      const shuffledOptions = options.sort(() => Math.random() - 0.5);
      const correctIndex = shuffledOptions.indexOf(flashcard.back);

      return {
        flashcardId: flashcard._id,
        question: flashcard.front,
        options: shuffledOptions,
        correctAnswer: correctIndex,
        explanation: `The correct answer is: ${flashcard.back}`
      };
    });

    res.status(200).json({
      success: true,
      data: {
        questions,
        totalQuestions: questions.length,
        department: department || 'Mixed',
        difficulty: difficulty || 'Mixed'
      }
    });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while generating quiz'
    });
  }
};

// Submit quiz attempt
export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
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

    const { questions, timeSpent, deckId } = req.body;
    const userId = req.user?.userId;

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach((question: any) => {
      if (question.selectedAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Create quiz record
    const quiz = new Quiz({
      questions,
      score: correctAnswers,
      totalQuestions,
      percentage,
      userId,
      deckId,
      department: questions[0]?.department || 'Mixed',
      difficulty: questions[0]?.difficulty || 'medium',
      timeSpent
    });

    await quiz.save();

    // Update analytics
    await updateUserAnalytics(userId, correctAnswers, totalQuestions, timeSpent);

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        quiz: {
          id: quiz._id,
          score: correctAnswers,
          totalQuestions,
          percentage,
          timeSpent,
          completedAt: quiz.completedAt
        }
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while submitting quiz'
    });
  }
};

// Get quiz results for user
export const getQuizResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, department, difficulty } = req.query;
    const currentUserId = req.user?.userId;

    // Check if user can access these results
    if (userId !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access these quiz results'
      });
      return;
    }

    const filter: any = { userId };
    
    if (department) {
      filter.department = department;
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const quizzes = await Quiz.find(filter)
      .populate('deckId', 'title')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Quiz.countDocuments(filter);

    // Calculate statistics
    const stats = await Quiz.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        quizzes,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        },
        statistics: stats[0] || {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          totalTimeSpent: 0
        }
      }
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching quiz results'
    });
  }
};

// Get single quiz result
export const getQuizResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const quiz = await Quiz.findById(id).populate('deckId', 'title');

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    // Check ownership
    if (quiz.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this quiz result'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { quiz }
    });
  } catch (error) {
    console.error('Get quiz result error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching quiz result'
    });
  }
};

// Helper function to update user analytics
const updateUserAnalytics = async (
  userId: string,
  correctAnswers: number,
  totalQuestions: number,
  timeSpent: number
): Promise<void> => {
  try {
    const analytics = await Analytics.findOne({ userId });
    
    if (!analytics) {
      // Create new analytics record
      const newAnalytics = new Analytics({
        userId,
        studiedCount: 1,
        quizAccuracy: (correctAnswers / totalQuestions) * 100,
        timeSpent: timeSpent / 60, // Convert to minutes
        streaks: {
          current: 1,
          longest: 1,
          lastStudyDate: new Date()
        }
      });
      await newAnalytics.save();
    } else {
      // Update existing analytics
      const newStudiedCount = analytics.studiedCount + 1;
      const newAccuracy = ((analytics.quizAccuracy * analytics.studiedCount) + 
        ((correctAnswers / totalQuestions) * 100)) / newStudiedCount;
      
      // Update streak
      const today = new Date();
      const lastStudy = analytics.streaks.lastStudyDate;
      const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
      
      let newCurrentStreak = analytics.streaks.current;
      if (daysDiff === 1) {
        newCurrentStreak += 1;
      } else if (daysDiff > 1) {
        newCurrentStreak = 1;
      }

      await Analytics.findByIdAndUpdate(analytics._id, {
        studiedCount: newStudiedCount,
        quizAccuracy: newAccuracy,
        timeSpent: analytics.timeSpent + (timeSpent / 60),
        'streaks.current': newCurrentStreak,
        'streaks.longest': Math.max(analytics.streaks.longest, newCurrentStreak),
        'streaks.lastStudyDate': today
      });
    }
  } catch (error) {
    console.error('Update analytics error:', error);
  }
};
