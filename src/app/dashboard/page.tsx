'use client';

import React from 'react';
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
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-end gap-4 mb-8">
        <LabelButton variant='filled' >
          Play Game
        </LabelButton>
        <LabelButton variant='filled'>
          Play Contest
        </LabelButton>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid grid-rows-[auto_1fr] gap-4 -mt-20">
          <UserStats />
          <Leaderboard className="min-h-[400px]" />
        </div>

        <div className="grid grid-rows-[auto_1fr] gap-4 -mt-20">
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
