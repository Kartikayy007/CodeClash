import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface Contest {
  name: string;
  participants: number;
}

const ManageContest = () => {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]); // State for contests data

  useEffect(() => {
    const fetchContests = async () => {
      const token = localStorage.getItem('accessToken'); // Adjust the key as necessary

      if (!token) {
        console.error('No access token found in local storage');
        return;
      }

      try {
        const response = await fetch('https://goyalshivansh.me/api/v1/contest/my-contests', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched contests data:', data);

        if (data.contests && Array.isArray(data.contests)) {
          setContests(data.contests); // Set the contests state
        } else {
          console.error('Expected contests array but got:', data);
          setContests([]); // Reset state on failure
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
        setContests([]); // Reset state on error
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="w-full bg-[#1A1D24] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium text-white">Manage Contest</h2>
        <button 
          onClick={() => router.push('/contest/manage')}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          View
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {contests.slice(0, 2).map((contest, index) => ( // Show only the top 2 contests
          <div 
            key={index}
            className="bg-[#1E2127] rounded-lg p-4 hover:bg-[#282C34] transition-colors cursor-pointer"
            onClick={() => router.push('/matches')}
          >
            <h3 className="text-lg text-white mb-2">{contest.title}</h3>
            <p className="text-gray-400">Total participants: {contest.participantCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageContest;
