"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Swords,
  Users,
  Crown,
  Clock,
  Calendar,
  ExternalLink,
  Zap,
  Target,
  Gamepad2,
  Trophy,
  X,
  CheckCircle,
} from "lucide-react"
import type { Match, Player } from "./types/matches.types"

interface RecentMatchesProps {
  className?: string
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

    {/* Match cards skeleton */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-4 border border-cyan-500/20 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-cyan-500/20 rounded"></div>
          <div className="h-3 w-16 bg-cyan-500/10 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-cyan-500/10 rounded"></div>
            <div className="h-4 w-16 bg-cyan-500/20 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-10 bg-cyan-500/10 rounded"></div>
            <div className="h-4 w-20 bg-cyan-500/20 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-cyan-500/10 rounded"></div>
            <div className="h-4 w-12 bg-cyan-500/20 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default function RecentMatches({ className = "" }: RecentMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentMatches = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found in local storage")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          "https://codeclash.goyalshivansh.tech/api/v1/user/recent-matches?page=1&limit=12",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched recent matches data:", data)

        if (data.success && Array.isArray(data.recentMatches)) {
          setMatches(data.recentMatches)
        } else {
          console.error("Expected recentMatches array but got:", data)
          setMatches([])
        }
      } catch (error) {
        console.error("Error fetching recent matches:", error)
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentMatches()
  }, [])

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "standard":
        return <Target className="w-4 h-4 text-blue-400" />
      case "accuracy":
        return <Zap className="w-4 h-4 text-yellow-400" />
      case "speed":
        return <Clock className="w-4 h-4 text-red-400" />
      default:
        return <Gamepad2 className="w-4 h-4 text-cyan-400" />
    }
  }

  const getModeColors = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "standard":
        return {
          bg: "bg-blue-400/10",
          border: "border-blue-400/50",
          text: "text-blue-400",
        }
      case "accuracy":
        return {
          bg: "bg-yellow-400/10",
          border: "border-yellow-400/50",
          text: "text-yellow-400",
        }
      case "speed":
        return {
          bg: "bg-red-400/10",
          border: "border-red-400/50",
          text: "text-red-400",
        }
      default:
        return {
          bg: "bg-cyan-400/10",
          border: "border-cyan-400/50",
          text: "text-cyan-400",
        }
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

  const formatDuration = (duration: string) => {
    // Assuming duration is in format like "5m 30s" or similar
    return duration
  }

  const isWinner = (match: Match, currentUserId?: string) => {
    // This would need to be determined based on your auth system
    // For now, we'll show if there's a winner
    return match.winnerId !== null
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
          <h2 className="text-lg md:text-xl font-semibold">Recent Matches</h2>
        </div>
        <Link
          href="/recent-matches"
          className="flex items-center gap-1 text-xs text-cyan-400/80 hover:text-cyan-400 transition-colors group"
          prefetch={true}
        >
          <span>View All</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {matches.length > 0 ? (
          matches.slice(0, 3).map((match, index) => {
            const modeColors = getModeColors(match.mode)
            const winner = match.players.find((player: Player) => player.id === match.winnerId)

            return (
              <div
                key={index}
                className="group relative p-4 rounded-lg border border-cyan-500/30 bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-cyan-500/10"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getModeIcon(match.mode)}
                    <div className={`px-2 py-1 rounded-full border ${modeColors.border} ${modeColors.bg}`}>
                      <span className={`text-xs font-medium ${modeColors.text}`}>{match.mode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/60">
                    <Calendar className="w-3 h-3" />
                    <span className="font-mono">{formatDate(match.createdAt)}</span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="grid grid-cols-3 gap-4 mb-3">
                  {/* Players */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Players</span>
                    </div>
                    <div className="space-y-1">
                      {match.players.slice(0, 2).map((player: Player, playerIndex: number) => (
                        <div key={player.id} className="flex items-center gap-1">
                          <span className="text-sm font-medium text-white truncate">{player.username}</span>
                          {player.id === match.winnerId && <Crown className="w-3 h-3 text-yellow-400" />}
                        </div>
                      ))}
                      {match.players.length > 2 && (
                        <span className="text-xs text-white/60">+{match.players.length - 2} more</span>
                      )}
                    </div>
                  </div>

                  {/* Winner */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Winner</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {winner ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-400 truncate">{winner.username}</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">No Winner</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Duration</span>
                    </div>
                    <div className="text-sm font-bold text-purple-400">{formatDuration(match.duration)}</div>
                  </div>
                </div>

                {/* Match Result Indicator */}
                <div className="flex justify-end">
                  <div
                    className={`px-2 py-1 rounded-full border text-xs font-medium ${
                      winner
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                        : "border-gray-400/50 bg-gray-400/10 text-gray-400"
                    }`}
                  >
                    {winner ? "Completed" : "Incomplete"}
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
              <Swords className="w-6 h-6 text-cyan-400/60" />
            </div>
            <div>
              <p className="text-white/80 font-medium mb-1">No Match History</p>
              <p className="text-xs text-white/50">Start playing to see your match history here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-cyan-500/20 text-center">
        <span className="text-cyan-400/60 text-xs font-mono">
          {matches.length > 0
            ? `Showing ${Math.min(matches.length, 3)} of ${matches.length} matches`
            : "Ready for your first match?"}
        </span>
      </div>
    </div>
  )
}
