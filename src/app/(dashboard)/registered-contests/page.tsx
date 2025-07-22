"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, ChevronLeft, ChevronRight, Award, User } from "lucide-react"

interface Contest {
  id: string
  title: string
  startTime: string
  endTime: string
  status: "ONGOING" | "UPCOMING" | "COMPLETED"
  _count: {
    participants: number
  }
}

interface ApiResponse {
  message: string
  contests: Contest[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const TableSkeleton = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-cyan-500/20">
          <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            Contest Title
          </th>
          <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            Start Time
          </th>
          <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            End Time
          </th>
          <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            Duration
          </th>
          <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            Status
          </th>
          <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            Participants
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-cyan-500/10">
        {[...Array(8)].map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="py-4 px-6">
              <div className="h-5 bg-cyan-500/20 rounded-md w-3/4"></div>
            </td>
            <td className="py-4 px-6">
              <div className="space-y-2">
                <div className="h-4 bg-cyan-500/20 rounded w-20"></div>
                <div className="h-3 bg-cyan-500/15 rounded w-16"></div>
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="space-y-2">
                <div className="h-4 bg-cyan-500/20 rounded w-20"></div>
                <div className="h-3 bg-cyan-500/15 rounded w-16"></div>
              </div>
            </td>
            <td className="py-4 px-6 text-center">
              <div className="h-4 bg-cyan-500/20 rounded w-12 mx-auto"></div>
            </td>
            <td className="py-4 px-6 text-center">
              <div className="h-6 bg-cyan-500/20 rounded-full w-20 mx-auto"></div>
            </td>
            <td className="py-4 px-6 text-center">
              <div className="h-6 bg-cyan-500/20 rounded-full w-16 mx-auto"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function RegisteredContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalContests, setTotalContests] = useState(0)
  const [filterStatus] = useState<"ALL" | "ONGOING" | "UPCOMING" | "COMPLETED">("ALL")
  const PAGE_SIZE = 10 // Display 10 contests per page
  const router = useRouter()

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    let duration = ""
    if (days > 0) duration += `${days}d `
    if (hours > 0) duration += `${hours}h `
    if (minutes > 0) duration += `${minutes}m`
    if (!duration) duration = "0m"
    return duration.trim()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
      case "ONGOING":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
      case "COMPLETED":
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30"
    }
  }

  const handleContestClick = (contestId: string, status: string) => {
    if (status === "ONGOING") {
      router.push(`/contest/${contestId}`)
    } else if (status === "UPCOMING") {
      router.push(`/contest/join/${contestId}`)
    } else if (status === "COMPLETED") {
      router.push(`/contest-history/${contestId}`)
    }
  }


  useEffect(() => {
    const fetchContests = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.error("No access token found in local storage")
        setLoading(false)
        setError("Authentication required. Please log in.")
        return
      }
      try {
        setLoading(true)
        setError(null)
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contest/my-contests/registered?page=${currentPage}&limit=${PAGE_SIZE}`
        if (filterStatus !== "ALL") {
          url += `&status=${filterStatus}`
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()
        setContests(data.contests || [])
        setTotalPages(data.meta.totalPages)
        setTotalContests(data.meta.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch contests")
        console.error("Error fetching contests:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchContests()
  }, [currentPage, PAGE_SIZE, filterStatus])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-7xl relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h1 className="text-lg md:text-xl font-semibold text-white">My Registered Contests</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-red-400 font-medium text-base mb-2">Failed to load contests</h3>
            <p className="text-white/50 text-sm text-center">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Registered Contests</h1>
              <p className="text-cyan-400/80">View all contests you have registered for</p>
            </div>
          </div>
        </div>

        {/* Main Contests Section */}
        <div className="bg-[#1A1D24] rounded-xl border border-cyan-500/20 overflow-hidden">
          {/* Filter Buttons */}
          {/* <div className="px-6 py-4 flex flex-wrap gap-3 border-b border-cyan-500/20">
            {["ALL", "ONGOING", "UPCOMING", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status as "ALL" | "ONGOING" | "UPCOMING" | "COMPLETED")
                  setCurrentPage(1) // Reset to first page on filter change
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    filterStatus === status
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/25"
                      : "text-gray-400 hover:text-cyan-400/80 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 bg-gray-800/50"
                  }`}
              >
                {status === "ALL" ? "All Contests" : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div> */}

          {/* Contest List Table */}
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                      Contest Title
                    </th>
                    <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                      Participants
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {contests.length > 0 ? (
                    contests.map((contest) => {
                      const start = new Date(contest.startTime)
                      const end = new Date(contest.endTime)
                      const duration = calculateDuration(contest.startTime, contest.endTime)

                      return (
                        <tr
                          key={contest.id}
                          onClick={() => handleContestClick(contest.id, contest.status)}
                          className="hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-200 group cursor-pointer"
                        >
                          <td className="py-4 px-6">
                            <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-200">
                              {contest.title}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200 text-sm">
                              {start.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                              <br />
                              <span className="text-xs text-gray-400">
                                {start.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200 text-sm">
                              {end.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                              <br />
                              <span className="text-xs text-gray-400">
                                {end.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200 font-mono text-sm">
                              {duration}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                contest.status,
                              )}`}
                            >
                              {contest.status}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30">
                              <User className="w-4 h-4 mr-1" />
                              {contest._count.participants}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="space-y-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto border border-cyan-500/30">
                            <Award className="w-6 h-6 text-cyan-400/60" />
                          </div>
                          <div>
                            <p className="text-white/80 font-medium mb-1">No Registered Contests</p>
                            <p className="text-xs text-white/50">
                              You haven&apos;t registered for any contests yet. Check back later!
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="px-6 py-4 border-t border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-cyan-300/80 font-medium text-sm">
                  Showing <span className="text-cyan-400 font-bold">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                  <span className="text-cyan-400 font-bold">{Math.min(currentPage * PAGE_SIZE, totalContests)}</span> of{" "}
                  <span className="text-cyan-400 font-bold">{totalContests}</span> contests
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
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`group px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                      currentPage === totalPages
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
      </div>
    </div>
  )
}
