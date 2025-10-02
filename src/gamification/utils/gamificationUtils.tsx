// src/gamification/utils/gamificationUtils.ts

// 🎯 XP + Level calculation
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1; // every 100 XP = level up
};

export const progressToNextLevel = (xp: number): number => {
  return xp % 100; // remaining XP before next level
};

// 🏅 Badge checkers
export const checkFlashcardMaster = (flashcardsReviewed: number): boolean => {
  return flashcardsReviewed >= 100;
};

export const checkQuizStreak = (quizStreak: number): boolean => {
  return quizStreak >= 5;
};

export const checkCommunityHero = (communityAnswers: number): boolean => {
  return communityAnswers >= 10;
};

// 🔥 Streak handling
export const updateDailyStreak = (lastLogin: string, prevStreak: number): number => {
  const today = new Date().toDateString();
  if (lastLogin === today) return prevStreak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastLogin === yesterday.toDateString()) {
    return prevStreak + 1;
  }
  return 1; // reset streak
};

// 📆 Daily/Weekly Challenge Generator
export const getDailyChallenges = () => {
  return [
    { id: "daily-1", description: "Review 20 flashcards today", target: 20, type: "flashcards" },
    { id: "daily-2", description: "Score 80%+ in 1 quiz", target: 1, type: "quiz" },
  ];
};

export const getWeeklyChallenges = () => {
  return [
    { id: "weekly-1", description: "Complete 5 quizzes this week", target: 5, type: "quiz" },
    { id: "weekly-2", description: "Answer 3 community questions", target: 3, type: "community" },
  ];
};
