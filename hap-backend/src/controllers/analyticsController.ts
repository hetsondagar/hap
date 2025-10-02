import { Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import Analytics from '../models/Analytics';
import Quiz from '../models/Quiz';
import Flashcard from '../models/Flashcard';
import Deck from '../models/Deck';
import User from '../models/User';

// Validation rules
export const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
];

// Get user analytics
export const getUserAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.userId;

    // Check if user can access these analytics
    if (userId !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access these analytics'
      });
      return;
    }

    const analytics = await Analytics.findOne({ userId })
      .populate('userId', 'username email');

    if (!analytics) {
      res.status(404).json({
        success: false,
        message: 'Analytics not found for this user'
      });
      return;
    }

    // Get additional statistics
    const quizStats = await Quiz.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' },
          totalTimeSpent: { $sum: '$timeSpent' },
          recentQuizzes: {
            $sum: {
              $cond: [
                { $gte: ['$completedAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const flashcardStats = await Flashcard.aggregate([
      { $match: { ownerId: userId } },
      {
        $group: {
          _id: null,
          totalFlashcards: { $sum: 1 },
          departmentBreakdown: {
            $push: {
              department: '$department',
              count: 1
            }
          }
        }
      }
    ]);

    const deckStats = await Deck.aggregate([
      { $match: { creatorId: userId } },
      {
        $group: {
          _id: null,
          totalDecks: { $sum: 1 },
          publicDecks: {
            $sum: { $cond: ['$public', 1, 0] }
          },
          totalLikes: { $sum: { $size: '$likes' } },
          totalComments: { $sum: { $size: '$comments' } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        analytics,
        quizStats: quizStats[0] || {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          totalTimeSpent: 0,
          recentQuizzes: 0
        },
        flashcardStats: flashcardStats[0] || {
          totalFlashcards: 0,
          departmentBreakdown: []
        },
        deckStats: deckStats[0] || {
          totalDecks: 0,
          publicDecks: 0,
          totalLikes: 0,
          totalComments: 0
        }
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching analytics'
    });
  }
};

// Get leaderboard
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type = 'studied', limit = 50 } = req.query;

    let leaderboard;

    switch (type) {
      case 'studied':
        leaderboard = await Analytics.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $project: {
              username: '$user.username',
              studiedCount: 1,
              quizAccuracy: 1,
              timeSpent: 1,
              'streaks.current': 1,
              'streaks.longest': 1
            }
          },
          { $sort: { studiedCount: -1 } },
          { $limit: Number(limit) }
        ]);
        break;

      case 'accuracy':
        leaderboard = await Analytics.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $project: {
              username: '$user.username',
              studiedCount: 1,
              quizAccuracy: 1,
              timeSpent: 1,
              'streaks.current': 1,
              'streaks.longest': 1
            }
          },
          { $sort: { quizAccuracy: -1 } },
          { $limit: Number(limit) }
        ]);
        break;

      case 'streaks':
        leaderboard = await Analytics.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $project: {
              username: '$user.username',
              studiedCount: 1,
              quizAccuracy: 1,
              timeSpent: 1,
              'streaks.current': 1,
              'streaks.longest': 1
            }
          },
          { $sort: { 'streaks.longest': -1 } },
          { $limit: Number(limit) }
        ]);
        break;

      default:
        res.status(400).json({
          success: false,
          message: 'Invalid leaderboard type. Must be: studied, accuracy, or streaks'
        });
        return;
    }

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        type,
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching leaderboard'
    });
  }
};

// Get department statistics
export const getDepartmentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department } = req.params;

    const departmentStats = await Analytics.aggregate([
      {
        $unwind: '$departmentStats'
      },
      {
        $match: { 'departmentStats.department': department }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          averageAccuracy: { $avg: '$departmentStats.accuracy' },
          averageTimeSpent: { $avg: '$departmentStats.timeSpent' },
          totalStudied: { $sum: '$departmentStats.studiedCount' }
        }
      }
    ]);

    const flashcardStats = await Flashcard.aggregate([
      { $match: { department } },
      {
        $group: {
          _id: null,
          totalFlashcards: { $sum: 1 },
          averageDifficulty: {
            $avg: {
              $cond: [
                { $eq: ['$difficulty', 'easy'] },
                1,
                { $cond: [{ $eq: ['$difficulty', 'medium'] }, 2, 3] }
              ]
            }
          }
        }
      }
    ]);

    const deckStats = await Deck.aggregate([
      { $match: { department, public: true } },
      {
        $group: {
          _id: null,
          totalDecks: { $sum: 1 },
          totalLikes: { $sum: { $size: '$likes' } },
          totalComments: { $sum: { $size: '$comments' } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        department,
        userStats: departmentStats[0] || {
          totalUsers: 0,
          averageAccuracy: 0,
          averageTimeSpent: 0,
          totalStudied: 0
        },
        flashcardStats: flashcardStats[0] || {
          totalFlashcards: 0,
          averageDifficulty: 0
        },
        deckStats: deckStats[0] || {
          totalDecks: 0,
          totalLikes: 0,
          totalComments: 0
        }
      }
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching department statistics'
    });
  }
};

// Update weekly goal
export const updateWeeklyGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { weeklyGoal } = req.body;
    const currentUserId = req.user?.userId;

    if (userId !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this user\'s goal'
      });
      return;
    }

    if (weeklyGoal < 1 || weeklyGoal > 168) { // Max 168 hours per week
      res.status(400).json({
        success: false,
        message: 'Weekly goal must be between 1 and 168 hours'
      });
      return;
    }

    const analytics = await Analytics.findOneAndUpdate(
      { userId },
      { weeklyGoal },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Weekly goal updated successfully',
      data: {
        weeklyGoal: analytics.weeklyGoal
      }
    });
  } catch (error) {
    console.error('Update weekly goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating weekly goal'
    });
  }
};

// Get progress tracking
export const getProgressTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { period = 'week' } = req.query;
    const currentUserId = req.user?.userId;

    if (userId !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this user\'s progress'
      });
      return;
    }

    let dateFilter;
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        res.status(400).json({
          success: false,
          message: 'Invalid period. Must be: week, month, or year'
        });
        return;
    }

    const progress = await Quiz.aggregate([
      {
        $match: {
          userId: userId,
          completedAt: { $gte: dateFilter }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === 'week' ? '%Y-%m-%d' : '%Y-%m',
              date: '$completedAt'
            }
          },
          quizzesCompleted: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        progress
      }
    });
  } catch (error) {
    console.error('Get progress tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching progress tracking'
    });
  }
};
