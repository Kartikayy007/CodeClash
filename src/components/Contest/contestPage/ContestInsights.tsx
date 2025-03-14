import React from 'react';

interface ContestInsightsData {
  rank: number;
  score: number;
  totalQuestions: number;
  solved: number;
  unsolved: number;
  attempted: number;
  submissions: number;
}

interface ContestInsightsProps {
  insights: ContestInsightsData;
}

const ContestInsights: React.FC<ContestInsightsProps> = ({ insights }) => {
  return (
    <div className="lg:w-[300px] bg-[#1A1D24] rounded-lg p-8 h-fit ">
      <h2 className="text-xl font-semibold">Insights</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Your Rank:</span>
          <span>{insights.rank}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Score:</span>
          <span>{insights.score}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total Questions:</span>
          <span>{insights.totalQuestions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Solved:</span>
          <span>{insights.solved}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Unsolved:</span>
          <span>{insights.unsolved}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Attempted:</span>
          <span>{insights.attempted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">No. of Submissions:</span>
          <span>{insights.submissions}</span>
        </div>
      </div>
    </div>
  );
};

export default ContestInsights; 