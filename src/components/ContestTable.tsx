import ContestRow from './ContestRow';

interface ContestTableProps {
  contests: {
    name: string;
    startDate: string;
    duration: string;
    participants: number;
  }[];
}

const ContestTable: React.FC<ContestTableProps> = ({ contests }) => {
  return (
    <div className="bg-[#1E2127] rounded-lg overflow-hidden w-[80%]">
      <div className="grid grid-cols-4 p-4 text-gray-400 border-b border-gray-700">
        <div>Contest Name</div>
        <div>Start Date</div>
        <div>Duration</div>
        <div>Participants</div>
      </div>
      {contests.map((contest, index) => (
        <ContestRow key={index} contest={contest} />
      ))}
    </div>
  );
}

export default ContestTable;
