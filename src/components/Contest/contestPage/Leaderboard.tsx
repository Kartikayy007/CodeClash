import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: string;
  username: string;
  timeTaken: string;
  score: number;
  questionsSolved: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  leaderboard, 
  searchQuery, 
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [nextUpdate, setNextUpdate] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setNextUpdate((prev) => {
        if (prev <= 1) {
          // Reset timer to 15 minutes
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUpdateTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#1A1D24] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          <p className="text-sm text-gray-400">
            Next update in {formatUpdateTime(nextUpdate)}
          </p>
        </div>
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Enter UserName"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#282C33] text-white px-4 py-2 rounded-lg focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#71717A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 17.5L13.875 13.875" stroke="#71717A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {leaderboard.length > 0 ? (
        <>
          <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 bg-[#282C33] p-4 text-sm font-medium">
              <div>Rank</div>
              <div>Username</div>
              <div>Time Taken</div>
              <div>Score</div>
              <div>Question Solved</div>
            </div>
            
            <div className="space-y-2 mt-2">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.rank}
                  className="grid grid-cols-5 p-4 items-center bg-[#1E2127] hover:bg-[#282C33] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {index < 3 && (
                      <img 
                        src={index === 0 ? "/gold.svg" : index === 1 ? "/silver.svg" : "/bronze.svg"} 
                        alt="medal" 
                        className="w-5 h-5"
                      />
                    )}
                    {entry.rank}
                  </div>
                  <div>{entry.username}</div>
                  <div>{entry.timeTaken}</div>
                  <div>{entry.score.toFixed(2)}</div>
                  <div>{entry.questionsSolved.toString().padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          </div>
          
          {totalPages > 0 && (
            <div className="flex justify-center gap-2 mt-4 text-gray-400">
              <button 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:text-white disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={pageNum === currentPage ? 'text-purple-500' : 'hover:text-white'}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="hover:text-white disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-center py-8">
          No participants yet
        </div>
      )}
    </div>
  );
};

export default Leaderboard;