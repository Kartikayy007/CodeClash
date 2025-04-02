// components/ui/WinsOverview.tsx
import React from "react";

interface WinsOverviewProps {
  winRate: number;
}

const WinsOverview: React.FC<WinsOverviewProps> = ({ winRate }) => {
  return (
    <div className="bg-[#1E2127] rounded-lg p-6">
      <h3 className="text-white mb-4">Wins Overview</h3>
      <div className="relative w-32 h-32 mx-auto">
        <div className="w-full h-full rounded-full bg-[#282C34] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{winRate}/10</div>
            <div className="text-sm text-gray-400">wins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinsOverview;
