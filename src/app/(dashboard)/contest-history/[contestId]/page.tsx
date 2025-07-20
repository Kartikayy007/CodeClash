"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Timer,
  User,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Leaderboard from "@/components/Contest/contestPage/Leaderboard"
import ProblemSet from "@/components/Contest/PreviewContest/ProblemSet"

interface Contest {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  isPublic: boolean
  status: "UPCOMING" | "ONGOING" | "ENDED"
  createdAt: string
  organizationName?: string| null
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



export default function PastContestPage() {
  const params = useParams()
  const router = useRouter()
  const contestId = params.contestId as string

  const [contest, setContest] = useState<Contest | null>(null)
  const [, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
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


  useEffect(() => {
    if (!contestId) return
    fetchContestDetails()
  }, [contestId, fetchContestDetails])



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
                {(() => {
                  const score = (contest.userStats as Record<string, unknown>)?.score;
                  return (
                    <span className="text-lg font-semibold text-emerald-400">
                      {typeof score === "number" || typeof score === "string" ? score : 0}
                    </span>
                  );
                })()}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Rank</span>
                {(() => {
                  const rank = (contest.userStats as Record<string, unknown>)?.rank;
                  return (
                    <span className="text-lg font-semibold text-cyan-400">
                      {typeof rank === "number" || typeof rank === "string" ? rank : "N/A"}
                    </span>
                  );
                })()}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Joined</span>
                <span className="text-sm text-gray-300">
                  {(() => {
                    const joinedAt = (contest.userStats as Record<string, unknown>)?.joinedAt;
                    if (typeof joinedAt === "string" || typeof joinedAt === "number") {
                      return new Date(joinedAt).toLocaleDateString();
                    }
                    return "N/A";
                  })()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderLeaderboardTab = () => (
    <Leaderboard
      contestId={contestId}
    />  
  )

  const handleViewProblem = useCallback(
    (problemId: string) => {
      router.push(`/contest/${contestId}/problem/${problemId}`)
    },
    [router, contestId],
  )

  const renderQuestionsTab = () => (
    <ProblemSet
      problems={contest?.questions || []}
      onSolveProblem={handleViewProblem}
      isLoading={loading}
    />
  )



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
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25"
            >
              Questions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-8">
            {renderOverviewTab()}
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-8">
            {renderLeaderboardTab()}
          </TabsContent>
          
          <TabsContent value="questions" className="mt-8">
            {renderQuestionsTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
