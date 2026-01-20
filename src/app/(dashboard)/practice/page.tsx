"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import LabelButton from "@/components/ui/LabelButton"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search, Filter, X } from "lucide-react"
import { filterProblems } from "@/utils/practiceProblems"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Question {
  id: string
  title: string
  rating: number
  score: number
  difficulty?: string
  status?: "SOLVED" | "UNSOLVED" | null
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalQuestions: number
  hasNext: boolean
  hasPrev: boolean
}

// Shimmer loading component for problems
const ProblemSkeleton = () => (
  <div className="flex items-center justify-between bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 animate-pulse border border-cyan-500/20">
    <div className="flex-1">
      <div className="h-5 bg-cyan-500/20 rounded w-3/4 mb-3"></div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-1">
        <div className="h-4 bg-cyan-500/20 rounded w-24"></div>
        <div className="h-4 bg-cyan-500/20 rounded w-24"></div>
        <div className="h-4 bg-cyan-500/20 rounded w-20"></div>
      </div>
    </div>
    <div>
      <div className="h-9 bg-cyan-500/20 rounded w-24"></div>
    </div>
  </div>
)

const EnhancedPagination = ({
  pagination,
  onPageChange,
}: {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
}) => {
  const { currentPage, totalPages, hasNext, hasPrev } = pagination

  // Generate page numbers to display based on screen size
  const getPageNumbers = (isMobile = false) => {
    const pages: (number | "ellipsis")[] = []
    const maxVisiblePages = isMobile ? 3 : 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (isMobile) {
        // Mobile: Show current page and adjacent pages only
        pages.push(1)
        if (currentPage > 3) {
          pages.push("ellipsis")
        }

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        for (let i = start; i <= end; i++) {
          if (!pages.includes(i)) {
            pages.push(i)
          }
        }

        if (currentPage < totalPages - 2) {
          pages.push("ellipsis")
        }

        if (totalPages > 1 && !pages.includes(totalPages)) {
          pages.push(totalPages)
        }
      } else {
        // Desktop: Full pagination logic
        pages.push(1)
        if (currentPage <= 4) {
          for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
            pages.push(i)
          }
          if (totalPages > 5) {
            pages.push("ellipsis")
          }
        } else if (currentPage >= totalPages - 3) {
          if (totalPages > 5) {
            pages.push("ellipsis")
          }
          for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
            pages.push(i)
          }
        } else {
          pages.push("ellipsis")
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i)
          }
          pages.push("ellipsis")
        }

        if (totalPages > 1 && !pages.includes(totalPages)) {
          pages.push(totalPages)
        }
      }
    }
    return pages
  }

  const PaginationButton = ({
    children,
    onClick,
    disabled = false,
    active = false,
    className = "",
    size = "default",
  }: {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    active?: boolean
    className?: string
    size?: "default" | "sm"
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${size === "sm" ? "px-2 py-1 min-w-[32px] h-8 text-sm" : "px-3 py-2 min-w-[40px] h-10"}
        rounded-lg border transition-all duration-300 ease-in-out flex items-center justify-center
        ${
          active
            ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105"
            : "border-cyan-500/20 bg-[#1a1d26] text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:text-white hover:scale-105"
        }
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer active:scale-95"}
        ${className}
      `}
    >
      {children}
    </button>
  )

  return (
    <div className="mt-8 pt-6 border-t border-cyan-500/20">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Page info - Mobile */}
        <div className="text-center text-sm text-gray-400 mb-4">
          Page {currentPage} of {totalPages}
          <span className="block text-xs mt-1">{pagination.totalQuestions} total problems</span>
        </div>

        {/* Main pagination controls - Mobile */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {/* Previous button */}
          <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrev} size="sm">
            <ChevronLeft size={14} />
          </PaginationButton>

          {/* Page numbers - Mobile */}
          <div className="flex items-center gap-1 mx-2">
            {getPageNumbers(true).map((page, index) => (
              <div key={index}>
                {page === "ellipsis" ? (
                  <div className="px-2 py-1 text-gray-400 flex items-center justify-center">
                    <MoreHorizontal size={14} />
                  </div>
                ) : (
                  <PaginationButton onClick={() => onPageChange(page)} active={page === currentPage} size="sm">
                    {page}
                  </PaginationButton>
                )}
              </div>
            ))}
          </div>

          {/* Next button */}
          <PaginationButton onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext} size="sm">
            <ChevronRight size={14} />
          </PaginationButton>
        </div>

        {/* Quick jump input - Mobile */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-400">Jump to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="Page"
            className="w-16 px-2 py-1 bg-[#1a1d26] border border-cyan-500/20 rounded text-white text-center focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = Number.parseInt((e.target as HTMLInputElement).value)
                if (value >= 1 && value <= totalPages) {
                  onPageChange(value)
                  ;(e.target as HTMLInputElement).value = ""
                }
              }
            }}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between gap-4">
        {/* Page info - Desktop */}
        <div className="text-sm text-gray-400">
          Showing page {currentPage} of {totalPages} ({pagination.totalQuestions} total problems)
        </div>

        {/* Main pagination controls - Desktop */}
        <div className="flex items-center gap-1">
          {/* First page button */}
          <PaginationButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
            <ChevronsLeft size={16} />
          </PaginationButton>

          {/* Previous button */}
          <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrev}>
            <ChevronLeft size={16} />
            <span className="ml-1">Prev</span>
          </PaginationButton>

          {/* Page numbers - Desktop */}
          <div className="flex items-center gap-1 mx-2">
            {getPageNumbers(false).map((page, index) => (
              <div key={index}>
                {page === "ellipsis" ? (
                  <div className="px-3 py-2 text-gray-400 flex items-center justify-center">
                    <MoreHorizontal size={16} />
                  </div>
                ) : (
                  <PaginationButton onClick={() => onPageChange(page)} active={page === currentPage}>
                    {page}
                  </PaginationButton>
                )}
              </div>
            ))}
          </div>

          {/* Next button */}
          <PaginationButton onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
            <span className="mr-1">Next</span>
            <ChevronRight size={16} />
          </PaginationButton>

          {/* Last page button */}
          <PaginationButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
            <ChevronsRight size={16} />
          </PaginationButton>
        </div>

        {/* Quick jump input - Desktop */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Go to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="Page"
            className="w-16 px-2 py-1 bg-[#1a1d26] border border-cyan-500/20 rounded text-white text-center focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = Number.parseInt((e.target as HTMLInputElement).value)
                if (value >= 1 && value <= totalPages) {
                  onPageChange(value)
                  ;(e.target as HTMLInputElement).value = ""
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function PracticePage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "ALL">("ALL")
  const [ratingRange, setRatingRange] = useState({ min: "", max: "" })
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Toast theme configuration
  const toastTheme = {
    style: {
      background: '#1F2937',
      color: '#F3F4F6',
      borderRadius: '0.5rem',
      padding: '1rem',
      fontSize: '0.875rem',
      maxWidth: '100%',
    },
    duration: 4000,
  }
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    hasNext: false,
    hasPrev: false,
  })

  const fetchQuestions = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      
      // Small delay to ensure shimmer is visible
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const minRating = ratingRange.min ? Number.parseInt(ratingRange.min) : undefined
      const maxRating = ratingRange.max ? Number.parseInt(ratingRange.max) : undefined

      const result = filterProblems(
        {
          searchQuery: searchQuery.trim() || undefined,
          difficulty: selectedDifficulty !== "ALL" ? selectedDifficulty : undefined,
          ratingMin: minRating && !isNaN(minRating) ? minRating : undefined,
          ratingMax: maxRating && !isNaN(maxRating) ? maxRating : undefined,
        },
        page,
        10
      )

      const mappedQuestions = result.problems.map((q) => ({
        id: q.id,
        title: q.title,
        rating: q.rating,
        score: q.score,
        difficulty: q.difficulty,
        status: null as "SOLVED" | "UNSOLVED" | null,
      }))

      setQuestions(mappedQuestions)
      setPagination({
        currentPage: page,
        totalPages: result.totalPages,
        totalQuestions: result.total,
        hasNext: page < result.totalPages,
        hasPrev: page > 1,
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to load practice problems", toastTheme)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedDifficulty, ratingRange.min, ratingRange.max])

  useEffect(() => {
    // Ensure loading state is set when component mounts
    setLoading(true)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    fetchQuestions(1)
  }, [fetchQuestions])

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedDifficulty("ALL")
    setRatingRange({ min: "", max: "" })
  }

  const hasActiveFilters = searchQuery.trim() !== "" || selectedDifficulty !== "ALL" || ratingRange.min !== "" || ratingRange.max !== ""

  const handleSolve = (id: string) => {
    router.push(`/practice/${id}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      // Show loading state immediately for smooth transition
      setLoading(true)
      
      // Scroll smoothly to top of problems container
      setTimeout(() => {
        document.querySelector(".problems-container")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
      
      // Fetch new questions
      fetchQuestions(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-[#10141D] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-gray-400">Sharpen your coding skills with our curated problem set</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search problems by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#282c33] border border-cyan-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
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

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="relative flex items-center gap-2 px-4 py-3 bg-[#282c33] border border-cyan-500/20 rounded-lg text-white hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all whitespace-nowrap"
            >
              <Filter size={20} />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-[#282c33]"></span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogContent className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 text-white w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-md mx-auto p-4 sm:p-6 shadow-lg shadow-cyan-500/10 [&>button]:text-gray-400 [&>button]:hover:text-white [&>button]:right-2 [&>button]:top-2 sm:[&>button]:right-4 sm:[&>button]:top-4">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white">Filter Problems</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 font-medium">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-0 sm:flex-initial ${
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
                <label className="block text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 font-medium">Rating Range</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <input
                    type="number"
                    placeholder="Min Rating"
                    value={ratingRange.min}
                    onChange={(e) => setRatingRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-[#282c33] border border-cyan-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 text-sm"
                  />
                  <span className="hidden sm:inline text-gray-400 text-sm flex-shrink-0">-</span>
                  <input
                    type="number"
                    placeholder="Max Rating"
                    value={ratingRange.max}
                    onChange={(e) => setRatingRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-[#282c33] border border-cyan-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 text-sm"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-2 mt-4 sm:mt-0">
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    handleClearFilters()
                    setIsFilterModalOpen(false)
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-cyan-400 hover:text-cyan-300 transition-colors text-sm flex items-center justify-center gap-2 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              )}
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Apply Filters
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="problems-container bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          {loading ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <ProblemSkeleton />
              <ProblemSkeleton />
              <ProblemSkeleton />
              <ProblemSkeleton />
              <ProblemSkeleton />
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((problem, index) => (
                <div
                  key={problem.id}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-br from-[#282c33] to-[#2a2e35] rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-300 ease-in-out opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex-1 mb-3 md:mb-0">
                    <h3 className="text-lg font-medium text-white mb-2">{problem.title}</h3>
                    <div className="flex flex-wrap gap-2 md:gap-8 text-sm text-gray-400">
                      <span className="text-cyan-400">Rating: {problem.rating}</span>
                      <span className="text-emerald-400">Score: {problem.score}</span>
                      <span
                        className={`${
                          problem.difficulty === "EASY"
                            ? "text-green-400"
                            : problem.difficulty === "MEDIUM"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                  <div>
                    <LabelButton
                      variant={problem.status === "SOLVED" ? "light" : "filled"}
                      onClick={() => handleSolve(problem.id)}
                    >
                      {problem.status === "SOLVED" ? "Solved" : "Solve"}
                    </LabelButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">No problems found</h3>
              <p>Try refreshing the page or check back later.</p>
            </div>
          )}

          {!loading && questions.length > 0 && pagination.totalPages > 1 && (
            <EnhancedPagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  )
}