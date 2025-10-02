import React, { createContext, useContext, useState, useEffect } from "react";

type Badge = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
};

type UserStats = {
  xp: number;
  level: number;
  flashcardsReviewed: number;
  quizzesCompleted: number;
  quizStreak: number;
  communityAnswers: number;
  dailyStreak: number;
  lastLogin: string;
  badges: Badge[];
};

type GamificationContextType = {
  stats: UserStats;
  addXP: (amount: number) => void;
  incrementFlashcards: () => void;
  incrementQuiz: (score: number) => void;
  incrementCommunityAnswers: () => void;
  checkDailyStreak: () => void;
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<UserStats>(() => ({
    xp: 0,
    level: 1,
    flashcardsReviewed: 0,
    quizzesCompleted: 0,
    quizStreak: 0,
    communityAnswers: 0,
    dailyStreak: 0,
    lastLogin: "",
    badges: [
      { id: "flashcard-master", name: "Flashcard Master", description: "Reviewed 100 flashcards", earned: false },
      { id: "quiz-streak", name: "Quiz Streak", description: "Scored 5 quizzes in a row above 80%", earned: false },
      { id: "community-hero", name: "Community Hero", description: "Answered 10 community questions", earned: false },
    ],
  }));

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const incrementFlashcards = () => {
    setStats(prev => {
      const updated = { ...prev, flashcardsReviewed: prev.flashcardsReviewed + 1 };
      if (updated.flashcardsReviewed >= 100) {
        updated.badges = updated.badges.map(b =>
          b.id === "flashcard-master" ? { ...b, earned: true } : b
        );
      }
      return updated;
    });
    addXP(2);
  };

  const incrementQuiz = (score: number) => {
    setStats(prev => {
      let newStreak = prev.quizStreak;
      if (score >= 80) {
        newStreak += 1;
      } else {
        newStreak = 0;
      }
      const updated = {
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        quizStreak: newStreak,
      };
      if (newStreak >= 5) {
        updated.badges = updated.badges.map(b =>
          b.id === "quiz-streak" ? { ...b, earned: true } : b
        );
      }
      return updated;
    });
    addXP(10);
  };

  const incrementCommunityAnswers = () => {
    setStats(prev => {
      const updated = { ...prev, communityAnswers: prev.communityAnswers + 1 };
      if (updated.communityAnswers >= 10) {
        updated.badges = updated.badges.map(b =>
          b.id === "community-hero" ? { ...b, earned: true } : b
        );
      }
      return updated;
    });
    addXP(5);
  };

  const checkDailyStreak = () => {
    const today = new Date().toDateString();
    setStats(prev => {
      if (prev.lastLogin === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = prev.lastLogin === yesterday.toDateString();
      return {
        ...prev,
        dailyStreak: isConsecutive ? prev.dailyStreak + 1 : 1,
        lastLogin: today,
      };
    });
  };

  useEffect(() => {
    checkDailyStreak();
  }, []);

  return (
    <GamificationContext.Provider
      value={{ stats, addXP, incrementFlashcards, incrementQuiz, incrementCommunityAnswers, checkDailyStreak }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) throw new Error("useGamification must be used within GamificationProvider");
  return context;
};
