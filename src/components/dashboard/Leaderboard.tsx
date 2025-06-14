"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Crown, Medal, TrendingUp, Users, ExternalLink } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  rating: number
  avatar?: string
}

interface LeaderboardProps {
  className?: string
}

const LoadingSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-cyan-500/20 rounded-full"></div>
        <div className="h-4 w-24 bg-cyan-500/20 rounded"></div>
      </div>
      <div className="h-3 w-16 bg-cyan-500/10 rounded"></div>
    </div>

    {/* Stats skeleton */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border border-cyan-500/20 rounded-lg">
        <div className="w-8 h-8 bg-cyan-500/20 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-cyan-500/20 rounded"></div>
          <div className="h-2 w-16 bg-cyan-500/10 rounded"></div>
        </div>
        <div className="w-4 h-4 bg-cyan-500/20 rounded"></div>
      </div>
    ))}
  </div>
)

export default function Leaderboard({ className = "" }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.error("No access token found")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("https://codeclash.goyalshivansh.tech/api/v1/user/leaderboard?page=1&limit=5", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard")
        }

        const data = await response.json()
        if (data.success && Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard.slice(0, 5))
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-400" />
      case 2:
        return <Medal className="w-4 h-4 text-gray-300" />
      case 3:
        return <Medal className="w-4 h-4 text-amber-600" />
      default:
        return <TrendingUp className="w-4 h-4 text-cyan-400" />
    }
  }

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
          border: "border-yellow-400/50",
          text: "text-yellow-400",
          glow: "shadow-yellow-400/20",
        }
      case 2:
        return {
          bg: "bg-gradient-to-r from-gray-400/20 to-slate-400/20",
          border: "border-gray-300/50",
          text: "text-gray-300",
          glow: "shadow-gray-300/20",
        }
      case 3:
        return {
          bg: "bg-gradient-to-r from-amber-600/20 to-orange-500/20",
          border: "border-amber-600/50",
          text: "text-amber-600",
          glow: "shadow-amber-600/20",
        }
      default:
        return {
          bg: "bg-white/5",
          border: "border-cyan-500/30",
          text: "text-cyan-400",
          glow: "shadow-cyan-500/10",
        }
    }
  }

  const formatRating = (rating: number) => {
    if (!rating || rating === undefined || rating === null) return "0"
    if (rating >= 1000000) return `${(rating / 1000000).toFixed(1)}M`
    if (rating >= 1000) return `${(rating / 1000).toFixed(1)}K`
    return rating.toLocaleString()
  }

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 backdrop-blur-sm ${className}`}>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          
          <h2 className="text-lg md:text-xl font-semibold">Top Players</h2>
        </div>
        <Link
          href="/leaderboard"
          className="flex items-center gap-1 text-xs text-cyan-400/80 hover:text-cyan-400 transition-colors group"
          prefetch={true}
        >
          <span>View All</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-2">
        {leaderboard.length > 0 ? (
          leaderboard.map((player, index) => {
            const colors = getRankColors(player.rank)
            return (
              <div
                key={index}
                className={`group relative p-3 rounded-lg border ${colors.border} ${colors.bg} hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] shadow-lg ${colors.glow}`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  {/* <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${player.rank <= 3 ? "from-white/20 to-white/10" : "from-cyan-500/20 to-blue-500/20"} border ${colors.border} shadow-md`}
                  >
                    <span className={`text-xs font-bold ${colors.text}`}>#{player.rank}</span>
                  </div> */}

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{player.username}</p>
                      {getRankIcon(player.rank)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/60 font-mono">Rating: {formatRating(player.rating)}</span>
                    </div>
                  </div>

                  {/* Rating Display */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${colors.text}`}>{formatRating(player.rating)}</div>
                    <div className="text-xs text-white/40 uppercase tracking-wide">Points</div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto border border-cyan-500/30">
              <Users className="w-6 h-6 text-cyan-400/60" />
            </div>
            <div>
              <p className="text-white/80 font-medium mb-1">No Rankings Yet</p>
              <p className="text-xs text-white/50">Be the first to compete and claim your spot!</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 text-center">
        {/* <span className="text-cyan-400/60 text-xs font-mono">Top {leaderboard.length} of all competitors</span> */}
      </div>
    </div>
  )
}
