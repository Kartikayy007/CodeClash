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
import { Shield, Eye, Clock, CheckCircle, XCircle } from "lucide-react"
import type {
    Contest,
    ContestsResponse,
    LeaderboardResponse,
    LeaderboardEntry,
    UserDetailsResponse,
    Submission, // Changed from ContestSubmission
} from "@/types/admin-api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function AdminDashboard() {
    const router = useRouter()
    const [contests, setContests] = useState<Contest[]>([])
    const [selectedContest, setSelectedContest] = useState<Contest | null>(null)
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [userDetails, setUserDetails] = useState<UserDetailsResponse | null>(null)
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null) // Updated type
  
    const [loading, setLoading] = useState(true)
    const [leaderboardLoading, setLeaderboardLoading] = useState(false)
    const [userDetailsLoading, setUserDetailsLoading] = useState(false)
  
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [showUserDetails, setShowUserDetails] = useState(false)
    const [showSubmissionDetails, setShowSubmissionDetails] = useState(false) // New state for submission details dialog
  
    // Get access token from cookies
    const getAccessToken = () => {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1]
    }
  
    // Fetch ongoing contests
    const fetchContests = async () => {
      setLoading(true)
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
  
    // New handler for viewing submission details
    const handleViewSubmissionDetails = (submission: Submission) => {
      // Updated type
      setSelectedSubmission(submission)
      setShowSubmissionDetails(true)
    }
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case "ACCEPTED":
          return "text-green-600"
        case "WRONG_ANSWER":
          return "text-red-600"
        case "TIME_LIMIT_EXCEEDED":
          return "text-yellow-600"
        case "RUNTIME_ERROR":
          return "text-orange-600"
        default:
          return "text-gray-600"
      }
    }
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "ACCEPTED":
          return <CheckCircle className="h-4 w-4 text-green-600" />
        case "WRONG_ANSWER":
          return <XCircle className="h-4 w-4 text-red-600" />
        default:
          return <Clock className="h-4 w-4 text-yellow-600" />
      }
    }
  
    return (
      <AdminProtectedRoute>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage CodeClash platform and monitor system activities</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Access
            </Badge>
          </div>
  
          {/* Ongoing Contests */}
          <Card>
            <CardHeader>
              <CardTitle>Ongoing Contests</CardTitle>
              <CardDescription>Monitor active coding competitions and their participants</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading contests...</div>
                </div>
              ) : contests.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">No ongoing contests found</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contest Title</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contests.map((contest) => (
                      <TableRow key={contest.id}>
                        <TableCell className="font-medium">{contest.title}</TableCell>
                        <TableCell>{contest.creator.username}</TableCell>
                        <TableCell>{new Date(contest.startTime).toLocaleString()}</TableCell>
                        <TableCell>{new Date(contest.endTime).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{contest.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewLeaderboard(contest)}
                            disabled={leaderboardLoading}
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
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{selectedContest?.title} - Leaderboard</DialogTitle>
                <DialogDescription>Contest participants ranked by score and submission time</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground">Loading leaderboard...</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Problems Solved</TableHead>
                        <TableHead>Last Submission</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((entry) => (
                        <TableRow key={entry.user.id}>
                          <TableCell className="font-medium">#{entry.rank}</TableCell>
                          <TableCell>{entry.user.username}</TableCell>
                          <TableCell>{entry.score}</TableCell>
                          <TableCell>{entry.problemsSolved}</TableCell>
                          <TableCell>
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
            <DialogContent className="max-w-6xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{userDetails?.userDetails.username} - Contest Details</DialogTitle>
                <DialogDescription>
                  Email: {userDetails?.userDetails.email} | Total Score: {userDetails?.totalScore} | Submissions:{" "}
                  {userDetails?.totalSubmissions}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh]">
                {userDetailsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground">Loading user details...</div>
                  </div>
                ) : userDetails ? (
                  <div className="space-y-6">
                    {/* User Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">{userDetails.totalScore}</div>
                          <p className="text-xs text-muted-foreground">Total Score</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">{userDetails.totalSubmissions}</div>
                          <p className="text-xs text-muted-foreground">Total Submissions</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">{userDetails.totalPassedTestCases}</div>
                          <p className="text-xs text-muted-foreground">Passed Test Cases</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-red-600">{userDetails.totalFailedTestCases}</div>
                          <p className="text-xs text-muted-foreground">Failed Test Cases</p>
                        </CardContent>
                      </Card>
                    </div>
  
                    {/* Submissions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Contest Submissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Question</TableHead>
                              <TableHead>Language</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Test Cases</TableHead>
                              <TableHead>Submitted At</TableHead>
                              <TableHead>Actions</TableHead> {/* New column for actions */}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userDetails.contestSubmissions.map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell className="font-medium">{submission.question.title}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{submission.language}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className={`flex items-center gap-2 ${getStatusColor(submission.status)}`}>
                                    {getStatusIcon(submission.status)}
                                    {submission.status.replace("_", " ")}
                                  </div>
                                </TableCell>
                                <TableCell>{submission.score}</TableCell>
                                <TableCell>
                                  <span className="text-green-600">{submission.passedTestCases}</span>/
                                  <span className="text-gray-600">{submission.totalTestCases}</span>
                                </TableCell>
                                <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewSubmissionDetails(submission)}
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
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{selectedSubmission?.question.title} - Submission Details</DialogTitle>
                <DialogDescription>
                  Language: {selectedSubmission?.language} | Status: {selectedSubmission?.status.replace("_", " ")} |
                  Score: {selectedSubmission?.score}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                {selectedSubmission && (
                  <div className="space-y-6">
                    {/* Question Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          <strong>Description:</strong> {selectedSubmission.question.description}
                        </p>
                        <p>
                          <strong>Input Format:</strong> {selectedSubmission.question.inputFormat}
                        </p>
                        <p>
                          <strong>Output Format:</strong> 
                          {selectedSubmission.question.outputFormat}
                        </p>
                        <p>
                          <strong>Constraints:</strong> {selectedSubmission.question.constraints}
                        </p>
                      </CardContent>
                    </Card>
  
                    {/* Submitted Code */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Submitted Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64 rounded-md border p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900">
                          <pre>
                            <code>{selectedSubmission.code}</code>
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
  
                    {/* Test Cases */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Test Cases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Input</TableHead>
                              <TableHead>Expected Output</TableHead>
                              <TableHead>Hidden</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedSubmission.question.testCases.map((testCase, index) => (
                              <TableRow key={testCase.id || index}>
                                <TableCell className="font-mono text-xs">{testCase.input}</TableCell>
                                <TableCell className="font-mono text-xs">{testCase.output}</TableCell>
                                <TableCell>{testCase.isHidden ? "Yes" : "No"}</TableCell>
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
  