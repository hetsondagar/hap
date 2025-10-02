import React, { useState } from "react";

const dummyData = {
  global: [
    { name: "Alice", xp: 1200 },
    { name: "Bob", xp: 1100 },
    { name: "Charlie", xp: 1000 },
  ],
  department: [
    { name: "Dept Leader 1", xp: 500 },
    { name: "Dept Leader 2", xp: 400 },
  ],
  friends: [
    { name: "Your Friend 1", xp: 300 },
    { name: "Your Friend 2", xp: 250 },
  ],
};

const Leaderboard = () => {
  const [tab, setTab] = useState<"global" | "department" | "friends">("global");

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
      <div className="flex space-x-2 mb-3">
        {["global", "department", "friends"].map(t => (
          <button
            key={t}
            className={`px-3 py-1 rounded-lg ${tab === t ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setTab(t as any)}
          >
            {t}
          </button>
        ))}
      </div>
      <ul>
        {dummyData[tab].map((user, i) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>{user.name}</span>
            <span>{user.xp} XP</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
