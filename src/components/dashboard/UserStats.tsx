"use client"

import { useEffect, useState } from "react"
import { Trophy, Target, Zap, TrendingUp, User, Mail, Flame, X, GraduationCap, Calendar, BarChart3 } from "lucide-react"
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis } from "recharts"

interface UserProfile {
  success: boolean
  data: {
    id: string
    username: string
    email: string
    wins: number
    skillLevel: string
    rating: number
    winStreak: number
    maxWinStreak: number
    totalMatches: number
    losses: number
    winRate: number
  }
}

interface WinTrendData {
  date: string
  wins: number
  losses: number
}

interface WinTrendResponse {
  success: boolean
  trend: WinTrendData[]
  winStreak: number
  maxWinStreak: number
}

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-cyan-500/20 rounded-full"></div>
      <div className="space-y-1">
        <div className="h-3 w-24 bg-cyan-500/20 rounded"></div>
        <div className="h-2 w-32 bg-cyan-500/10 rounded"></div>
      </div>
    </div>

    {/* Stats skeleton */}
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-3 border border-cyan-500/20 rounded-lg space-y-2">
          <div className="w-4 h-4 bg-cyan-500/20 rounded"></div>
          <div className="h-5 w-12 bg-cyan-500/20 rounded"></div>
          <div className="h-2 w-8 bg-cyan-500/10 rounded"></div>
        </div>
      ))}
    </div>
  </div>
)

interface UserStats {
  rating: number
  totalMatches: number
  wins: number
  winRate: number
}

interface UserStatsProps {
  className?: string
}

export default function UserStats({ className = "" }: UserStatsProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    rating: 0,
    totalMatches: 0,
    wins: 0,
    winRate: 0,
  })
  const [winTrend, setWinTrend] = useState<WinTrendResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found in local storage")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()
        console.log("Fetched user profile data:", data.data)

        if (data.success) {
          console.log("Setting user profile:")
          setUserProfile(data)
          setUserStats({
            rating: data.data.rating,
            totalMatches: data.data.totalMatches,
            wins: data.data.wins,
            winRate: data.data.winRate,
          })
        } else {
          console.error("Failed to fetch user profile:", data)
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setUserProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchWinTrend = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("No access token found for win trend")
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/win-trend`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()
        console.log("Fetched win trend data:", data)

        if (data.success) {
          setWinTrend(data)
        } else {
          console.error("Failed to fetch win trend:", data)
        }
      } catch (error) {
        console.error("Error fetching win trend:", error)
      }
    }

    fetchUserProfile()
    fetchWinTrend()
  }, [])

  useEffect(() => {
    console.log("User profile updated:", userProfile)
  }, [userProfile])

  useEffect(() => {
    console.log("User stats updated:", userStats)
  }, [userStats])

  if (isLoading) {
    return (
      <div
        className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 ${className}`}
      >
        <LoadingSkeleton />
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getWinRateColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-400"
    if (rate >= 60) return "text-cyan-400"
    if (rate >= 40) return "text-yellow-400"
    return "text-red-400"
  }

  const getSkillLevelStyle = (skillLevel: string) => {
    switch (skillLevel.toLowerCase()) {
      case "beginner":
        return {
          color: "text-green-400",
          borderColor: "border-green-400/50",
          bgColor: "bg-green-400/10",
        }
      case "intermediate":
        return {
          color: "text-yellow-400",
          borderColor: "border-yellow-400/50",
          bgColor: "bg-yellow-400/10",
        }
      case "advanced":
        return {
          color: "text-red-400",
          borderColor: "border-red-400/50",
          bgColor: "bg-red-400/10",
        }
      case "expert":
        return {
          color: "text-purple-400",
          borderColor: "border-purple-400/50",
          bgColor: "bg-purple-400/10",
        }
      default:
        return {
          color: "text-cyan-400",
          borderColor: "border-cyan-400/50",
          bgColor: "bg-cyan-400/10",
        }
    }
  }

  // Prepare chart data
  const chartData = winTrend?.trend.map((item) => ({
    date: item.date.split('/').slice(0, 2).join('/'), // Format to DD/MM
    wins: item.wins,
    losses: item.losses,
    total: item.wins + item.losses,
    winRate: item.wins + item.losses > 0 ? (item.wins / (item.wins + item.losses)) * 100 : 0
  })) || []

  const chartConfig = {
    wins: {
      label: "Wins",
      color: "hsl(var(--chart-1))",
    },
    losses: {
      label: "Losses", 
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const stats = [
    {
      label: "Rating",
      value: formatNumber(userStats.rating),
      icon: Trophy,
      color: "text-yellow-400",
      borderColor: "border-yellow-400/50",
    },
    {
      label: "Wins",
      value: formatNumber(userStats.wins),
      icon: TrendingUp,
      color: "text-emerald-400",
      borderColor: "border-emerald-400/50",
    },
    {
      label: "Matches",
      value: formatNumber(userStats.totalMatches),
      icon: Target,
      color: "text-blue-400",
      borderColor: "border-blue-400/50",
    },
    {
      label: "Streak",
      value: formatNumber(userProfile?.data.winStreak || 0),
      icon: Flame,
      color: "text-orange-400",
      borderColor: "border-orange-400/50",
    },
    {
      label: "Win Rate",
      value: `${userStats.winRate.toFixed(1)}%`,
      icon: Zap,
      color: getWinRateColor(userStats.winRate),
      borderColor: `border-${getWinRateColor(userStats.winRate).split("-")[1]}-400/50`,
    },
  ]

  return (
    <div
      className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4  backdrop-blur-sm ${className}`}
    >
      {/* Compact Header */}
      {userProfile && (
        <div className="mb-4 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/50">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-bold text-white truncate">{userProfile.data.username}</h3>
              <div className="flex items-center gap-1 text-cyan-400/80">
                <Mail className="w-3 h-3" />
                <span className="text-xs font-mono truncate">{userProfile.data.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-orange-400/50 bg-orange-400/10">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400 font-medium">{userProfile.data.maxWinStreak}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-red-400/50 bg-red-400/10">
              <X className="w-3 h-3 text-red-400" />
              <span className="text-red-400 font-medium">{userProfile.data.losses}</span>
            </div>
            {userProfile.data.skillLevel && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getSkillLevelStyle(userProfile.data.skillLevel).borderColor} ${getSkillLevelStyle(userProfile.data.skillLevel).bgColor}`}>
                <GraduationCap className={`w-3 h-3 ${getSkillLevelStyle(userProfile.data.skillLevel).color}`} />
                <span className={`${getSkillLevelStyle(userProfile.data.skillLevel).color} font-medium capitalize`}>
                  {userProfile.data.skillLevel.toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {stats.slice(0, 4).map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div
              key={index}
              className={`group relative p-3 rounded-lg border ${stat.borderColor} bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center gap-2">
                <IconComponent className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-white/50 uppercase tracking-wide font-medium">{stat.label}</div>
                  <div className={`text-lg font-bold ${stat.color} truncate`}>{stat.value}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Win Rate Highlight */}
      <div
        className={`p-3 rounded-lg border ${stats[4].borderColor} bg-white/5 hover:bg-white/10 transition-all duration-200`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${stats[4].color}`} />
            <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Win Rate</span>
          </div>
          <div className={`text-xl font-bold ${stats[4].color}`}>{stats[4].value}</div>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="mt-3 pt-2 border-t border-cyan-500/20">
        <div className="flex items-center justify-between">
          <span className="text-cyan-400/60 text-xs font-mono">
            {userProfile?.data.totalMatches || userStats.totalMatches} total games
          </span>
          {winTrend && (
            <button
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 transition-all duration-200 text-xs"
            >
              <BarChart3 className="w-3 h-3" />
              {showChart ? "Hide Chart" : "Win Trend"}
            </button>
          )}
        </div>
      </div>

      {/* Win Trend Chart */}
      {showChart && winTrend && chartData.length > 0 && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-white">7-Day Win Trend</h4>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[150px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10, fill: 'rgba(134, 239, 172, 0.6)' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10, fill: 'rgba(134, 239, 172, 0.6)' }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Line
                dataKey="wins"
                type="monotone"
                stroke="rgb(34, 197, 94)"
                strokeWidth={2}
                dot={{
                  fill: "rgb(34, 197, 94)",
                  strokeWidth: 2,
                  r: 3,
                }}
                activeDot={{
                  r: 4,
                  stroke: "rgb(34, 197, 94)",
                  strokeWidth: 2,
                }}
              />
              <Line
                dataKey="losses"
                type="monotone"
                stroke="rgb(239, 68, 68)"
                strokeWidth={2}
                dot={{
                  fill: "rgb(239, 68, 68)",
                  strokeWidth: 2,
                  r: 3,
                }}
                activeDot={{
                  r: 4,
                  stroke: "rgb(239, 68, 68)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ChartContainer>

          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-400">Wins</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-red-400">Losses</span>
            </div>
            <div className="text-cyan-400/60">
              Current Streak: {winTrend.winStreak}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
