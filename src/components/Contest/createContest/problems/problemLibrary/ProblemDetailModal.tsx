import React from "react";
import { X, Loader2 } from "lucide-react";
import { Problem } from "@/features/battle/editor/api/problems";

interface ProblemDetailModalProps {
  problem?: Problem;
  isLoading?: boolean;
  onClose: () => void;
}

const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  isLoading = false,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] w-[800px] max-h-[80vh] rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <h2 className="text-xl font-bold text-white">
            {isLoading ? "Loading..." : problem?.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-lg font-medium ${
                    problem?.difficulty === "EASY"
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                      : problem?.difficulty === "MEDIUM"
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {problem?.difficulty}
                </span>
                <span className="text-cyan-400 font-medium">Rating: {problem?.rating}</span>
                <span className="text-emerald-400 font-medium">
                  Time Limit: {problem?.timeLimit}ms
                </span>
                <span className="text-blue-400 font-medium">
                  Memory Limit: {problem?.memoryLimit}MB
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-4 rounded-lg border border-cyan-500/20">
                  {problem?.description}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Input Format</h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-4 rounded-lg border border-cyan-500/20">
                  {problem?.inputFormat}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Output Format</h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-4 rounded-lg border border-cyan-500/20">
                  {problem?.outputFormat}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Constraints</h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-4 rounded-lg border border-cyan-500/20">
                  {problem?.constraints}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Example Test Cases</h3>
                <div className="space-y-4">
                  {problem?.testCases
                    .filter((tc) => !tc.isHidden)
                    .map((testCase, index) => (
                      <div key={testCase.id} className="space-y-2">
                        <h4 className="font-medium text-cyan-400">Test Case {index + 1}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400 font-medium">Input:</p>
                            <pre className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] p-3 rounded-lg whitespace-pre-wrap border border-cyan-500/20 text-white shadow-lg shadow-cyan-500/10">
                              {testCase.input}
                            </pre>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400 font-medium">Output:</p>
                            <pre className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] p-3 rounded-lg whitespace-pre-wrap border border-cyan-500/20 text-white shadow-lg shadow-cyan-500/10">
                              {testCase.output}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailModal;
