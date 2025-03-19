import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlayerList from '../leaderboard/PlayerList';
import { LeaderboardPlayer } from '@/features/home/leaderboard/types/leaderboard.types';

interface LeaderboardProps {
  className?: string;
}

export default function Leaderboard({ className = '' }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('accessToken'); // Adjust the key as necessary

      if (!token) {
        console.error('No access token found in local storage');
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

        // Extract the leaderboard array from the response
        if (data.success && Array.isArray(data.leaderboard)) {
          setLeaderboardData(data.leaderboard);
        } else {
          console.error('Expected leaderboard array but got:', data);
          setLeaderboardData([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardData([]); // Set to empty array on error
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <button onClick={() => router.push('/leaderboard')} className="text-base hover:text-white/80">
          View All
        </button>
      </div>

      <PlayerList players={leaderboardData.slice(0, 5)} />
    </div>
  );
}
