'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LabelButton from '@/components/ui/LabelButton';
import { Timer } from 'lucide-react';
import ProblemSet from '@/components/Contest/PreviewContest/ProblemSet';
import Leaderboard from '@/components/Contest/contestPage/Leaderboard';
import MySubmissions from '@/components/Contest/contestPage/MySubmissions';
import ContestInsights from '@/components/Contest/contestPage/ContestInsights';

interface Problem {
  id: string;
  title: string;
  rating: number;
  score: number;
  status: 'SOLVED' | 'UNSOLVED' | null;
}

interface ContestInsights {
  rank: number;
  score: number;
  totalQuestions: number;
  solved: number;
  unsolved: number;
  attempted: number;
  submissions: number;
}

interface LeaderboardEntry {
  rank: string;
  username: string;
  timeTaken: string;
  score: number;
  questionsSolved: number;
}

type TabType = 'Problem Set' | 'Leaderboard' | 'My Submissions';

interface PreviewContestProps {
  contest: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    organizationName: string;
    description: string;
    rules: string;
    prizes: string;
    score: string;
    problems: Array<{
      id?: string;
      name: string;
      title: string;
      maxScore: number;
      score: number;
      rating: number;
      description: string;
      inputFormat: string;
      constraints: string;
      outputFormat: string;
      testCases: Array<{
        input: string;
        output: string;
        sample: boolean;
        strength: number;
      }>;
    }>;
  };
}

export default function PreviewContest({ contest }: PreviewContestProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Problem Set');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data for preview
  const problems: Problem[] = contest.problems.map(p => ({
    id: p.id || crypto.randomUUID(),
    title: p.name,
    rating: p.rating,
    score: p.score,
    status: null
  }));

  const insights: ContestInsights = {
    rank: 1,
    score: 0,
    totalQuestions: problems.length,
    solved: 0,
    unsolved: problems.length,
    attempted: 0,
    submissions: 0
  };

  const leaderboard: LeaderboardEntry[] = [
    {
      rank: "1",
      username: "User1",
      timeTaken: "00:30:00",
      score: 100,
      questionsSolved: 2
    },
    {
      rank: "2",
      username: "User2",
      timeTaken: "00:45:00",
      score: 75,
      questionsSolved: 1
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSolveProblem = (problemId: string) => {
    // In preview mode, just log the action
    console.log('Solve problem clicked:', problemId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Problem Set':
        return <ProblemSet problems={problems} onSolveProblem={handleSolveProblem} />;
      case 'Leaderboard':
        return (
          <Leaderboard 
            leaderboard={leaderboard} 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
          />
        );
      case 'My Submissions':
        return <MySubmissions />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-8">
          <h1 className="text-2xl font-bold">{contest.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer size={24} className={timeLeft <= 300 ? 'text-red-500 animate-pulse' : ''} />
              <span className={`text-2xl font-bold ${timeLeft <= 300 ? 'text-red-500' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <LabelButton variant="red" onClick={() => router.push('/dashboard')}>
              END
            </LabelButton>
          </div>
        </div>

        <div className="flex gap-8 px-8">
          <div className="flex-1">
            <div className="flex gap-8 mb-8">
              {(['Problem Set', 'Leaderboard', 'My Submissions'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>
          <ContestInsights insights={insights} />
        </div>
      </div>
    </div>
  );
} 