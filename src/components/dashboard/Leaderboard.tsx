import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlayerList from '../leaderboard/PlayerList';
import { LeaderboardPlayer } from '@/features/home/leaderboard/types/leaderboard.types';

interface LeaderboardProps {
  className?: string;
}

const ShimmerEffect = () => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 w-32 bg-gray-700 rounded"></div>
      <div className="h-6 w-20 bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
          <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 w-24 bg-gray-700 rounded"></div>
          </div>
          <div className="h-6 w-12 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function Leaderboard({ className = '' }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.error('No access token found in local storage');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://goyalshivansh.me/api/v1/user/leaderboard?page=1&limit=10', {
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
        console.log('Fetched leaderboard data:', data);

        if (data.success && Array.isArray(data.leaderboard)) {
          setLeaderboardData(data.leaderboard);
        } else {
          console.error('Expected leaderboard array but got:', data);
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}>
      {isLoading ? (
        <ShimmerEffect />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Leaderboard</h2>
            <button onClick={() => router.push('/leaderboard')} className="text-base hover:text-white/80">
              View All
            </button>
          </div>

          <PlayerList players={leaderboardData.slice(0, 5)} />
        </>
      )}
    </div>
  );
}
