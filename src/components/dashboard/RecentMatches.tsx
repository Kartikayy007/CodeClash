import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Match } from '@/features/home/matches/types/matches.types';

export default function RecentMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const matchTypes = ["All", "Standard", "Accuracy", "Speed"];

  useEffect(() => {
    const fetchRecentMatches = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.error('No access token found in local storage');
        return;
      }

      try {
        const response = await fetch('https://goyalshivansh.me/api/v1/user/recent-matches?page=1&limit=12', {
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
        console.log('Fetched recent matches data:', data);

        if (data.success && Array.isArray(data.recentMatches)) {
          setMatches(data.recentMatches);
        } else {
          console.error('Expected recentMatches array but got:', data);
          setMatches([]);
        }
      } catch (error) {
        console.error('Error fetching recent matches:', error);
        setMatches([]);
      }
    };

    fetchRecentMatches();
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Matches</h2>
        <Link 
          href="/recent-matches" 
          className="text-base hover:text-white/80 cursor-pointer"
          prefetch={true}
        >
          View All
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        {matchTypes.map((type, index) => (
          <button
            key={type}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
              index === 0
                ? "bg-[#3d3d3d] text-white"
                : "border border-[#888888] text-[#e7e7e7] hover:bg-white/5"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 bg-white/10 rounded-lg px-4 py-2 mb-4 text-sm font-medium">
        <span>Mode</span>
        <span>Players</span>
        <span>Winner</span>
        <span>Duration</span>
        <span>Date</span>
      </div>

      <div className="space-y-2">
        {matches.slice(0,3).map((match, index) => (
          <div key={index} className="grid grid-cols-5 bg-white/5 rounded-lg px-4 py-2">
            <span className="text-base font-medium truncate">{match.mode}</span>
            <div className="flex flex-col">
              {match.players.map((player: { id: string; username: string }) => (
                <span key={player.id} className="text-base font-medium truncate">{player.username}</span>
              ))}
            </div>
            <span className="text-base font-medium truncate">
              {match.winnerId ? 
                match.players.find((player: { id: string }) => player.id === match.winnerId)?.username || 'N/A' 
                : 'N/A'}
            </span>
            <span className="text-sm truncate">{match.duration}</span>
            <span className="text-sm truncate">{match.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
