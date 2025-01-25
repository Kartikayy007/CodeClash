import React from 'react'

interface LeaderboardProps {
  className?: string;
}

export default function Leaderboard({ className = '' }: LeaderboardProps) {
  const leaderboardData = [
    { rank: 1, name: "Abcdefg", victories: 134 },
    { rank: 2, name: "Abcdefg", victories: 134 },
    { rank: 2, name: "Abcdefg", victories: 134 },
    { rank: 2, name: "Abcdefg", victories: 134 },
    { rank: 2, name: "Abcdefg", victories: 134 },
    { rank: 16, name: "UserName(You)", victories: 134 },
  ];

  return (
    <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <button className="text-base hover:text-white/80">View All</button>
      </div>

      <div className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-1.5 mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Rank</span>
          <span className="text-sm font-medium">Player</span>
        </div>
        <span className="text-sm font-medium">Victories</span>
      </div>

      <div className="space-y-2">
        {leaderboardData.map((entry, index) => (
          <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
            <div className="flex items-center gap-4">
              <span className="text-base font-semibold">{entry.rank}.</span>
              <span className="text-base font-medium">{entry.name}</span>
            </div>
            <span className="text-base font-medium">{entry.victories}</span>
          </div>
        ))}
      </div>
    </div>
  );
}