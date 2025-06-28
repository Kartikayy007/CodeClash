
interface PlayerRankCardProps {
  title: string
  value: number
  iconSrc: string
}

const PlayerRankCard = ({ title, value }: PlayerRankCardProps) => {
  const isCurrentRank = title.includes("Current") || title.includes("Your")

  return (
    <div className="group relative">
      {/* Outer glow effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${
          isCurrentRank ? "from-cyan-600 via-blue-600 to-purple-600" : "from-purple-600 via-pink-600 to-red-600"
        } rounded-xl blur-sm opacity-30 group-hover:opacity-60 transition-all duration-500`}
      ></div>

      {/* Main card */}
      <div
        className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl px-6 py-5 border-2 ${
          isCurrentRank
            ? "border-cyan-500/40 hover:border-cyan-400/70"
            : "border-purple-500/40 hover:border-purple-400/70"
        } transition-all duration-500 backdrop-blur-xl shadow-2xl ${
          isCurrentRank
            ? "shadow-cyan-500/20 hover:shadow-cyan-500/40"
            : "shadow-purple-500/20 hover:shadow-purple-500/40"
        } min-w-[180px] group-hover:scale-105 group-hover:-translate-y-1`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              isCurrentRank
                ? "from-cyan-500/5 via-blue-500/5 to-purple-500/5"
                : "from-purple-500/5 via-pink-500/5 to-red-500/5"
            } animate-pulse`}
          ></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative flex items-center gap-4">
          

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white/80 font-semibold tracking-wide uppercase mb-1">{title}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-white/60 font-medium">#</span>
              <span
                className={`text-2xl font-black bg-gradient-to-r ${
                  isCurrentRank ? "from-cyan-300 via-blue-300 to-purple-300" : "from-purple-300 via-pink-300 to-red-300"
                } bg-clip-text text-transparent drop-shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {value.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/20 animate-ping"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-white/30"></div>

        {/* Bottom accent line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${
            isCurrentRank
              ? "from-transparent via-cyan-400/50 to-transparent"
              : "from-transparent via-purple-400/50 to-transparent"
          }`}
        ></div>
      </div>
    </div>
  )
}

export default PlayerRankCard
