"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Users, Clock, Trophy, Target, ExternalLink, Award } from "lucide-react"

interface MyAnnouncementsProps {
  className?: string
}

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

const LoadingSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-cyan-500/20 rounded-full"></div>
        <div className="h-4 w-28 bg-cyan-500/20 rounded"></div>
      </div>
      <div className="h-3 w-16 bg-cyan-500/10 rounded"></div>
    </div>
    {/* Contest cards skeleton */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-4 border border-cyan-500/20 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-cyan-500/20 rounded"></div>
          <div className="h-3 w-12 bg-cyan-500/10 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="h-3 w-8 bg-cyan-500/10 rounded"></div>
            <div className="h-4 w-12 bg-cyan-500/20 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 bg-cyan-500/10 rounded"></div>
            <div className="h-4 w-16 bg-cyan-500/20 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 w-16 bg-cyan-500/10 rounded"></div>
            <div className="h-4 w-20 bg-cyan-500/20 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const MyAnnouncements: React.FC<MyAnnouncementsProps> = ({ className = "" }) => {
  const [loading, setLoading] = useState(true)
  const [contests, setContests] = useState<Contest[]>([])
  const [error, setError] = useState<string | null>(null)
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

  const formatScore = (participantCount: number) => {
    if (participantCount >= 1000) return `${(participantCount / 1000).toFixed(1)}K`
    return participantCount.toString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "text-blue-400"
      case "ONGOING":
        return "text-green-400"
      case "COMPLETED": // Changed from ENDED to COMPLETED
        return "text-gray-400"
      default:
        return "text-cyan-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleContestClick = (contestId: string, status: string) => {
    if (status === "ONGOING") {
      router.push(`/contest/${contestId}`)
    } else if (status === "UPCOMING") {
      router.push(`/contest/join/${contestId}`)
    } else {
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
        // Using the original API endpoint from SimpleAnnouncements
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contest/my-contests/registered`, {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch contests")
        console.error("Error fetching contests:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchContests()
  }, [])

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 backdrop-blur-sm ${className}`}>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-4 md:p-6 ${className}`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-white">My Registered Contests</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-red-400 font-medium text-base mb-2">Failed to load contests</h3>
          <p className="text-white/50 text-sm text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 backdrop-blur-sm relative ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <h2 className="text-lg md:text-xl font-semibold">My Registered Contests</h2>
        </div>
        <Link
          href="/registered-contests" // Changed link to reflect registered contests
          className="flex items-center gap-1 text-xs text-cyan-400/80 hover:text-cyan-400 transition-colors group"
          prefetch={true}
        >
          <span>View All</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Contest Cards */}
      <div className="space-y-3">
        {contests.length > 0 ? (
          contests.slice(0, 3).map((contest) => (
            <div
              key={contest.id} // Use contest.id as key
              onClick={() => handleContestClick(contest.id, contest.status)}
              className="group relative p-4 rounded-lg border border-cyan-500/30 bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              {/* Contest Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <h3 className="text-sm font-bold text-white truncate">{contest.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/60">
                  <Calendar className="w-3 h-3" />
                  <span className="font-mono">{formatDate(contest.startTime)}</span>
                </div>
              </div>

              {/* Contest Stats */}
              <div className="grid grid-cols-3 gap-4 mb-3">
                {/* Status */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Status</span>
                  </div>
                  <div className={`text-lg font-bold ${getStatusColor(contest.status)}`}>{contest.status}</div>
                </div>
                {/* Players */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Players</span>
                  </div>
                  <div className="text-lg font-bold text-cyan-400">{formatScore(contest._count.participants)}</div>
                </div>
                {/* Duration */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Duration</span>
                  </div>
                  <div className="text-lg font-bold text-purple-400">
                    {calculateDuration(contest.startTime, contest.endTime)}
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          ))
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto border border-cyan-500/30">
              <Award className="w-6 h-6 text-cyan-400/60" />
            </div>
            <div>
              <p className="text-white/80 font-medium mb-1">No Registered Contests</p>
              <p className="text-xs text-white/50">You haven&apos;t registered for any contests yet. Check back later!</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 text-center">
        <span className="text-cyan-400/60 text-xs font-mono">
          {contests.length > 0
            ? `Showing ${Math.min(contests.length, 3)} of ${contests.length} registered contests`
            : "Ready to register for your first contest?"}
        </span>
      </div>
    </div>
  )
}

export default MyAnnouncements
