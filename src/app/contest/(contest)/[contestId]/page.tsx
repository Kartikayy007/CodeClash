'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LabelButton from '@/components/ui/LabelButton';
import { Timer } from 'lucide-react';
import ProblemSet from '@/components/Contest/contestPage/ProblemSet';
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

export default function ContestPage() {
  const params = useParams<{ contestId: string }>();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [activeTab, setActiveTab] = useState<TabType>('Problem Set');
  const [problems, setProblems] = useState<Problem[]>([
    { id: '1', title: 'Two Pointer', rating: 900, score: 20, status: 'SOLVED' },
    { id: '2', title: 'Two Pointer', rating: 900, score: 20, status: null },
    { id: '3', title: 'Two Pointer', rating: 900, score: 20, status: null },
    { id: '4', title: 'Two Pointer', rating: 900, score: 20, status: null },
    { id: '5', title: 'Two Pointer', rating: 900, score: 20, status: null },
  ]);
  const [insights, setInsights] = useState<ContestInsights>({
    rank: 2,
    score: 50,
    totalQuestions: 5,
    solved: 1,
    unsolved: 2,
    attempted: 2,
    submissions: 10
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: "01", username: "Abcdef", timeTaken: "1 hr", score: 90.00, questionsSolved: 5 },
    { rank: "02", username: "Efghij", timeTaken: "1 hr", score: 80.00, questionsSolved: 5 },
    { rank: "03", username: "Qwetyu", timeTaken: "1 hr", score: 70.00, questionsSolved: 4 },
    { rank: "04", username: "Ytrefgv", timeTaken: "1 hr", score: 60.00, questionsSolved: 4 },
    { rank: "05", username: "Dfghksis", timeTaken: "1 hr", score: 50.00, questionsSolved: 4 },
    { rank: "06", username: "Asdfhjc", timeTaken: "1 hr", score: 46.00, questionsSolved: 3 },
    { rank: "07", username: "Zxfdteyfb", timeTaken: "1 hr", score: 40.00, questionsSolved: 3 },
    { rank: "08", username: "Qeryuincksm", timeTaken: "1 hr", score: 30.00, questionsSolved: 3 },
    { rank: "09", username: "Qpryu n n", timeTaken: "1 hr", score: 20.00, questionsSolved: 3 },
    { rank: "10", username: "Ghjiilklngd", timeTaken: "1 hr", score: 10.00, questionsSolved: 2 }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const handleSolveProblem = (problemId: string) => {
    if (params?.contestId) {
      router.push(`/contest/${params.contestId}/problem/${problemId}`);
    }
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
            onSearchChange={setSearchQuery} 
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
          <h1 className="text-2xl font-bold">Contest Name</h1>
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

        <div className="flex px-8 gap-8">
          <div className="w-[200px] rounded-lg h-fit">
            {(['Problem Set', 'Leaderboard', 'My Submissions'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg text-lg transition-colors ${
                  activeTab === tab 
                    ? 'text-white bg-[#282C33] rounded-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <div className="rounded-lg p">
              {renderTabContent()}
            </div>
          </div>

          <ContestInsights insights={insights} />
        </div>
      </div>
    </div>
  );
} 