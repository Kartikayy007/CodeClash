import React, { useEffect } from "react";
import { X } from "lucide-react";
import LabelButton from "@/components/ui/LabelButton";
// import Loader from "@/components/ui/Loader";
import { ProblemPreview } from "@/features/battle/editor/api/problems";

interface ProblemsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  problems: ProblemPreview[];
  isLoading: boolean;
  onProblemSelect: (problemId: string) => void;
  onFetchProblems: () => void;
}

// Helper function to get difficulty based on rating
const getDifficulty = (rating: number): { label: string; color: string } => {
  if (rating < 1000) {
    return { label: "Easy", color: "text-green-500" };
  } else if (rating < 2000) {
    return { label: "Medium", color: "text-yellow-500" };
  } else {
    return { label: "Hard", color: "text-red-500" };
  }
};

// Skeleton loading component for problem cards
const ProblemCardSkeleton = () => (
  <div className="bg-[#292C33] rounded-lg p-4 animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="h-6 bg-gray-700 rounded w-3/5"></div>
      <div className="flex flex-col items-end">
        <div className="h-4 bg-gray-700 rounded w-16 mb-1"></div>
        <div className="h-3 bg-gray-700 rounded w-20"></div>
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className="h-4 bg-gray-700 rounded w-20"></div>
      <div className="h-8 bg-gray-700 rounded w-16"></div>
    </div>
  </div>
);

const ProblemsSidebar: React.FC<ProblemsSidebarProps> = ({
  isOpen,
  onClose,
  problems,
  isLoading,
  onProblemSelect,
  onFetchProblems,
}) => {
  useEffect(() => {
    // Only fetch problems when the sidebar opens and we don't have problems yet
    if (isOpen && problems.length === 0 && !isLoading) {
      onFetchProblems();
    }
  }, [isOpen, problems.length, isLoading, onFetchProblems]);

  // Handle navigation to a problem
  const handleProblemSelect = (problemId: string) => {
    onProblemSelect(problemId);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed left-0 top-0 h-full w-96 bg-[#1C202A] shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-xl font-semibold">Contest Problems</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <ProblemCardSkeleton key={index} />
              ))}
            </div>
          ) : problems.length > 0 ? (
            <div className="space-y-4">
              {problems.map((problem) => {
                const difficulty = getDifficulty(problem.rating);
                return (
                  <div key={problem.id} className="bg-[#292C33] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium text-lg">
                        {problem.title}
                      </h3>
                      <div className="flex flex-col items-end">
                        <span
                          className={`${difficulty.color} text-sm font-medium`}
                        >
                          {difficulty.label}
                        </span>
                        <span className="text-gray-400 text-xs mt-1">
                          Rating: {problem.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-300 text-sm">
                        Score: {problem.score}
                      </span>
                      <LabelButton
                        onClick={() => handleProblemSelect(problem.id)}
                        variant="filled"
                        className="text-sm py-1"
                      >
                        Solve
                      </LabelButton>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No problems found in this contest
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsSidebar;
