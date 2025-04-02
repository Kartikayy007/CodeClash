"use client";

import React, { useState, useCallback } from "react";
import { Play, Send, Grid } from "lucide-react";
import LabelButton from "@/components/ui/LabelButton";
import Loader from "@/components/ui/Loader";
import ProblemsSidebar from "./ProblemsSidebar";
import { contestApi } from "@/features/contests/api/contestApi";
import { ProblemPreview } from "@/features/battle/editor/api/problems";

interface TopbarProps {
  onRun: () => void;
  onSubmit: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  contestId: string;
}

const Topbar = ({
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  contestId,
}: TopbarProps) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [contestQuestions, setContestQuestions] = useState<ProblemPreview[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchContestQuestions = useCallback(async () => {
    if (contestId && !hasLoaded) {
      try {
        setIsLoading(true);
        const contestResponse = await contestApi.getContestDetails(contestId);

        // Map contest questions to ProblemPreview format
        if (contestResponse.contest?.questions) {
          const formattedQuestions: ProblemPreview[] =
            contestResponse.contest.questions.map((question) => ({
              id: question.id,
              title: question.title,
              rating: question.rating,
              score: question.score,
              createdAt: new Date().toISOString(),
            }));
          setContestQuestions(formattedQuestions);
          setHasLoaded(true);
        }
      } catch (error) {
        console.error("Failed to fetch contest questions:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [contestId, hasLoaded]);

  const handleGridClick = () => {
    setShowSidebar(true);
  };

  const navigateToProblem = (problemId: string) => {
    window.location.href = `/contest/${contestId}/problem/${problemId}`;
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
              disabled={isRunning || isSubmitting}
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
              disabled={isSubmitting || isRunning}
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
        problems={contestQuestions}
        isLoading={isLoading}
        onProblemSelect={navigateToProblem}
        onFetchProblems={fetchContestQuestions}
      />
    </>
  );
};

export default Topbar;
