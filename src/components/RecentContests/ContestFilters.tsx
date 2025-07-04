"use client"

import type React from "react"

interface ContestFiltersProps {
  contests: Array<{ status: string }>
  selectedStatus: string
  setSelectedStatus: (status: string) => void
}

const ContestFilters: React.FC<ContestFiltersProps> = ({ contests, selectedStatus, setSelectedStatus }) => {
  // Compute unique statuses from contests
  const statusSet = new Set<string>(contests.map((c) => c.status))
  const statusOptions = ["All", ...Array.from(statusSet)]

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-gray-400 text-sm font-medium mr-2">Filter by:</span>
      {statusOptions.map((status) => (
        <button
          key={status}
          onClick={() => setSelectedStatus(status)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
            selectedStatus === status
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/25"
              : "text-gray-400 hover:text-cyan-400/80 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 bg-gray-800/50"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  )
}

export default ContestFilters
