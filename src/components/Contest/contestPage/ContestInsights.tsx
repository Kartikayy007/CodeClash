import React from "react";

interface ContestInsightsData {
  rank: number;
  score: number;
  totalQuestions: number;
  solved: number;
  unsolved: number;
  attempted: number;
  submissions: number;
}

interface ContestInsightsProps {
  insights: ContestInsightsData;
  isLoading?: boolean;
}

// Skeleton loading for insights
const InsightSkeleton = () => (
  <div className="flex justify-between animate-pulse py-2">
    <div className="h-4 bg-cyan-500/20 rounded w-24"></div>
    <div className="h-4 bg-cyan-500/10 rounded w-8"></div>
  </div>
);

const ContestInsights: React.FC<ContestInsightsProps> = ({
  insights,
  isLoading = false,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 lg:p-8 h-fit mb-10 lg:mb-0 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <h2 className="text-xl font-semibold text-white mb-4">Insights</h2>

      {isLoading ? (
        <div className="space-y-4">
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-400">Your Rank:</span>
            <span className="font-medium text-cyan-400">{insights.rank}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-400">Score:</span>
            <span className="font-medium text-emerald-400">{insights.score}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-400">Total Questions:</span>
            <span className="font-medium text-blue-400">{insights.totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-400">Solved:</span>
            <span className="font-medium text-green-400">
              {insights.solved}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-400">Unsolved:</span>
            <span className="font-medium text-red-400">
              {insights.unsolved}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-400">Attempted:</span>
            <span className="font-medium text-blue-400">
              {insights.attempted}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-gray-400">No. of Submissions:</span>
            <span className="font-medium text-purple-400">{insights.submissions}</span>
          </div>

          {/* Progress bar showing solved/total questions */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-cyan-400 font-semibold">
                {Math.round((insights.solved / insights.totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full h-2.5 border border-cyan-500/30">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25"
                style={{
                  width: `${(insights.solved / insights.totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestInsights;
