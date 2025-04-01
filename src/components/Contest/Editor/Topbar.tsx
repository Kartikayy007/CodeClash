'use client';

import React, { useState } from 'react';
import { Play, Send, Grid } from 'lucide-react';
import LabelButton from '@/components/ui/LabelButton';
import Loader from '@/components/ui/Loader';
import { fetchProblemList, ProblemPreview } from '@/features/battle/editor/api/problems';
import ProblemsSidebar from './ProblemsSidebar';

interface TopbarProps {
  onRun: () => void;
  onSubmit: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

const Topbar = ({
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false
}: TopbarProps) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [problems, setProblems] = useState<ProblemPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProblems = async () => {
    if (problems.length === 0) {
      try {
        setIsLoading(true);
        const response = await fetchProblemList(1, 20);
        setProblems(response.data.questions);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGridClick = () => {
    setShowSidebar(true);
  };

  const navigateToProblem = (problemId: string) => {
    window.location.href = `/contest/problem/${problemId}`;
  };

  return (
    <>
      <div className="h-16 bg-[#1C202A] rounded-lg flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 text-[#999] hover:bg-[#292C33] hover:text-[#fff] rounded-lg"
            onClick={handleGridClick}
          >
            <Grid size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <LabelButton
              onClick={onRun}
              variant="outlined"
              className="flex items-center gap-2 py-2"
              disabled={isRunning}
            >
              {isRunning ? (
                <div className="flex items-center justify-center w-12">
                  <Loader size="small" />
                </div>
              ) : (
                <>
                  <Play size={16} />
                  Run
                </>
              )}
            </LabelButton>
            <LabelButton
              onClick={onSubmit}
              variant="filled"
              className="flex items-center gap-2 px-4 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader size="small" />
                </div>
              ) : (
                <>
                  <Send size={16} />
                  Submit
                </>
              )}
            </LabelButton>
          </div>
        </div>
      </div>

      <ProblemsSidebar 
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        problems={problems}
        isLoading={isLoading}
        onProblemSelect={navigateToProblem}
        onFetchProblems={fetchProblems}
      />
    </>
  );
};

export default Topbar;
