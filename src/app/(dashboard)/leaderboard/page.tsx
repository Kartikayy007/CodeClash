"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import TopPlayers from "@/components/leaderboard/TopPlayers"
import PlayerList from "@/components/leaderboard/PlayerList"
import SearchInput from "@/components/leaderboard/SearchInput"
import PlayerRankCard from "@/components/leaderboard/PlayerRankCard"
import { fetchLeaderboard } from "@/features/home/leaderboard/thunks/leaderboardThunks"
import { ChevronLeft, ChevronRight, Trophy, Zap } from "lucide-react"

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Background elements - keeping the same as the main page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col p-4 lg:p-6">
          {/* Skeleton for page structure */}
          <div className="flex flex-col lg:flex-row lg:gap-6">
            <div className="w-full lg:w-[70%] space-y-6">
              {/* Top Players Skeleton */}
              <div className="flex justify-center space-x-4 p-6 bg-gradient-to-r from-[#1a1d26]/50 to-[#1e222c]/50 rounded-xl border border-cyan-500/10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center p-4">
                    <div className="w-20 h-20 rounded-full bg-gray-700/50 animate-pulse mb-3"></div>
                    <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-16 bg-gray-700/30 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Player List Skeleton */}
              <div className="bg-gradient-to-r from-[#1a1d26]/50 to-[#1e222c]/50 rounded-xl border border-cyan-500/10 overflow-hidden">
                <div className="p-4 border-b border-cyan-500/10 flex justify-between">
                  <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
                
                {/* Player rows */}
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-cyan-500/10">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 bg-gray-700/50 rounded-full animate-pulse"></div>
                      <div className="h-6 w-40 bg-gray-700/50 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-700/50 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex justify-between items-center bg-gradient-to-r from-[#1a1d26]/50 to-[#1e222c]/50 rounded-xl p-6 border border-cyan-500/10">
                <div className="h-5 w-40 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="flex gap-3">
                  <div className="h-10 w-10 bg-gray-700/50 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-24 bg-gray-700/50 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-10 bg-gray-700/50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="mt-8 lg:mt-0 gap-6 flex flex-col w-full lg:w-[30%]">
              {/* Search Input Skeleton */}
              <div className="h-14 bg-gradient-to-r from-[#1a1d26]/50 to-[#1e222c]/50 rounded-xl border border-cyan-500/10 animate-pulse"></div>
              
              {/* Player Rank Cards Skeleton */}
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-gradient-to-r from-[#1a1d26]/50 to-[#1e222c]/50 rounded-xl border border-cyan-500/10 p-4 animate-pulse">
                  <div className="h-5 w-1/2 bg-gray-700/50 rounded mb-4"></div>
                  <div className="h-8 w-1/3 bg-gray-700/50 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b0f] via-[#1a1d26] to-[#0f1419] flex items-center justify-center">
        <div className="text-center p-8 rounded-xl border border-red-500/50 bg-red-500/10 backdrop-blur-sm">
          <div className="text-red-400 text-xl font-bold mb-2">Error Loading Leaderboard</div>
          <div className="text-red-300/80">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/3 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
      </div>

      <div className="relative z-10 flex flex-col p-4 lg:p-6">

        <div className="flex flex-col lg:flex-row lg:gap-6">
          <div className="w-full lg:w-[70%] space-y-6">
            <TopPlayers topPlayers={topPlayers} />
            <PlayerList players={players} />

            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center bg-gradient-to-r from-[#1a1d26] to-[#1e222c] rounded-xl p-6 border border-cyan-500/20 backdrop-blur-sm shadow-lg shadow-cyan-500/5">
                <div className="text-cyan-300/80 font-medium">
                  Showing <span className="text-cyan-400 font-bold">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                  <span className="text-cyan-400 font-bold">
                    {Math.min(currentPage * PAGE_SIZE, pagination.totalCount)}
                  </span>{" "}
                  of <span className="text-cyan-400 font-bold">{pagination.totalCount}</span>  players
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

          <div className="mt-8 lg:mt-0 gap-6 flex flex-col w-full lg:w-[30%]">
            {/* <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
            <PlayerRankCard title="Current Rank" value={userRank} iconSrc="/current.svg" />
            <PlayerRankCard title="Your Highest Rank" value={userRank} iconSrc="/highest.svg" />
          </div>
        </div>
      </div>
    </div>
  )
}
