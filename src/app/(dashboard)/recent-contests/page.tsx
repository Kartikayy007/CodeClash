"use client";

import { useEffect, useState } from "react";
import ContestFilters from "@/components/RecentContests/ContestFilters";
import ContestTable from "@/components/RecentContests/ContestTable";
import { fetchMatches } from "@/features/home/matches/thunks/matchesThunks";
import { RootState } from "@/store/store";
import { AppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { MatchStatus } from "@/features/home/matches/types/matches.types";
import { Search, Plus } from "lucide-react";
import LabelButton from "@/components/ui/LabelButton";

export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);
  const PAGE_SIZE = 12;

  const dispatch = useDispatch<AppDispatch>();
  const { matches, loading, error } = useSelector(
    (state: RootState) => state.matches,
  );

  useEffect(() => {
    dispatch(
      fetchMatches({
        page: currentPage,
        limit: PAGE_SIZE,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        searchQuery: searchQuery || undefined,
      }),
    );
  }, [dispatch, selectedStatus, currentPage, searchQuery]);

  const formatMatches = matches.map((match) => ({
    name: `Match #${match.players.map((p) => p.username).join(" vs ")}`,
    startDate: new Date(match.createdAt).toLocaleDateString(),
    duration: match.duration,
    participants: match.players.length,
    status: match.status,
    mode: match.mode,
  }));

  if (loading) {
    return (
      <div className="min-h-screen py-2 md:p-2 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-cyan-400 text-xl font-semibold">Loading contests data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  py-2 md:p-2 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-red-500/20 shadow-lg shadow-red-500/10">
              <div className="text-red-400 text-center">
                <p className="text-lg font-semibold mb-2">Error Loading Contests</p>
                <p className="text-sm text-red-300">Failed to load contests. Please try again.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-2 md:p-2 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <div className="w-full md:w-1/4 flex-shrink-0 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <ContestFilters
                selectedStatus={
                  selectedStatus as "All" | "Scheduled" | "Ongoing" | "Completed"
                }
                setSelectedStatus={
                  setSelectedStatus as (
                    status: "All" | "Scheduled" | "Ongoing" | "Completed",
                  ) => void
                }
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
                  <input
                    type="text"
                    placeholder="Search contests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-2 bg-gradient-to-r from-[#1a1d26] to-[#1e222c] border border-cyan-500/30 rounded-lg text-white placeholder-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105">
                  <Plus className="w-4 h-4" />
                  <span>Create Contest</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <ContestTable
                contests={formatMatches}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
