import type React from "react"
import type { LeaderboardPlayer } from "@/features/home/leaderboard/types/leaderboard.types"
import { Crown, Trophy, Award, Star } from "lucide-react"

interface TopPlayersProps {
  topPlayers: LeaderboardPlayer[]
}

const TopPlayers: React.FC<TopPlayersProps> = ({ topPlayers }) => {
  const getMedalConfig = (index: number) => {
    switch (index) {
      case 0:
        return {
          gradient: "from-yellow-400 via-yellow-500 to-yellow-600",
          shadow: "shadow-yellow-500/30",
          border: "border-yellow-400/50",
          icon: Crown,
          glow: "shadow-yellow-400/20",
          textGradient: "from-yellow-400 to-yellow-600",
        }
      case 1:
        return {
          gradient: "from-gray-300 via-gray-400 to-gray-500",
          shadow: "shadow-gray-400/30",
          border: "border-gray-400/50",
          icon: Trophy,
          glow: "shadow-gray-400/20",
          textGradient: "from-gray-300 to-gray-500",
        }
      case 2:
        return {
          gradient: "from-amber-600 via-amber-700 to-amber-800",
          shadow: "shadow-amber-600/30",
          border: "border-amber-600/50",
          icon: Award,
          glow: "shadow-amber-600/20",
          textGradient: "from-amber-600 to-amber-800",
        }
      default:
        return {
          gradient: "from-cyan-400 to-blue-500",
          shadow: "shadow-cyan-500/30",
          border: "border-cyan-500/50",
          icon: Star,
          glow: "shadow-cyan-500/20",
          textGradient: "from-cyan-400 to-blue-500",
        }
    }
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          🏆 Hall of Fame
        </h2>
        <p className="text-cyan-300/60">The ultimate coding champions</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Podium arrangement: 2nd, 1st, 3rd */}
        {topPlayers.length >= 3 && [topPlayers[1], topPlayers[0], topPlayers[2]].map((player, displayIndex) => {
          const actualIndex = topPlayers.indexOf(player)
          const config = getMedalConfig(actualIndex)
          const IconComponent = config.icon
          
          // Add podium height classes
          const podiumHeight = actualIndex === 0 ? 'lg:mt-0' : actualIndex === 1 ? 'lg:mt-8' : 'lg:mt-12'

          return (
            <div
              key={player.id}
              className={`group relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 border ${config.border} transition-all duration-500 hover:scale-105 hover:${config.shadow} hover:shadow-2xl cursor-pointer backdrop-blur-sm overflow-hidden ${podiumHeight}`}
            >
              {/* Animated background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              {/* Rank indicator */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center ${config.glow} shadow-lg`}
                >
                  <span className="text-white font-bold text-sm">#{actualIndex + 1}</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* Medal/Icon */}
                <div
                  className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center ${config.glow} shadow-xl group-hover:animate-pulse`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                  {/* Rotating ring */}
                  <div
                    className={`absolute inset-0 rounded-full border-2 ${config.border} animate-spin`}
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-xl font-bold bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent truncate group-hover:animate-pulse`}
                  >
                    {player.username}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Trophy className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 font-medium">{player.wins} Victories</span>
                  </div>

                  {/* Win streak indicator */}
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, Math.floor(player.wins / 10)) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-cyan-400/60 ml-1">Elite Status</span>
                  </div>
                </div>
              </div>

              {/* Animated border */}
              <div
                className={`absolute inset-0 rounded-xl border ${config.border} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Particle effect */}
              <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-300"></div>
            </div>
          )
        })}
        
        {/* Render remaining players (4th and beyond) normally */}
        {topPlayers.slice(3).map((player, index) => {
          const actualIndex = index + 3
          const config = getMedalConfig(actualIndex)
          const IconComponent = config.icon

          return (
            <div
              key={player.id}
              className={`group relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 border ${config.border} transition-all duration-500 hover:scale-105 hover:${config.shadow} hover:shadow-2xl cursor-pointer backdrop-blur-sm overflow-hidden`}
            >
              {/* Animated background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              {/* Rank indicator */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center ${config.glow} shadow-lg`}
                >
                  <span className="text-white font-bold text-sm">#{actualIndex + 1}</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* Medal/Icon */}
                <div
                  className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center ${config.glow} shadow-xl group-hover:animate-pulse`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                  {/* Rotating ring */}
                  <div
                    className={`absolute inset-0 rounded-full border-2 ${config.border} animate-spin`}
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>

                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-xl font-bold bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent truncate group-hover:animate-pulse`}
                  >
                    {player.username}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Trophy className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 font-medium">{player.wins} Victories</span>
                  </div>

                  {/* Win streak indicator */}
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, Math.floor(player.wins / 10)) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-cyan-400/60 ml-1">Elite Status</span>
                  </div>
                </div>
              </div>

              {/* Animated border */}
              <div
                className={`absolute inset-0 rounded-xl border ${config.border} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Particle effect */}
              <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-300"></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopPlayers
