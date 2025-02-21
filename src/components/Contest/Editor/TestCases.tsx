'use client';

import React, { useState } from 'react';

const TestCases = () => {
  const [activeCase, setActiveCase] = useState(1);

  return (
    <div className="h-full flex flex-col bg-[#1C202A] rounded-lg">
      <div className="flex items-center p-4 border-b border-[#1E2D3D]">
        <h3 className="text-white font-medium">Testcases</h3>
        <div className="flex gap-2 ml-4">
          {[1, 2, 3].map((caseNum) => (
            <button
              key={caseNum}
              onClick={() => setActiveCase(caseNum)}
              className={`px-3 py-1 rounded text-sm ${
                activeCase === caseNum
                  ? 'bg-[#292C33] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Case {caseNum}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-rows-2 p-4 gap-4 overflow-hidden">
        <div className="flex flex-col min-h-0">
          <h4 className="text-sm text-gray-400 mb-1">Input:</h4>
          <div className="flex-1 overflow-auto">
            <pre className="bg-[#292C33] p-2 rounded whitespace-pre-wrap font-mono text-sm text-white h-full">
              {`nums = [2,7,11,15], target = 9`}
            </pre>
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <h4 className="text-sm text-gray-400 mb-1">Expected Output:</h4>
          <div className="flex-1 overflow-auto">
            <pre className="bg-[#292C33] p-2 rounded whitespace-pre-wrap font-mono text-sm text-white h-full">
              [0,1]
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCases; 