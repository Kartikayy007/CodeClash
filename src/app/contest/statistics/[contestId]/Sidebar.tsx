import React from 'react';

interface SidebarProps {
  onLeaderboardClick: () => void;
  onOverviewClick: () => void;
  active: 'overview' | 'leaderboard';
}

const Sidebar = ({ onLeaderboardClick, onOverviewClick, active }: SidebarProps) => {
  return (
    <div className="w-64 bg-[#10141D] text-white">
      <div className="p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <button 
                className={`w-full text-left py-2 px-4 rounded ${active === 'overview' ? 'bg-[#ffffff11]' : 'text-gray-400 hover:bg-[#ffffff11] hover:text-white'} `}
                onClick={onOverviewClick}
              >
                Overview
              </button>
            </li>
            <li>
              <button 
                className={`w-full text-left py-2 px-4 rounded ${active === 'leaderboard' ? 'bg-[#ffffff11]' : 'text-gray-400 hover:bg-[#ffffff11] hover:text-white'}`}
                onClick={onLeaderboardClick}
              >
                Leaderboard
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 