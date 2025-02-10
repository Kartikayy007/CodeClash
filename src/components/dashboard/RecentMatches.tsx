import React from 'react'
import Link from 'next/link'

export default function RecentMatches() {
  const matchTypes = ["All", "Standard", "Accuracy", "Speed"];
  const matches = [
    {
      mode: "",
      players: ["Player1", "You"],
      result: "win",
      duration: "15min",
      date: "2 hours ago"
    },
    {
      mode: "",
      players: ["Player1", "You"],
      result: "loss",
      duration: "10min",
      date: "12 Jan 2024"
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Matches</h2>
        <Link 
          href="/recent-matches" 
          className="text-base hover:text-white/80 cursor-pointer"
          prefetch={true}
        >
          View All
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        {matchTypes.map((type, index) => (
          <button
            key={type}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
              index === 0
                ? "bg-[#3d3d3d] text-white"
                : "border border-[#888888] text-[#e7e7e7] hover:bg-white/5"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 bg-white/10 rounded-lg px-4 py-2 mb-4 text-sm font-medium">
        <span>Mode</span>
        <span>Players</span>
        <span>Result</span>
        <span>Duration</span>
        <span>Date</span>
      </div>

      <div className="space-y-2">
        {matches.map((match, index) => (
          <div key={index} className="grid grid-cols-5 bg-white/5 rounded-lg px-4 py-2">
            <div className="w-4 h-4" />
            <div className="flex flex-col">
              {match.players.map((player, i) => (
                <span key={i} className="text-base font-medium">{player}</span>
              ))}
            </div>
            <div className="w-5 h-5" />
            <span className="text-sm">{match.duration}</span>
            <span className="text-sm">{match.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
