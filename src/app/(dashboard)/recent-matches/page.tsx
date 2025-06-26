"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import MatchTable from "@/components/RecentMatches/MatchTable";
// import WinsOverview from "@/components/RecentMatches/WinsOverview";
// import WinningMomentum from "@/components/RecentMatches/WinningMomentum";
// import WinTrend from "@/components/RecentMatches/WinTrend";
import { fetchMatches } from "@/features/home/matches/thunks/matchesThunks";
import { MatchMode } from "@/features/home/matches/types/matches.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

// const winTrendData = [
//   Array(8).fill("inactive"),
//   [
//     "inactive",
//     "inactive",
//     "inactive",
//     "inactive",
//     "loss",
//     "inactive",
//     "inactive",
//     "inactive",
//   ],
//   [
//     "inactive",
//     "inactive",
//     "inactive",
//     "inactive",
//     "inactive",
//     "win",
//     "win",
//     "inactive",
//   ],
//   Array(8).fill("inactive"),
// ];

export default function MatchesPage() {
  const [selectedMode] = useState<MatchMode | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const dispatch = useDispatch<AppDispatch>();
  const { matches, loading, error,  pagination } =
    useSelector((state: RootState) => state.matches);

  useEffect(() => {
    dispatch(
      fetchMatches({
        page: currentPage,
        limit: PAGE_SIZE,
        mode: selectedMode === "All" ? undefined : selectedMode,
      }),
    );
  }, [dispatch, selectedMode, currentPage]);

  const formatMatches = matches.map((match) => ({
    mode: match.mode,
    player: match.players[0].username,
    opponent: match.players[1].username,
    result:
      match.winnerId === match.players[0].id
        ? ("win" as const)
        : ("loss" as const),
    duration: match.duration,
    date: new Date(match.createdAt).toLocaleDateString(),
  }));

  // const winRate =
  //   totalMatches > 0 ? Math.round((winsCount / totalMatches) * 10) : 0;
  // const currentStreak = 0; // This should come from API
  // const longestStreak = 0; // This should come from API

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  py-2 md:p-2 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
        </div>

        <div className="container mx-auto p-6 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-cyan-400 text-xl font-semibold">Loading performance data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-2 md:p-2 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
        </div>

        <div className="container mx-auto p-6 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-red-500/20 shadow-lg shadow-red-500/10">
              <div className="text-red-400 text-center">
                <p className="text-lg font-semibold mb-2">Error Loading Matches</p>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen   py-2 md:p-2 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
      </div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recent Matches</h1>
          <p className="text-cyan-400/80">Track your competitive coding performance</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-8 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Match History</h2>
              <p className="text-gray-400 text-sm">Your recent competitive matches and results</p>
            </div>
            <MatchTable matches={formatMatches} />
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-cyan-400/80 text-sm mb-4 md:mb-0">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                  {Math.min(currentPage * PAGE_SIZE, pagination.totalCount)} of{" "}
                  {pagination.totalCount} matches
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousPage}
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
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === pagination.totalPages
                        ? "bg-cyan-500/20 text-cyan-400/40 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 shadow-lg shadow-cyan-500/25"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
