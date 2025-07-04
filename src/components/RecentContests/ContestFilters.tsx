interface ContestFiltersProps {
  contests: Array<{ status: string }>; // Add contests prop
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const ContestFilters: React.FC<ContestFiltersProps> = ({
  contests,
  selectedStatus,
  setSelectedStatus,
}) => {
  // Compute unique statuses from contests
  const statusSet = new Set<string>(contests.map((c) => c.status));
  const statusOptions = ["All", ...Array.from(statusSet)];

  return (
    <div className="">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <span>Filters</span>
        </h2>
        <p className="text-gray-400 text-sm">Filter contests by status</p>
      </div>
      <div className="space-y-3">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              selectedStatus === status
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/25"
                : "text-gray-400 hover:text-cyan-400/80 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContestFilters;
