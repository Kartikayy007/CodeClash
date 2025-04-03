"use client";

import React, { useState, useEffect, useCallback } from "react";
import { contestApi } from "@/features/contests/api/contestApi";
import { SubmissionItem } from "@/features/contests/types/contest.types";
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

interface MySubmissionsProps {
  contestId: string;
}

const SubmissionSkeleton = () => (
  <div className="grid grid-cols-5 p-4 items-center bg-[#1E2127] animate-pulse">
    <div className="h-5 bg-gray-700 rounded w-3/4"></div>
    <div className="h-5 bg-gray-700 rounded w-1/2"></div>
    <div className="h-5 bg-gray-700 rounded w-3/4"></div>
    <div className="h-5 bg-gray-700 rounded w-1/2"></div>
    <div className="h-5 bg-gray-700 rounded w-1/2"></div>
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

const MySubmissions: React.FC<MySubmissionsProps> = ({ contestId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Memoize fetchSubmissions to avoid infinite loops
  const fetchSubmissions = useCallback(async (requestedPage: number) => {
    console.log("Fetching submissions for page:", requestedPage);
    try {
      setIsLoading(true);
      setError(null);

      const response = await contestApi.getUserContestSubmissions(
        contestId,
        requestedPage,
      );
      console.log("API Response:", response);
      setSubmissions(response.submissions);

      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setError("Failed to load submissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [contestId]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    console.log("Page change requested to:", page);

    setCurrentPage(page);

    setTimeout(() => {
      fetchSubmissions(page);
    }, 0);
  };

  useEffect(() => {
    if (contestId) {
      setCurrentPage(1);
      fetchSubmissions(1);
    }
  }, [contestId, fetchSubmissions]);

  return (
    <div className="bg-[#1A1D24] rounded-lg p-6 mb-10">
      <div className="rounded-lg overflow-hidden">
        <h2 className="text-3xl font-semibold mb-6">My Submissions</h2>
        <div className="grid grid-cols-5 bg-[#282C33] p-4 text-sm font-medium text-white">
          <div>Problem</div>
          <div>Language</div>
          <div>Status</div>
          <div>Time</div>
          <div>Score</div>
        </div>

        <div className="space-y-2 mt-2">
          {isLoading ? (
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
            submissions.map((submission) => (
            <div
              key={submission.id}
              className="grid grid-cols-5 p-4 items-center bg-[#1E2127] hover:bg-[#282C33] transition-colors"
            >
                <div className="truncate flex items-center gap-1">
                  {submission.question?.title || "Unknown Problem"}
                  {submission.question?.difficulty && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        submission.question.difficulty === "EASY"
                          ? "bg-green-900/40 text-green-400"
                          : submission.question.difficulty === "MEDIUM"
                            ? "bg-yellow-900/40 text-yellow-400"
                            : "bg-red-900/40 text-red-400"
                      }`}
                    >
                      {submission.question.difficulty}
                    </span>
                  )}
                </div>
                <div>
                  {submission.language.charAt(0).toUpperCase() +
                    submission.language.slice(1)}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <span>{getStatusText(submission.status)}</span>
                </div>
                <div>
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
                <div>{submission.score !== null ? submission.score : "-"}</div>
            </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 text-gray-400">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`${currentPage === totalPages ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
            >
              <ChevronRight size={16} />
            </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
