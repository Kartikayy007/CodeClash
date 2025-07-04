"use client"

import { useEffect, useState } from "react"
import ContestFilters from "@/components/RecentContests/ContestFilters"
import ContestTable from "@/components/RecentContests/ContestTable"

interface Contest {
  contestId: string
  title: string
  startTime: string
  endTime: string
  status: "UPCOMING" | "ONGOING" | "ENDED"
  participantCount: number
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          setError("No access token found")
          setLoading(false)
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contest/my-contests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        if (data.contests && Array.isArray(data.contests)) {
          setContests(data.contests)
        } else {
          setContests([])
        }
      } catch {
        setError("Failed to fetch contests")
        setContests([])
      } finally {
        setLoading(false)
      }
    }

    fetchContests()
  }, [])

  // Filter contests based on selected status
  const filteredContests: Contest[] = contests.filter((contest) => {
    return selectedStatus === "All" || contest.status === selectedStatus
  })

  return (
    <div className="min-h-screen py-4 md:p-6 relative overflow-hidden">


      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recent Contests</h1>
          <p className="text-cyan-400/80">Track your competitive coding performance</p>
        </div>
        {/* Filters Section - Now at the top */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl px-6 py-4 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <ContestFilters contests={contests} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
        </div>

        {/* Contest Table Section */}
        <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <ContestTable contests={filteredContests} loading={loading} error={error} />
        </div>
      </div>
    </div>
  )
}
