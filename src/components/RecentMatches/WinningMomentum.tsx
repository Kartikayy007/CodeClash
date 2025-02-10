// components/ui/WinningMomentum.tsx
import React from 'react';
import { Zap } from 'lucide-react';

interface WinningMomentumProps {
  currentStreak: number;
  longestStreak: number;
}

const WinningMomentum: React.FC<WinningMomentumProps> = ({ currentStreak, longestStreak }) => {
  return (
    <div className="bg-[#1E2127] rounded-lg p-6">
      <h3 className="text-white mb-4">Winning Momentum</h3>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 mb-1">Current Streak</p>
          <div className="flex items-center gap-2">
            <Zap className="text-purple-500" />
            <span className="text-2xl text-white">{currentStreak}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-400 mb-1">Longest Streak</p>
          <p className="text-white text-2xl">{longestStreak}</p>
        </div>
      </div>
    </div>
  );
};

export default WinningMomentum;
