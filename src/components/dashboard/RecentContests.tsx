"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Users, Clock, Target, ExternalLink, Calendar, Award, Eye } from "lucide-react"

interface RecentContestsProps {
  className?: string
}

interface Contest {
  id: string
  title: string
  startTime: string
  endTime: string
  score: number
  participantCount: number
  hasReview: boolean
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

export default function RecentContests({ className = "" }: RecentContestsProps) {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)

  const isDev = process.env.NODE_ENV === "development"

  useEffect(() => {
    const fetchContests = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found in local storage")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("https://codeclash.goyalshivansh.tech/api/v1/contest/my-contests", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched contests data:", data)

       

        if (data.contests && Array.isArray(data.contests)) {
          setContests(data.contests)
        } else {
          console.error("Expected contests array but got:", data)
          setContests([])
        }
      } catch (error) {
        console.error("Error fetching contests:", error)
        setContests([])
        
      } finally {
        setLoading(false)
      }
    }

    fetchContests()
  }, [isDev])

  // Function to calculate duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const duration = end.getTime() - start.getTime() // Duration in milliseconds

    const hours = Math.floor((duration % (1000 * 3600 * 24)) / (1000 * 3600))
    const minutes = Math.floor((duration % (1000 * 3600)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  const formatScore = (score: number) => {
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`
    return 5
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400"
    if (score >= 70) return "text-cyan-400"
    if (score >= 50) return "text-yellow-400"
    return "text-red-400"
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

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 backdrop-blur-sm ${className}`}>
        <LoadingSkeleton />
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

          <h2 className="text-lg md:text-xl font-semibold">Recent Contests</h2>
        </div>
        <Link
          href="/recent-contests"
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
          contests.slice(0, 3).map((contest, index) => (
            <div
              key={index}
              className="group relative p-4 rounded-lg border border-cyan-500/30 bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-cyan-500/10"
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
                {/* Score */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Score</span>
                  </div>
                  <div className={`text-lg font-bold ${getScoreColor(contest.score)}`}>
                    {formatScore(contest.score)}
                  </div>
                </div>

                {/* Players */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Players</span>
                  </div>
                  <div className="text-lg font-bold text-cyan-400">{contest.participantCount}</div>
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

              {/* Review Button */}
              {contest.hasReview && (
                <div className="flex justify-end pt-2 border-t border-cyan-500/20">
                  <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-cyan-400/50 bg-cyan-400/10 text-cyan-400 text-xs font-medium hover:bg-cyan-400/20 transition-colors">
                    <Eye className="w-3 h-3" />
                    <span>Review</span>
                  </button>
                </div>
              )}

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
              <p className="text-white/80 font-medium mb-1">No Contest History</p>
              <p className="text-xs text-white/50">Join contests to see your participation history here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 text-center">
        <span className="text-cyan-400/60 text-xs font-mono">
          {contests.length > 0
            ? `Showing ${Math.min(contests.length, 3)} of ${contests.length} contests`
            : "Ready for your first contest?"}
        </span>
      </div>
    </div>
  )
}
