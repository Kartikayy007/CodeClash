import React from 'react';
import { ChevronDown } from 'lucide-react';

const TestCases = () => {
  return (
    <div className="bg-[#1A1D24] w-full h-full rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#292C33]">
        <h1 className="text-white hover:text-gray-300">Test Cases</h1>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-[#292C33] rounded">
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
      {/* Test cases content will go here */}
    </div>
  );
};

export default TestCases; 