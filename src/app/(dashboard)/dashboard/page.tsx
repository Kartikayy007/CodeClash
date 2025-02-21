'use client';

import React, { useEffect } from 'react';
import { socketService } from '@/lib/socket';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import LabelButton from '@/components/ui/LabelButton';

import UserStats from '@/components/dashboard/UserStats';
import PerformanceInsights from '@/components/dashboard/PerformanceInsights';
import Leaderboard from '@/components/dashboard/Leaderboard';
import RecentMatches from '@/components/dashboard/RecentMatches';
import RecentContests from '@/components/dashboard/RecentContests';
import ManageContest from '@/components/dashboard/ManageContest'; 
import { PlayButton } from '@/features/battle/components/PlayButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !socketService.isConnected()) {
      socketService.connect(token);
    }

    return () => {
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col p-[20px] lg:flex-row lg:p-0 lg:gap-4">
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <UserStats />
          <Leaderboard className="min-h-[400px]" />
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3 mt-[20px] md:m-0">
          <RecentMatches />
          <RecentContests className="min-h-[400px]" />
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <div className="flex justify-center gap-4 h-fit min-h-[200px] mt-[20px] md:m-0">
            <div className='w-[50%]'>
              <PlayButton />
            </div>
            <div className='w-[50%] '>
              <LabelButton variant='filled' onClick={() => router.push('/contest/join')}>
                Play Contest
              </LabelButton>
            </div>
          </div>
          <PerformanceInsights className="min-h-[calc(100%)] mt-[-125px]" />
          <ManageContest />
        </div>
      </div>
    </div>
  );
}