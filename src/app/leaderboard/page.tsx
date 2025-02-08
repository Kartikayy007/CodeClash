'use client';

import { useState } from 'react';
import Image from 'next/image';
import NavbarPlain from '@/components/ui/NavbarPlain';
import {Search} from 'lucide-react'

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
      <NavbarPlain/>
      <div className="p-12 bg-[#15171B] h-screen flex">
        <div className='w-[70%] '>
        <div className="mb-8">
          <button className="text-white text-lg flex items-center gap-2">
            <span>←</span> Leaderboard
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 relative">
          <div className="bg-[#212733] rounded-lg p-4 flex items-center gap-4 mt-8">
            <div className="relative w-12 h-12">
              <Image
                src="/silver.svg"
                alt="Silver Medal"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-white font-medium">{topPlayers[1].username}</p>
              <p className="text-gray-400">{topPlayers[1].victories} Victories</p>
            </div>
          </div>

          <div className="bg-[#212733] rounded-lg p-4 flex items-center gap-4 mt-2  shadow-lg mb-6">
            <div className="relative w-12 h-12">
              <Image
                src="/gold.svg"
                alt="Gold Medal"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-white font-medium">{topPlayers[0].username}</p>
              <p className="text-gray-400">{topPlayers[0].victories} Victories</p>
            </div>
          </div>

          <div className="bg-[#212733] rounded-lg p-4 flex items-center gap-4 mt-8">
            <div className="relative w-12 h-12">
              <Image
                src="/bronze.svg"
                alt="Bronze Medal"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-white font-medium">{topPlayers[2].username}</p>
              <p className="text-gray-400">{topPlayers[2].victories} Victories</p>
            </div>
          </div>
        </div>

       

        <div className="rounded-lg overflow-hidden text-center">
          <div className="grid grid-cols-3 p-4  bg-[#15171B]">
            <div className="text-white">Rank</div>
            <div className="text-white">Player</div>
            <div className="text-white">Game Victories</div>
          </div>
          {players.map((player) => (
            <div
              key={player.id}
              className="grid grid-cols-3 p-4  hover:bg-[#282C34] rounded-md mb-2 bg-white/5"
            >
              <div className="text-white">{player.rank}.</div>
              <div className="text-white">{player.username}</div>
              <div className="text-white">{player.victories}</div>
            </div>
          ))}
        </div>
</div>
        <div className="mt-8  gap-8 flex flex-col w-[30%] pl-[20px]">
        <div className="">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter UserName"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full  bg-[#2C2F35] rounded-sm h-12 px-4 py-2 pl-10 text-white"
            />
 {!searchQuery && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search color='gray'/>
              </span>
            )}          </div>
        </div>
          <div className=" rounded-sm p-6 bg-white/5"  >
            <h3 className="text-gray-400 mb-4">Current Rank</h3>
            <div className="flex items-center justify-between">
              <span className="text-6xl font-bold text-white">150</span>
              <div className="w-24 h-24 relative">
                <Image
                  src="/current.svg"
                  alt="Current Rank"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className=" rounded-sm p-6 bg-white/5" >
            <h3 className="text-gray-400 mb-4">Your Highest Rank</h3>
            <div className="flex items-center justify-between">
              <span className="text-6xl font-bold text-white">5</span>
              <div className="w-24 h-24 relative">
                <Image
                  src="/highest.svg"
                  alt="Highest Rank"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}