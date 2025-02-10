interface ContestFiltersProps {
    selectedStatus: 'All' | 'Scheduled' | 'Ongoing' | 'Completed';
    setSelectedStatus: (status: 'All' | 'Scheduled' | 'Ongoing' | 'Completed') => void;
  }
  
  const ContestFilters: React.FC<ContestFiltersProps> = ({ selectedStatus, setSelectedStatus }) => {
    return (
      <div className="mb-6 w-[20%]">
        <h2 className="text-white mb-4 flex items-center gap-2">
          <span className="text-lg">Filters</span>
        </h2>
        <div className="space-y-2">
          {(['All', 'Scheduled', 'Ongoing', 'Completed'] as ('All' | 'Scheduled' | 'Ongoing' | 'Completed')[]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`block w-[90%] text-left px-4 py-2 rounded ${
                selectedStatus === status ? 'bg-[#282C34] text-white' : 'text-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  export default ContestFilters;
  