'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchLeaderboard, updateLeaderboard } from '@/features/contests/thunks/contestThunks';
import { contestApi } from '@/features/contests/api/contestApi';
import { LeaderboardEntry } from '@/features/contests/types/contest.types';
import { toast } from 'react-hot-toast';
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

interface ContestData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  problems: Array<{
    id: string;
    title: string;
    rating: number;
    score: number;
  }>;
}

interface ContestResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  questions: Array<{
    id: string;
    title: string;
    rating: number;
    score: number;
  }>;
}

type TabType = 'Problem Set' | 'Leaderboard' | 'My Submissions';

export default function ContestPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const contestId = params?.contestId as string;

  const [activeTab, setActiveTab] = useState<TabType>('Problem Set');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [contest, setContest] = useState<ContestData | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [insights, setInsights] = useState<ContestInsights>({
    rank: 0,
    score: 0,
    totalQuestions: 0,
    solved: 0,
    unsolved: 0,
    attempted: 0,
    submissions: 0
  });

  useEffect(() => {
    if (!contestId) return;
    fetchContestDetails();
  }, [contestId]);

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

  useEffect(() => {
    if (activeTab === 'Leaderboard') {
      fetchLeaderboardData();
    }
  }, [activeTab, leaderboardPage]);

  useEffect(() => {
    // Set up leaderboard update interval (15 minutes)
    const updateInterval = setInterval(() => {
      if (activeTab === 'Leaderboard') {
        handleUpdateLeaderboard();
      }
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => clearInterval(updateInterval);
  }, [activeTab]);

  const fetchContestDetails = async () => {
    try {
      const response = await contestApi.getContestDetails(contestId);
      if (response.success && response.data) {
        const data = response.data as unknown as ContestResponse;
        const contestData: ContestData = {
          id: data.id,
          name: data.name,
          startTime: data.startDate,
          endTime: data.endDate,
          description: data.description,
          problems: data.questions || []
        };
        setContest(contestData);
        setProblems(contestData.problems.map(p => ({
          id: p.id,
          title: p.title,
          rating: p.rating,
          score: p.score,
          status: null
        })));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch contest details');
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      const result = await dispatch(fetchLeaderboard({ 
        contestId, 
        page: leaderboardPage 
      })).unwrap();
      
      setLeaderboardData(result.leaderboard);
      setTotalPages(result.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch leaderboard data');
    }
  };

  const handleUpdateLeaderboard = async () => {
    try {
      await dispatch(updateLeaderboard(contestId)).unwrap();
      fetchLeaderboardData(); // Refresh the leaderboard data
    } catch (error) {
      toast.error('Failed to update leaderboard');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSolveProblem = (problemId: string) => {
    router.push(`/problem/${problemId}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setLeaderboardPage(1); // Reset to first page when searching
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Problem Set':
        return <ProblemSet problems={problems} onSolveProblem={handleSolveProblem} />;
      case 'Leaderboard':
        return (
          <Leaderboard 
            leaderboard={leaderboardData} 
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

  if (!contest) {
    return <div className="min-h-screen bg-[#10141D] text-white flex items-center justify-center">Loading...</div>;
  }

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