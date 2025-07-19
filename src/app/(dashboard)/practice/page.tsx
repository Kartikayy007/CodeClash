"use client"

import type React from "react"

import { useEffect, useState } from "react"
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 4) {
        // Show pages 2-5 and ellipsis
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i)
        }
        if (totalPages > 5) {
          pages.push("ellipsis")
        }
      } else if (currentPage >= totalPages - 3) {
        // Show ellipsis and last 4 pages
        if (totalPages > 5) {
          pages.push("ellipsis")
        }
        for (let i = Math.max(2, totalPages - 4); i <= totalPages - 1; i++) {
          pages.push(i)
        }
      } else {
        // Show ellipsis, current page area, ellipsis
        pages.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
      }

      // Always show last page (if not already included)
      if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages)
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
  }: {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    active?: boolean
    className?: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-2 min-w-[40px] h-10 rounded-lg border transition-all duration-200 flex items-center justify-center
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
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-cyan-500/20">
      {/* Page info */}
      <div className="text-sm text-gray-400 order-2 lg:order-1">
        <span className="hidden sm:inline">
          Showing page {currentPage} of {totalPages} ({pagination.totalQuestions} total problems)
        </span>
        <span className="sm:hidden">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Main pagination controls */}
      <div className="flex items-center gap-1 order-1 lg:order-2">
        {/* First page button */}
        <PaginationButton onClick={() => onPageChange(1)} disabled={currentPage === 1} className="hidden sm:flex">
          <ChevronsLeft size={16} />
        </PaginationButton>

        {/* Previous button */}
        <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrev}>
          <ChevronLeft size={16} />
          <span className="hidden sm:inline ml-1">Prev</span>
        </PaginationButton>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
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
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight size={16} />
        </PaginationButton>

        {/* Last page button */}
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          <ChevronsRight size={16} />
        </PaginationButton>
      </div>

      {/* Quick jump input */}
      <div className="flex items-center gap-2 text-sm order-3">
        <span className="text-gray-400 hidden md:inline">Go to:</span>
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
  )
}

export default function PracticePage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    hasNext: false,
    hasPrev: false,
  })

  const fetchQuestions = async (page = 1) => {
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
          toast.error("Authentication failed. Please login again.")
          router.push("/login")
        } else if (error.response?.status === 403) {
          toast.error("Access forbidden")
        } else {
          toast.error("Failed to fetch questions")
        }
      } else {
        toast.error("Failed to fetch questions")
      }
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyFromRating = (rating: number): string => {
    if (rating <= 1200) return "EASY"
    if (rating <= 1600) return "MEDIUM"
    return "HARD"
  }

  useEffect(() => {
    fetchQuestions(1)
  }, [])

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
    <div className="min-h-screen bg-[#10141D] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-gray-400">Sharpen your coding skills with our curated problem set</p>
        </div>

        <div className="problems-container bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-4 md:p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          {/* <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2 md:mb-0">Problem Set</h2>
            <div className="text-sm text-gray-400">
              {!loading && (
                <span>
                  Showing {(pagination.currentPage - 1) * 10 + 1}-
                  {Math.min(pagination.currentPage * 10, pagination.totalQuestions)} of {pagination.totalQuestions}{" "}
                  problems
                </span>
              )}
            </div>
          </div> */}

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
