import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface Contest {
  name: string;
  participants: number;
}

const ManageContest = () => {
  const router = useRouter();

  const contests: Contest[] = [
    {
      name: 'Contest Name',
      participants: 50
    },
    {
      name: 'Contest Name',
      participants: 50
    }
  ];

  return (
    <div className="w-full bg-[#1A1D24] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium text-white">Manage Contest</h2>
        <button 
          onClick={() => router.push('/matches')}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          view
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {contests.map((contest, index) => (
          <div 
            key={index}
            className="bg-[#1E2127] rounded-lg p-4 hover:bg-[#282C34] transition-colors cursor-pointer"
            onClick={() => router.push('/matches')}
          >
            <h3 className="text-lg text-white mb-2">{contest.name}</h3>
            <p className="text-gray-400">Total participants : {contest.participants}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageContest;
