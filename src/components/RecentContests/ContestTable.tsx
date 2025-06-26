import React from "react";

interface Contest {
  name: string;
  startDate: string;
  duration: string;
  participants: number;
  status: string;
  mode: string;
}

interface ContestTableProps {
  contests: Contest[];
  loading?: boolean;
  error?: string | null;
}

export default function ContestTable({
  contests,
  loading,
  error,
}: ContestTableProps) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-400 text-lg font-medium mb-2">Error Loading Contests</div>
          <div className="text-red-300 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!contests.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-cyan-400/60 text-lg font-medium mb-2">No contests found</div>
          <div className="text-gray-500 text-sm">Join or create contests to see them here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Start Date
              </th>
              <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Duration
              </th>
              <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Participants
              </th>
              <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {contests.map((contest, index) => (
              <tr
                key={index}
                className="hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-200 group cursor-pointer"
              >
                <td className="py-4 px-6">
                  <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-200">
                    {contest.name}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200">
                    {contest.startDate}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200 font-mono text-sm">
                    {contest.duration}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30">
                    {contest.participants}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                      contest.status === "ONGOING"
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/25"
                        : contest.status === "COMPLETED"
                          ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/25"
                          : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/25"
                    }`}
                  >
                    {contest.status.charAt(0) +
                      contest.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
