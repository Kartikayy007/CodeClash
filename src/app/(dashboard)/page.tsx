import React from 'react';
import Leaderboard from '@/components/dashboard/Leaderboard';

export default function Page() {
  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Leaderboard />
    </div>
  );
} 