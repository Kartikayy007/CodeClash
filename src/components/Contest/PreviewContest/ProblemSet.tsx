import React from "react";
import LabelButton from "@/components/ui/LabelButton";

interface Problem {
  id: string;
  title: string;
  rating: number;
  score: number;
  difficulty: string;
  status?: "SOLVED" | "UNSOLVED" | null;
}

interface ProblemSetProps {
  problems: Problem[];
  onSolveProblem: (problemId: string) => void;
  isLoading?: boolean;
}

// Shimmer loading component for problems
const ProblemSkeleton = () => (
  <div className="flex items-center justify-between bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 animate-pulse border border-cyan-500/20">
    <div className="flex-1">
      <div className="h-5 bg-cyan-500/20 rounded w-3/4 mb-3"></div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-1">
        <div className="h-4 bg-cyan-500/20 rounded w-24"></div>
        <div className="h-4 bg-cyan-500/20 rounded w-24"></div>
        <div className="h-4 bg-cyan-500/20 rounded w-20"></div>
      </div>
    </div>
    <div>
      <div className="h-9 bg-cyan-500/20 rounded w-24"></div>
    </div>
  </div>
);

const ProblemSet: React.FC<ProblemSetProps> = ({
  problems,
  onSolveProblem,
  isLoading = false,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <h2 className="text-3xl font-semibold mb-4 md:mb-6 text-white">Problem Set</h2>

      {isLoading ? (
        <div className="space-y-4">
          <ProblemSkeleton />
          <ProblemSkeleton />
          <ProblemSkeleton />
        </div>
      ) : problems.length > 0 ? (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-br from-[#282c33] to-[#2a2e35] rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-200"
            >
              <div className="flex-1 mb-3 md:mb-0">
                <h3 className="text-lg font-medium text-white">{problem.title}</h3>
                <div className="flex flex-wrap gap-2 md:gap-8 text-sm text-gray-400 mt-1">
                  <span className="text-cyan-400">Rating: {problem.rating}</span>
                  <span className="text-emerald-400">Score: {problem.score}</span>
                  <span
                    className={`${
                      problem.difficulty === "EASY"
                        ? "text-green-400"
                        : problem.difficulty === "MEDIUM"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>
              <div>
                <LabelButton
                  variant={problem.status === "SOLVED" ? "light" : "filled"}
                  onClick={() => onSolveProblem(problem.id)}
                >
                  {problem.status === "SOLVED" ? "Solved" : "Solve"}
                </LabelButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          No problems available in this contest
        </div>
      )}
    </div>
  );
};

export default ProblemSet;
