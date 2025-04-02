import { Edit, BarChart2, Trash } from "lucide-react";

interface ContestRowProps {
  contest: {
    name: string;
    startDate: string;
    duration: string;
    participants: number;
  };
}

const ContestRow: React.FC<ContestRowProps> = ({ contest }) => {
  return (
    <div className="grid grid-cols-4 p-4 text-white border-b border-gray-700 hover:bg-[#282C34]">
      <div>{contest.name}</div>
      <div>{contest.startDate}</div>
      <div>{contest.duration}</div>
      <div className="flex items-center justify-between">
        <span>{contest.participants}</span>
        <div className="flex gap-4">
          <button className="text-gray-400 hover:text-white">
            <Edit size={18} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <BarChart2 size={18} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestRow;
