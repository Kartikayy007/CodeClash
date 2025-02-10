import ContestRow from './ContestRow';

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
      <div className="flex-1 bg-[#1A1D24] rounded-lg p-6">
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
          No matches found
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#1A1D24] rounded-lg p-6">
      <div className="grid grid-cols-5 gap-4 mb-4 text-gray-400 font-medium">
        <div>Name</div>
        <div>Start Date</div>
        <div>Duration</div>
        <div>Participants</div>
        <div>Status</div>
      </div>
      <div className="space-y-4">
        {contests.map((contest, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 p-4 bg-[#292C33] rounded-lg hover:bg-[#31343C] transition-colors cursor-pointer"
          >
            <div className="text-white">{contest.name}</div>
            <div className="text-gray-400">{contest.startDate}</div>
            <div className="text-gray-400">{contest.duration}</div>
            <div className="text-gray-400">{contest.participants}</div>
            <div>
              <span className={`px-2 py-1 rounded text-sm ${
                contest.status === 'ONGOING' ? 'bg-green-500/20 text-green-500' :
                contest.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500' :
                'bg-yellow-500/20 text-yellow-500'
              }`}>
                {contest.status.charAt(0) + contest.status.slice(1).toLowerCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
