import React from 'react';

interface MatchmakingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatchmakingPopup: React.FC<MatchmakingPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1D24] rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center gap-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <h2 className="text-xl font-semibold text-white">Finding a Match</h2>
          <p className="text-gray-400 text-center">
            Searching for an opponent... This may take a few moments.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Cancel Matchmaking
          </button>
        </div>
      </div>
    </div>
  );
}; 