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
    <div className="min-h-screen bg-background p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row lg:gap-4">
        {/* First Column */}
        <div className="flex flex-col gap-4 flex-1 ">
          <UserStats />
          <div className="flex justify-center gap-4 lg:hidden">
            <div className="w-1/2">
              <PlayButton />
            </div>
            <div className="w-1/2">
              <LabelButton variant='filled' onClick={() => router.push('/contest/join')}>
                Play Contest
              </LabelButton>
            </div>
          </div>
          <Leaderboard className="flex-1 min-h-0" />
        </div>
        
        {/* Second Column */}
        <div className="flex flex-col gap-4 flex-1 pt-4 lg:p-0">
          <RecentMatches />
          <RecentContests className="flex-1 min-h-0" />
        </div>
        
        {/* Third Column */}
        <div className="flex flex-col gap-4 flex-1">
          <div className=" justify-center gap-4 hidden lg:flex">
            <div className="w-1/2">
              <PlayButton />
            </div>
            <div className="w-1/2">
              <LabelButton variant='filled' onClick={() => router.push('/contest/join')}>
                Play Contest
              </LabelButton>
            </div>
          </div>
          <PerformanceInsights className="flex-1 min-h-0 mt-4 lg:m-0" />
          <ManageContest  />
        </div>
      </div>
    </div>
  );
}