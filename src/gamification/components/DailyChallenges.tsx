import React, { useState } from "react";
import { getDailyChallenges, getWeeklyChallenges } from "../utils/gamificationUtils";
import { useGamification } from "../context/GamificationContext";

const DailyChallenges = () => {
  const { stats } = useGamification();
  const [tab, setTab] = useState<"daily" | "weekly">("daily");

  const challenges = tab === "daily" ? getDailyChallenges() : getWeeklyChallenges();

  // progress simulation (replace with actual progress logic from stats)
  const getProgress = (challenge: any) => {
    if (challenge.type === "flashcards") return stats.flashcardsReviewed;
    if (challenge.type === "quiz") return stats.quizzesCompleted;
    if (challenge.type === "community") return stats.communityAnswers;
    return 0;
  };

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-lg font-bold mb-2">🔥 {tab === "daily" ? "Daily" : "Weekly"} Challenges</h2>
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setTab("daily")}
          className={`px-3 py-1 rounded-lg ${tab === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Daily
        </button>
        <button
          onClick={() => setTab("weekly")}
          className={`px-3 py-1 rounded-lg ${tab === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Weekly
        </button>
      </div>

      <ul className="space-y-2">
        {challenges.map((c) => {
          const progress = getProgress(c);
          const completed = progress >= c.target;
          const percent = Math.min((progress / c.target) * 100, 100);

          return (
            <li key={c.id} className="border rounded-xl p-2">
              <p className="font-semibold">{c.description}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percent}%` }} />
              </div>
              <p className="text-sm">
                {Math.min(progress, c.target)}/{c.target} {completed ? "✅ Completed" : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DailyChallenges;
