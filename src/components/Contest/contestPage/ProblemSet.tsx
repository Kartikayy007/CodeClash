import React from "react";
import LabelButton from "@/components/ui/LabelButton";

interface Problem {
  id: string;
  title: string;
  rating: number;
  score: number;
  status: "SOLVED" | "UNSOLVED" | null;
}

interface ProblemSetProps {
  problems: Problem[];
  onSolveProblem: (problemId: string) => void;
}

const ProblemSet: React.FC<ProblemSetProps> = ({
  problems,
  onSolveProblem,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <h2 className="text-xl font-semibold text-white mb-6">Problem Set</h2>
      <div className="space-y-4">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="flex items-center justify-between bg-gradient-to-r from-white/5 to-white/10 hover:from-cyan-500/10 hover:to-blue-500/10 border border-cyan-500/10 rounded-lg p-4 transition-all duration-200 hover:scale-[1.01]"
          >
            <div>
              <h3 className="text-lg text-cyan-400 font-semibold mb-1">{problem.title}</h3>
              <div className="flex gap-6 text-sm">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 font-medium">
                  Rating: {problem.rating}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 font-medium">
                  Score: {problem.score}
                </span>
              </div>
            </div>
            <LabelButton
              variant={problem.status === "SOLVED" ? "light" : "filled"}
              onClick={() => onSolveProblem(problem.id)}
              className={`w-24 font-semibold transition-all duration-200 ${
                problem.status === "SOLVED"
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-none hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
              }`}
            >
              {problem.status === "SOLVED" ? "Solved" : "Solve"}
            </LabelButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSet;
