import React, { useState } from "react";

interface Contest {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  score: number;
  participantCount: number;
  hasReview: boolean;
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
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(contests.length / PAGE_SIZE);
  const paginatedContests = contests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {paginatedContests.map((contest) => {
              const start = new Date(contest.startTime);
              const end = new Date(contest.endTime);
              const durationMs = end.getTime() - start.getTime();
              const hours = Math.floor(durationMs / (1000 * 60 * 60));
              const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
              const duration = `${hours}h ${minutes}m`;
              return (
                <tr
                  key={contest.id}
                  className="hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-200 group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-200">
                      {contest.title}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200">
                      {start.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200 font-mono text-sm">
                      {duration}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30">
                      {contest.participantCount}
                    </div>
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded border border-cyan-500/30 text-cyan-400 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-cyan-400 font-mono text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border border-cyan-500/30 text-cyan-400 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
