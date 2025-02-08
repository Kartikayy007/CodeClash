'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CreateBattle = () => {
  const router = useRouter();

  const handleCreateMatch = () => {
    const matchId = 'test-match-123'; 
    router.push(`/battle/${matchId}`);
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
            Create Battle Match
          </h2>
          <p className="mt-2 text-gray-400">
            Set up your competitive coding battle
          </p>
        </div>

        <div className="mt-8 space-y-6 bg-[#1A1D24] p-8 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Difficulty Level
              </label>
              <select className="mt-1 block w-full px-3 py-2 bg-[#292C33] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DB84D9]">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Time Limit (minutes)
              </label>
              <select className="mt-1 block w-full px-3 py-2 bg-[#292C33] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DB84D9]">
                <option>30</option>
                <option>45</option>
                <option>60</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Problem Category
              </label>
              <select className="mt-1 block w-full px-3 py-2 bg-[#292C33] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DB84D9]">
                <option>Arrays</option>
                <option>Strings</option>
                <option>Dynamic Programming</option>
                <option>Graphs</option>
                <option>Trees</option>
              </select>
            </div>
          </div>

          <div>
            <button
              onClick={handleCreateMatch}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#DB84D9] hover:bg-[#c76dc4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB84D9]"
            >
              Create Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBattle;
