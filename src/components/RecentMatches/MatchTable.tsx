// components/ui/MatchTable.tsx
import React from 'react';
import { MatchMode } from '@/features/home/matches/types/matches.types';

interface Match {
  mode: MatchMode;
  player: string;
  opponent: string;
  result: 'win' | 'loss';
  duration: string;
  date: string;
}

interface MatchTableProps {
  matches: Match[];
}

export default function MatchTable({ matches }: MatchTableProps) {
  if (!matches.length) {
    return (
      <div className="bg-[#1A1D24] rounded-lg p-6">
        <div className="text-gray-400 text-center">No matches found</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1D24] rounded-lg p-6">
      <div className="grid grid-cols-5 gap-4 mb-4 text-gray-400 font-medium">
        <div>Mode</div>
        <div>Players</div>
        <div>Result</div>
        <div>Duration</div>
        <div>Date</div>
      </div>
      <div className="space-y-4">
        {matches.map((match, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 p-4 bg-[#292C33] rounded-lg hover:bg-[#31343C] transition-colors"
          >
            <div className="text-white">
              {match.mode.charAt(0) + match.mode.slice(1).toLowerCase()}
            </div>
            <div className="text-gray-400">
              {match.player} vs {match.opponent}
            </div>
            <div>
              <span className={`px-2 py-1 rounded text-sm ${
                match.result === 'win' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {match.result.toUpperCase()}
              </span>
            </div>
            <div className="text-gray-400">{match.duration}</div>
            <div className="text-gray-400">{match.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
