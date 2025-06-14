import Image from "next/image"
import { TrendingUp, Award } from "lucide-react"

interface PlayerRankCardProps {
  title: string
  value: number
  iconSrc: string
}

const PlayerRankCard = ({ title, value, iconSrc }: PlayerRankCardProps) => {
  const isCurrentRank = title.includes("Current")

  return (
    <div className="group relative">
      {/* Animated background glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          isCurrentRank ? "from-cyan-500/20 to-blue-500/20" : "from-purple-500/20 to-pink-500/20"
        } rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      <div
        className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 border ${
          isCurrentRank
            ? "border-cyan-500/30 hover:border-cyan-400/50"
            : "border-purple-500/30 hover:border-purple-400/50"
        } transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg ${
          isCurrentRank
            ? "shadow-cyan-500/5 hover:shadow-cyan-500/20"
            : "shadow-purple-500/5 hover:shadow-purple-500/20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          {isCurrentRank ? (
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          ) : (
            <Award className="w-5 h-5 text-purple-400" />
          )}
          <h3 className={`font-bold ${isCurrentRank ? "text-cyan-400" : "text-purple-400"} group-hover:animate-pulse`}>
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div
              className={`text-5xl font-bold bg-gradient-to-r ${
                isCurrentRank ? "from-cyan-400 to-blue-400" : "from-purple-400 to-pink-400"
              } bg-clip-text text-transparent group-hover:animate-pulse`}
            >
              #{value}
            </div>
            <div className="text-sm text-white/60 mt-1 font-medium">
              {isCurrentRank ? "Global Position" : "Peak Achievement"}
            </div>
          </div>

          <div className="relative w-20 h-20">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                isCurrentRank ? "from-cyan-500/20 to-blue-500/20" : "from-purple-500/20 to-pink-500/20"
              } group-hover:animate-pulse`}
            ></div>
            <Image
              src={iconSrc || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Animated particles */}
        <div className="absolute top-3 right-3 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
        <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-300 opacity-0 group-hover:opacity-100"></div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  )
}

export default PlayerRankCard
