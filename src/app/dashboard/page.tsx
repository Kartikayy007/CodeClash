'use client';

import React, { useEffect } from 'react';
import { socketService } from '@/lib/socket';
// import Image from 'next/image';
// import { Settings } from 'lucide-react';
// import { Line } from 'react-chartjs-2';
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
// import RecentMatches from '@/components/RecentMatches';
// import RecentContests from '@/components/RecentContests';
import UserStats from '@/components/UserStats';
import PerformanceInsights from '@/components/PerformanceInsights';
import Leaderboard from '@/components/Leaderboard';
import RecentMatches from '@/components/RecentMatches';
import RecentContests from '@/components/RecentContests';
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
      // Don't disconnect on unmount, let the socket stay connected
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-end gap-4 mb-8">
        <PlayButton />
        <LabelButton variant='filled'>
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
        </div>
      </div>
    </div>
  );
}
