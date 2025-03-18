import React from 'react';

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

export default function ContestTable({ contests, loading, error }: ContestTableProps) {
  if (loading) {
    return (
      <div className="flex-1 bg-[#1A1D24] rounded-lg p-6 ">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700/20 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-[#1A1D24] rounded-lg p-6">
        <div className="text-red-500 text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!contests.length) {
    return (
      <div className="flex-1 bg-[#1A1D24] rounded-lg p-6">
        <div className="text-gray-400 text-center">
          No contests found
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#1A1D24] rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Start Date</th>
              <th className="text-center">Duration</th>
              <th className="text-center">Participants</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest, index) => (
              <tr key={index} className="h-[50px] p-4 hover:bg-[#31343C] transition-colors cursor-pointer">
                <td className="text-gray-400 text-center px-4">{contest.name}</td>
                <td className="text-gray-400 text-center px-4">{contest.startDate}</td>
                <td className="text-gray-400 text-center px-4">{contest.duration}</td>
                <td className="text-gray-400 text-center px-4">{contest.participants}</td>
                <td className="px-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    contest.status === 'ONGOING' ? 'bg-green-500/20 text-green-500' :
                    contest.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {contest.status.charAt(0) + contest.status.slice(1).toLowerCase()}
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
