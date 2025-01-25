import React from 'react'

interface RecentContestsProps {
  className?: string;
}

export default function RecentContests({ className = '' }: RecentContestsProps) {
  const contests = [
    {
      name: "Contest Name",
      score: "12.2",
      rank: "5/50",
      duration: "1 hr",
      hasReview: true
    },
    {
      name: "Contest Name",
      score: "12.2",
      rank: "5/50",
      duration: "1 hr",
      hasReview: true
    }
  ];

  return (
    <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Contests</h2>
        <button className="text-base hover:text-white/80">View All</button>
      </div>

      <div className="flex gap-3 mb-6">
        <button className="px-2 py-1 bg-[#3d3d3d] rounded text-sm font-medium">
          Participated
        </button>
        <button className="px-2 py-1 rounded border border-[#888888] text-[#e7e7e7] text-sm font-medium hover:bg-white/5">
          Created
        </button>
      </div>

      <div className="grid grid-cols-4 bg-white/10 rounded-lg px-8 py-2 mb-4 text-sm font-medium">
        <span>Contest Name</span>
        <span>Score</span>
        <span>Rank</span>
        <span>Duration</span>
      </div>

      <div className="space-y-2">
        {contests.map((contest, index) => (
          <div key={index} className="grid grid-cols-5 bg-white/5 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 col-span-2">
              <div className="w-4 h-4" />
              <span className="text-base font-medium">{contest.name}</span>
            </div>
            <span className="text-sm">{contest.score}</span>
            <span className="text-sm">{contest.rank}</span>
            <div className="flex justify-between items-center">
              <span className="text-sm">{contest.duration}</span>
              {contest.hasReview && (
                <button className="text-[#b0b0b0] text-sm font-medium hover:text-white">
                  Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
