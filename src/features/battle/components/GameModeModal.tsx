import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useBattleWebSocket } from '../hooks/useBattleWebSocket';
import LabelButton from '@/components/ui/LabelButton';
import { toast } from '@/providers/toast-config';

interface GameModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameMode = 'STANDARD' | 'SPEED' | 'ACCURACY';

export const GameModeModal: React.FC<GameModeModalProps> = ({ isOpen, onClose }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('STANDARD');
  const { isSearching, error, findMatch } = useBattleWebSocket();

  if (error) {
    toast.error('Failed to find match', error);
  }

  if (!isOpen) return null;

  const modes: { id: GameMode; label: string; icon: string }[] = [
    { id: 'STANDARD', label: 'Standard', icon: '🎮' },
    { id: 'SPEED', label: 'Speed', icon: '⚡' },
    { id: 'ACCURACY', label: 'Accuracy', icon: '🎯' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1D24] rounded-lg p-6 w-[400px] space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Select Your Mode</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                selectedMode === mode.id
                  ? 'bg-[#292C33] text-white'
                  : 'text-gray-400 hover:bg-[#292C33]/50'
              }`}
            >
              <span className="text-xl">{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <LabelButton
            onClick={findMatch}
            disabled={isSearching}
            className="w-full"
          >
            {isSearching ? 'Searching...' : 'Play Game'}
          </LabelButton>
          <button
            onClick={onClose}
            className="w-full py-2 text-[#B4A5FF] hover:text-white transition-colors"
          >
            Invite Friend
          </button>
        </div>
      </div>
    </div>
  );
}; 