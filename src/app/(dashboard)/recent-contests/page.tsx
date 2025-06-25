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
import { Search, Plus } from "lucide-react";import LabelButton from "@/components/ui/LabelButton";

export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);
  // const [filtersOpen, setFiltersOpen] = useState(false);
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

  // Mobile status selection handler
  // const handleStatusSelect = (status: MatchStatus | "All") => {
  //   setSelectedStatus(status);
  //   setFiltersOpen(false);
  // };

  return (
    <div className="min-h-screen bg-background py-2 md:p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <div className="w-full md:w-1/4 flex-shrink-0 flex flex-col gap-6">
            <div className="bg-[#1A1D24] rounded-xl p-6">
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
                <input
                  type="text"
                  placeholder="Search matches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#1A1D24] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <div className="w-full sm:w-auto">
                <LabelButton
                  variant="filled"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={() => {
                    /* Handle create contest */
                  }}
                >
                  <Plus size={20} />
                  Create Contest
                </LabelButton>
              </div>
            </div>
            <div className="bg-[#1A1D24] rounded-xl p-6">
              <ContestTable
                contests={formatMatches}
                loading={loading}
                error={error}
              />
            </div>
            {/* Loading state indicator */}
            {loading && (
              <div className="flex justify-center mt-6">
                <div className="w-6 h-6 border-2 border-t-2 border-purple-500 rounded-full animate-spin"></div>
              </div>
            )}
            {/* Error display */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 text-red-200 p-4 rounded-lg mt-6">
                Failed to load matches. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
