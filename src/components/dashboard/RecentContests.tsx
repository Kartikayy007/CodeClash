import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface RecentContestsProps {
  className?: string;
}

export default function RecentContests({ className = '' }: RecentContestsProps) {
  const [contests, setContests] = useState<any[]>([])

  useEffect(() => {
    const fetchContests = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        console.error('No access token found in local storage')
        return
      }

      try {
        const response = await fetch('https://goyalshivansh.me/api/v1/contest/my-contests', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Fetched contests data:', data)

        if (data.contests && Array.isArray(data.contests)) {
          setContests(data.contests)
        } else {
          console.error('Expected contests array but got:', data)
          setContests([])
        }
      } catch (error) {
        console.error('Error fetching contests:', error)
        setContests([])
      }
    }

    fetchContests()
  }, [])

  // Function to calculate duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const duration = end.getTime() - start.getTime() // Duration in milliseconds

    const hours = Math.floor((duration % (1000 * 3600 * 24)) / (1000 * 3600))
    const minutes = Math.floor((duration % (1000 * 3600)) / (1000 * 60))

    return `${hours} hr ${minutes} min`
  }

  return (
    <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Contests</h2>
        <Link 
          href="/recent-contests" 
          className="text-base hover:text-white/80" 
          prefetch={true}
        >View All</Link>
      </div>

      <div className="flex gap-3 mb-6">
        <button className="px-2 py-1 bg-[#3d3d3d] rounded text-sm font-medium">
          Participated
        </button>
        <button className="px-2 py-1 rounded border border-[#888888] text-[#e7e7e7] text-sm font-medium hover:bg-white/5">
          Created
        </button>
      </div>

      <div className="grid grid-cols-4 bg-white/10 rounded-lg px-8 py-2 mb-4 text-sm font-medium">
        <span>Contest Name</span>
        <span>Score</span>
        <span>Participants</span>
        <span>Duration</span>
      </div>

      <div className="space-y-2">
        {contests.map((contest, index) => (
          <div key={index} className="grid grid-cols-5 bg-white/5 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 col-span-2">
              <div className="w-4 h-4" />
              <span className="text-base font-medium">{contest.title}</span>
            </div>
            <span className="text-sm">{contest.score}</span>
            <span className="text-sm">{contest.participantCount}</span>
            <div className="flex justify-between items-center">
              <span className="text-sm">{calculateDuration(contest.startTime, contest.endTime)}</span>
              {contest.hasReview && (
                <button className="text-[#b0b0b0] text-sm font-medium hover:text-white">
                  Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
