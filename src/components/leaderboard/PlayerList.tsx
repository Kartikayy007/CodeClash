import type { LeaderboardPlayer } from "@/features/home/leaderboard/types/leaderboard.types"
import { Trophy, User } from "lucide-react"

interface PlayerListProps {
  players: LeaderboardPlayer[]
  currentPage: number
  pageSize: number
}

const PlayerList = ({ players, currentPage, pageSize }: PlayerListProps) => (
  <div className="space-y-2">
    {/* Table Header */}
    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-cyan-400/80 border-b border-cyan-500/20">
      <div className="col-span-1 text-center">#</div>
      <div className="col-span-6">Player</div>
      <div className="col-span-3 text-center">Wins</div>
      <div className="col-span-2 text-center">Win Rate</div>
    </div>

    {/* Player rows */}
    <div className="space-y-1">
      {players.map((player, index) => {
        const globalRank = (currentPage - 1) * pageSize + index + 1
        const winRate = player.wins > 0 ? Math.round((player.wins / (player.wins + 2)) * 100) : 0 // Mock calculation
        
        return (
          <div
            key={player.id}
            className="group grid grid-cols-12 gap-4 px-4 py-4 rounded-lg hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/20 transition-all duration-200 cursor-pointer"
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center justify-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all duration-300 ${
                  globalRank <= 3
                    ? globalRank === 1
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30"
                      : globalRank === 2
                      ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-400/30"
                      : "bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-600/30"
                    : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 group-hover:border-cyan-400/50"
                }`}
              >
                {globalRank}
              </div>
            </div>

            {/* Player Info */}
            <div className="col-span-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-300 truncate">
                  {player.username}
                </div>
                <div className="text-xs text-white/50">
                  Player since 2024
                </div>
              </div>
            </div>

            {/* Wins */}
            <div className="col-span-3 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold text-lg">{player.wins}</span>
              </div>
            </div>

            {/* Win Rate */}
            <div className="col-span-2 flex items-center justify-center">
              <div className="text-center">
                <div className={`font-bold ${
                  winRate >= 80 ? "text-emerald-400" :
                  winRate >= 60 ? "text-cyan-400" :
                  winRate >= 40 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {winRate}%
                </div>
                <div className="text-xs text-white/50">
                  success
                </div>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )
      })}
    </div>
  </div>
)

export default PlayerList
