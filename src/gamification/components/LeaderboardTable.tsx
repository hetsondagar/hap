import React from "react";

type User = {
  name: string;
  xp: number;
};

const LeaderboardTable = ({ users }: { users: User[] }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Rank</th>
          <th className="p-2">Name</th>
          <th className="p-2 text-right">XP</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index} className="border-b">
            <td className="p-2">{index + 1}</td>
            <td className="p-2">{user.name}</td>
            <td className="p-2 text-right">{user.xp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
