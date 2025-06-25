"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import TopPlayers from "@/components/leaderboard/TopPlayers"
import PlayerList from "@/components/leaderboard/PlayerList"
import PlayerRankCard from "@/components/leaderboard/PlayerRankCard"
import { fetchLeaderboard } from "@/features/home/leaderboard/thunks/leaderboardThunks"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function LeaderboardPage() {
  const [searchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10

  const dispatch = useDispatch<AppDispatch>()
  const { players, loading, error, userRank, pagination } = useSelector((state: RootState) => state.leaderboard)

  useEffect(() => {
    dispatch(
      fetchLeaderboard({
        page: currentPage,
        limit: PAGE_SIZE,
        searchQuery: searchQuery || undefined,
      }),
    )
  }, [dispatch, currentPage, searchQuery])

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

  const topPlayers = players.slice(0, 3)

  if (loading) {
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
    <div className="min-h-screen bg-background py-2 md:p-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="bg-[#1A1D24] rounded-xl p-6">
              <TopPlayers topPlayers={topPlayers} />
            </div>
            <div className="bg-[#1A1D24] rounded-xl p-6">
              <PlayerList players={players} />
            </div>
            {pagination.totalPages > 1 && (
              <div className="bg-[#1A1D24] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-cyan-300/80 font-medium">
                  Showing <span className="text-cyan-400 font-bold">{(currentPage - 1) * PAGE_SIZE + 1}</span> to {" "}
                  <span className="text-cyan-400 font-bold">{Math.min(currentPage * PAGE_SIZE, pagination.totalCount)}</span> of {" "}
                  <span className="text-cyan-400 font-bold">{pagination.totalCount}</span> players
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`group p-3 rounded-lg transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
                    }`}
                  >
                    <ChevronLeft size={20} className="group-hover:animate-pulse" />
                  </button>
                  <div className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
                    <span className="text-cyan-400 font-bold">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className={`group p-3 rounded-lg transition-all duration-300 ${
                      currentPage === pagination.totalPages
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
                    }`}
                  >
                    <ChevronRight size={20} className="group-hover:animate-pulse" />
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 mt-8 lg:mt-0">
            <PlayerRankCard title="Current Rank" value={userRank} iconSrc="/current.svg" />
            <PlayerRankCard title="Your Highest Rank" value={userRank} iconSrc="/highest.svg" />
          </div>
        </div>
      </div>
    </div>
  )
}
