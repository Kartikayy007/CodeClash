'use client';

import React from 'react';
import { Problem } from '@/features/battle/editor/api/problems';
import 'katex/dist/katex.min.css';
import { parseConstraints } from '@/utils/mathUtils';

interface QuestionProps {
  problem: Problem | null;
  isLoading: boolean;
}

const Question = ({ problem, isLoading }: QuestionProps) => {
  if (isLoading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (!problem) {
    return <div className="p-6 bg-[#1C202A] text-gray-400 text-2xl font-bold text-center mt-10">Problem not found</div>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        {problem.title} ({problem.rating})
      </h1>
      <div className="space-y-6">
        <div className="prose prose-invert">
          <p className="text-gray-300">{problem.description}</p>
        </div>

        <div>
          <h3 className="font-medium text-2xl mb-2">Input Format:</h3>
          <p className="text-gray-300">{problem.inputFormat}</p>
        </div>

        <div>
          <h3 className="font-medium text-2xl mb-2">Output Format:</h3>
          <p className="text-gray-300">{problem.outputFormat}</p>
        </div>

        <div className="space-y-4">
          {problem.testCases.filter(test => !test.isHidden).map((testCase, index) => (
            <div key={testCase.id} className="space-y-2">
              <h3 className="font-medium text-2xl">Example {index + 1}:</h3>
              <div className="bg-[#292C33] rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-gray-400">Input: </span>
                  <code className="text-white">{testCase.input}</code>
                </div>
                <div>
                  <span className="text-gray-400">Output: </span>
                  <code className="text-white">{testCase.output}</code>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-medium text-2xl mb-2">Constraints:</h3>
          {parseConstraints(problem.constraints)}
        </div> 

        <div className="text-sm text-gray-400">
          <p>Time Limit: {problem.timeLimit} ms</p>
          <p>Memory Limit: {problem.memoryLimit} MB</p>
        </div>
      </div>
    </div>
  );
};

export default Question; 