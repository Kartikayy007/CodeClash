import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface Contest {
  id: string;
  title: string;
  participantCount: number;
}

const ShimmerEffect = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 w-32 bg-gray-700 rounded"></div>
      <div className="h-6 w-16 bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white/5 rounded-lg p-4">
          <div className="h-6 w-48 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const ManageContest = () => {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.error('No access token found in local storage');
        setIsLoading(false);
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
          setContests(data.contests);
        } else {
          console.error('Expected contests array but got:', data);
          setContests([]);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
        setContests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6">
      {isLoading ? (
        <ShimmerEffect />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-white">Manage Contest</h2>
            <button 
              onClick={() => router.push('/matches')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {contests.slice(0, 2).map((contest, index) => (
              <div 
                key={index}
                className="bg-white/5 rounded-lg p-4 hover:bg-[#282C34] transition-colors cursor-pointer"
                onClick={() => router.push('/matches')}
              >
                <h3 className="text-lg text-white mb-2">{contest.title}</h3>
                <p className="text-gray-400">Total participants: {contest.participantCount}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageContest;
