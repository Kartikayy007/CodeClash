"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LabelButton from "@/components/ui/LabelButton"
import {
  fetchProblem,
  fetchProblemList,
  type Problem,
  type ProblemPreview,
} from "@/features/battle/editor/api/problems"
import toast from "react-hot-toast"
import ProblemDetailModal from "./ProblemDetailModal"
import type { Problem as ContestProblem } from "@/types/problem.types"

interface LibProblemsProps {
  onBack: () => void
  onAddProblems: (selectedProblems: ContestProblem[]) => void
}

const LibProblems: React.FC<LibProblemsProps> = ({ onAddProblems }) => {
  const [searchQuery ] = useState("")
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
  const [ratingFilter] = useState("all")
  const [customRating] = useState({ from: "", to: "" })
  const [addLoading, setAddLoading] = useState(false)

  const fetchProblems = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchProblemList(currentPage, 10)
      setProblems(response.data.questions)
      setTotalPages(response.data.meta.totalPages)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch problems")
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  React.useEffect(() => {
    fetchProblems()
  }, [fetchProblems, currentPage])

  const handleToggleSelect = async (problemId: string) => {
    const newSelected = new Set(selectedProblems)
    if (newSelected.has(problemId)) {
      newSelected.delete(problemId)
    } else {
      if (!selectedProblemDetails[problemId]) {
        try {
          const problemDetail = await fetchProblem(problemId)
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
        }
      })
      onAddProblems(selectedProblemsList)
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
        const problemDetail = await fetchProblem(problemId)
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

  const getFilteredProblems = (problems: ProblemPreview[]) => {
    return problems.filter((problem) => {
      if (searchQuery && !problem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      switch (ratingFilter) {
        case "less1000":
          return problem.rating < 1000
        case "greater1000":
          return problem.rating >= 1000
        case "greater1500":
          return problem.rating >= 1500
        case "custom":
          const from = Number.parseInt(customRating.from)
          const to = Number.parseInt(customRating.to)
          if (!isNaN(from) && !isNaN(to)) {
            return problem.rating >= from && problem.rating <= to
          }
          return true
        default:
          return true
      }
    })
  }

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

          {/* Search and Add Button Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter Problem Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[42px] sm:h-[45px] pl-10 pr-4 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20 focus:outline-none focus:border-cyan-500/40 text-white text-sm sm:text-base shadow-lg shadow-cyan-500/10 transition-all duration-200"
                />
              </div>
            </div> */}
            <LabelButton
              variant="light"
              onClick={handleAddSelected}
              disabled={selectedProblems.size === 0 || addLoading}
              className="w-full text-sm sm:text-base"
            >
              {addLoading
                ? "Adding..."
                : `Add Questions ${selectedProblems.size > 0 ? `(${selectedProblems.size})` : ""}`}
            </LabelButton>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          {/* Desktop Table Header */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 p-4 text-white border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
            <div className="text-center font-semibold text-sm lg:text-base">Select</div>
            <div className="text-center font-semibold text-sm lg:text-base lg:col-span-2">Problem Name</div>
            <div className="text-center font-semibold text-sm lg:text-base">Rating</div>
          </div>

          {/* Mobile/Desktop Content */}
          <div className="divide-y divide-cyan-500/20">
            {loading ? (
              <div className="p-6 sm:p-8 text-center text-gray-400">
                <div className="text-sm sm:text-base">Loading problems...</div>
              </div>
            ) : getFilteredProblems(problems).length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-400">
                <div className="text-sm sm:text-base">No problems found</div>
              </div>
            ) : (
              getFilteredProblems(problems).map((problem) => (
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
                        </div>
                      </div>
                      <div className="text-emerald-400 font-medium text-sm flex-shrink-0">{problem.rating}</div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 p-3 lg:p-4 items-center">
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
