'use client';

import React from 'react';

interface QuestionProps {
  problemId: string;
}

const Question = ({  }: QuestionProps) => {
  // Mock data for now
  const problem = {
    title: "Question Name (rating)",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109"
    ]
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
      <div className="space-y-6">
        <div className="prose prose-invert">
          <p className="text-gray-300">{problem.description}</p>
        </div>

        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">Example {index + 1}:</h3>
              <div className="bg-[#292C33] rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-gray-400">Input: </span>
                  <code className="text-white">{example.input}</code>
                </div>
                <div>
                  <span className="text-gray-400">Output: </span>
                  <code className="text-white">{example.output}</code>
                </div>
                {example.explanation && (
                  <div>
                    <span className="text-gray-400">Explanation: </span>
                    <span className="text-white">{example.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-medium mb-2">Constraints:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Question; 