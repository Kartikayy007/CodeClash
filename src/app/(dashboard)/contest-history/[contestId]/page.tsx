"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  ArrowLeft,
  Target,
  Award,
  Timer,
  ChevronLeft,
  ChevronRight,
  Eye,
  Crown,
  Medal,
  User,
} from "lucide-react"

interface Contest {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  isPublic: boolean
  status: "UPCOMING" | "ONGOING" | "ENDED"
  createdAt: string
  organizationName?: string | null
  creator: {
    id: string
    username: string
    rating: number
  }
  isRegistered: boolean
  isCreator: boolean
  userStats: Record<string, unknown> | null
  participantCount: number
  questionCount: number
  questions: Question[]
}

interface LeaderboardEntry {
  id: string
  username: string
  score: number
  rank: number
  questionsSolved: number
  timeTaken?: string
  lastSubmissionTime?: string
}

interface Question {
  id: string
  title: string
  rating: number
  score: number
  createdAt: string
  difficulty?: "EASY" | "MEDIUM" | "HARD"
  description?: string
  inputFormat?: string
  outputFormat?: string
  constraints?: string
  timeLimit?: number
  memoryLimit?: number
}

type TabType = "Overview" | "Leaderboard" | "Questions"

export default function PastContestPage() {
  const params = useParams()
  const router = useRouter()
  const contestId = params.contestId as string
  const [activeTab, setActiveTab] = useState<TabType>("Overview")
  const [contest, setContest] = useState<Contest | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [leaderboardPage, setLeaderboardPage] = useState(1)
  const [totalLeaderboardPages, setTotalLeaderboardPages] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchContestDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("No access token found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contest/${contestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch contest details: ${response.status}`)
      }

      const data = await response.json()
      if (data.contest) {
        setContest(data.contest)
        if (data.contest.questions && Array.isArray(data.contest.questions)) {
          setQuestions(data.contest.questions)
        }
        if (data.contest.status === "ONGOING") {
          router.push(`/contest/${contestId}`)
          return
        }
      }
    } catch (error) {
      console.error("Error fetching contest details:", error)
      setError("Failed to load contest details")
    } finally {
      setLoading(false)
    }
  }, [contestId, router])

  const fetchLeaderboard = useCallback(
    async (page: number) => {
      try {
        setLeaderboardLoading(true)
        const token = localStorage.getItem("accessToken")
        if (!token) {
          throw new Error("No access token found")
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contest/${contestId}/leaderboard?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.status}`)
        }

        const data = await response.json()
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard)
          setTotalLeaderboardPages(data.pagination?.pages || 1)
          setLeaderboardPage(page)
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLeaderboardLoading(false)
      }
    },
    [contestId],
  )

  useEffect(() => {
    if (!contestId) return
    fetchContestDetails()
  }, [contestId, fetchContestDetails])

  useEffect(() => {
    if (activeTab === "Leaderboard" && contestId) {
      fetchLeaderboard(1)
    }
  }, [activeTab, contestId, fetchLeaderboard])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    let duration = ""
    if (days > 0) duration += `${days}d `
    if (hours > 0) duration += `${hours}h `
    if (minutes > 0) duration += `${minutes}m`
    return duration.trim() || "0m"
  }

  const getDifficultyColor = (rating: number) => {
    if (rating < 1000) return "text-green-400"
    if (rating < 1600) return "text-cyan-400"
    if (rating < 1900) return "text-blue-400"
    if (rating < 2100) return "text-purple-400"
    if (rating < 2400) return "text-orange-400"
    return "text-red-400"
  }

  const getDifficultyBadge = (rating: number) => {
    if (rating < 1000) return { text: "Newbie", color: "bg-gray-500/20 text-gray-300 border-gray-500/30" }
    if (rating < 1200) return { text: "Pupil", color: "bg-green-500/20 text-green-400 border-green-500/30" }
    if (rating < 1400) return { text: "Specialist", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" }
    if (rating < 1600) return { text: "Expert", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" }
    if (rating < 1900)
      return { text: "Candidate Master", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" }
    if (rating < 2100) return { text: "Master", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" }
    if (rating < 2300)
      return { text: "International Master", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" }
    if (rating < 2400) return { text: "Grandmaster", color: "bg-red-500/20 text-red-400 border-red-500/30" }
    if (rating < 2600)
      return { text: "International Grandmaster", color: "bg-red-500/20 text-red-400 border-red-500/30" }
    return { text: "Legendary Grandmaster", color: "bg-red-500/20 text-red-400 border-red-500/30" }
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Contest Header */}
      <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{contest?.title}</h2>
            {contest?.description && <p className="text-gray-300 leading-relaxed mb-4">{contest.description}</p>}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400">Created by</span>
                <span className="text-white font-medium">{contest?.creator?.username}</span>
              </div>
              {contest?.organizationName && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-purple-400 font-medium">{contest.organizationName}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30 text-sm font-medium">
              {contest?.status || "ENDED"}
            </span>
          </div>
        </div>
      </div>

      {/* Contest Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5 text-cyan-400" />
            Contest Timeline
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400 uppercase tracking-wide">Start Time</span>
              </div>
              <p className="text-sm text-gray-300 font-mono pl-6 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                {contest ? formatDate(contest.startTime) : "Loading..."}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400 uppercase tracking-wide">End Time</span>
              </div>
              <p className="text-sm text-gray-300 font-mono pl-6 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                {contest ? formatDate(contest.endTime) : "Loading..."}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400 uppercase tracking-wide">Duration</span>
              </div>
              <p className="text-sm text-gray-300 font-mono pl-6 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                {contest ? calculateDuration(contest.startTime, contest.endTime) : "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Participants</span>
              <span className="text-lg font-semibold text-white">{contest?.participantCount || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Problems</span>
              <span className="text-lg font-semibold text-white">{contest?.questionCount || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Visibility</span>
              <span className="text-sm font-medium text-cyan-400">{contest?.isPublic ? "Public" : "Private"}</span>
            </div>
          </div>
        </div>

        {/* Your Performance */}
        {contest?.userStats && (
          <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Your Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Score</span>
                <span className="text-lg font-semibold text-emerald-400">{(contest.userStats as any)?.score || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Rank</span>
                <span className="text-lg font-semibold text-cyan-400">{(contest.userStats as any)?.rank || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Joined</span>
                <span className="text-sm text-gray-300">
                  {(contest.userStats as any)?.joinedAt
                    ? new Date((contest.userStats as any).joinedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderLeaderboardTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <div className="px-6 py-4 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Final Standings
            </h3>
            <div className="text-sm text-gray-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              {contest?.participantCount || 0} participants
            </div>
          </div>
        </div>

        {leaderboardLoading ? (
          <div className="p-6">
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-cyan-500/10 rounded animate-pulse border border-cyan-500/20" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/20">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                      Rank
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                      Participant
                    </th>
                    <th className="text-center py-3 px-6 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                      Score
                    </th>
                    <th className="text-center py-3 px-6 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                      Solved
                    </th>
                    <th className="text-center py-3 px-6 text-sm font-semibold text-cyan-400 uppercase tracking-wide">
                      Last Submission
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {leaderboard.map((entry, index) => {
                    const isEven = index % 2 === 0
                    const bgColor = isEven ? "bg-transparent" : "bg-cyan-500/5"

                    return (
                      <tr key={entry.id} className={`hover:bg-cyan-500/10 transition-colors ${bgColor}`}>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-2">
                            {entry.rank === 1 && <Crown className="w-4 h-4 text-yellow-400" />}
                            {entry.rank === 2 && <Medal className="w-4 h-4 text-gray-300" />}
                            {entry.rank === 3 && <Award className="w-4 h-4 text-orange-400" />}
                            <span
                              className={`font-semibold ${
                                entry.rank === 1
                                  ? "text-yellow-400"
                                  : entry.rank === 2
                                    ? "text-gray-300"
                                    : entry.rank === 3
                                      ? "text-orange-400"
                                      : "text-white"
                              }`}
                            >
                              {entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="font-medium text-white">{entry.username}</div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-semibold text-emerald-400">{entry.score.toFixed(2)}</div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-semibold text-blue-400">{entry.questionsSolved}</div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="text-sm text-gray-300 font-mono">
                            {entry.lastSubmissionTime
                              ? new Date(entry.lastSubmissionTime).toLocaleString()
                              : entry.timeTaken || "N/A"}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalLeaderboardPages > 1 && (
              <div className="px-6 py-4 border-t border-cyan-500/20">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => fetchLeaderboard(leaderboardPage - 1)}
                    disabled={leaderboardPage === 1}
                    className={`p-2 rounded border transition-colors ${
                      leaderboardPage === 1
                        ? "bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed"
                        : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-300 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20">
                    Page {leaderboardPage} of {totalLeaderboardPages}
                  </span>
                  <button
                    onClick={() => fetchLeaderboard(leaderboardPage + 1)}
                    disabled={leaderboardPage === totalLeaderboardPages}
                    className={`p-2 rounded border transition-colors ${
                      leaderboardPage === totalLeaderboardPages
                        ? "bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed"
                        : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  const handleViewProblem = useCallback(
    (problemId: string) => {
      router.push(`/contest/${contestId}/problem/${problemId}`)
    },
    [router, contestId],
  )

  const renderQuestionsTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <div className="px-6 py-4 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Problems
            </h3>
            <div className="text-sm text-gray-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              {questions.length} problem{questions.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="divide-y divide-cyan-500/10">
          {questions.map((question) => {
            return (
              <div key={question.id} className="p-6 hover:bg-cyan-500/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{question.title}</h4>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Rating:</span>
                          <span className={`font-semibold ${getDifficultyColor(question.rating)}`}>
                            {question.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Score:</span>
                          <span className="font-semibold text-emerald-400">{question.score}</span>
                        </div>
                        {question.timeLimit && question.memoryLimit && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Limits:</span>
                            <span className="font-mono text-xs text-cyan-400">
                              {question.timeLimit}ms / {question.memoryLimit}MB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewProblem(question.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 rounded hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            )
          })}

          {questions.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium mb-2">No problems found</p>
              <p className="text-gray-500 text-sm">This contest doesn&apos;t have any problems configured.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverviewTab()
      case "Leaderboard":
        return renderLeaderboardTab()
      case "Questions":
        return renderQuestionsTab()
      default:
        return renderOverviewTab()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141D] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-cyan-500/20 rounded w-48"></div>
                <div className="h-4 bg-cyan-500/10 rounded w-32"></div>
              </div>
            </div>
            <div className="h-32 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/20"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-cyan-500/20 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl border border-cyan-500/20"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#10141D] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-xl font-medium mb-2">Error Loading Contest</div>
            <div className="text-red-300 text-sm mb-4">{error}</div>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {/* <button
            onClick={() => router.back()}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </button> */}
          <div>
            <h1 className="text-3xl font-bold text-white">{contest?.title || "Past Contest"}</h1>
            <p className="text-cyan-400/80 mt-1 font-medium">Contest Results & Analysis</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(["Overview", "Leaderboard", "Questions"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-500/50"
                  : "text-gray-400 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 bg-gradient-to-br from-[#1a1d26] to-[#1e222c]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-8">{renderTabContent()}</div>
      </div>
    </div>
  )
}
