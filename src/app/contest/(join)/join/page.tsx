'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LabelButton from '@/components/ui/LabelButton';
import Image from 'next/image';
import { contestApi } from '@/features/contests/api/contestApi';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function JoinContest() {
  const [contestCode, setContestCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoinContest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contestCode.trim()) {
      setError('Please enter a contest code');
      return;
    }

    try {
      const contestResponse = await contestApi.getContestDetails(contestCode);
      if (contestResponse.contest) {
        router.push(`/contest/join/${contestCode}`);
      } else {
        setError('Contest not found');
      }
    } catch (error) {
      const err = error as ApiError;
      setError(err?.response?.data?.message || 'Contest not found');
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-[calc(100vh-64px)]">
      <div className="hidden md:block w-1/2 bg-[#282D37] p-8">
        {/* <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-300"
          >
            ← Back
          </button>
        </div> */}
        <div className="flex justify-center items-center h-[calc(100%-48px)]">
          <Image
            src="/_0227_Coding_3.svg"
            alt="Join Contest"
            className="max-w-[80%] h-auto"
            width={500}
            height={500}
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 bg-[#191C23]">
        <div className="max-w-md mx-auto w-full flex flex-col gap-16">
          <div className="flex justify-center items-center mb-12">
            <div className="flex gap-8">
              <button className="text-white hover:text-gray-300 border-b-2 border-white pb-1 text-lg font-medium">
                Join Contest
              </button>
              {/* <div className="w-px bg-gray-700" />
               <button
                onClick={() => router.push('/contest/create')}
                className="text-white/60 hover:text-white pb-1 text-lg font-medium transition-colors"
              >
                Create Contest
              </button> */} 
            </div>
          </div>

          <form onSubmit={handleJoinContest} className="space-y-6 max-w-xl">
            <div className="form-item">
              <label className="text-[#D1D1D1] text-[14px] block mb-2">Enter Code</label>
              <div className="flex flex-col w-full mt-2">
                <input
                  type="text"
                  name="contestCode"
                  value={contestCode}
                  onChange={(e) => setContestCode(e.target.value)}
                  className={`w-full 
                  h-[45px] 
                  px-3 sm:px-4
                  py-2
                  rounded-md
                  bg-transparent
                  border-2
                  ${error ? 'border-red-500' : 'border-[#D1D1D1]'}
                  focus:outline-none
                  transition-all
                  duration-500
                  text-sm sm:text-base
                  text-white
                  placeholder:text-gray-400`}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>
            </div>

            <LabelButton type="submit" className="w-full">
              Join Contest
            </LabelButton>
          </form>
        </div>
      </div>
    </div>
  );
}