"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Shield,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trophy,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Award,
} from "lucide-react"
import { CartesianGrid, XAxis, YAxis, Line, LineChart, Bar, BarChart } from "recharts"
import type {
  Contest,
  ContestsResponse,
  LeaderboardResponse,
  LeaderboardEntry,
  UserDetailsResponse,
  Submission,
} from "@/types/admin-api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function AdminDashboard() {
  const router = useRouter()
  const [contests, setContests] = useState<Contest[]>([])
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userDetails, setUserDetails] = useState<UserDetailsResponse | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [userDetailsLoading, setUserDetailsLoading] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false)

  // Sort and rank leaderboard data
  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard]
      .sort((a, b) => {
        // Sort by score descending, then by problems solved descending, then by last submission time ascending
        if (b.score !== a.score) return b.score - a.score
        if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved
        if (!a.lastSubmissionTime && !b.lastSubmissionTime) return 0
        if (!a.lastSubmissionTime) return 1
        if (!b.lastSubmissionTime) return -1
        return new Date(a.lastSubmissionTime).getTime() - new Date(b.lastSubmissionTime).getTime()
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))
  }, [leaderboard])

  // Sort contests by start time (most recent first)
  const sortedContests = useMemo(() => {
    return [...contests].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  }, [contests])

  // Chart data for score distribution (normal axis)
  const scoreDistributionData = useMemo(() => {
    const scoreRanges = [
      { range: "0-50", min: 0, max: 50, count: 0 },
      { range: "51-100", min: 51, max: 100, count: 0 },
      { range: "101-150", min: 101, max: 150, count: 0 },
      { range: "151-200", min: 151, max: 200, count: 0 },
      { range: "201-250", min: 201, max: 250, count: 0 },
      { range: "250+", min: 251, max: Number.POSITIVE_INFINITY, count: 0 },
    ]

    sortedLeaderboard.forEach((entry) => {
      const range = scoreRanges.find((r) => entry.score >= r.min && entry.score <= r.max)
      if (range) range.count++
    })

    return scoreRanges.filter((range) => range.count > 0)
  }, [sortedLeaderboard])

  // Chart data for problems solved distribution (normal axis)
  const problemsSolvedData = useMemo(() => {
    const distribution: { [key: number]: number } = {}

    sortedLeaderboard.forEach((entry) => {
      distribution[entry.problemsSolved] = (distribution[entry.problemsSolved] || 0) + 1
    })

    return Object.entries(distribution)
      .map(([problems, count]) => ({
        problems: `${problems} Problem${Number.parseInt(problems) === 1 ? "" : "s"}`,
        count,
        problemsNum: Number.parseInt(problems),
      }))
      .sort((a, b) => a.problemsNum - b.problemsNum)
  }, [sortedLeaderboard])

  // User-specific chart data
  const userScoreProgressData = useMemo(() => {
    if (!userDetails) return []

    return userDetails.contestSubmissions
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((submission, index) => ({
        submission: `#${index + 1}`,
        score: submission.score,
        time: new Date(submission.createdAt).toLocaleTimeString(),
        cumulativeScore: userDetails.contestSubmissions.slice(0, index + 1).reduce((sum, s) => sum + s.score, 0),
      }))
  }, [userDetails])

  // Test case success rate over time
  const testCaseSuccessData = useMemo(() => {
    if (!userDetails) return []

    return userDetails.contestSubmissions
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((submission, index) => ({
        submission: `#${index + 1}`,
        successRate: Math.round((submission.passedTestCases / submission.totalTestCases) * 100),
        passed: submission.passedTestCases,
        total: submission.totalTestCases,
        time: new Date(submission.createdAt).toLocaleTimeString(),
      }))
  }, [userDetails])

  // Performance by question
  const questionPerformanceData = useMemo(() => {
    if (!userDetails) return []

    const questionMap = new Map()

    userDetails.contestSubmissions.forEach((submission) => {
      const questionTitle = submission.question.title
      if (!questionMap.has(questionTitle)) {
        questionMap.set(questionTitle, {
          question: questionTitle.length > 15 ? questionTitle.substring(0, 15) + "..." : questionTitle,
          maxScore: submission.score,
          attempts: 1,
          bestSuccessRate: Math.round((submission.passedTestCases / submission.totalTestCases) * 100),
        })
      } else {
        const existing = questionMap.get(questionTitle)
        existing.maxScore = Math.max(existing.maxScore, submission.score)
        existing.attempts += 1
        existing.bestSuccessRate = Math.max(
          existing.bestSuccessRate,
          Math.round((submission.passedTestCases / submission.totalTestCases) * 100),
        )
      }
    })

    return Array.from(questionMap.values())
  }, [userDetails])

  // Submission timeline data
  const submissionTimelineData = useMemo(() => {
    if (!userDetails) return []

    return userDetails.contestSubmissions
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((submission) => {
        const date = new Date(submission.createdAt)
        return {
          time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          score: submission.score,
          status: submission.status === "ACCEPTED" ? 1 : 0,
          question:
            submission.question.title.length > 10
              ? submission.question.title.substring(0, 10) + "..."
              : submission.question.title,
        }
      })
  }, [userDetails])

  const chartConfig = {
    score: {
      label: "Participants",
      color: "hsl(var(--chart-1))",
    },
    problems: {
      label: "Participants",
      color: "hsl(var(--chart-2))",
    },
    progress: {
      label: "Score",
      color: "hsl(var(--chart-5))",
    },
    testCase: {
      label: "Success Rate",
      color: "hsl(var(--chart-3))",
    },
    performance: {
      label: "Score",
      color: "hsl(var(--chart-4))",
    },
    timeline: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  }

  // Get access token from cookies
  const getAccessToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1]
  }

  // Fetch ongoing contests
  const fetchContests = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const token = getAccessToken()
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/contests?status=ONGOING`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401 || response.status === 403) {
        router.push("/dashboard")
        return
      }

      const data: ContestsResponse | { success: boolean; error?: string } = await response.json()

      if (
        (data as { success: boolean; error?: string })?.success === false &&
        String((data as { success: boolean; error?: string }).error ?? "")
          .toLowerCase()
          .includes("unauthorized")
      ) {
        router.push("/dashboard")
        return
      }

      if (response.ok) {
        const contestsData = data as ContestsResponse
        setContests(contestsData.contests)
      } else {
        console.error("Failed to fetch contests:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching contests:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch contest leaderboard
  const fetchLeaderboard = async (contestId: string) => {
    setLeaderboardLoading(true)
    try {
      const token = getAccessToken()
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/contests/${contestId}/leaderboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401 || response.status === 403) {
        router.push("/dashboard")
        return
      }

      const data: LeaderboardResponse | { success: boolean; error?: string } = await response.json()

      if (
        (data as { success: boolean; error?: string })?.success === false &&
        String((data as { success: boolean; error?: string }).error ?? "")
          .toLowerCase()
          .includes("unauthorized")
      ) {
        router.push("/dashboard")
        return
      }

      if (response.ok) {
        const leaderboardData = data as LeaderboardResponse
        setLeaderboard(leaderboardData.leaderboard)
        setShowLeaderboard(true)
      } else {
        console.error("Failed to fetch leaderboard:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLeaderboardLoading(false)
    }
  }

  // Fetch user details
  const fetchUserDetails = async (contestId: string, userId: string) => {
    setUserDetailsLoading(true)
    setSelectedUserId(userId)
    try {
      const token = getAccessToken()
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/contests/${contestId}/user-details/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401 || response.status === 403) {
        router.push("/dashboard")
        return
      }

      const data: UserDetailsResponse | { success: boolean; error?: string } = await response.json()

      if (
        (data as { success: boolean; error?: string })?.success === false &&
        String((data as { success: boolean; error?: string }).error ?? "")
          .toLowerCase()
          .includes("unauthorized")
      ) {
        router.push("/dashboard")
        return
      }

      if (response.ok) {
        const detailsData = data as UserDetailsResponse
        setUserDetails(detailsData)
        setShowUserDetails(true)
      } else {
        console.error("Failed to fetch user details:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setUserDetailsLoading(false)
    }
  }

  // Refresh function
  const handleRefresh = () => {
    fetchContests(true)
    if (showLeaderboard && selectedContest) {
      fetchLeaderboard(selectedContest.id)
    }
    if (showUserDetails && selectedContest && selectedUserId) {
      fetchUserDetails(selectedContest.id, selectedUserId)
    }
  }

  useEffect(() => {
    fetchContests()
  }, [])

  const handleViewLeaderboard = (contest: Contest) => {
    setSelectedContest(contest)
    fetchLeaderboard(contest.id)
  }

  const handleViewUserDetails = (userId: string) => {
    if (selectedContest) {
      fetchUserDetails(selectedContest.id, userId)
    }
  }

  const handleViewSubmissionDetails = (submission: Submission) => {
    setSelectedSubmission(submission)
    setShowSubmissionDetails(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "text-green-400"
      case "WRONG_ANSWER":
        return "text-red-400"
      case "TIME_LIMIT_EXCEEDED":
        return "text-yellow-400"
      case "RUNTIME_ERROR":
        return "text-orange-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "WRONG_ANSWER":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-400" />
      case 2:
        return <Trophy className="h-4 w-4 text-gray-300" />
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-gray-400">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminProtectedRoute>
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Manage CodeClash platform and monitor system activities
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-800 bg-transparent text-sm"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Badge variant="secondary" className="flex items-center gap-2 bg-gray-800 text-gray-200 text-xs">
                <Shield className="h-4 w-4" />
                Admin Access
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          {sortedLeaderboard.length > 0 && (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                    <div className="text-lg sm:text-2xl font-bold text-white">{sortedLeaderboard.length}</div>
                  </div>
                  <p className="text-xs text-gray-400">Total Participants</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {Math.max(...sortedLeaderboard.map((l) => l.score))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Highest Score</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {Math.round(sortedLeaderboard.reduce((acc, l) => acc + l.score, 0) / sortedLeaderboard.length)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Average Score</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {Math.max(...sortedLeaderboard.map((l) => l.problemsSolved))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Max Problems Solved</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts with normal axis */}
          {sortedLeaderboard.length > 0 && (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                    <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
                    Score Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-xs sm:text-sm">
                    Distribution of participant scores across different ranges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] lg:h-[350px]">
                    <LineChart data={scoreDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="range"
                        tick={{ fill: "#9CA3AF", fontSize: 10 }}
                        axisLine={{ stroke: "#4B5563" }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={{ stroke: "#4B5563" }} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-score)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: "var(--color-score)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Problems Solved Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-xs sm:text-sm">
                    Number of participants by problems solved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] lg:h-[350px]">
                    <LineChart data={problemsSolvedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="problems"
                        tick={{ fill: "#9CA3AF", fontSize: 10 }}
                        axisLine={{ stroke: "#4B5563" }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={{ stroke: "#4B5563" }} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-problems)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-problems)", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: "var(--color-problems)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ongoing Contests */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Ongoing Contests</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor active coding competitions and their participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-400">Loading contests...</div>
                </div>
              ) : sortedContests.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-400">No ongoing contests found</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Contest Title</TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Creator</TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                            Start Time
                          </TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                            End Time
                          </TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Status</TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedContests.map((contest) => (
                          <TableRow key={contest.id} className="border-gray-600">
                            <TableCell className="font-medium text-white text-xs sm:text-sm">{contest.title}</TableCell>
                            <TableCell className="text-gray-300 text-xs sm:text-sm">
                              {contest.creator.username}
                            </TableCell>
                            <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                              {new Date(contest.startTime).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                              {new Date(contest.endTime).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-green-900 text-green-200 text-xs">
                                {contest.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewLeaderboard(contest)}
                                disabled={leaderboardLoading}
                                className="border-gray-600 text-white hover:bg-gray-700 text-xs"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">View Leaderboard</span>
                                <span className="sm:hidden">View</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard Dialog */}
          <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
            <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[80vh] bg-gray-900 border-gray-600">
              <DialogHeader>
                <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
                  <span className="flex items-center gap-2 text-sm sm:text-base">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    {selectedContest?.title} - Leaderboard
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => selectedContest && fetchLeaderboard(selectedContest.id)}
                    disabled={leaderboardLoading}
                    className="text-white hover:bg-gray-700 self-start sm:self-auto"
                  >
                    <RefreshCw className={`h-4 w-4 ${leaderboardLoading ? "animate-spin" : ""}`} />
                  </Button>
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-xs sm:text-sm">
                  Contest participants ranked by score and submission time
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] overflow-x-auto">
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-gray-400">Loading leaderboard...</div>
                  </div>
                ) : (
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Rank</TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Username</TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Score</TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Problems</TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                            Last Submission
                          </TableHead>
                          <TableHead className="text-gray-300 text-xs sm:text-sm">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedLeaderboard.map((entry) => (
                          <TableRow key={entry.user.id} className="border-gray-600">
                            <TableCell className="font-medium text-white text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                {getRankIcon(entry.rank)}
                                {entry.rank > 3 && `#${entry.rank}`}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300 text-xs sm:text-sm">{entry.user.username}</TableCell>
                            <TableCell className="text-gray-300 font-semibold text-xs sm:text-sm">
                              {entry.score}
                            </TableCell>
                            <TableCell className="text-gray-300 text-xs sm:text-sm">{entry.problemsSolved}</TableCell>
                            <TableCell className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                              {entry.lastSubmissionTime
                                ? new Date(entry.lastSubmissionTime).toLocaleString()
                                : "No submissions"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUserDetails(entry.user.id)}
                                disabled={userDetailsLoading}
                                className="border-gray-600 text-white hover:bg-gray-700 text-xs"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">View</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* User Details Dialog with New Charts */}
          <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
            <DialogContent className="w-[95vw] max-w-7xl h-[95vh] max-h-[90vh] bg-gray-900 border-gray-600">
              <DialogHeader>
                <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
                  <span className="text-sm sm:text-base">{userDetails?.userDetails.username} - Contest Details</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      selectedContest && selectedUserId && fetchUserDetails(selectedContest.id, selectedUserId)
                    }
                    disabled={userDetailsLoading}
                    className="text-white hover:bg-gray-700 self-start sm:self-auto"
                  >
                    <RefreshCw className={`h-4 w-4 ${userDetailsLoading ? "animate-spin" : ""}`} />
                  </Button>
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-xs sm:text-sm">
                  Email: {userDetails?.userDetails.email} | Total Score: {userDetails?.totalScore} | Submissions:{" "}
                  {userDetails?.totalSubmissions}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[75vh] overflow-x-auto">
                {userDetailsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-gray-400">Loading user details...</div>
                  </div>
                ) : userDetails ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* User Stats */}
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                      <Card className="bg-gray-800 border-gray-600">
                        <CardContent className="p-3 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-white">{userDetails.totalScore}</div>
                          <p className="text-xs text-gray-400">Total Score</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-600">
                        <CardContent className="p-3 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-white">{userDetails.totalSubmissions}</div>
                          <p className="text-xs text-gray-400">Total Submissions</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-600">
                        <CardContent className="p-3 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-green-400">
                            {userDetails.totalPassedTestCases}
                          </div>
                          <p className="text-xs text-gray-400">Passed Test Cases</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-800 border-gray-600">
                        <CardContent className="p-3 sm:p-4">
                          <div className="text-lg sm:text-2xl font-bold text-red-400">
                            {userDetails.totalFailedTestCases}
                          </div>
                          <p className="text-xs text-gray-400">Failed Test Cases</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* User Analytics Charts */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                      <Card className="bg-gray-800 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            Score Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer config={chartConfig} className="h-[150px] sm:h-[200px]">
                            <LineChart data={userScoreProgressData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis
                                dataKey="submission"
                                tick={{ fill: "#9CA3AF", fontSize: 9 }}
                                axisLine={{ stroke: "#4B5563" }}
                              />
                              <YAxis tick={{ fill: "#9CA3AF", fontSize: 9 }} axisLine={{ stroke: "#4B5563" }} />
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                                contentStyle={{
                                  backgroundColor: "#1F2937",
                                  border: "1px solid #374151",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="cumulativeScore"
                                stroke="var(--color-progress)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-progress)", strokeWidth: 2, r: 2 }}
                                activeDot={{ r: 4, stroke: "var(--color-progress)", strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                            Test Case Success
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer config={chartConfig} className="h-[150px] sm:h-[200px]">
                            <LineChart data={testCaseSuccessData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis
                                dataKey="submission"
                                tick={{ fill: "#9CA3AF", fontSize: 9 }}
                                axisLine={{ stroke: "#4B5563" }}
                              />
                              <YAxis tick={{ fill: "#9CA3AF", fontSize: 9 }} axisLine={{ stroke: "#4B5563" }} />
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                                contentStyle={{
                                  backgroundColor: "#1F2937",
                                  border: "1px solid #374151",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="successRate"
                                stroke="var(--color-testCase)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-testCase)", strokeWidth: 2, r: 2 }}
                                activeDot={{ r: 4, stroke: "var(--color-testCase)", strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                            Question Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer config={chartConfig} className="h-[150px] sm:h-[200px]">
                            <BarChart data={questionPerformanceData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis
                                dataKey="question"
                                tick={{ fill: "#9CA3AF", fontSize: 8 }}
                                axisLine={{ stroke: "#4B5563" }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis tick={{ fill: "#9CA3AF", fontSize: 9 }} axisLine={{ stroke: "#4B5563" }} />
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                                contentStyle={{
                                  backgroundColor: "#1F2937",
                                  border: "1px solid #374151",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                }}
                              />
                              <Bar dataKey="maxScore" fill="var(--color-performance)" radius={[2, 2, 0, 0]} />
                            </BarChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            Submission Timeline
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer config={chartConfig} className="h-[150px] sm:h-[200px]">
                            <LineChart data={submissionTimelineData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis
                                dataKey="time"
                                tick={{ fill: "#9CA3AF", fontSize: 8 }}
                                axisLine={{ stroke: "#4B5563" }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                              />
                              <YAxis tick={{ fill: "#9CA3AF", fontSize: 9 }} axisLine={{ stroke: "#4B5563" }} />
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                                contentStyle={{
                                  backgroundColor: "#1F2937",
                                  border: "1px solid #374151",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="score"
                                stroke="var(--color-timeline)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-timeline)", strokeWidth: 2, r: 2 }}
                                activeDot={{ r: 4, stroke: "var(--color-timeline)", strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Submissions */}
                    <Card className="bg-gray-800 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-sm sm:text-base">Contest Submissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <div className="min-w-[700px]">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-600">
                                  <TableHead className="text-gray-300 text-xs sm:text-sm">Question</TableHead>
                                  <TableHead className="text-gray-300 text-xs sm:text-sm">Language</TableHead>
                                  <TableHead className="text-gray-300 text-xs sm:text-sm">Status</TableHead>
                                  <TableHead className="text-gray-300 text-xs sm:text-sm">Score</TableHead>
                                  <TableHead className="text-gray-300 text-xs sm:text-sm">Test Cases</TableHead>
                                  <TableHead className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">
                                    Submitted At
                                  </TableHead>
                                  <TableHead className="text-gray-300 text-xs sm:text-sm">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {userDetails.contestSubmissions.map((submission) => (
                                  <TableRow key={submission.id} className="border-gray-600">
                                    <TableCell className="font-medium text-white text-xs sm:text-sm">
                                      {submission.question.title}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="border-gray-500 text-gray-300 text-xs">
                                        {submission.language}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div
                                        className={`flex items-center gap-1 sm:gap-2 ${getStatusColor(submission.status)}`}
                                      >
                                        {getStatusIcon(submission.status)}
                                        <span className="text-xs sm:text-sm">
                                          {submission.status.replace("_", " ")}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-gray-300 font-semibold text-xs sm:text-sm">
                                      {submission.score}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                      <span className="text-green-400">{submission.passedTestCases}</span>/
                                      <span className="text-gray-400">{submission.totalTestCases}</span>
                                    </TableCell>
                                    <TableCell className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">
                                      {new Date(submission.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewSubmissionDetails(submission)}
                                        className="border-gray-600 text-white hover:bg-gray-700 text-xs"
                                      >
                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">View Code</span>
                                        <span className="sm:hidden">Code</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Submission Details Dialog */}
          <Dialog open={showSubmissionDetails} onOpenChange={setShowSubmissionDetails}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-600">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedSubmission?.question.title} - Submission Details
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Language: {selectedSubmission?.language} | Status: {selectedSubmission?.status.replace("_", " ")} |
                  Score: {selectedSubmission?.score}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                {selectedSubmission && (
                  <div className="space-y-6">
                    {/* Question Details */}
                    <Card className="bg-gray-800 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white">Question Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-gray-300">
                          <strong>Description:</strong> {selectedSubmission.question.description}
                        </p>
                        <p className="text-gray-300">
                          <strong>Input Format:</strong> {selectedSubmission.question.inputFormat}
                        </p>
                        <p className="text-gray-300">
                          <strong>Output Format:</strong> {selectedSubmission.question.outputFormat}
                        </p>
                        <p className="text-gray-300">
                          <strong>Constraints:</strong> {selectedSubmission.question.constraints}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Submitted Code */}
                    <Card className="bg-gray-800 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white">Submitted Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64 rounded-md border border-gray-600 p-4 font-mono text-sm bg-gray-950">
                          <pre>
                            <code className="text-gray-200">{selectedSubmission.code}</code>
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Test Cases */}
                    <Card className="bg-gray-800 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white">Test Cases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-600">
                              <TableHead className="text-gray-300">Input</TableHead>
                              <TableHead className="text-gray-300">Expected Output</TableHead>
                              <TableHead className="text-gray-300">Hidden</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedSubmission.question.testCases.map((testCase, index) => (
                              <TableRow key={testCase.id || index} className="border-gray-600">
                                <TableCell className="font-mono text-xs text-gray-300">{testCase.input}</TableCell>
                                <TableCell className="font-mono text-xs text-gray-300">{testCase.output}</TableCell>
                                <TableCell className="text-gray-300">{testCase.isHidden ? "Yes" : "No"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </AdminProtectedRoute>
    </div>
  )
}
