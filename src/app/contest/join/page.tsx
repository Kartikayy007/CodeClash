'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const JoinBattle = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/battle/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#10141D] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image  
            src="/logo.svg"
            alt="Code Clash"
            width={160}
            height={40}
            className="mx-auto"
            priority
          />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Join Battle Room
          </h2>
          <p className="mt-2 text-gray-400">
            Enter room code to join the battle
          </p>
        </div>

        <div className="mt-8 space-y-6 bg-[#1A1D24] p-8 rounded-lg">
          <div>
            <label htmlFor="room-id" className="block text-sm font-medium text-gray-300">
              Room Code
            </label>
            <input
              id="room-id"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#292C33] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DB84D9]"
              placeholder="Enter room code"
            />
          </div>

          <div>
            <button
              onClick={handleJoinRoom}
              disabled={!roomId.trim()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#DB84D9] hover:bg-[#c76dc4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB84D9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinBattle;
