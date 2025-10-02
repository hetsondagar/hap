import React from "react";
import { useGamification } from "../context/GamificationContext";

const XPProgress = () => {
  const { stats } = useGamification();
  const progress = (stats.xp % 100);

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-lg font-bold">Level {stats.level}</h2>
      <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
        <div
          className="bg-blue-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm mt-1">{progress}/100 XP to next level</p>
    </div>
  );
};

export default XPProgress;
