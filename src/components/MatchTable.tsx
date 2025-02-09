// components/ui/MatchTable.tsx
import React from 'react';

interface Match {
  mode: string;
  player: string;
  opponent: string;
  result: string;
  duration: string;
  date: string;
}

interface MatchTableProps {
  matches: Match[];
}

const MatchTable: React.FC<MatchTableProps> = ({ matches }) => {
  return (
    <div className="bg-[#1E2127] rounded-lg overflow-hidden">
      <div className="grid grid-cols-5 p-4 text-gray-400 border-b border-gray-700">
        <div>Mode</div>
        <div>Players</div>
        <div>Result</div>
        <div>Duration</div>
        <div>Date</div>
      </div>
      {matches.map((match, index) => (
        <div
          key={index}
          className="grid grid-cols-5 p-4 border-b border-gray-700 text-white hover:bg-[#282C34]"
        >
          <div className="flex items-center gap-2">
            {match.mode === 'Standard' }
            {match.mode === 'Accuracy'}
            {match.mode === 'Speed' }
            {match.mode}
          </div>
          <div>{match.player} vs {match.opponent}</div>
          <div>
            <span className={match.result === 'win' ? 'text-green-500' : 'text-red-500'}>
              {match.result === 'win' ? '✓' : '✗'}
            </span>
          </div>
          <div>{match.duration}</div>
          <div>{match.date}</div>
        </div>
      ))}
    </div>
  );
};

export default MatchTable;
