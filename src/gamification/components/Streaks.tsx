import React from "react";
import { useGamification } from "../context/GamificationContext";

const Streaks = () => {
  const { stats } = useGamification();

  return (
    <div className="p-4 bg-white shadow rounded-2xl text-center">
      <h2 className="text-lg font-bold mb-2">🔥 Daily Streak</h2>
      <p className="text-2xl font-bold">{stats.dailyStreak} days</p>
      {stats.dailyStreak >= 7 && <p className="text-green-600">Weekly streak bonus unlocked 🎉</p>}
    </div>
  );
};

export default Streaks;
