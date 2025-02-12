import React from 'react';
import { Problem } from '@/features/editor/api/problems';

interface QuestionProps {
  problem: Problem;
}

const Question: React.FC<QuestionProps> = ({ problem }) => {
  return (
    <div className="relative h-[calc(100vh-180px)]">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="px-6 space-y-8">
          <div className="sticky top-0 bg-[#1A1D24] py-4 z-10">
            <h1 className="text-2xl font-bold flex items-center gap-4">
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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90 sticky top-16 bg-[#1A1D24] py-2">
              Description
            </h2>
            <div className="text-gray-300 whitespace-pre-wrap">
            Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?Consider an infinite string that consists of all positive integers in increasing order: 12345678910111213141516171819202122232425... Your task is to process q queries of the form: what is the digit at position k in the string?
            </div>
          </div>

          {/* Input Format */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90 sticky top-16 bg-[#1A1D24] py-2">
              Input Format
            </h2>
            <div className="text-gray-300 whitespace-pre-wrap">
              {problem.inputFormat}
            </div>
          </div>

          {/* Output Format */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90 sticky top-16 bg-[#1A1D24] py-2">
              Output Format
            </h2>
            <div className="text-gray-300 whitespace-pre-wrap">
              {problem.outputFormat}
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90 sticky top-16 bg-[#1A1D24] py-2">
              Constraints
            </h2>
            <div className="text-gray-300 whitespace-pre-wrap">
              {problem.constraints}
            </div>
          </div>

          {/* Time and Memory Limits */}
          <div className="flex gap-8 text-sm text-gray-400 sticky bottom-0 bg-[#1A1D24] py-4">
            <div>Time Limit: {problem.timeLimit}ms</div>
            <div>Memory Limit: {problem.memoryLimit}MB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
