import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import LabelButton from '@/components/ui/LabelButton';
import Loader from '@/components/ui/Loader';
import { ProblemPreview } from '@/features/battle/editor/api/problems';

interface ProblemsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  problems: ProblemPreview[];
  isLoading: boolean;
  onProblemSelect: (problemId: string) => void;
  onFetchProblems: () => void;
}

const ProblemsSidebar: React.FC<ProblemsSidebarProps> = ({
  isOpen,
  onClose,
  problems,
  isLoading,
  onProblemSelect,
  onFetchProblems
}) => {
  useEffect(() => {
    if (isOpen) {
      onFetchProblems();
    }
  }, [isOpen, onFetchProblems]);

  // Handle navigation to a problem
  const handleProblemSelect = (problemId: string) => {
    onProblemSelect(problemId);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>
      
      <div 
        className={`fixed left-0 top-0 h-full w-96 bg-[#1C202A] shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-xl font-semibold">Problems</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="medium" />
            </div>
          ) : problems.length > 0 ? (
            <div className="space-y-4">
              {problems.map((problem) => (
                <div key={problem.id} className="bg-[#292C33] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{problem.title}</h3>
                    <span className="text-gray-400 text-sm">Rating: {problem.rating}</span>
                  </div>
                  <div className="mt-4">
                    <LabelButton
                      onClick={() => handleProblemSelect(problem.id)}
                      variant="filled"
                      className="text-sm py-1"
                    >
                      Solve
                    </LabelButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No problems found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsSidebar; 