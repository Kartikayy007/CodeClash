import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TestCases = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-[#1A1D24] w-full rounded-lg overflow-hidden transition-all duration-300 ${
      isCollapsed ? 'h-[50px]' : 'h-full'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-[#292C33]">
        <h1 className="text-white font-bold hover:text-gray-300">Test Cases</h1>
        <div className="flex gap-2">
          <button 
            className="p-1 hover:bg-[#292C33] rounded"
            onClick={() => setIsMaximized(!isMaximized)}
          >
          </button>
          <button 
            className="p-1 hover:bg-[#292C33] rounded"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      <div className={`flex-1 ${isCollapsed ? 'hidden' : ''}`}>
        {/* Test cases content will go here */}
      </div>
    </div>
  );
};

export default TestCases; 