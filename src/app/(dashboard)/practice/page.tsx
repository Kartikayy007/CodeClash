"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import LabelButton from "@/components/ui/LabelButton"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"

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
        rounded-lg border transition-all duration-200 flex items-center justify-center
        ${
          active
            ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25"
            : "border-cyan-500/20 bg-[#1a1d26] text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:text-white"
        }
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
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

  const getDifficultyFromRating = useCallback((rating: number): string => {
    if (rating <= 1200) return "EASY"
    if (rating <= 1600) return "MEDIUM"
    return "HARD"
  }, [])

  const fetchQuestions = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contest/questions/all`, {
        params: {
          page: page,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response.data
      if (data?.success && data?.data?.questions) {
        const mappedQuestions = data.data.questions.map((q: Question) => ({
          ...q,
          difficulty: getDifficultyFromRating(q.rating),
          status: null,
        }))

        setQuestions(mappedQuestions)
        const meta = data.data.meta || {}
        setPagination({
          currentPage: meta.page || page,
          totalPages: meta.totalPages || 1,
          totalQuestions: meta.total || mappedQuestions.length,
          hasNext: (meta.page || page) < (meta.totalPages || 1),
          hasPrev: (meta.page || page) > 1,
        })
      } else {
        throw new Error("Invalid response")
      }
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Authentication failed. Please login again.", toastTheme)
          router.push("/login")
        } else if (error.response?.status === 403) {
          toast.error("Access forbidden", toastTheme)
        } else {
          toast.error("Failed to fetch questions", toastTheme)
        }
      } else {
        toast.error("Failed to fetch questions")
      }
    } finally {
      setLoading(false)
    }
  }, [router, getDifficultyFromRating])

  useEffect(() => {
    fetchQuestions(1)
  }, [fetchQuestions])

  const handleSolve = (id: string) => {
    router.push(`/practice/${id}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      fetchQuestions(newPage)
      document.querySelector(".problems-container")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#10141D] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-gray-400">Sharpen your coding skills with our curated problem set</p>
        </div>

        <div className="problems-container bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          {loading ? (
            <div className="space-y-4">
              <ProblemSkeleton />
              <ProblemSkeleton />
              <ProblemSkeleton />
              <ProblemSkeleton />
              <ProblemSkeleton />
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((problem) => (
                <div
                  key={problem.id}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-br from-[#282c33] to-[#2a2e35] rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-200"
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