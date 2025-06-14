"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"

interface SimpleAnnouncementsProps {
  className?: string
}

interface Announcement {
  id: number
  title: string
  description: string
  icon: any
  color: string
  isContest?: boolean
}

const SimpleAnnouncements: React.FC<SimpleAnnouncementsProps> = ({ className = "" }) => {
  const [loading, setLoading] = useState(true)

  // Simple announcements - manually update these
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "Next Contest: Weekly Challenge #15",
      description: "Sunday, 8:00 PM IST • Register now",
      icon: Calendar,
      color: "text-cyan-400",
      isContest: true,
    }
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-4 md:p-6 ${className}`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="h-6 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-4 md:p-6 border border-transparent hover:border-white/30 transition-all duration-300 ${className}`}
    >
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-white">Announcements</h2>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3">
        {announcements.map((announcement, index) => {
          const IconComponent = announcement.icon
          return (
            <div
              key={announcement.id}
              className={`flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-[1.01] cursor-pointer ${
                announcement.isContest ? "border border-cyan-400/40 bg-cyan-400/5" : ""
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.5s ease-out forwards",
              }}
            >
              <div
                className={`p-2 rounded-lg ${
                  announcement.isContest ? "bg-cyan-400/20 border border-cyan-400/30" : "bg-white/10"
                } flex-shrink-0`}
              >
                <IconComponent className={`w-5 h-5 ${announcement.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-base ${announcement.color} leading-tight`}>{announcement.title}</h3>
                <p className="text-white/70 text-sm mt-1">{announcement.description}</p>
              </div>
              {announcement.isContest && (
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <span className="text-white/40 text-xs font-mono">Last updated: 2:42 PM</span>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default SimpleAnnouncements
