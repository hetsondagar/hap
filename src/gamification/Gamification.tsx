import React, { useState } from "react";
import XPProgress from "./components/XPProgress";
import Badges from "./components/Badges";
import Leaderboard from "./components/Leaderboard";
import DailyChallenges from "./components/DailyChallenges";
import Streaks from "./components/Streaks";

const Gamification = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleToggleLeaderboard = () => {
    console.log("Button clicked! Toggling Leaderboard...");
    setShowLeaderboard((prev) => !prev);
  };

  return (
    <div className="grid gap-6 p-6">
      {/* XP & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <XPProgress />
        <Badges />
      </div>

      {/* Streaks & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Streaks />
        <DailyChallenges />
      </div>

      {/* Leaderboard Button */}
      <div className="text-center">
        <button
          onClick={handleToggleLeaderboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          {showLeaderboard ? "Hide Leaderboard" : "View Leaderboard"}
        </button>
      </div>

      {/* Conditionally render Leaderboard */}
      {showLeaderboard && (
        <div className="mt-6 border p-4 rounded-xl bg-white shadow">
          <Leaderboard />
        </div>
      )}
    </div>
  );
};

export default Gamification;
