'use client';

import { useState } from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';
import LeaderboardHeader from '@/components/LeaderboardHeader';
import TopPlayers from '@/components/TopPlayers';
import PlayerList from '@/components/PlayerList';
import SearchInput from '@/components/SearchInput';
import PlayerRankCard from '@/components/PlayerRankCard';

interface Player {
  id: number;
  username: string;
  victories: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const players: Player[] = [
    { id: 1, username: 'Abcdefg', victories: 134, rank: 1 },
    { id: 2, username: 'awwerrttt', victories: 134, rank: 2 },
    { id: 3, username: 'wrtfyytfc', victories: 134, rank: 3 },
    { id: 4, username: 'xdcdfgcgff', victories: 134, rank: 4 },
    { id: 5, username: 'sssehcvffrt', victories: 134, rank: 5 },
    { id: 6, username: 'jnjnhuygyt', victories: 134, rank: 6 },
  ];

  const topPlayers = players.slice(0, 3);

  return (
    <div>
      <NavbarPlain />
      <div className="p-12 bg-[#15171B] h-screen flex">
        <div className='w-[70%]'>
          <LeaderboardHeader />
          <TopPlayers topPlayers={topPlayers} />
          <PlayerList players={players} />
        </div>

        <div className="mt-8 gap-8 flex flex-col w-[30%] pl-[20px]">
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <PlayerRankCard title="Current Rank" value={150} iconSrc="/current.svg" />
          <PlayerRankCard title="Your Highest Rank" value={5} iconSrc="/highest.svg" />
        </div>
      </div>
    </div>
  );
}
