import type { LeaderboardPlayer } from "@/features/home/leaderboard/types/leaderboard.types"
import { Trophy, User, Zap, TrendingUp } from "lucide-react"

interface PlayerListProps {
  players: LeaderboardPlayer[]
}

const PlayerList = ({ players }: PlayerListProps) => (
  <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/20 backdrop-blur-sm shadow-lg shadow-cyan-500/5 overflow-hidden">
    {/* Header */}
    <div className="grid grid-cols-3 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20">
      <div className="flex items-center gap-2 text-cyan-400 font-bold">
        <TrendingUp className="w-4 h-4" />
        Rank
      </div>
      <div className="flex items-center gap-2 text-cyan-400 font-bold">
        <User className="w-4 h-4" />
        Player
      </div>
      <div className="flex items-center gap-2 text-cyan-400 font-bold">
        <Trophy className="w-4 h-4" />
        Victories
      </div>
    </div>

    {/* Player rows */}
    <div className="divide-y divide-cyan-500/10">
      {players.map((player, index) => {
        const isTopTier = player.wins > 50
        const isElite = player.wins > 100

        return (
          <div
            key={player.id}
            className="group grid grid-cols-3 p-4 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden"
          >
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>

            {/* Rank */}
            <div className="relative z-10 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  index < 3
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30"
                    : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 group-hover:border-cyan-400/50"
                }`}
              >
                #{index + 1}
              </div>
            </div>

            {/* Player name */}
            <div className="relative z-10 flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/30">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-300">
                    {player.username}
                  </div>
                </div>
              </div>
            </div>

            {/* Victories */}
            <div className="relative z-10 flex items-center">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold text-lg">{player.wins}</span>
              </div>
            </div>


            {/* Hover glow effect */}
            <div className="absolute inset-0 border border-transparent group-hover:border-cyan-500/30 rounded-lg transition-all duration-300"></div>

            {/* Particle effects */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
          </div>
        )
      })}
    </div>
  </div>
)

export default PlayerList
