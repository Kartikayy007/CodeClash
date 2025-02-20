'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import LabelButton from '@/components/ui/LabelButton';
// import { Timer } from 'lucide-react';
import ProblemSet from '@/components/Contest/PreviewContest/ProblemSet';
// import Leaderboard from '@/components/Contest/contestPage/Leaderboard';
// import MySubmissions from '@/components/Contest/contestPage/MySubmissions';
import ContestInsights from '@/components/Contest/contestPage/ContestInsights';

interface PreviewProblem {
  id: string;
  title: string;
  rating: number;
  score: number;
  status: 'SOLVED' | 'UNSOLVED' | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
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

// interface LeaderboardEntry {
//   rank: string;
//   username: string;
//   timeTaken: string;
//   score: number;
//   questionsSolved: number;
// }

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
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Problem Set');
  // const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  // const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data for preview
  const problems: PreviewProblem[] = contest.problems.map(p => ({
    id: p.id || crypto.randomUUID(),
    title: p.name,
    rating: p.rating,
    score: p.score,
    status: null,
    difficulty: p.rating < 1000 ? 'EASY' : p.rating < 2000 ? 'MEDIUM' : 'HARD'
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

  // const leaderboard: LeaderboardEntry[] = [
  //   {
  //     rank: "1",
  //     username: "User1",
  //     timeTaken: "00:30:00",
  //     score: 100,
  //     questionsSolved: 2
  //   },
  //   {
  //     rank: "2",
  //     username: "User2",
  //     timeTaken: "00:45:00",
  //     score: 75,
  //     questionsSolved: 1
  //   }
  // ];

  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  // };

  const handleSolveProblem = (problemId: string) => {
    console.log('Solve problem clicked:', problemId);
  };

  // const handleSearchChange = (query: string) => {
  //   setSearchQuery(query);
  // };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Problem Set':
        return <ProblemSet problems={problems} onSolveProblem={handleSolveProblem} />;
      case 'Leaderboard':
        return (
          <div>
            <h1 className='text-2xl font-bold text-center'>
              Leaderboard will be shown here
            </h1>
          </div>
        );
      case 'My Submissions':
        return (
          <div>
            <h1 className='text-2xl font-bold text-center'>
              My Submissions will be shown here
            </h1>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="flex flex-col h-full">

        <div className="flex px-8 gap-8">
          <div className="w-[200px] rounded-lg h-fit">
            {(['Problem Set', 'Leaderboard', 'My Submissions'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg text-lg transition-colors ${
                  activeTab === tab 
                    ? 'text-white bg-[#282C33] rounded-lg' 
                    : 'text-gray-400 hover:text-white '
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1">
            {renderTabContent()}
          </div>
        <ContestInsights insights={insights} />
        </div>
      </div>
    </div>
  );
} 