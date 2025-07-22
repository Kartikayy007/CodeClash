"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Eye, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
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
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null) // Track the current user ID
  
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [leaderboardLoading, setLeaderboardLoading] = useState(false)
    const [userDetailsLoading, setUserDetailsLoading] = useState(false)
  
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [showUserDetails, setShowUserDetails] = useState(false)
    const [showSubmissionDetails, setShowSubmissionDetails] = useState(false)
  
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
        // Redirect if unauthorized
        if (response.status === 401 || response.status === 403) {
          router.push('/dashboard')
          return
        }

        const data: ContestsResponse | { success: boolean; error?: string } = await response.json()
        if ((data as { success: boolean; error?: string })?.success === false && String((data as { success: boolean; error?: string }).error ?? '').toLowerCase().includes('unauthorized')) {
          router.push('/dashboard')
          return
        }

        if (response.ok) {
          const contestsData = data as ContestsResponse
          setContests(contestsData.contests)
        } else {
          console.error('Failed to fetch contests:', response.statusText)
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
        // Redirect if unauthorized
        if (response.status === 401 || response.status === 403) {
          router.push('/dashboard')
          return
        }

        const data: LeaderboardResponse | { success: boolean; error?: string } = await response.json()
        if ((data as { success: boolean; error?: string })?.success === false && String((data as { success: boolean; error?: string }).error ?? '').toLowerCase().includes('unauthorized')) {
          router.push('/dashboard')
          return
        }

        if (response.ok) {
          const leaderboardData = data as LeaderboardResponse
          setLeaderboard(leaderboardData.leaderboard)
          setShowLeaderboard(true)
        } else {
          console.error('Failed to fetch leaderboard:', response.statusText)
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
      setSelectedUserId(userId) // Store the user ID
      try {
        const token = getAccessToken()
        const response = await fetch(`${API_BASE_URL}/api/v1/admin/contests/${contestId}/user-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        // Redirect if unauthorized
        if (response.status === 401 || response.status === 403) {
          router.push('/dashboard')
          return
        }

        const data: UserDetailsResponse | { success: boolean; error?: string } = await response.json()
        if ((data as { success: boolean; error?: string })?.success === false && String((data as { success: boolean; error?: string }).error ?? '').toLowerCase().includes('unauthorized')) {
          router.push('/dashboard')
          return
        }

        if (response.ok) {
          const detailsData = data as UserDetailsResponse
          setUserDetails(detailsData)
          setShowUserDetails(true)
        } else {
          console.error('Failed to fetch user details:', response.statusText)
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
      // If leaderboard is currently shown, refresh it too
      if (showLeaderboard && selectedContest) {
        fetchLeaderboard(selectedContest.id)
      }
      // If user details are currently shown, refresh them too
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
  
    // Handler for viewing submission details
    const handleViewSubmissionDetails = (submission: Submission) => {
      setSelectedSubmission(submission)
      setShowSubmissionDetails(true)
    }
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case "ACCEPTED":
          return "text-green-600 dark:text-green-400"
        case "WRONG_ANSWER":
          return "text-red-600 dark:text-red-400"
        case "TIME_LIMIT_EXCEEDED":
          return "text-yellow-600 dark:text-yellow-400"
        case "RUNTIME_ERROR":
          return "text-orange-600 dark:text-orange-400"
        default:
          return "text-gray-600 dark:text-gray-400"
      }
    }
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "ACCEPTED":
          return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        case "WRONG_ANSWER":
          return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        default:
          return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      }
    }
  
    return (
      <AdminProtectedRoute>
        <div className="container mx-auto p-6 space-y-6 dark:bg-gray-900 min-h-screen">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">Admin Dashboard</h1>
              <p className="text-muted-foreground dark:text-gray-400">Manage CodeClash platform and monitor system activities</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Badge variant="secondary" className="flex items-center gap-2 dark:bg-gray-800 dark:text-gray-200">
                <Shield className="h-4 w-4" />
                Admin Access
              </Badge>
            </div>
          </div>
  
          {/* Ongoing Contests */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Ongoing Contests</CardTitle>
              <CardDescription className="dark:text-gray-400">Monitor active coding competitions and their participants</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground dark:text-gray-400">Loading contests...</div>
                </div>
              ) : contests.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground dark:text-gray-400">No ongoing contests found</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-600">
                      <TableHead className="dark:text-gray-300">Contest Title</TableHead>
                      <TableHead className="dark:text-gray-300">Creator</TableHead>
                      <TableHead className="dark:text-gray-300">Start Time</TableHead>
                      <TableHead className="dark:text-gray-300">End Time</TableHead>
                      <TableHead className="dark:text-gray-300">Status</TableHead>
                      <TableHead className="dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contests.map((contest) => (
                      <TableRow key={contest.id} className="dark:border-gray-600">
                        <TableCell className="font-medium dark:text-white">{contest.title}</TableCell>
                        <TableCell className="dark:text-gray-300">{contest.creator.username}</TableCell>
                        <TableCell className="dark:text-gray-300">{new Date(contest.startTime).toLocaleString()}</TableCell>
                        <TableCell className="dark:text-gray-300">{new Date(contest.endTime).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">{contest.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewLeaderboard(contest)}
                            disabled={leaderboardLoading}
                            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Leaderboard
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
  
          {/* Leaderboard Dialog */}
          <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
            <DialogContent className="max-w-4xl max-h-[80vh] dark:bg-gray-800 dark:border-gray-600">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between dark:text-white">
                  <span>{selectedContest?.title} - Leaderboard</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => selectedContest && fetchLeaderboard(selectedContest.id)}
                    disabled={leaderboardLoading}
                    className="dark:text-white dark:hover:bg-gray-700"
                  >
                    <RefreshCw className={`h-4 w-4 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400">Contest participants ranked by score and submission time</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground dark:text-gray-400">Loading leaderboard...</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:border-gray-600">
                        <TableHead className="dark:text-gray-300">Rank</TableHead>
                        <TableHead className="dark:text-gray-300">Username</TableHead>
                        <TableHead className="dark:text-gray-300">Score</TableHead>
                        <TableHead className="dark:text-gray-300">Problems Solved</TableHead>
                        <TableHead className="dark:text-gray-300">Last Submission</TableHead>
                        <TableHead className="dark:text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((entry) => (
                        <TableRow key={entry.user.id} className="dark:border-gray-600">
                          <TableCell className="font-medium dark:text-white">#{entry.rank}</TableCell>
                          <TableCell className="dark:text-gray-300">{entry.user.username}</TableCell>
                          <TableCell className="dark:text-gray-300">{entry.score}</TableCell>
                          <TableCell className="dark:text-gray-300">{entry.problemsSolved}</TableCell>
                          <TableCell className="dark:text-gray-300">
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
                              className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
  
          {/* User Details Dialog */}
          <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
            <DialogContent className="max-w-6xl max-h-[90vh] dark:bg-gray-800 dark:border-gray-600">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between dark:text-white">
                  <span>{userDetails?.userDetails.username} - Contest Details</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => selectedContest && selectedUserId && fetchUserDetails(selectedContest.id, selectedUserId)}
                    disabled={userDetailsLoading}
                    className="dark:text-white dark:hover:bg-gray-700"
                  >
                    <RefreshCw className={`h-4 w-4 ${userDetailsLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Email: {userDetails?.userDetails.email} | Total Score: {userDetails?.totalScore} | Submissions:{" "}
                  {userDetails?.totalSubmissions}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh]">
                {userDetailsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground dark:text-gray-400">Loading user details...</div>
                  </div>
                ) : userDetails ? (
                  <div className="space-y-6">
                    {/* User Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold dark:text-white">{userDetails.totalScore}</div>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">Total Score</p>
                        </CardContent>
                      </Card>
                      <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold dark:text-white">{userDetails.totalSubmissions}</div>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">Total Submissions</p>
                        </CardContent>
                      </Card>
                      <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userDetails.totalPassedTestCases}</div>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">Passed Test Cases</p>
                        </CardContent>
                      </Card>
                      <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{userDetails.totalFailedTestCases}</div>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">Failed Test Cases</p>
                        </CardContent>
                      </Card>
                    </div>
  
                    {/* Submissions */}
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardHeader>
                        <CardTitle className="dark:text-white">Contest Submissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="dark:border-gray-600">
                              <TableHead className="dark:text-gray-300">Question</TableHead>
                              <TableHead className="dark:text-gray-300">Language</TableHead>
                              <TableHead className="dark:text-gray-300">Status</TableHead>
                              <TableHead className="dark:text-gray-300">Score</TableHead>
                              <TableHead className="dark:text-gray-300">Test Cases</TableHead>
                              <TableHead className="dark:text-gray-300">Submitted At</TableHead>
                              <TableHead className="dark:text-gray-300">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userDetails.contestSubmissions.map((submission) => (
                              <TableRow key={submission.id} className="dark:border-gray-600">
                                <TableCell className="font-medium dark:text-white">{submission.question.title}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="dark:border-gray-500 dark:text-gray-300">{submission.language}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className={`flex items-center gap-2 ${getStatusColor(submission.status)}`}>
                                    {getStatusIcon(submission.status)}
                                    {submission.status.replace("_", " ")}
                                  </div>
                                </TableCell>
                                <TableCell className="dark:text-gray-300">{submission.score}</TableCell>
                                <TableCell>
                                  <span className="text-green-600 dark:text-green-400">{submission.passedTestCases}</span>/
                                  <span className="text-gray-600 dark:text-gray-400">{submission.totalTestCases}</span>
                                </TableCell>
                                <TableCell className="dark:text-gray-300">{new Date(submission.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewSubmissionDetails(submission)}
                                    className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Code
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </ScrollArea>
            </DialogContent>
          </Dialog>
  
          {/* Submission Details Dialog */}
          <Dialog open={showSubmissionDetails} onOpenChange={setShowSubmissionDetails}>
            <DialogContent className="max-w-4xl max-h-[90vh] dark:bg-gray-800 dark:border-gray-600">
              <DialogHeader>
                <DialogTitle className="dark:text-white">{selectedSubmission?.question.title} - Submission Details</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Language: {selectedSubmission?.language} | Status: {selectedSubmission?.status.replace("_", " ")} |
                  Score: {selectedSubmission?.score}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                {selectedSubmission && (
                  <div className="space-y-6">
                    {/* Question Details */}
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardHeader>
                        <CardTitle className="dark:text-white">Question Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="dark:text-gray-300">
                          <strong>Description:</strong> {selectedSubmission.question.description}
                        </p>
                        <p className="dark:text-gray-300">
                          <strong>Input Format:</strong> {selectedSubmission.question.inputFormat}
                        </p>
                        <p className="dark:text-gray-300">
                          <strong>Output Format:</strong> {selectedSubmission.question.outputFormat}
                        </p>
                        <p className="dark:text-gray-300">
                          <strong>Constraints:</strong> {selectedSubmission.question.constraints}
                        </p>
                      </CardContent>
                    </Card>
  
                    {/* Submitted Code */}
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardHeader>
                        <CardTitle className="dark:text-white">Submitted Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64 rounded-md border dark:border-gray-600 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900">
                          <pre>
                            <code className="dark:text-gray-200">{selectedSubmission.code}</code>
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
  
                    {/* Test Cases */}
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardHeader>
                        <CardTitle className="dark:text-white">Test Cases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="dark:border-gray-600">
                              <TableHead className="dark:text-gray-300">Input</TableHead>
                              <TableHead className="dark:text-gray-300">Expected Output</TableHead>
                              <TableHead className="dark:text-gray-300">Hidden</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedSubmission.question.testCases.map((testCase, index) => (
                              <TableRow key={testCase.id || index} className="dark:border-gray-600">
                                <TableCell className="font-mono text-xs dark:text-gray-300">{testCase.input}</TableCell>
                                <TableCell className="font-mono text-xs dark:text-gray-300">{testCase.output}</TableCell>
                                <TableCell className="dark:text-gray-300">{testCase.isHidden ? "Yes" : "No"}</TableCell>
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
    )
}