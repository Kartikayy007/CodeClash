"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Check,
  X,
  AlertTriangle,
  Clock,
  Settings,
  BarChart,
  Lock,
  Infinity,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { contestApi } from "@/features/contests/api/contestApi";
import { SubmissionItem } from "@/features/contests/types/contest.types";
import SubmissionDetails from "./SubmissionDetails";

interface SubmissionsProps {
  problemId: string;
  contestId: string;
  onSelectSubmission?: (id: string) => void;
}

// Skeleton loading component for submissions
const SubmissionSkeleton = () => (
  <div className="w-full grid grid-cols-4 p-4 mb-4 rounded-lg bg-[#1A1D24] items-center border border-[#2A2A2A] animate-pulse">
    <div className="h-5 bg-gray-700 rounded w-3/4"></div>
    <div className="h-5 bg-gray-700 rounded w-1/2 mx-auto"></div>
    <div className="flex items-center justify-center">
      <div className="h-5 bg-gray-700 rounded w-20"></div>
    </div>
    <div className="h-5 bg-gray-700 rounded w-8 mx-auto"></div>
  </div>
);

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return <Check className="w-4 h-4 text-green-500" />;
    case "TIME_LIMIT_EXCEEDED":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "RUNTIME_ERROR":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "WRONG_ANSWER":
      return <X className="w-4 h-4 text-red-500" />;
    case "COMPILATION_ERROR":
      return <Settings className="w-4 h-4 text-blue-500" />;
    case "MEMORY_LIMIT_EXCEEDED":
      return <BarChart className="w-4 h-4 text-purple-500" />;
    case "SEGMENTATION_FAULT":
      return <Lock className="w-4 h-4 text-orange-500" />;
    case "INFINITE_LOOP":
      return <Infinity className="w-4 h-4 text-red-500" />;
    default:
      return <HelpCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "TIME_LIMIT_EXCEEDED":
      return "Time Limit Exceeded";
    case "RUNTIME_ERROR":
      return "Runtime Error";
    case "WRONG_ANSWER":
      return "Wrong Answer";
    case "COMPILATION_ERROR":
      return "Compilation Error";
    case "MEMORY_LIMIT_EXCEEDED":
      return "Memory Limit Exceeded";
    case "SEGMENTATION_FAULT":
      return "Segmentation Fault";
    case "INFINITE_LOOP":
      return "Infinite Loop";
    default:
      return "Undefined Behavior";
  }
};

const Submissions = ({
  contestId,
  problemId,
  onSelectSubmission,
}: SubmissionsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionItem | null>(null);

  const fetchSubmissions = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update the UI immediately to provide feedback
      setCurrentPage(page);

      // Use the API endpoint with page parameter
      const response = await contestApi.getQuestionSubmissions(
        contestId,
        problemId,
        page,
      );
      setSubmissions(response.submissions);

      // Set pagination data from response
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        // Don't update currentPage from response as we've already set it
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setError("Failed to load submissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [contestId, problemId]);

  useEffect(() => {
    if (contestId && problemId) {
      fetchSubmissions(1);
    }
  }, [contestId, problemId, fetchSubmissions]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchSubmissions(page);
  };

  const handleSubmissionClick = (submission: SubmissionItem) => {
    setSelectedSubmission(submission);
    if (onSelectSubmission) {
      onSelectSubmission(submission.id);
    }
  };

  // If a submission is selected, show its details
  if (selectedSubmission) {
    return (
      <SubmissionDetails
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
      />
    );
  }

  return (
    <div className="h-full bg-[#1C202A] text-white">
      <div className="grid grid-cols-4 p-4 text-lg font-semibold text-white">
        <div className="text-center">Time</div>
        <div className="text-center">Language</div>
        <div className="text-center">Status</div>
        <div className="text-center">Score</div>
      </div>

      <div className="px-6">
        <div className="rounded-lg overflow-hidden">
          {isLoading ? (
            // Skeleton loading state
            <>
              <SubmissionSkeleton />
              <SubmissionSkeleton />
              <SubmissionSkeleton />
            </>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No submissions yet
            </div>
          ) : (
            <>
              {submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => handleSubmissionClick(submission)}
                  className="w-full grid grid-cols-4 p-4 mb-4 rounded-lg bg-[#1A1D24] items-center border border-[#5D5D5D] text-[#5D5D5D] hover:border-gray-400 hover:text-gray-400 transition-colors"
                >
                  <div className="text-sm">
                    {new Date(submission.createdAt)
                      .toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(",", "")}
                  </div>
                  <div className="text-sm text-center">
                    {submission.language.charAt(0).toUpperCase() +
                      submission.language.slice(1)}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">
                      {getStatusIcon(submission.status)}
                    </span>
                    <span className="text-sm">
                      {getStatusText(submission.status)}
                    </span>
                  </div>
                  <div className="text-sm text-center">
                    {submission.score !== null ? submission.score : "-"}
                  </div>
                </button>
              ))}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 mb-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 hover:bg-[#292C33] hover:text-white"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 hover:bg-[#292C33] hover:text-white"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
