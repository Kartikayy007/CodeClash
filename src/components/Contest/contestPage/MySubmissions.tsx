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
  <div className="grid grid-cols-5 p-4 items-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse rounded-lg border border-cyan-500/10">
    <div className="h-5 bg-cyan-500/20 rounded w-3/4"></div>
    <div className="h-5 bg-cyan-500/10 rounded w-1/2"></div>
    <div className="h-5 bg-cyan-500/10 rounded w-3/4"></div>
    <div className="h-5 bg-cyan-500/10 rounded w-1/2"></div>
    <div className="h-5 bg-cyan-500/10 rounded w-1/2"></div>
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
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 mb-10 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="rounded-lg overflow-hidden">
        <h2 className="text-3xl font-semibold text-white mb-6">My Submissions</h2>
        <div className="grid grid-cols-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 text-sm font-semibold text-cyan-400 uppercase tracking-wider">
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
            <div className="text-center py-8 text-cyan-400/60">
              No submissions yet
            </div>
          ) : (
            submissions.map((submission) => (
            <div
              key={submission.id}
              className="grid grid-cols-5 p-4 items-center bg-gradient-to-r from-white/5 to-white/10 hover:from-cyan-500/10 hover:to-blue-500/10 border border-cyan-500/10 rounded-lg transition-all duration-200 hover:scale-[1.01]"
            >
                <div className="truncate flex items-center gap-2">
                  <span className="font-medium text-white">
                    {submission.question?.title || "Unknown Problem"}
                  </span>
                  {submission.question?.difficulty && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold border transition-all duration-200 ${
                        submission.question.difficulty === "EASY"
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
                          : submission.question.difficulty === "MEDIUM"
                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {submission.question.difficulty}
                    </span>
                  )}
                </div>
                <div className="text-cyan-400 font-medium">
                  {submission.language.charAt(0).toUpperCase() +
                    submission.language.slice(1)}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status)}
                  <span className={`font-semibold text-xs px-2 py-0.5 rounded-full border transition-all duration-200 ${
                    submission.status === "ACCEPTED"
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
                      : submission.status === "WRONG_ANSWER"
                        ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30"
                        : submission.status === "TIME_LIMIT_EXCEEDED"
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30"
                  }`}>
                    {getStatusText(submission.status)}
                  </span>
                </div>
                <div className="text-gray-300 font-mono text-xs">
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
                <div className="text-emerald-400 font-bold">
                  {submission.score !== null ? submission.score : "-"}
                </div>
            </div>
            ))
          )}
        </div>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? "bg-cyan-500/20 text-cyan-400/40 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 shadow-lg shadow-cyan-500/25"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center px-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
            <span className="text-cyan-400 font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-cyan-500/20 text-cyan-400/40 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:scale-105 shadow-lg shadow-cyan-500/25"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
