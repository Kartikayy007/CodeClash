"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react"
import LabelButton from "@/components/ui/LabelButton"
import type { ProblemPreview } from "@/features/battle/editor/api/problems"
import Image from "next/image"

interface LeaderboardUser {
  username: string
  rating: number
  profileImage: string | null
}

interface LeaderboardEntry {
  id: string
  contestId: string
  userId: string
  score: number
  problemsSolved: number
  lastSubmissionTime: string | null
  rank: number
  updatedAt: string
  user: LeaderboardUser
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  pagination: {
    total: number
    pages: number
    currentPage: number
    perPage: number
  }
}

interface ProblemsSidebarProps {
  isOpen: boolean
  onClose: () => void
  problems: ProblemPreview[]
  isLoading: boolean
  onProblemSelect: (problemId: string) => void
  onFetchProblems: () => void
  contestId: string
}

type SidebarTab = "problems" | "leaderboard"

// Helper function to get difficulty based on rating
const getDifficulty = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
  if (difficulty === 'EASY') {
    return { label: "EASY", color: "text-green-500" }
  } else if (difficulty === 'MEDIUM') {
    return { label: "MEDIUM", color: "text-yellow-500" }
  } else if (difficulty === 'HARD') {
    return { label: "HARD", color: "text-red-500" }
  }
}

interface ProblemSubmissions {
  accepted?: number;
  wrong_answer?: number;
  time_limit_exceeded?: number;
  compilation_error?: number;
}

const isProblemSolved = (submissions: ProblemSubmissions | undefined): boolean => {
  if (!submissions || !submissions.accepted) {
    return false;
  }
  return submissions.accepted > 0;
}


// Skeleton loading component for problem cards
const ProblemCardSkeleton = () => (
  <div className="bg-[#292C33] rounded-lg p-4 animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="h-6 bg-gray-700 rounded w-3/5"></div>
      <div className="flex flex-col items-end">
        <div className="h-4 bg-gray-700 rounded w-16 mb-1"></div>
        <div className="h-3 bg-gray-700 rounded w-20"></div>
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className="h-4 bg-gray-700 rounded w-20"></div>
      <div className="h-8 bg-gray-700 rounded w-16"></div>
    </div>
  </div>
)

// Skeleton loading component for leaderboard entries
const LeaderboardSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((index) => (
      <div key={index} className="bg-[#292C33] rounded-lg p-3 sm:p-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
            <div className="h-4 bg-gray-700 rounded w-16 sm:w-20"></div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-700 rounded w-8 sm:w-12 mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-12 sm:w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const ProblemsSidebar: React.FC<ProblemsSidebarProps> = ({
  isOpen,
  onClose,
  problems,
  isLoading,
  onProblemSelect,
  onFetchProblems,
  contestId,
}) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null)
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<SidebarTab>("problems")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // Only fetch problems when the sidebar opens and we don't have problems yet
    if (isOpen && problems.length === 0 && !isLoading) {
      onFetchProblems()
    }
  }, [isOpen, problems.length, isLoading, onFetchProblems])

  const fetchLeaderboard = useCallback(
    async (page = 1) => {
      if (!contestId) return

      try {
        setIsLeaderboardLoading(true)
        const response = await fetch(
          `https://codeclash.goyalshivansh.tech/api/v1/contest/${contestId}/leaderboard?page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard")
        }

        const data = await response.json()
        setLeaderboardData(data)
        setCurrentPage(page)
      } catch (err) {
        console.error("Failed to fetch leaderboard", err)
        setLeaderboardData(null)
      } finally {
        setIsLeaderboardLoading(false)
      }
    },
    [contestId],
  )

  useEffect(() => {
    // Fetch leaderboard when switching to leaderboard tab
    if (isOpen && activeTab === "leaderboard" && !leaderboardData && !isLeaderboardLoading) {
      fetchLeaderboard(1)
    }
  }, [isOpen, activeTab, leaderboardData, isLeaderboardLoading, fetchLeaderboard])

  // Handle navigation to a problem
  const handleProblemSelect = (problemId: string) => {
    onProblemSelect(problemId)
    onClose()
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (leaderboardData?.pagination.pages || 1)) {
      fetchLeaderboard(page)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-50" : "opacity-0"
          }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed left-0 top-0 h-full w-full sm:w-96 bg-[#1C202A] shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-xl font-semibold">Contest Info</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("problems")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === "problems"
              ? "text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === "leaderboard"
              ? "text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pb-20">
          {activeTab === "problems" ? (
            // Problems Section
            <>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((index) => (
                    <ProblemCardSkeleton key={index} />
                  ))}
                </div>
              ) : problems.length > 0 ? (
                <div className="space-y-4">
                  {problems.map((problem) => {
                    const difficulty = getDifficulty(problem.difficulty)
                    const isSolved = isProblemSolved(problem.submissions)

                    return (
                      <div key={problem.id} className="bg-[#292C33] rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium text-lg pr-2">{problem.title}</h3>
                            {isSolved && (
                              <Check size={16} className="text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <span className={`${difficulty?.color} text-sm font-medium`}>{difficulty?.label}</span>
                            <span className="text-gray-400 text-xs mt-1">Rating: {problem.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-gray-300 text-sm">Score: {problem.score}</span>
                          <LabelButton
                            onClick={() => handleProblemSelect(problem.id)}
                            variant={isSolved ? "light" : "filled"}
                            className={`text-sm py-1 `}
                          >
                            {isSolved ? (
                              "Solved"
                            ) : (
                              "Solve"
                            )}
                          </LabelButton>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No problems found in this contest</p>
              )}
            </>
          ) : (
            // Leaderboard Section
            <>
              {isLeaderboardLoading ? (
                <LeaderboardSkeleton />
              ) : leaderboardData?.leaderboard.length ? (
                <>
                  <div className="space-y-3">
                    {leaderboardData.leaderboard.map((entry, index) => (
                      <div key={entry.id} className="bg-[#292C33] rounded-lg p-3 sm:p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            {/* Rank Display using index */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-yellow-500 text-black" : // Gold for 1st
                              index === 1 ? "bg-gray-400 text-black" : // Silver for 2nd  
                                index === 2 ? "bg-orange-500 text-black" : // Bronze for 3rd
                                  "bg-gray-600 text-white" // Default for 4th+
                              }`}>
                              {index + 1}
                            </div>

                            {/* Profile Image */}
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                              {entry.user.profileImage ? (
                                <Image
                                  src={entry.user.profileImage || "/placeholder.svg"}
                                  alt={entry.user.username}
                                  className="w-full h-full object-cover"
                                  width={32}
                                  height={32}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                                  {entry.user.username.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="text-white font-medium text-sm truncate">{entry.user.username}</div>
                              <div className="text-gray-400 text-xs">Rating: {entry.user.rating}</div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="text-cyan-400 font-semibold text-sm">{entry.score}</div>
                            <div className="text-gray-400 text-xs">{entry.problemsSolved} solved</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>


                  {/* Pagination */}
                  {leaderboardData.pagination.pages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                      >
                        <ChevronLeft size={16} />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">
                          Page {leaderboardData.pagination.currentPage} of {leaderboardData.pagination.pages}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === leaderboardData.pagination.pages}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-4 text-center text-gray-400 text-xs">
                    Showing {leaderboardData.leaderboard.length} of {leaderboardData.pagination.total} participants
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-center py-8">No submissions yet</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemsSidebar
