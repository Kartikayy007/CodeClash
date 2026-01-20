"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import LabelButton from "@/components/ui/LabelButton"
import {
  fetchProblem,
  fetchProblemList,
  type Problem,
  type ProblemPreview,
} from "@/features/battle/editor/api/problems"
import { getProblems, getProblemById, filterProblems } from "@/utils/practiceProblems"
import toast from "react-hot-toast"
import ProblemDetailModal from "./ProblemDetailModal"
import type { Problem as ContestProblem } from "@/types/problem.types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface LibProblemsProps {
  onBack: () => void
  onAddProblems: (selectedProblems: ContestProblem[]) => void
}

const LibProblems: React.FC<LibProblemsProps> = ({ onAddProblems }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProblems, setSelectedProblems] = useState<Set<string>>(new Set())
  const [problems, setProblems] = useState<ProblemPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProblemDetails, setSelectedProblemDetails] = useState<{
    [key: string]: Problem
  }>({})
  const [viewingProblem, setViewingProblem] = useState<Problem | null>(null)
  const [loadingProblemDetail, setLoadingProblemDetail] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "ALL">("ALL")
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" })
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [useLocalProblems] = useState(true) // Use local problems.json by default

  const fetchProblems = React.useCallback(async () => {
    try {
      setLoading(true)
      
      if (useLocalProblems) {
        // Use local problems.json
        const minRating = ratingRange.min ? Number.parseInt(ratingRange.min) : undefined
        const maxRating = ratingRange.max ? Number.parseInt(ratingRange.max) : undefined
        
        const result = filterProblems(
          {
            searchQuery: searchQuery.trim() || undefined,
            difficulty: selectedDifficulty !== "ALL" ? selectedDifficulty : undefined,
            ratingMin: minRating && !isNaN(minRating) ? minRating : undefined,
            ratingMax: maxRating && !isNaN(maxRating) ? maxRating : undefined,
          },
          currentPage,
          10
        )
        
        setProblems(result.problems)
        setTotalPages(result.totalPages)
      } else {
        // Fallback to API
        const response = await fetchProblemList(currentPage, 10)
        setProblems(response.data.questions)
        setTotalPages(response.data.meta.totalPages)
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch problems")
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, selectedDifficulty, ratingRange.min, ratingRange.max, useLocalProblems])

  React.useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  const handleToggleSelect = async (problemId: string) => {
    const newSelected = new Set(selectedProblems)
    if (newSelected.has(problemId)) {
      newSelected.delete(problemId)
    } else {
      if (!selectedProblemDetails[problemId]) {
        try {
          // Try to get problem from local problems first, then fallback to API
          let problemDetail: Problem
          if (problemId.startsWith("practice-")) {
            const localProblem = getProblemById(problemId)
            if (localProblem) {
              problemDetail = localProblem
            } else {
              problemDetail = await fetchProblem(problemId)
            }
          } else {
            problemDetail = await fetchProblem(problemId)
          }
          
          setSelectedProblemDetails((prev) => ({
            ...prev,
            [problemId]: problemDetail,
          }))
        } catch (error: unknown) {
          toast.error(error instanceof Error ? error.message : "Failed to fetch problem details")
          return
        }
      }
      newSelected.add(problemId)
    }
    setSelectedProblems(newSelected)
  }

  const handleAddSelected = () => {
    setAddLoading(true)
    try {
      const selectedProblemsList = Array.from(selectedProblems).map((id) => {
        const problem = selectedProblemDetails[id]
        if (!problem) {
          throw new Error(`Problem ${id} not found`)
        }
        return {
          id: problem.id, // Keep the ID (will be "practice-X" for local problems)
          name: problem.title,
          title: problem.title,
          maxScore: problem.rating || 100, // Use rating as default score
          score: problem.rating || 100,
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
        }
      })
      onAddProblems(selectedProblemsList)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to prepare problems")
    } finally {
      setAddLoading(false)
    }
  }

  const handleProblemClick = async (problemId: string) => {
    setLoadingProblemDetail(true)
    setViewingProblem(null)
    try {
      if (selectedProblemDetails[problemId]) {
        setViewingProblem(selectedProblemDetails[problemId])
      } else {
        // Try to get problem from local problems first, then fallback to API
        let problemDetail: Problem
        if (problemId.startsWith("practice-")) {
          const localProblem = getProblemById(problemId)
          if (localProblem) {
            problemDetail = localProblem
          } else {
            problemDetail = await fetchProblem(problemId)
          }
        } else {
          problemDetail = await fetchProblem(problemId)
        }
        
        setSelectedProblemDetails((prev) => ({
          ...prev,
          [problemId]: problemDetail,
        }))
        setViewingProblem(problemDetail)
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch problem details")
    } finally {
      setLoadingProblemDetail(false)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedDifficulty("ALL")
    setRatingRange({ min: "", max: "" })
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery.trim() !== "" || selectedDifficulty !== "ALL" || ratingRange.min !== "" || ratingRange.max !== ""

  // Pagination helper function
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1d26] to-[#1e222c] text-white p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* Back Button Row */}
          {/* <div className="flex justify-start">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors duration-200 p-2 -ml-2"
            >
              <ArrowLeft size={20} />
              <span className="text-sm sm:text-base">Back</span>
            </button>
          </div> */}

          {/* Search, Filter and Add Button Row */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1) // Reset to first page on search
                    }}
                    className="w-full h-[42px] sm:h-[45px] pl-4 pr-4 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20 focus:outline-none focus:border-cyan-500/40 text-white text-sm sm:text-base shadow-lg shadow-cyan-500/10 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-[#282c33] border border-cyan-500/20 rounded-lg text-white hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all whitespace-nowrap"
              >
                <Filter size={18} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-[#282c33]"></span>
                )}
              </button>
              <LabelButton
                variant="light"
                onClick={handleAddSelected}
                disabled={selectedProblems.size === 0 || addLoading}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {addLoading
                  ? "Adding..."
                  : `Add Questions ${selectedProblems.size > 0 ? `(${selectedProblems.size})` : ""}`}
              </LabelButton>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          {/* Desktop Table Header */}
          <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-5 p-4 text-white border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
            <div className="text-center font-semibold text-sm lg:text-base">Select</div>
            <div className="text-center font-semibold text-sm lg:text-base lg:col-span-2">Problem Name</div>
            <div className="text-center font-semibold text-sm lg:text-base">Difficulty</div>
            <div className="text-center font-semibold text-sm lg:text-base">Rating</div>
          </div>

          {/* Mobile/Desktop Content */}
          <div className="divide-y divide-cyan-500/20">
            {loading ? (
              <div className="p-6 sm:p-8 text-center text-gray-400">
                <div className="text-sm sm:text-base">Loading problems...</div>
              </div>
            ) : problems.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-400">
                <div className="text-sm sm:text-base">No problems found</div>
              </div>
            ) : (
              problems.map((problem) => (
                <div
                  key={problem.id}
                  className="hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-200"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedProblems.has(problem.id)}
                          onChange={() => handleToggleSelect(problem.id)}
                          className="form-checkbox w-4 h-4 mt-1 text-cyan-500 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 rounded focus:ring-cyan-500/40 focus:ring-offset-0 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className="font-medium cursor-pointer hover:text-cyan-400 transition-colors duration-200 text-sm leading-tight break-words"
                            onClick={() => handleProblemClick(problem.id)}
                          >
                            {problem.title}
                          </div>
                          <div className="mt-1.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                problem.difficulty === "EASY"
                                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                                  : problem.difficulty === "MEDIUM"
                                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                                    : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-emerald-400 font-medium text-sm flex-shrink-0">{problem.rating}</div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-5 p-3 lg:p-4 items-center">
                    <div className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedProblems.has(problem.id)}
                        onChange={() => handleToggleSelect(problem.id)}
                        className="form-checkbox w-4 h-4 text-cyan-500 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 rounded focus:ring-cyan-500/40 focus:ring-offset-0"
                      />
                    </div>
                    <div
                      className="text-center cursor-pointer hover:text-cyan-400 transition-colors duration-200 text-sm lg:text-base px-2 lg:col-span-2"
                      onClick={() => handleProblemClick(problem.id)}
                    >
                      <span className="break-words">{problem.title}</span>
                    </div>
                    <div className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                          problem.difficulty === "EASY"
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                            : problem.difficulty === "MEDIUM"
                              ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="text-center text-emerald-400 font-medium text-sm lg:text-base">
                      {problem.rating}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-cyan-500/20 p-4">
              <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    currentPage === 1
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-gray-300 hover:text-white hover:bg-cyan-500/10 hover:border-cyan-500/20"
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-2 text-gray-500 text-sm">...</span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(page as number)}
                          className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm min-w-[40px] ${
                            currentPage === page
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                              : "text-gray-400 hover:text-white hover:bg-cyan-500/10"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    currentPage === totalPages
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-gray-300 hover:text-white hover:bg-cyan-500/10 hover:border-cyan-500/20"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Page Info */}
              <div className="text-center mt-3 text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 text-white max-w-md shadow-lg shadow-cyan-500/10 [&>button]:text-gray-400 [&>button]:hover:text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Filter Problems</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-3 font-medium">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty)
                      setCurrentPage(1)
                    }}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                      selectedDifficulty === difficulty
                        ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                        : "bg-[#282c33] border-cyan-500/20 text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-500/40"
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Range Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-3 font-medium">Rating Range</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <input
                  type="number"
                  placeholder="Min Rating"
                  value={ratingRange.min}
                  onChange={(e) => {
                    setRatingRange(prev => ({ ...prev, min: e.target.value }))
                    setCurrentPage(1)
                  }}
                  className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-[#282c33] border border-cyan-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 text-sm"
                />
                <span className="hidden sm:inline text-gray-400 text-sm flex-shrink-0">-</span>
                <input
                  type="number"
                  placeholder="Max Rating"
                  value={ratingRange.max}
                  onChange={(e) => {
                    setRatingRange(prev => ({ ...prev, max: e.target.value }))
                    setCurrentPage(1)
                  }}
                  className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-[#282c33] border border-cyan-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {hasActiveFilters && (
              <button
                onClick={() => {
                  handleClearFilters()
                  setIsFilterModalOpen(false)
                }}
                className="w-full sm:w-auto px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm flex items-center justify-center gap-2 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10"
              >
                <X size={16} />
                Clear All Filters
              </button>
            )}
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium"
            >
              Apply Filters
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Problem Detail Modal */}
      {(viewingProblem || loadingProblemDetail) && (
        <ProblemDetailModal
          problem={viewingProblem ?? undefined}
          isLoading={loadingProblemDetail}
          onClose={() => {
            setViewingProblem(null)
            setLoadingProblemDetail(false)
          }}
        />
      )}
    </div>
  )
}

export default LibProblems
