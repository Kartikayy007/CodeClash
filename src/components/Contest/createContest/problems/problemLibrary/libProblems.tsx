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

  const [addLoading, setAddLoading] = useState(false);

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
    setAddLoading(true);
    try {
      const selectedProblemsList = Array.from(selectedProblems).map((id) => {
        const problem = selectedProblemDetails[id];
        return {
          id: problem.id,
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
    } finally {
      setAddLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1d26] to-[#1e222c] text-white p-4 md:p-8">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter Problem Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 h-[45px] pl-10 pr-4 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20 focus:outline-none focus:border-cyan-500/40 text-white shadow-lg shadow-cyan-500/10 transition-all duration-200"
              />
            </div>
          </div>

          <LabelButton
            variant="light"
            onClick={handleAddSelected}
            disabled={selectedProblems.size === 0 || addLoading}
            className="w-full md:w-auto"
          >
            {addLoading ? "Adding..." : "Add Questions"}
          </LabelButton>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-56 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <h2 className="text-lg font-medium mb-4 text-white">Filters</h2>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedFilter === "all" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-gray-400 hover:text-white hover:bg-cyan-500/10"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter("created")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedFilter === "created" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25" : "text-gray-400 hover:text-white hover:bg-cyan-500/10"
                }`}
              >
                Your Created Problems
              </button>
              
              <div className="py-4">
                <h3 className="text-gray-400 mb-2 font-medium">Rating</h3>
                <div className="space-y-2">
                  {["all", "less1000", "greater1000", "greater1500", "custom"].map((value) => (
                    <label key={value} className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={ratingFilter === value}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="form-radio text-cyan-500 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 focus:ring-cyan-500/40 focus:ring-offset-0"
                      />
                      <span className="capitalize">{value.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                  
                  {ratingFilter === "custom" && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="number"
                        placeholder="from"
                        value={customRating.from}
                        onChange={(e) => setCustomRating(prev => ({ ...prev, from: e.target.value }))}
                        className="w-20 px-2 py-1 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg border border-cyan-500/20 text-white shadow-lg shadow-cyan-500/10 focus:outline-none focus:border-cyan-500/40 transition-all duration-200"
                      />
                      <input
                        type="number"
                        placeholder="to"
                        value={customRating.to}
                        onChange={(e) => setCustomRating(prev => ({ ...prev, to: e.target.value }))}
                        className="w-20 px-2 py-1 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg border border-cyan-500/20 text-white shadow-lg shadow-cyan-500/10 focus:outline-none focus:border-cyan-500/40 transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <div className="grid grid-cols-3 p-4 text-white border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                <div className="text-center font-semibold">Select</div>
                <div className="text-center font-semibold">Problem Name</div>
                <div className="text-center font-semibold">Rating</div>
              </div>

              <div className="divide-y divide-cyan-500/20">
                {loading ? (
                  <div className="p-4 text-center text-gray-400">
                    Loading problems...
                  </div>
                ) : (
                  getFilteredProblems(problems).map((problem) => (
                    <div
                      key={problem.id}
                      className="grid grid-cols-3 p-4 items-center hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-200"
                    >
                      <div className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedProblems.has(problem.id)}
                          onChange={() => handleToggleSelect(problem.id)}
                          className="form-checkbox w-4 h-4 text-cyan-500 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 rounded focus:ring-cyan-500/40 focus:ring-offset-0"
                        />
                      </div>
                      <div
                        className="text-center cursor-pointer hover:text-cyan-400 transition-colors duration-200"
                        onClick={() => handleProblemClick(problem.id)}
                      >
                        {problem.title}
                      </div>
                      <div className="text-center text-emerald-400 font-medium">{problem.rating}</div>
                    </div>
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-left md:justify-center gap-2 p-4 border-t border-cyan-500/20 overflow-scroll">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                          : "text-gray-400 hover:text-white hover:bg-cyan-500/10"
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
  );
};

export default LibProblems;
