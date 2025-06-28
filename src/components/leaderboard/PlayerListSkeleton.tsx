const PlayerListSkeleton = () => (
  <div className="space-y-2">
    {/* Table Header */}
    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-cyan-400/80 border-b border-cyan-500/20">
      <div className="col-span-1 text-center">#</div>
      <div className="col-span-6">Player</div>
      <div className="col-span-3 text-center">Wins</div>
      <div className="col-span-2 text-center">Win Rate</div>
    </div>

    {/* Skeleton rows */}
    <div className="space-y-1">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-4 px-4 py-4 rounded-lg animate-pulse"
        >
          {/* Rank skeleton */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20" />
          </div>

          {/* Player Info skeleton */}
          <div className="col-span-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="h-4 w-24 bg-cyan-500/20 rounded" />
              <div className="h-3 w-16 bg-cyan-500/10 rounded" />
            </div>
          </div>

          {/* Wins skeleton */}
          <div className="col-span-3 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400/20 rounded" />
              <div className="h-5 w-8 bg-cyan-500/20 rounded" />
            </div>
          </div>

          {/* Win Rate skeleton */}
          <div className="col-span-2 flex items-center justify-center">
            <div className="text-center space-y-1">
              <div className="h-4 w-12 bg-cyan-500/20 rounded mx-auto" />
              <div className="h-3 w-16 bg-cyan-500/10 rounded mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default PlayerListSkeleton
