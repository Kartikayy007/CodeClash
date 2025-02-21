'use client';

import React, { useState } from 'react';
import { TestCase } from '@/features/editor/api/problems';

interface TestCasesProps {
  testCases?: TestCase[];
  runResult?: string | null;
  runError?: string | null;
  isRunning?: boolean;
}

const TestCases = ({ 
  testCases = [], 
  runResult, 
  runError,
  isRunning 
}: TestCasesProps) => {
  const [activeCase, setActiveCase] = useState(0);

  if (testCases.length === 0) {
    return (
      <div className="h-full flex flex-col bg-[#1C202A] rounded-lg">
        <div className="flex items-center justify-center h-full text-gray-400">
          No test cases found
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1C202A] rounded-lg">
      <div className="flex items-center p-4 border-b border-[#1E2D3D]">
        <h3 className="text-white font-medium">Testcases</h3>
        <div className="flex gap-2 ml-4">
          {testCases.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCase(index)}
              className={`px-3 py-1 rounded text-sm ${
                activeCase === index
                  ? 'bg-[#292C33] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Case {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-rows-2 p-4 gap-4 overflow-hidden">
        <div className="flex flex-col min-h-0">
          <h4 className="text-sm text-gray-400 mb-1">Input:</h4>
          <div className="flex-1 overflow-auto">
            <pre className="bg-[#292C33] p-2 rounded whitespace-pre-wrap font-mono text-sm text-white h-full">
              {testCases[activeCase]?.input || ''}
            </pre>
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm text-gray-400">Expected Output:</h4>
            {isRunning && (
              <span className="text-sm text-blue-400">Running...</span>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            <pre className="bg-[#292C33] p-2 rounded whitespace-pre-wrap font-mono text-sm text-white h-full">
              {testCases[activeCase]?.output || ''}
            </pre>
          </div>
          
          {(runResult || runError) && (
            <div className="mt-2">
              <h4 className="text-sm text-gray-400 mb-1">Your Output:</h4>
              <pre className={`bg-[#292C33] p-2 rounded whitespace-pre-wrap font-mono text-sm ${
                runError ? 'text-red-400' : 'text-green-400'
              } h-full`}>
                {runError || runResult || ''}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCases; 