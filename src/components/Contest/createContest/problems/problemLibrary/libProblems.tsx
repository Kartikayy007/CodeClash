"use client";

import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import LabelButton from "@/components/ui/LabelButton";
import {
  fetchProblem,
  fetchProblemList,
  Problem,
  ProblemPreview,
} from "@/features/battle/editor/api/problems";
import toast from "react-hot-toast";
import ProblemDetailModal from "./ProblemDetailModal";
import { Problem as ContestProblem } from "@/types/problem.types";

interface LibProblemsProps {
  onBack: () => void;
  onAddProblems: (selectedProblems: ContestProblem[]) => void;
}

const LibProblems: React.FC<LibProblemsProps> = ({ onBack, onAddProblems }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedProblems, setSelectedProblems] = useState<Set<string>>(
    new Set(),
  );
  const [problems, setProblems] = useState<ProblemPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProblemDetails, setSelectedProblemDetails] = useState<{
    [key: string]: Problem;
  }>({});
  const [viewingProblem, setViewingProblem] = useState<Problem | null>(null);
  const [loadingProblemDetail, setLoadingProblemDetail] = useState(false);

  const [ratingFilter, setRatingFilter] = useState("all");
  const [customRating, setCustomRating] = useState({ from: "", to: "" });

  const fetchProblems = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchProblemList(currentPage, 10);
      setProblems(response.data.questions);
      setTotalPages(response.data.meta.totalPages);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch problems",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  React.useEffect(() => {
    fetchProblems();
  }, [fetchProblems, currentPage]);

  const handleToggleSelect = async (problemId: string) => {
    const newSelected = new Set(selectedProblems);

    if (newSelected.has(problemId)) {
      newSelected.delete(problemId);
    } else {
      if (!selectedProblemDetails[problemId]) {
        try {
          const problemDetail = await fetchProblem(problemId);
          setSelectedProblemDetails((prev) => ({
            ...prev,
            [problemId]: problemDetail,
          }));
        } catch (error: unknown) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to fetch problem details",
          );
          return;
        }
      }
      newSelected.add(problemId);
    }

    setSelectedProblems(newSelected);
  };

  const handleAddSelected = () => {
    const selectedProblemsList = Array.from(selectedProblems).map((id) => {
      const problem = selectedProblemDetails[id];
      return {
        name: problem.title,
        title: problem.title,
        maxScore: 100,
        score: 0,
        rating: problem.rating,
        description: problem.description,
        inputFormat: problem.inputFormat,
        constraints: problem.constraints,
        outputFormat: problem.outputFormat,
        testCases: problem.testCases.map((tc) => ({
          input: tc.input,
          output: tc.output,
          sample: !tc.isHidden,
          strength: 1,
        })),
      };
    });
    onAddProblems(selectedProblemsList);
  };

  const handleProblemClick = async (problemId: string) => {
    setLoadingProblemDetail(true);
    setViewingProblem(null);

    try {
      if (selectedProblemDetails[problemId]) {
        setViewingProblem(selectedProblemDetails[problemId]);
      } else {
        const problemDetail = await fetchProblem(problemId);
        setSelectedProblemDetails((prev) => ({
          ...prev,
          [problemId]: problemDetail,
        }));
        setViewingProblem(problemDetail);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch problem details",
      );
    } finally {
      setLoadingProblemDetail(false);
    }
  };

  const getFilteredProblems = (problems: ProblemPreview[]) => {
    return problems.filter((problem) => {
      if (
        searchQuery &&
        !problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      switch (ratingFilter) {
        case "less1000":
          return problem.rating < 1000;
        case "greater1000":
          return problem.rating >= 1000;
        case "greater1500":
          return problem.rating >= 1500;
        case "custom":
          const from = parseInt(customRating.from);
          const to = parseInt(customRating.to);
          if (!isNaN(from) && !isNaN(to)) {
            return problem.rating >= from && problem.rating <= to;
          }
          return true;
        default:
          return true;
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex-1 mx-8 ">
            <div className="relative flex justify-end">
              <Search
                className="absolute right-[200px]  top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Enter Problem Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=" h-[45px] pl-12 pr-4 rounded-lg bg-[#1A1D24] border-none focus:outline-none text-white"
              />
            </div>
          </div>
          <div>
            <LabelButton
              variant="light"
              onClick={handleAddSelected}
              disabled={selectedProblems.size === 0}
            >
              Add Questions
            </LabelButton>
          </div>
        </div>

        <div className="flex flex-1">
          <div className="w-56">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span className="text-gray-400">Filters</span>
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedFilter === "all"
                    ? "bg-[#1A1D24] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter("created")}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedFilter === "created"
                    ? "bg-[#1A1D24] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Your Created Problems
              </button>
              <div className="py-4">
                <h3 className="text-gray-400 mb-2">Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="all"
                      checked={ratingFilter === "all"}
                      onChange={(e) => setRatingFilter(e.target.value)}
                    />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="less1000"
                      checked={ratingFilter === "less1000"}
                      onChange={(e) => setRatingFilter(e.target.value)}
                    />
                    <span>less than 1000</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="greater1000"
                      checked={ratingFilter === "greater1000"}
                      onChange={(e) => setRatingFilter(e.target.value)}
                    />
                    <span>greater than 1000</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="greater1500"
                      checked={ratingFilter === "greater1500"}
                      onChange={(e) => setRatingFilter(e.target.value)}
                    />
                    <span>greater than 1500</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="custom"
                      checked={ratingFilter === "custom"}
                      onChange={(e) => setRatingFilter(e.target.value)}
                    />
                    <span>Custom</span>
                  </label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      placeholder="from"
                      value={customRating.from}
                      onChange={(e) =>
                        setCustomRating((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                      disabled={ratingFilter !== "custom"}
                      className="w-20 px-2 py-1 bg-[#1A1D24] rounded border border-gray-700 disabled:opacity-50"
                    />
                    <input
                      type="number"
                      placeholder="to"
                      value={customRating.to}
                      onChange={(e) =>
                        setCustomRating((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                      disabled={ratingFilter !== "custom"}
                      className="w-20 px-2 py-1 bg-[#1A1D24] rounded border border-gray-700 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 ml-8">
            <div className="bg-[#1A1D24] rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 p-4 text-white border-b border-gray-700">
                <div className="text-center">Select</div>
                <div className="text-center">Problem Name</div>
                <div className="text-center">Rating</div>
              </div>

              <div className="divide-y divide-gray-700">
                {loading ? (
                  <div className="p-4 text-center text-gray-400">
                    Loading problems...
                  </div>
                ) : (
                  getFilteredProblems(problems).map((problem) => (
                    <div
                      key={problem.id}
                      className="grid grid-cols-3 p-4 items-center"
                    >
                      <div className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedProblems.has(problem.id)}
                          onChange={() => handleToggleSelect(problem.id)}
                          className="form-checkbox"
                        />
                      </div>
                      <div
                        className="text-center cursor-pointer hover:text-purple-400"
                        onClick={() => handleProblemClick(problem.id)}
                      >
                        {problem.title}
                      </div>
                      <div className="text-center">{problem.rating}</div>
                    </div>
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 p-4 border-t border-gray-700">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-purple-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {(viewingProblem || loadingProblemDetail) && (
          <ProblemDetailModal
            problem={viewingProblem ?? undefined}
            isLoading={loadingProblemDetail}
            onClose={() => {
              setViewingProblem(null);
              setLoadingProblemDetail(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LibProblems;
