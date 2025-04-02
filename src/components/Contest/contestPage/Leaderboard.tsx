import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LeaderboardEntry {
  rank: string;
  username: string;
  timeTaken: string;
  score: number;
  questionsSolved: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

// Shimmer loading for leaderboard entries
const LeaderboardSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-5 p-4 items-center bg-[#1E2127] animate-pulse">
    <div className="flex items-center gap-2 mb-2 md:mb-0">
      <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
      <div className="h-5 w-8 bg-gray-700 rounded"></div>
    </div>
    <div className="h-5 w-24 bg-gray-700 rounded mb-2 md:mb-0"></div>
    <div className="h-5 w-20 bg-gray-700 rounded mb-2 md:mb-0"></div>
    <div className="h-5 w-16 bg-gray-700 rounded mb-2 md:mb-0"></div>
    <div className="h-5 w-10 bg-gray-700 rounded"></div>
  </div>
);

const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const [nextUpdate, setNextUpdate] = useState(900);

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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#1A1D24] rounded-lg p-4 md:p-6 mb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-white">Leaderboard</h2>
          <p className="text-sm text-gray-400">
            Next update in {formatUpdateTime(nextUpdate)}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-5 bg-[#282C33] p-4 text-sm font-medium">
            <div>Rank</div>
            <div>Username</div>
            <div className="hidden md:block">Time Taken</div>
            <div className="hidden md:block">Score</div>
            <div className="hidden md:block">Questions Solved</div>
          </div>

          <div className="space-y-2 mt-2">
            <LeaderboardSkeleton />
            <LeaderboardSkeleton />
            <LeaderboardSkeleton />
            <LeaderboardSkeleton />
            <LeaderboardSkeleton />
          </div>
        </div>
      ) : leaderboard.length > 0 ? (
        <>
          <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-5 bg-[#282C33] p-4 text-sm font-medium">
              <div>Rank</div>
              <div>Username</div>
              <div className="hidden md:block">Time Taken</div>
              <div className="hidden md:block">Score</div>
              <div className="hidden md:block">Questions Solved</div>
            </div>

            <div className="space-y-2 mt-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={`${entry.username}-${index}`}
                  className="grid grid-cols-2 md:grid-cols-5 p-4 items-center bg-[#1E2127] hover:bg-[#282C33] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {index < 3 && (
                      <Image
                        src={
                          index === 0
                            ? "/gold.svg"
                            : index === 1
                              ? "/silver.svg"
                              : "/bronze.svg"
                        }
                        alt="medal"
                        className="w-5 h-5"
                        width={20}
                        height={20}
                      />
                    )}
                    {entry.rank}
                  </div>
                  <div className="truncate">{entry.username}</div>
                  <div className="hidden md:block">{entry.timeTaken}</div>
                  <div className="hidden md:block">
                    {entry.score.toFixed(2)}
                  </div>
                  <div className="hidden md:block">{entry.questionsSolved}</div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 text-gray-400">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${currentPage === totalPages ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
              >
                <ChevronRight size={16} />
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
