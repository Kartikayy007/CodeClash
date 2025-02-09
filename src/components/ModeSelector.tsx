// components/ui/ModeSelector.tsx
import React from 'react';
import { Award, Clock, Zap } from 'lucide-react';

type MatchMode = 'All' | 'Standard' | 'Accuracy' | 'Speed';

interface ModeSelectorProps {
  selectedMode: MatchMode;
  setSelectedMode: (mode: MatchMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, setSelectedMode }) => {
  return (
    <div className="flex gap-3 mb-8">
      {['All', 'Standard', 'Accuracy', 'Speed'].map((mode) => (
        <button
          key={mode}
          onClick={() => setSelectedMode(mode as MatchMode)}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            selectedMode === mode ? 'bg-[#282C34]' : 'text-gray-400'
          }`}
        >
          {mode === 'Standard' && <Award size={16} />}
          {mode === 'Accuracy' && <Clock size={16} />}
          {mode === 'Speed' && <Zap size={16} />}
          {mode}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
