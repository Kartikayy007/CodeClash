// components/ui/ModeSelector.tsx
import React from 'react';
import { Award, Clock, Zap } from 'lucide-react';
import { MatchMode } from '@/features/home/matches/types/matches.types';

interface ModeSelectorProps {
  selectedMode: MatchMode | 'All';
  setSelectedMode: (mode: MatchMode | 'All') => void;
}

export default function ModeSelector({ selectedMode, setSelectedMode }: ModeSelectorProps) {
  const modes: (MatchMode | 'All')[] = ['All', 'STANDARD', 'ACCURACY', 'SPEED'];

  return (
    <div className="flex gap-4 mb-8">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => setSelectedMode(mode)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedMode === mode
              ? 'bg-[#C879EB] text-black'
              : 'bg-[#1A1D24] text-white hover:bg-[#292C33]'
          }`}
        >
          {mode === 'All' ? mode : mode.charAt(0) + mode.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
}
