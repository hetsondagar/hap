import { Request, Response } from 'express';
import User from '../models/User';
import Flashcard from '../models/Flashcard';
import Deck from '../models/Deck';
import Post from '../models/Post';

// Badge definitions with criteria
export const BADGE_CRITERIA = {
  // Flashcard Creation Badges
  'first_flashcard': { xp: 10, name: 'First Steps', description: 'Create your first flashcard', check: (user: any) => user.totalFlashcardsCreated >= 1 },
  'flashcard_creator_5': { xp: 50, name: 'Flashcard Novice', description: 'Create 5 flashcards', check: (user: any) => user.totalFlashcardsCreated >= 5 },
  'flashcard_creator_25': { xp: 150, name: 'Flashcard Expert', description: 'Create 25 flashcards', check: (user: any) => user.totalFlashcardsCreated >= 25 },
  'flashcard_creator_100': { xp: 500, name: 'Flashcard Master', description: 'Create 100 flashcards', check: (user: any) => user.totalFlashcardsCreated >= 100 },
  
  // Deck Creation Badges
  'first_deck': { xp: 25, name: 'Deck Builder', description: 'Create your first deck', check: (user: any) => user.totalDecksCreated >= 1 },
  'deck_creator_5': { xp: 100, name: 'Deck Collector', description: 'Create 5 decks', check: (user: any) => user.totalDecksCreated >= 5 },
  'deck_creator_20': { xp: 400, name: 'Deck Legend', description: 'Create 20 decks', check: (user: any) => user.totalDecksCreated >= 20 },
  
  // Streak Badges
  'streak_3': { xp: 30, name: 'Getting Started', description: 'Maintain a 3-day streak', check: (user: any) => user.streak >= 3 },
  'streak_7': { xp: 75, name: 'Week Warrior', description: 'Maintain a 7-day streak', check: (user: any) => user.streak >= 7 },
  'streak_30': { xp: 300, name: 'Monthly Master', description: 'Maintain a 30-day streak', check: (user: any) => user.streak >= 30 },
  'streak_100': { xp: 1000, name: 'Centurion', description: 'Maintain a 100-day streak', check: (user: any) => user.streak >= 100 },
  
  // Quiz Badges
  'first_quiz': { xp: 15, name: 'Quiz Starter', description: 'Complete your first quiz', check: (user: any) => user.totalQuizzesTaken >= 1 },
  'quiz_taker_10': { xp: 100, name: 'Quiz Enthusiast', description: 'Complete 10 quizzes', check: (user: any) => user.totalQuizzesTaken >= 10 },
  'quiz_taker_50': { xp: 350, name: 'Quiz Master', description: 'Complete 50 quizzes', check: (user: any) => user.totalQuizzesTaken >= 50 },
  'perfect_score': { xp: 200, name: 'Perfectionist', description: 'Score 100% on a quiz', check: (user: any) => user.perfectQuizzes >= 1 },
  'perfect_score_10': { xp: 600, name: 'Flawless', description: 'Score 100% on 10 quizzes', check: (user: any) => user.perfectQuizzes >= 10 },
  
  // Community Badges
  'social_butterfly': { xp: 50, name: 'Community Member', description: 'Post 5 comments', check: (user: any) => user.totalCommentsPosted >= 5 },
  'community_helper': { xp: 200, name: 'Helpful Member', description: 'Post 25 comments', check: (user: any) => user.totalCommentsPosted >= 25 },
  'discussion_leader': { xp: 500, name: 'Discussion Leader', description: 'Post 100 comments', check: (user: any) => user.totalCommentsPosted >= 100 },
  
  // Level-based Badges
  'level_5': { xp: 0, name: 'Rising Star', description: 'Reach level 5', check: (user: any) => user.level >= 5 },
  'level_10': { xp: 0, name: 'Elite Learner', description: 'Reach level 10', check: (user: any) => user.level >= 10 },
  'level_20': { xp: 0, name: 'Learning Legend', description: 'Reach level 20', check: (user: any) => user.level >= 20 },
};

// Compute progress (0-100) toward a badge based on current user stats
const computeBadgeProgress = (user: any, key: string): number => {
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  switch (key) {
    // Flashcards
    case 'first_flashcard': return clamp((user.totalFlashcardsCreated / 1) * 100);
    case 'flashcard_creator_5': return clamp((user.totalFlashcardsCreated / 5) * 100);
    case 'flashcard_creator_25': return clamp((user.totalFlashcardsCreated / 25) * 100);
    case 'flashcard_creator_100': return clamp((user.totalFlashcardsCreated / 100) * 100);
    // Decks
    case 'first_deck': return clamp((user.totalDecksCreated / 1) * 100);
    case 'deck_creator_5': return clamp((user.totalDecksCreated / 5) * 100);
    case 'deck_creator_20': return clamp((user.totalDecksCreated / 20) * 100);
    // Streaks
    case 'streak_3': return clamp((user.streak / 3) * 100);
    case 'streak_7': return clamp((user.streak / 7) * 100);
    case 'streak_30': return clamp((user.streak / 30) * 100);
    case 'streak_100': return clamp((user.streak / 100) * 100);
    // Quizzes
    case 'first_quiz': return clamp((user.totalQuizzesTaken / 1) * 100);
    case 'quiz_taker_10': return clamp((user.totalQuizzesTaken / 10) * 100);
    case 'quiz_taker_50': return clamp((user.totalQuizzesTaken / 50) * 100);
    case 'perfect_score': return clamp((user.perfectQuizzes / 1) * 100);
    case 'perfect_score_10': return clamp((user.perfectQuizzes / 10) * 100);
    // Community
    case 'social_butterfly': return clamp((user.totalCommentsPosted / 5) * 100);
    case 'community_helper': return clamp((user.totalCommentsPosted / 25) * 100);
    case 'discussion_leader': return clamp((user.totalCommentsPosted / 100) * 100);
    // Level
    case 'level_5': return clamp((user.level / 5) * 100);
    case 'level_10': return clamp((user.level / 10) * 100);
    case 'level_20': return clamp((user.level / 20) * 100);
    default: return 0;
  }
};

// XP thresholds for levels
const XP_LEVELS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  850,    // Level 5
  1300,   // Level 6
  1850,   // Level 7
  2500,   // Level 8
  3250,   // Level 9
  4100,   // Level 10
  5000,   // Level 11
  6000,   // Level 12
  7200,   // Level 13
  8600,   // Level 14
  10200,  // Level 15
  12000,  // Level 16
  14000,  // Level 17
  16500,  // Level 18
  19500,  // Level 19
  23000   // Level 20
];

// Calculate level from XP
export const calculateLevel = (xp: number): number => {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Award XP and check for new badges
export const awardXP = async (userId: string, xpAmount: number, reason: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  const oldXP = user.xp;
  const oldLevel = user.level;

  // Add XP
  user.xp += xpAmount;
  
  // Calculate new level
  const newLevel = calculateLevel(user.xp);
  user.level = newLevel;

  // Check for new badges
  const newBadges: string[] = [];
  for (const [badgeKey, criteria] of Object.entries(BADGE_CRITERIA)) {
    if (!user.badges.includes(badgeKey) && criteria.check(user)) {
      user.badges.push(badgeKey);
      newBadges.push(badgeKey);
      // Award XP for badge if applicable
      if (criteria.xp > 0) {
        user.xp += criteria.xp;
        user.level = calculateLevel(user.xp);
      }
    }
  }

  await user.save();

  console.log(`User ${user.username} awarded ${xpAmount} XP for ${reason}`);
  if (newBadges.length > 0) {
    console.log(`New badges earned: ${newBadges.join(', ')}`);
  }
  if (newLevel > oldLevel) {
    console.log(`Level up! ${oldLevel} → ${newLevel}`);
  }
};

// Update streak
export const updateStreak = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.lastStudyDate) {
    const lastDate = new Date(user.lastStudyDate);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day - increment streak
      user.streak += 1;
      await awardXP(userId, 5, 'daily streak');
    } else if (daysDiff > 1) {
      // Streak broken - reset to 1
      user.streak = 1;
    }
    // If daysDiff === 0, already studied today, don't change streak
  } else {
    // First study day
    user.streak = 1;
  }

  user.lastStudyDate = new Date();
  await user.save();
};

// Get user gamification stats
export const getUserGamificationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Auto-award any newly completed badges before computing stats
    const newlyEarned: string[] = [];
    for (const [badgeKey, criteria] of Object.entries(BADGE_CRITERIA)) {
      if (!user.badges.includes(badgeKey) && criteria.check(user)) {
        user.badges.push(badgeKey);
        newlyEarned.push(badgeKey);
        if (criteria.xp > 0) {
          user.xp += criteria.xp;
        }
      }
    }
    if (newlyEarned.length > 0) {
      user.level = calculateLevel(user.xp);
      await user.save();
    }

    // Calculate next level XP
    const currentLevelXP = XP_LEVELS[user.level - 1] || 0;
    const nextLevelXP = XP_LEVELS[user.level] || XP_LEVELS[XP_LEVELS.length - 1];
    const xpToNextLevel = nextLevelXP - user.xp;
    const levelProgress = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    // Get earned badges with details
    const earnedBadges = user.badges.map(badgeKey => ({
      key: badgeKey,
      ...BADGE_CRITERIA[badgeKey as keyof typeof BADGE_CRITERIA],
      earned: true,
      progress: 100
    }));

    // Get available badges (not yet earned)
    const availableBadges = Object.entries(BADGE_CRITERIA)
      .filter(([key]) => !user.badges.includes(key))
      .map(([key, criteria]) => ({
        key,
        ...criteria,
        earned: false,
        progress: computeBadgeProgress(user, key)
      }));

    res.status(200).json({
      success: true,
      data: {
        user: {
          username: user.username,
          department: user.department,
          year: user.year,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          totalFlashcardsCreated: user.totalFlashcardsCreated,
          totalDecksCreated: user.totalDecksCreated,
          totalQuizzesTaken: user.totalQuizzesTaken,
          totalCommentsPosted: user.totalCommentsPosted,
          perfectQuizzes: user.perfectQuizzes
        },
        levelProgress: {
          currentLevelXP,
          nextLevelXP,
          xpToNextLevel,
          progress: Math.min(100, Math.max(0, levelProgress))
        },
        badges: {
          earned: earnedBadges,
          available: availableBadges,
          total: earnedBadges.length,
          totalPossible: Object.keys(BADGE_CRITERIA).length
        }
      }
    });
  } catch (error) {
    console.error('Get gamification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get department leaderboard
export const getDepartmentLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department } = req.params;
    const { limit = 50 } = req.query;

    const filter: any = {};
    if (department && department !== 'all') {
      filter.department = department;
    }

    const leaderboard = await User.find(filter)
      .select('username department year xp level streak totalFlashcardsCreated totalDecksCreated badges')
      .sort({ xp: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        department: department || 'all',
        total: leaderboard.length
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all achievements
export const getAllAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    // If user is authenticated, include earned + progress in the response
    const userId = (req as any).user?.userId;
    let user: any = null;
    if (userId) {
      user = await User.findById(userId);
    }

    const achievements = Object.entries(BADGE_CRITERIA).map(([key, criteria]) => {
      const earned = user ? user.badges.includes(key) : false;
      const progress = user ? Math.max(0, Math.min(100, Math.round((() => {
        switch (key) {
          case 'first_flashcard': return (user.totalFlashcardsCreated / 1) * 100;
          case 'flashcard_creator_5': return (user.totalFlashcardsCreated / 5) * 100;
          case 'flashcard_creator_25': return (user.totalFlashcardsCreated / 25) * 100;
          case 'flashcard_creator_100': return (user.totalFlashcardsCreated / 100) * 100;
          case 'first_deck': return (user.totalDecksCreated / 1) * 100;
          case 'deck_creator_5': return (user.totalDecksCreated / 5) * 100;
          case 'deck_creator_20': return (user.totalDecksCreated / 20) * 100;
          case 'streak_3': return (user.streak / 3) * 100;
          case 'streak_7': return (user.streak / 7) * 100;
          case 'streak_30': return (user.streak / 30) * 100;
          case 'streak_100': return (user.streak / 100) * 100;
          case 'first_quiz': return (user.totalQuizzesTaken / 1) * 100;
          case 'quiz_taker_10': return (user.totalQuizzesTaken / 10) * 100;
          case 'quiz_taker_50': return (user.totalQuizzesTaken / 50) * 100;
          case 'perfect_score': return (user.perfectQuizzes / 1) * 100;
          case 'perfect_score_10': return (user.perfectQuizzes / 10) * 100;
          case 'social_butterfly': return (user.totalCommentsPosted / 5) * 100;
          case 'community_helper': return (user.totalCommentsPosted / 25) * 100;
          case 'discussion_leader': return (user.totalCommentsPosted / 100) * 100;
          case 'level_5': return (user.level / 5) * 100;
          case 'level_10': return (user.level / 10) * 100;
          case 'level_20': return (user.level / 20) * 100;
          default: return 0;
        }
      })()))) : 0;
      return {
        key,
        name: criteria.name,
        description: criteria.description,
        xp: criteria.xp,
        earned,
        progress
      };
    });

    res.status(200).json({
      success: true,
      data: { achievements }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Manually trigger badge check (for testing or recalculation)
export const checkAndAwardBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const newBadges: string[] = [];
    let totalXPAwarded = 0;

    for (const [badgeKey, criteria] of Object.entries(BADGE_CRITERIA)) {
      if (!user.badges.includes(badgeKey) && criteria.check(user)) {
        user.badges.push(badgeKey);
        newBadges.push(badgeKey);
        if (criteria.xp > 0) {
          user.xp += criteria.xp;
          totalXPAwarded += criteria.xp;
        }
      }
    }

    user.level = calculateLevel(user.xp);
    await user.save();

    res.status(200).json({
      success: true,
      message: newBadges.length > 0 ? `Awarded ${newBadges.length} new badges!` : 'No new badges to award',
      data: {
        newBadges,
        totalXPAwarded,
        currentXP: user.xp,
        currentLevel: user.level
      }
    });
  } catch (error) {
    console.error('Check badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

