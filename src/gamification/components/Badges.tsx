import React from "react";
import { useGamification } from "../context/GamificationContext";

const Badges = () => {
  const { stats } = useGamification();

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-lg font-bold mb-2">Achievements</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.badges.map(badge => (
          <div
            key={badge.id}
            className={`p-2 border rounded-xl ${badge.earned ? "bg-green-100" : "bg-gray-100"}`}
          >
            <h3 className="font-semibold">{badge.name}</h3>
            <p className="text-sm">{badge.description}</p>
            {badge.earned ? "🏅 Earned" : "🔒 Locked"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
