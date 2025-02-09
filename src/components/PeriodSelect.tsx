// components/PeriodSelect.tsx
interface PeriodSelectProps {
    selectedPeriod: 'Current' | 'Year' | 'All';
    setSelectedPeriod: (period: 'Current' | 'Year' | 'All') => void;
  }
  
  const PeriodSelect: React.FC<PeriodSelectProps> = ({ selectedPeriod, setSelectedPeriod }) => {
    return (
      <div className="relative">
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="bg-[#282C34] text-white px-6 py-3 pr-12 rounded text-lg appearance-none cursor-pointer"
        >
          <option value="Current">Current</option>
          <option value="Year">Year</option>
          <option value="All">All</option>
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">▼</span>
      </div>
    );
  };
  
  export default PeriodSelect;
  