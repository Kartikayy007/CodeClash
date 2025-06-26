interface ContestFiltersProps {
  selectedStatus: "All" | "Scheduled" | "Ongoing" | "Completed";
  setSelectedStatus: (
    status: "All" | "Scheduled" | "Ongoing" | "Completed",
  ) => void;
}

const ContestFilters: React.FC<ContestFiltersProps> = ({
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <span>Filters</span>
        </h2>
        <p className="text-gray-400 text-sm">Filter contests by status</p>
      </div>
      
      <div className="space-y-3">
        {(
          ["All", "Scheduled", "Ongoing", "Completed"] as (
            | "All"
            | "Scheduled"
            | "Ongoing"
            | "Completed"
          )[]
        ).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              selectedStatus === status
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/25"
                : "text-gray-400 hover:text-cyan-400/80 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContestFilters;
