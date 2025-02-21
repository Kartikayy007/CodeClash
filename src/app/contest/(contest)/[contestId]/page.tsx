'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { contestApi } from '@/features/contests/api/contestApi';
import toast from 'react-hot-toast';
import { Contest, LeaderboardEntry } from '@/features/contests/types/contest.types';
import LabelButton from '@/components/ui/LabelButton';
import { Timer } from 'lucide-react';
import ProblemSet from '@/components/Contest/PreviewContest/ProblemSet';
import Leaderboard from '@/components/Contest/contestPage/Leaderboard';
import MySubmissions from '@/components/Contest/contestPage/MySubmissions';
import ContestInsights from '@/components/Contest/contestPage/ContestInsights';
interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}
type TabType = 'Problem Set' | 'Leaderboard' | 'My Submissions';


// const dummyLeaderboard = [
//   { rank: 1, username: 'JohnDoe', score: 450, solved: 3, time: '01:30:45' },
//   { rank: 2, username: 'AliceSmith', score: 350, solved: 2, time: '01:45:22' },
//   { rank: 3, username: 'BobJohnson', score: 250, solved: 2, time: '02:15:10' },
// ];

const dummyInsights = {
  rank: 2,
  score: 350,
  totalQuestions: 5,
  solved: 2,
  unsolved: 2,
  attempted: 4,
  submissions: 8
};

export default function ContestPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.contestId as string;
  
  const [activeTab, setActiveTab] = useState<TabType>('Problem Set');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [searchQuery, setSearchQuery] = useState('');
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        const response = await contestApi.getContestDetails(contestId);
        
        if (response.contest) {
          setContest(response.contest);
          
          // Handle routing based on contest status
          if (response.contest.status === 'UPCOMING') {
            router.push(`/contest/join/${contestId}`);
            return;
          }
          
          // Calculate time left for ongoing contests
          if (response.contest.status === 'ONGOING') {
            const endTime = new Date(response.contest.endTime).getTime();
            const now = new Date().getTime();
            const timeLeftInSeconds = Math.floor((endTime - now) / 1000);
            setTimeLeft(timeLeftInSeconds > 0 ? timeLeftInSeconds : 0);
          }
        }
      } catch (error: ApiError | unknown) {
        const err = error as ApiError;
        toast.error(err?.response?.data?.message || 'Failed to fetch contest details');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [contestId, router]);

  useEffect(() => {
    if (!contest || contest.status !== 'ONGOING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [contest, router]);

  useEffect(() => {
    if (activeTab !== 'Leaderboard' || !contestId) return;

    const fetchLeaderboard = async () => {
      try {
        const response = await contestApi.getLeaderboard(contestId, leaderboardPage);
        setLeaderboard(response.leaderboard);
        setTotalPages(response.pagination.pages);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err?.response?.data?.message || 'Failed to fetch leaderboard');
      }
    };

    fetchLeaderboard();

    const updateInterval = setInterval(async () => {
      try {
        const updateResponse = await contestApi.updateLeaderboard(contestId);
        if (updateResponse.success) {
          fetchLeaderboard();
        }
      } catch (error) {
        console.error('Failed to update leaderboard:', error);
      }
    }, 15 * 60 * 1000); 

    return () => clearInterval(updateInterval);
  }, [contestId, activeTab, leaderboardPage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSolveProblem = (problemId: string) => {
    router.push(`/contest/problem/${problemId}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setLeaderboardPage(1);
  };

  const handlePageChange = (page: number) => {
    setLeaderboardPage(page);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Problem Set':
        return (
          <ProblemSet 
            problems={contest?.questions.map(q => ({
              id: q.id,
              title: q.title,
              rating: q.rating || 0,
              score: q.score || 0,
              difficulty: q.difficulty,
              status: null 
            })) || []}
            onSolveProblem={handleSolveProblem}
          />
        );
        case 'Leaderboard':
          return (
            <Leaderboard 
              leaderboard={leaderboard.map(entry => ({
                rank: entry.rank.toString(),
                username: entry.username,
                timeTaken: entry.timeTaken,
                score: entry.score,
                questionsSolved: entry.questionsSolved
              }))}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              currentPage={leaderboardPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          );
      case 'My Submissions':
        return <MySubmissions />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141D] text-white flex items-center justify-center">
        <p>Loading contest...</p>
      </div>
    );
  }

  if (!contest || contest.status !== 'ONGOING') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-8">
          <h1 className="text-2xl font-bold">
            {contest.title}
          </h1>
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
          <ContestInsights insights={dummyInsights} />
        </div>
      </div>
    </div>
  );
}