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
  <div className="grid grid-cols-2 md:grid-cols-5 p-4 items-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse rounded-lg border border-cyan-500/10">
    <div className="flex items-center gap-2 mb-2 md:mb-0">
      <div className="h-5 w-5 bg-cyan-500/20 rounded-full"></div>
      <div className="h-5 w-8 bg-cyan-500/10 rounded"></div>
    </div>
    <div className="h-5 w-24 bg-cyan-500/10 rounded mb-2 md:mb-0"></div>
    <div className="h-5 w-20 bg-cyan-500/10 rounded mb-2 md:mb-0"></div>
    <div className="h-5 w-16 bg-cyan-500/10 rounded mb-2 md:mb-0"></div>
    <div className="h-5 w-10 bg-cyan-500/10 rounded"></div>
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
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 md:p-8 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 mb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-white">Leaderboard</h2>
          <p className="text-sm text-cyan-400/80">
            Next update in {formatUpdateTime(nextUpdate)}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 text-sm font-semibold text-cyan-400 uppercase tracking-wider">
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
            <div className="grid grid-cols-2 md:grid-cols-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 text-sm font-semibold text-cyan-400 uppercase tracking-wider">
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
                  className="grid grid-cols-2 md:grid-cols-5 p-4 items-center bg-gradient-to-r from-white/5 to-white/10 hover:from-cyan-500/10 hover:to-blue-500/10 border border-cyan-500/10 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    {index < 3 && (
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-300 to-gray-500"
                          : "bg-gradient-to-r from-orange-400 to-orange-600"
                      }`}>
                        <Image
                          src={
                            index === 0
                              ? "/gold.svg"
                              : index === 1
                              ? "/silver.svg"
                              : "/bronze.svg"
                          }
                          alt="medal"
                          className="w-4 h-4"
                          width={16}
                          height={16}
                        />
                      </span>
                    )}
                    <span className="font-bold text-white">{entry.rank}</span>
                  </div>
                  <div className="truncate text-cyan-400 font-medium">{entry.username}</div>
                  <div className="hidden md:block text-gray-300">{entry.timeTaken}</div>
                  <div className="hidden md:block text-emerald-400 font-semibold">
                    {entry.score.toFixed(2)}
                  </div>
                  <div className="hidden md:block text-blue-400 font-semibold">{entry.questionsSolved}</div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-cyan-500/20 text-cyan-400/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 shadow-lg shadow-cyan-500/25"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center px-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                <span className="text-cyan-400 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-cyan-500/20 text-cyan-400/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 shadow-lg shadow-cyan-500/25"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-cyan-400/60 text-center py-8">
          No participants yet
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
