"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
// import Image from "next/image";
import LabelButton from "@/components/ui/LabelButton"
// import { ArrowLeft } from 'lucide-react';
import type { Contest } from "@/features/contests/types/contest.types"
import { contestApi } from "@/features/contests/api/contestApi"
import toast from "react-hot-toast"
import Timer from "@/components/Contest/joinContest/Timer"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Users } from "lucide-react"

type TabType = "Description" | "Rules" | "Score" | "Prizes"

export default function ContestDetails() {
  const params = useParams()
  const router = useRouter()
  const contestId = params?.contestId as string
  const [activeTab, setActiveTab] = useState<TabType>("Description")
  const [contest, setContest] = useState<Contest>({
    id: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    isPublic: true,
    status: "UPCOMING",
    createdAt: "",
    organizationName: null,
    rules: null,
    prizes: null,
    score: null,
    creator: {
      id: "",
      username: "",
      rating: 0,
    },
    isRegistered: false,
    isCreator: false,
    userStats: null,
    participantCount: 0,
    questionCount: 0,
    questions: [],
  })
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    const fetchContestDetails = async () => {
      if (!contestId) return
      try {
        setLoading(true)
        const response = await contestApi.getContestDetails(contestId)
        if (response.contest.isRegistered === true && response.contest.status === "ONGOING") {
          router.push(`/contest/${contestId}`)
        }
        // if (
        //   response.contest.isRegistered === false &&
        //   response.contest.status === "ONGOING"
        // ) {
        //   toast.error("Contest has already started");
        //   setTimeout(() => {
        //     router.push(`/contest/join`);
        //   }, 1000);
        // }
        toast.success(response.message)
        if (response.contest) {
          setContest(response.contest)
        }
      } catch (error) {
        console.error("Error fetching contest details:", error)
        toast.error("Failed to fetch contest details")
      } finally {
        setLoading(false)
      }
    }
    fetchContestDetails()
  }, [contestId, router])

  const handleRegister = async () => {
    if (!contestId) return
    try {
      setRegistering(true)
      const response = await contestApi.registerForContest(contest.id)
      if (response.data) {
        toast.success(response.message || "Successfully joined the contest")
        router.push(`/contest/${contestId}`)
        const updatedDetails = await contestApi.getContestDetails(contestId)
        if (updatedDetails.contest) {
          setContest(updatedDetails.contest)
        }
      }
    } catch (error: unknown) {
      const errorMessage = "Failed to join the contest"
      console.error(errorMessage, error)
      toast.error(errorMessage)
    } finally {
      setRegistering(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Description":
        return (
          <div className="markdown-content text-gray-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contest.description || "# No description provided for this contest."}
            </ReactMarkdown>
          </div>
        )
      case "Rules":
        return (
          <div className="markdown-content text-gray-300">
            {/* <div>
              <p className="font-medium mb-2">Rules</p>
            </div> */}
            {contest.rules ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{contest.rules}</ReactMarkdown>
            ) : (
              <p>No rules specified for this contest.</p>
            )}
          </div>
        )
      case "Score":
        return (
          <div className="markdown-content text-gray-300">
            {/* <div>
              <p className="font-medium mb-2">Scoring</p>
            </div> */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contest.score || "No scoring system specified"}</ReactMarkdown>
          </div>
        )
      case "Prizes":
        return (
          <div className="markdown-content text-gray-300">
            {/* <div className="flex items-center gap-4 mb-4">
              <Image src="/gold.svg" alt="1st Prize" width={40} height={40} />
              <h3 className="text-xl font-medium">Prizes</h3>
            </div> */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contest.prizes || "No prize specified. Prizes will be announced soon."}
            </ReactMarkdown>
          </div>
        )
      default:
        return null
    }
  }

  // Add this array of quotes at the top of your component
  const loadingQuotes = [
    "Every expert was once a beginner. Every pro was once an amateur.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Victory belongs to the most persevering.",
    "Champions are made when nobody's watching.",
    "The battlefield is won in the mind before it's won in the field.",
    "Preparation prevents poor performance.",
    "Train hard, fight easy.",
    "Excellence is never an accident. It is always the result of high intention.",
    "The harder you work, the luckier you get.",
    "Discipline is the bridge between goals and accomplishment.",
    "Focus on the process, not the outcome.",
    "Great things never come from comfort zones.",
    "Your only limit is your mindset.",
    "Winners never quit, quitters never win.",
  ]

  // Add this function to get a random quote
  const getRandomQuote = () => {
    return loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)]
  }

  // Replace your loading return statement with this:
  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141D] text-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
          {/* Random quote */}
          <div className="mb-6">
            <p className="text-lg md:text-xl font-medium text-gray-300">&quot;{getRandomQuote()}&quot;</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-2 md:p-2 relative overflow-hidden">
      <style jsx global>{`
        .markdown-content {
          /* Base text styling */
          color: #d1d5db;
          line-height: 1.6;
        }
        .markdown-content h1 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.4rem;
          margin-bottom: 0.8rem;
          color: white;
        }
        .markdown-content h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-top: 1.3rem;
          margin-bottom: 0.6rem;
          color: white;
        }
        .markdown-content h4, .markdown-content h5, .markdown-content h6 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
          color: white;
        }
        .markdown-content p {
          margin-bottom: 1rem;
        }
        .markdown-content ul, .markdown-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content ul {
          list-style-type: disc;
        }
        .markdown-content ol {
          list-style-type: decimal;
        }
        .markdown-content li {
          margin-bottom: 0.5rem;
        }
        .markdown-content a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .markdown-content blockquote {
          border-left: 4px solid #4b5563;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
          color: #9ca3af;
        }
        .markdown-content pre {
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .markdown-content code {
          background: #282c34;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .markdown-content th, .markdown-content td {
          border: 1px solid #4b5563;
          padding: 0.5rem;
          text-align: left;
        }
        .markdown-content th {
          background: #282c34;
        }
        .markdown-content hr {
          border: 0;
          border-top: 1px solid #4b5563;
          margin: 1.5rem 0;
        }
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
      `}</style>
      <div className="container mx-auto p-6 relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
              <p className="text-cyan-400/80">
                {new Date(contest.startTime).toLocaleString()} to {new Date(contest.endTime).toLocaleString()}
              </p>
              {contest.organizationName && (
                <p className="text-gray-400 text-sm mt-1">Organized by {contest.organizationName}</p>
              )}
            </div>

            {contest.isRegistered && contest.status === "UPCOMING" && (

              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-6">Contest starts in</h2>
                <div className="flex justify-center">
                  <Timer startTime={contest.startTime} contestId={contest.id} />
                </div>
              </div>
            )}

            <div className="flex-shrink-0">
              <LabelButton onClick={handleRegister} disabled={registering || contest.isRegistered}>
                {registering ? "Registering..." : contest.isRegistered ? "Registered" : "Register"}
              </LabelButton>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <h2 className="text-xl font-semibold text-white mb-4">Contest Details</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-cyan-400 text-sm font-medium">Start Time</span>
                  <span className="text-gray-300 text-sm">{new Date(contest.startTime).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-cyan-400 text-sm font-medium">End Time</span>
                  <span className="text-gray-300 text-sm">{new Date(contest.endTime).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-cyan-400 text-sm font-medium">Created by</span>
                  <span className="text-gray-300 text-sm">{contest.creator.username}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-cyan-400 text-sm font-medium">Participants</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 w-fit">
                    <Users className="w-3 h-3" />
                    {contest.participantCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              {/* Tabs */}
              <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {(["Description", "Rules", "Score", "Prizes"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200 ${activeTab === tab
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/25"
                        : "text-gray-400 hover:text-cyan-400/80 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Content */}
              <div className="text-gray-300">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
