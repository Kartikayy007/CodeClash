"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Contest {
  contestId: string
  title: string
  startTime: string
  endTime: string
  status: "UPCOMING" | "ONGOING" | "ENDED"
  participantCount: number
}

interface ContestTableProps {
  contests: Contest[]
  loading?: boolean
  error?: string | null
}

export default function ContestTable({ contests, loading, error }: ContestTableProps) {
  const [page, setPage] = useState(1)
  const router = useRouter()
  const PAGE_SIZE = 10
  const totalPages = Math.ceil(contests.length / PAGE_SIZE)
  const paginatedContests = contests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleContestClick = (contestId: string, status: string) => {
    if (status === "ONGOING") {
      router.push(`/contest/${contestId}`)
    } else if (status === "UPCOMING") {
      router.push(`/contest/join/${contestId}`)
    } else {
      router.push(`/contest-history/${contestId}`)
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-400 text-lg font-medium mb-2">Error Loading Contests</div>
          <div className="text-red-300 text-sm">{error}</div>
        </div>
      </div>
    )
  }

  if (!contests.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-cyan-400/60 text-lg font-medium mb-2">No contests found</div>
          <div className="text-gray-500 text-sm">Join or create contests to see them here</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">

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
            {paginatedContests.map((contest) => {
              const start = new Date(contest.startTime)
              const end = new Date(contest.endTime)
              const durationMs = end.getTime() - start.getTime()
              const days = Math.floor(durationMs / (1000 * 60 * 60 * 24))
              const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
              const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

              let duration = ""
              if (days > 0) duration += `${days}d `
              if (hours > 0) duration += `${hours}h `
              if (minutes > 0) duration += `${minutes}m`
              if (!duration) duration = "0m"

              const getStatusColor = (status: string) => {
                switch (status) {
                  case "UPCOMING":
                    return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
                  case "ONGOING":
                    return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
                  case "ENDED":
                    return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30"
                  default:
                    return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30"
                }
              }

              return (
                <tr
                  key={contest.contestId}
                  onClick={() => handleContestClick(contest.contestId, contest.status)}
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
                      {duration.trim()}
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
                      {contest.participantCount}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 disabled:opacity-50 hover:bg-cyan-500/10 transition-colors duration-200"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-cyan-400 font-mono text-sm px-4">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 disabled:opacity-50 hover:bg-cyan-500/10 transition-colors duration-200"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
