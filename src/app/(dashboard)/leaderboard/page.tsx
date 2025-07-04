"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import TopPlayers from "@/components/leaderboard/TopPlayers"
import PlayerList from "@/components/leaderboard/PlayerList"
import PlayerRankCard from "@/components/leaderboard/PlayerRankCard"
import { fetchLeaderboard, fetchTopPlayers } from "@/features/home/leaderboard/thunks/leaderboardThunks"
import PlayerListSkeleton from "@/components/leaderboard/PlayerListSkeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PercentileChart from '../../../components/leaderboard/PercentileChart';

export default function LeaderboardPage() {
  const [searchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10

  const dispatch = useDispatch<AppDispatch>()
  const { players, topPlayers, loading, playersLoading, error, userRank, pagination } = useSelector((state: RootState) => state.leaderboard)

  useEffect(() => {
    // Fetch top players only once when component mounts
    if (topPlayers.length === 0) {
      dispatch(fetchTopPlayers())
    }
    
    // Fetch current page players
    dispatch(
      fetchLeaderboard({
        page: currentPage,
        limit: PAGE_SIZE,
        searchQuery: searchQuery || undefined,
      }),
    )
  }, [dispatch, currentPage, searchQuery, topPlayers.length])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  if (loading && topPlayers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 rounded-xl border border-red-500/50 bg-red-500/10 backdrop-blur-sm">
          <div className="text-red-400 text-xl font-bold mb-2">Error Loading Leaderboard</div>
          <div className="text-red-300/80">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
              <p className="text-cyan-400/80">Compete with the best developers worldwide</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PlayerRankCard title="Your Rank" value={userRank} iconSrc="/current.svg" />
            </div>
          </div>
        </div>

        {/* Top Players Podium */}
        <div className="mb-8">
          <TopPlayers topPlayers={topPlayers} />
        </div>

        {/* Main Leaderboard Section */}
        <div className="bg-[#1A1D24] rounded-xl border border-cyan-500/20 overflow-hidden">
          
          {/* Leaderboard Header */}
          <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Global Rankings</h2>
              <div className="text-sm text-cyan-400/80">
                {pagination.totalCount} players competing
              </div>
            </div>
          </div>

          {/* Player List */}
          <div className="p-6">
            {playersLoading ? (
              <PlayerListSkeleton />
            ) : (
              <PlayerList players={players} currentPage={currentPage} pageSize={PAGE_SIZE} />
            )}
          </div>

          {/* Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-cyan-300/80 font-medium text-sm">
                  Showing <span className="text-cyan-400 font-bold">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                  <span className="text-cyan-400 font-bold">{Math.min(currentPage * PAGE_SIZE, pagination.totalCount)}</span> of{" "}
                  <span className="text-cyan-400 font-bold">{pagination.totalCount}</span> players
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`group px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                      currentPage === 1
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-400/50"
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  <div className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
                    <span className="text-cyan-400 font-medium text-sm">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className={`group px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                      currentPage === pagination.totalPages
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-400/50"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <PercentileChart userRank={userRank} totalPlayers={pagination.totalCount} />
        </div>
      </div>
    </div>
  )
}
