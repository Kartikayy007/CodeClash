"use client"

import { useState, useEffect } from "react"
import ContestEditor from "@/components/Contest/Editor/ContestEditor"
import { useParams } from "next/navigation"
import { contestApi } from "@/features/contests/api/contestApi"
import { Home, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const ProblemPage = () => {
  const params = useParams()
  const problemId = params?.problemId as string
  const contestId = params?.contestId as string
  const [endTime, setEndTime] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await contestApi.getContestDetails(contestId)
        if (response.contest) {
          setEndTime(response.contest.endTime)
          const endTimeMs = new Date(response.contest.endTime).getTime()
          const now = new Date().getTime()
          const timeLeftInSeconds = Math.floor((endTimeMs - now) / 1000)
          setTimeLeft(timeLeftInSeconds > 0 ? timeLeftInSeconds : 0)
        }
      } catch (error) {
        console.error("Failed to fetch contest details:", error)
      }
    }

    fetchContestDetails()
  }, [contestId])

  useEffect(() => {
    if (!endTime) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const secs = seconds % 60

    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    parts.push(`${secs.toString().padStart(2, "0")}s`)

    return parts.join(" ")
  }

  const isCritical = timeLeft <= 60 // Last minute
  const isWarning = timeLeft <= 300 // Last 5 minutes
  const isLowTime = timeLeft <= 900 // Last 15 minutes

  return (
    <div className="min-h-screen bg-[#10141D]">
      <div className="flex md:-mt-16 mt-0 flex-col sm:flex-row items-center justify-end gap-4 p-4 text-white bg-[#10151c]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/contest/${contestId}`}
                className="text-white hover:text-cyan-300 transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
              >
                <Home size={20} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Go to contest home page</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Improved Timer Design */}
        <div
          className={`
            relative flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 h-10 w-full sm:w-auto
            backdrop-blur-sm border
            ${
              isCritical
                ? "bg-gradient-to-r from-red-900/40 to-red-800/40 border-red-500/30 shadow-lg shadow-red-500/10"
                : isWarning
                  ? "bg-gradient-to-r from-orange-900/40 to-red-900/40 border-orange-500/30 shadow-lg shadow-orange-500/10"
                  : isLowTime
                    ? "bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                    : "bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-600/30 shadow-lg shadow-slate-500/5"
            }
          `}
        >
          {/* Status indicator dot */}
          <div
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${
                isCritical
                  ? "bg-red-400 animate-pulse shadow-lg shadow-red-400/50"
                  : isWarning
                    ? "bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50"
                    : isLowTime
                      ? "bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50"
                      : "bg-green-400 shadow-lg shadow-green-400/30"
              }
            `}
          />

          {/* Timer icon with conditional styling */}
          <div className="relative">
            {isCritical ? (
              <AlertTriangle size={18} className="text-red-400 animate-bounce drop-shadow-sm" />
            ) : (
              <Clock
                size={18}
                className={`
                  transition-all duration-300 drop-shadow-sm
                  ${isWarning ? "text-orange-400 animate-pulse" : isLowTime ? "text-yellow-400" : "text-blue-400"}
                `}
              />
            )}
          </div>

          {/* Time display with improved typography */}
          <span
            className={`
              text-base font-mono font-semibold tabular-nums transition-all duration-300 drop-shadow-sm
              ${
                isCritical
                  ? "text-red-300"
                  : isWarning
                    ? "text-orange-300"
                    : isLowTime
                      ? "text-yellow-300"
                      : "text-blue-300"
              }
            `}
          >
            {formatTime(timeLeft)}
          </span>

          {/* Subtle glow effect for critical states */}
          {(isCritical || isWarning) && (
            <div
              className={`
                absolute -inset-0.5 rounded-xl opacity-20 blur-sm -z-10 animate-pulse
                ${isCritical ? "bg-red-500" : "bg-orange-500"}
              `}
            />
          )}

          {/* Progress indicator for last hour */}
          {timeLeft <= 3600 && timeLeft > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700/50 rounded-b-xl overflow-hidden">
              <div
                className={`
                  h-full transition-all duration-1000 ease-linear
                  ${
                    isCritical
                      ? "bg-gradient-to-r from-red-400 to-red-500"
                      : isWarning
                        ? "bg-gradient-to-r from-orange-400 to-red-400"
                        : "bg-gradient-to-r from-yellow-400 to-orange-400"
                  }
                `}
                style={{
                  width: `${Math.max(0, Math.min(100, (timeLeft / 3600) * 100))}%`,
                }}
              />
            </div>
          )}
        </div>

        {timeLeft === 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-500/30 h-9">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
            <span className="text-xs font-medium text-red-300">Contest Ended</span>
          </div>
        )}
      </div>

      <ContestEditor problemId={problemId} contestId={contestId} />
    </div>
  )
}

export default ProblemPage
