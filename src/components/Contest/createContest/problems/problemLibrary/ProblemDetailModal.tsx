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
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <h2 className="text-lg sm:text-xl font-bold text-white pr-4 break-words">
            {isLoading ? "Loading Problem Details..." : problem?.title || "Problem Details"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              <p className="text-gray-400">Loading problem details...</p>
            </div>
          ) : problem ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Problem Info Badges */}
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                <span
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${
                    problem.difficulty === "EASY"
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                      : problem.difficulty === "MEDIUM"
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-cyan-400 font-medium px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  Rating: {problem.rating}
                </span>
                <span className="text-emerald-400 font-medium px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  Time: {problem.timeLimit}ms
                </span>
                <span className="text-blue-400 font-medium px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  Memory: {problem.memoryLimit}MB
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-cyan-500 rounded"></span>
                  Description
                </h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-3 sm:p-4 rounded-lg border border-cyan-500/20 text-sm sm:text-base">
                  {problem.description || "No description available"}
                </div>
              </div>

              {/* Input Format */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-cyan-500 rounded"></span>
                  Input Format
                </h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-3 sm:p-4 rounded-lg border border-cyan-500/20 text-sm sm:text-base">
                  {problem.inputFormat || "No input format specified"}
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-cyan-500 rounded"></span>
                  Output Format
                </h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-3 sm:p-4 rounded-lg border border-cyan-500/20 text-sm sm:text-base">
                  {problem.outputFormat || "No output format specified"}
                </div>
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-cyan-500 rounded"></span>
                  Constraints
                </h3>
                <div className="text-gray-300 whitespace-pre-wrap bg-gradient-to-br from-[#282c33] to-[#2a2e35] p-3 sm:p-4 rounded-lg border border-cyan-500/20 text-sm sm:text-base">
                  {problem.constraints || "No constraints specified"}
                </div>
              </div>

              {/* Example Test Cases */}
              {problem.testCases && problem.testCases.filter((tc) => !tc.isHidden).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-cyan-500 rounded"></span>
                    Example Test Cases
                  </h3>
                  <div className="space-y-4">
                    {problem.testCases
                      .filter((tc) => !tc.isHidden)
                      .map((testCase, index) => (
                        <div key={testCase.id || index} className="space-y-2">
                          <h4 className="font-medium text-cyan-400 text-sm sm:text-base">
                            Test Case {index + 1}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-gray-400 font-medium">Input:</p>
                              <pre className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] p-2 sm:p-3 rounded-lg whitespace-pre-wrap border border-cyan-500/20 text-white shadow-lg shadow-cyan-500/10 text-xs sm:text-sm overflow-x-auto">
                                {testCase.input || "No input provided"}
                              </pre>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-gray-400 font-medium">Output:</p>
                              <pre className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] p-2 sm:p-3 rounded-lg whitespace-pre-wrap border border-cyan-500/20 text-white shadow-lg shadow-cyan-500/10 text-xs sm:text-sm overflow-x-auto">
                                {testCase.output || "No output provided"}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-gray-400">No problem details available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailModal;
