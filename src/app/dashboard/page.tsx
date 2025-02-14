'use client';

import React, { useEffect } from 'react';
import { socketService } from '@/lib/socket';

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
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !socketService.isConnected()) {
      console.log('🔌 Connecting socket from dashboard');
      socketService.connect(token);
    }

    return () => {
    };
  }, []);

  return (
    <div className="min-h-screen bg-background ">
      

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 ">
        <div className="grid grid-rows-[auto_1fr] gap-4 ">
          <UserStats />
          <Leaderboard className="min-h-[400px]" />
        </div>

        <div className="grid grid-rows-[auto_1fr] gap-4 ">
          <RecentMatches />
          <RecentContests className="min-h-[400px]" />
        </div>

        <div className="grid">
      <div className="flex justify-center gap-4 ">
        <div className='w-[50%]'>

        <PlayButton />
        </div>
        <div className='w-[50%]'>

        <LabelButton variant='filled'>
          Play Contest
        </LabelButton>
        </div>
      </div>
          <PerformanceInsights className="min-h-[calc(100%)] mt-[-125px]" />
        </div>
      </div>
    </div>
  );
}
