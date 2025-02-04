import React from 'react';
import { Problem } from '@/features/editor/api/problems';

interface QuestionProps {
  problem: Problem;
}

const Question: React.FC<QuestionProps> = ({ problem }) => {
  return (
    <div className="p-6 space-y-8">
      {/* Title and Difficulty */}
      <div>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-4">
          {problem.title}
          <span className={`text-base px-3 py-1 rounded ${
            problem.difficulty === 'EASY' ? 'bg-green-500/20 text-green-500' :
            problem.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {problem.difficulty}
          </span>
          <span className="text-base text-gray-400">
            Rating: {problem.rating}
          </span>
        </h1>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90">Description</h2>
        <div className="text-gray-300 whitespace-pre-wrap">
          {problem.description}
        </div>
      </div>

      {/* Input Format */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90">Input Format</h2>
        <div className="text-gray-300 whitespace-pre-wrap">
          {problem.inputFormat}
        </div>
      </div>

      {/* Output Format */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90">Output Format</h2>
        <div className="text-gray-300 whitespace-pre-wrap">
          {problem.outputFormat}
        </div>
      </div>

      {/* Constraints */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90">Constraints</h2>
        <div className="text-gray-300 whitespace-pre-wrap">
          {problem.constraints}
        </div>
      </div>

      {/* Time and Memory Limits */}
      <div className="flex gap-8 text-sm text-gray-400">
        <div>Time Limit: {problem.timeLimit}ms</div>
        <div>Memory Limit: {problem.memoryLimit}MB</div>
      </div>
    </div>
  );
};

export default Question;
