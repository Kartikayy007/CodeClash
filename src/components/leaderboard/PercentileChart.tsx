"use client"

import { useMemo } from "react"
import { Trophy } from "lucide-react"

interface PercentileChartProps {
  userRank: number
  totalPlayers: number
  className?: string
}

export default function PercentileChart({ userRank, totalPlayers, className = "" }: PercentileChartProps) {
  const { chartData, userPercentile, userBin } = useMemo(() => {
    // Calculate user's percentile (0-100)
    const percentile = ((totalPlayers - userRank + 1) / totalPlayers) * 100

    // Create histogram bins (20 bins for smooth distribution)
    const numBins = 20
    const binSize = 100 / numBins
    const bins = Array(numBins).fill(0)

    // Simulate a realistic distribution (bell curve skewed toward lower percentiles)
    for (let i = 0; i < numBins; i++) {
      const binCenter = (i + 0.5) * binSize

      if (binCenter <= 20) {
        // Very few players in top 20%
        bins[i] = Math.max(1, Math.round(totalPlayers * 0.02 * Math.exp((-(binCenter - 10) * (binCenter - 10)) / 200)))
      } else if (binCenter <= 50) {
        // Moderate number in 20-50%
        bins[i] = Math.round(totalPlayers * 0.06 * (1 + Math.sin((binCenter - 35) / 10)))
      } else {
        // Most players in bottom 50%
        bins[i] = Math.round(totalPlayers * 0.08 * (1.5 - Math.abs(binCenter - 75) / 50))
      }
    }

    // Normalize bins to ensure they sum to approximately total players
    const currentSum = bins.reduce((sum, count) => sum + count, 0)
    const scaleFactor = totalPlayers / currentSum
    bins.forEach((count, i) => {
      bins[i] = Math.max(1, Math.round(count * scaleFactor))
    })

    // Find which bin the user falls into
    const userBinIndex = Math.min(numBins - 1, Math.floor(percentile / binSize))

    return {
      chartData: bins,
      userPercentile: percentile,
      userBin: userBinIndex,
    }
  }, [userRank, totalPlayers])

  const maxCount = Math.max(...chartData)

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 95) return "from-yellow-500 to-yellow-400"
    if (percentile >= 90) return "from-orange-500 to-orange-400"
    if (percentile >= 75) return "from-red-500 to-red-400"
    if (percentile >= 50) return "from-purple-500 to-purple-400"
    return "from-blue-500 to-blue-400"
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 backdrop-blur-sm ${className}`}
    >
      {/* Enhanced Histogram Chart */}
      <div className="relative">
        <div className="mb-2">
          <h4 className="text-white font-semibold text-sm mb-1">Player Distribution</h4>
          <p className="text-gray-400 text-xs">Your position among all players</p>
        </div>

        <div className="relative h-40 bg-[#0f1419] rounded-lg p-4 border border-gray-700/30 overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute w-full border-t border-gray-500" style={{ top: `${(i + 1) * 20}%` }} />
            ))}
          </div>

          <div className="flex items-end justify-between h-full gap-0.5 relative z-10">
            {chartData.map((count, index) => {
              const height = (count / maxCount) * 100
              const isUserBin = index === userBin
              const binStart = index * (100 / chartData.length)
              const binEnd = (index + 1) * (100 / chartData.length)

              return (
                <div key={index} className="relative flex-1 flex flex-col justify-end group cursor-pointer">
                  {/* Bar with enhanced styling */}
                  <div
                    className={`w-full transition-all duration-500 ease-out rounded-t-sm relative overflow-hidden ${
                      isUserBin
                        ? `bg-gradient-to-t ${getPercentileColor(userPercentile)} shadow-lg animate-pulse`
                        : "bg-gradient-to-t from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                    }`}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Shimmer effect for user bar */}
                    {isUserBin && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    )}
                  </div>

                  {/* Enhanced tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 scale-95 group-hover:scale-100">
                    <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-gray-700 shadow-xl">
                      <div className="font-semibold text-cyan-400">
                        {binStart.toFixed(0)}% - {binEnd.toFixed(0)}%
                      </div>
                      <div className="text-gray-300">{formatNumber(count)} players</div>
                      {isUserBin && (
                        <div className="text-yellow-400 font-semibold mt-1 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          You are here
                        </div>
                      )}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* User position indicator line */}
          <div
            className={`absolute bottom-0 w-0.5 bg-gradient-to-t ${getPercentileColor(userPercentile)} opacity-90 transition-all duration-500`}
            style={{
              left: `${(userPercentile / 100) * 100}%`,
              height: "100%",
              transform: "translateX(-50%)",
              boxShadow: `0 0 10px rgba(255, 255, 255, 0.3)`,
            }}
          >
            {/* Floating percentile indicator */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div
                className={`bg-gradient-to-r ${getPercentileColor(userPercentile)} text-white text-xs rounded-full px-3 py-1 font-bold shadow-lg`}
              >
                {userPercentile.toFixed(1)}%
              </div>
              <div
                className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-yellow-400`}
              />
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-3 text-xs text-gray-400 font-mono">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-white/5 rounded-lg border border-gray-700/30">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-t from-gray-700 to-gray-600 rounded-sm shadow-sm" />
          <span className="text-gray-300 text-sm">Other players</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 bg-gradient-to-t ${getPercentileColor(userPercentile)} rounded-sm shadow-sm`} />
          <span className="text-white text-sm font-medium">Your position</span>
        </div>
      </div>
    </div>
  )
}
