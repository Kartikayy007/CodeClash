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
       ('🔌 Connecting socket from dashboard');
      socketService.connect(token);
    }

    return () => {
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-end gap-4 mb-8">
        <PlayButton />
        <LabelButton variant='filled' onClick={() => router.push('/contest/join')}>
          Play Contest
        </LabelButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 ">
        <div className="grid grid-rows-[auto_1fr] gap-4 lg:-mt-20">
          <UserStats />
          <Leaderboard className="min-h-[400px]" />
        </div>

        <div className="grid grid-rows-[auto_1fr] gap-4 lg:-mt-20">
          <RecentMatches />
          <RecentContests className="min-h-[400px]" />
        </div>

        <div className="grid grid-rows-[1fr] gap-4">
          <PerformanceInsights className="min-h-[calc(100%)]" />
          <ManageContest />
        </div>
      </div>
    </div>
  );
}
