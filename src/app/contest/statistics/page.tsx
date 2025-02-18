'use client'
import React, { useEffect } from 'react';
import { Home, Settings } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import Sidebar from './Sidebar';
import Leaderboard from './Leaderboard';

interface Participant {
  name: string;
  score: number;
  avatar: string;
}

interface ProblemData {
  name: string;
  value: number;
}

interface ScoreDistribution {
  range: string;
  count: number;
}

const CodingContestDashboard = () => {
  const problemData: ProblemData[] = [
    { name: 'Q1', value: 48 },
    { name: 'Q2', value: 38 },
    { name: 'Q3', value: 40 },
    { name: 'Q4', value: 36 },
    { name: 'Q5', value: 24 },
    { name: 'Q6', value: 32 },
    { name: 'Q7', value: 20 },
  ];

  const scoreDistribution: ScoreDistribution[] = [
    { range: '0-20', count: 4 },
    { range: '21-40', count: 12 },
    { range: '41-60', count: 6 },
    { range: '61-80', count: 20 },
    { range: '81-100', count: 8 },
  ];


    const topPerformers = [
      { name: 'Abcdefgh', score: 120.00, position: 1, avatar: '/first.svg' },
      { name: 'Abcdefgh', score: 100.00, position: 2, avatar: '/second.svg' },
      { name: 'Abcdefgh', score: 80.00, position: 3, avatar: '/third.svg' },
    ];
  
    const getMedalColor = (position: number) => {
      switch (position) {
        case 1:
          return 'text-yellow-400';
        case 2:
          return 'text-gray-400';
        case 3:
          return 'text-amber-700';
        default:
          return '';
      }
    };

  const [active, setActive] = React.useState('overview'); // State to manage active option

  const handleLeaderboardClick = () => {
    console.log('Leaderboard clicked');
    setActive('leaderboard');
  };

  const handleOverviewClick = () => {
    console.log('Overview clicked');
    setActive('overview');
  };

  useEffect(() => {
    console.log(`Current active state: ${active}`);
  }, [active]);

  return (
    <div className="flex min-h-screen bg-[#10141D]">
      <Sidebar 
        onLeaderboardClick={handleLeaderboardClick} 
        onOverviewClick={handleOverviewClick} 
        active={active} 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {active === 'leaderboard' ? (
          <Leaderboard />
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-2 text-gray-400">
                <button className="hover:text-white">←</button>
                <span>Contest Name Statistics</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-6 mb-6  h-[20%]">
                  <div className="bg-[#171D2A] p-6 rounded-lg ">
                    <div className="text-gray-400 mb-2">Total Participation</div>
                    <div className="text-4xl font-bold text-white">50</div>
                  </div>
                  <div className="bg-[#171D2A] p-6 rounded-lg ">
                    <div className="text-gray-400 mb-2">Average Score</div>
                    <div className="text-4xl font-bold text-white">56.00</div>
                  </div>
                </div>

                {/* Problem Insights */}
                <div className="bg-[#171D2A] p-6 rounded-lg h-[70%]">
                  <h2 className="text-xl font-bold mb-4 text-white">Problem Insights</h2>
                  <div className="w-full h-[90%]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={problemData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            color: '#fff'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 lg:col-span-2">
                {/* Top Performers */}
                <div className="bg-[#171D2A] p-6 rounded-lg h-[45%]">
          <h2 className="text-xl font-bold mb-8 text-white">Top Performers</h2>
          <div className="relative h-80 flex items-end justify-center gap-4">
            {/* Second Place */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src={topPerformers[1].avatar}
                  alt={topPerformers[1].name}
                  className="w-16 h-16 rounded-full border-4 border-purple-700"
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-700 px-4 py-1 rounded-md">
                    <span className="text-white text-sm">{topPerformers[1].name}</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 mb-[90px] flex flex-col items-center bg-[#583F64] rounded-lg p-4 w-32">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mb-2">
                  <span className="text-gray-800 font-bold">2</span>
                </div>
                <span className="text-white font-bold">{topPerformers[1].score.toFixed(2)}</span>
                <span className="text-gray-400 text-sm">score</span>
              </div>
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={topPerformers[0].avatar}
                  alt={topPerformers[0].name}
                  className="w-16 h-16 rounded-full border-4 border-purple-700"
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-700 px-4 py-1 rounded-md">
                    <span className="text-white text-sm">{topPerformers[0].name}</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 mb-[90px] flex flex-col items-center bg-[#583F64] rounded-lg p-4 w-32">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                  <span className="text-yellow-800 font-bold">1</span>
                </div>
                <span className="text-white font-bold">{topPerformers[0].score.toFixed(2)}</span>
                <span className="text-gray-400 text-sm">score</span>
              </div>
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={topPerformers[2].avatar}
                  alt={topPerformers[2].name}
                  className="w-16 h-16 rounded-full border-4 border-purple-700"
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-700 px-4 py-1 rounded-md">
                    <span className="text-white text-sm">{topPerformers[2].name}</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 mb-[90px] flex flex-col items-center bg-[#583F64] rounded-lg p-4 w-32">
                <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center mb-2">
                  <span className="text-amber-100 font-bold">3</span>
                </div>
                <span className="text-white font-bold">{topPerformers[2].score.toFixed(2)}</span>
                <span className="text-gray-400 text-sm">score</span>
              </div>
            </div>
          </div>
        </div>



                {/* Score Distribution */}
                <div className="bg-[#171D2A] p-6 rounded-lg h-[45%]">
                  <h2 className="text-xl font-bold mb-4 text-white">Score Distribution</h2>
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="range" 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            color: '#fff'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingContestDashboard;