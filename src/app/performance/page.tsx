'use client'
import { useState } from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';
import ModeSelector from '@/components/ModeSelector';
import MatchTable from '@/components/MatchTable';
import WinsOverview from '@/components/WinsOverview';
import WinningMomentum from '@/components/WinningMomentum';
import WinTrend from '@/components/WinTrend';

type MatchMode = 'All' | 'Standard' | 'Accuracy' | 'Speed';
type MatchResult = 'win' | 'loss';

const winTrendData = [
  Array(8).fill('inactive'),
  ['inactive', 'inactive', 'inactive', 'inactive', 'loss', 'inactive', 'inactive', 'inactive'],
  ['inactive', 'inactive', 'inactive', 'inactive', 'inactive', 'win', 'win', 'inactive'],
  Array(8).fill('inactive'),
];

const matches = [
  { mode: 'Standard', player: 'You', opponent: 'Player1', result: 'win', duration: '15min', date: '2 hours ago' },
  { mode: 'Accuracy', player: 'You', opponent: 'Player1', result: 'loss', duration: '10min', date: '12 Jan 2024' },
  { mode: 'Speed', player: 'You', opponent: 'Player1', result: 'loss', duration: '10min', date: '12 Jan 2024' },
  { mode: 'Accuracy', player: 'You', opponent: 'Player1', result: 'loss', duration: '10min', date: '12 Jan 2024' },
  { mode: 'Speed', player: 'You', opponent: 'Player1', result: 'loss', duration: '10min', date: '12 Jan 2024' },
  { mode: 'Standard', player: 'You', opponent: 'Player1', result: 'loss', duration: '10min', date: '12 Jan 2024' }
];

export default function MatchesPage() {
  const [selectedMode, setSelectedMode] = useState<MatchMode>('All');

  const filteredMatches = selectedMode === 'All' 
    ? matches 
    : matches.filter(match => match.mode === selectedMode);

  const totalMatches = matches.length;
  const wins = matches.filter(m => m.result === 'win').length;
  const winRate = Math.round((wins / totalMatches) * 10);
  const currentStreak = 6; // Mock data
  const longestStreak = 12; // Mock data

  return (
    <div className="min-h-screen bg-[#15171B]">
      <NavbarPlain />
      <div className="container mx-auto p-6">
        <ModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <MatchTable matches={filteredMatches} />
          </div>
          <div className="col-span-4 flex flex-col gap-5">
            <div className='flex justify-between'>
            <WinsOverview winRate={winRate} />
            <WinningMomentum currentStreak={currentStreak} longestStreak={longestStreak} />
            </div>
            <WinTrend winTrendData={winTrendData} />
          </div>
        </div>
      </div>
    </div>
  );
}
