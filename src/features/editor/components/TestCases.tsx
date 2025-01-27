import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TestCasesProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  questionData: {
    title: string;
    difficulty: string;
    description: string[];
    constraints: string[];
    examples: {
      id: number;
      input: string;
      output: string;
      explanation?: string;
    }[];
  };
}

const TestCases = ({ isCollapsed, onCollapse, questionData }: TestCasesProps) => {
  const [activeCase, setActiveCase] = useState(0);

  return (
    <div className={`bg-[#1A1D24] w-full rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
      isCollapsed ? 'h-12' : 'h-full'
    }`}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-white font-bold hover:text-gray-300">Test Cases</h1>
        <button 
          className="p-1 hover:bg-[#292C33] rounded"
          onClick={() => onCollapse(!isCollapsed)}
        >
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      <div className={`flex-1 ${isCollapsed ? 'hidden' : ''}`}>
        <div className="p-4">
          <div className="bg-[#292C33] p-4 rounded-lg">
            <div className="flex gap-4 mb-4 border-b border-[#1A1D24]">
              {questionData.examples.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => setActiveCase(index)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeCase === index 
                      ? 'text-white border-b-2 border-white' 
                      : 'text-gray-400 hover:text-white border-b-2 border-transparent hover:border-white'
                  }`}
                >
                  Case {index + 1}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-400">Input:</span>
                <pre className="text-sm bg-[#1A1D24] p-2 rounded mt-1">
                  {questionData.examples[activeCase].input}
                </pre>
              </div>
              <div>
                <span className="text-sm text-gray-400">Output:</span>
                <pre className="text-sm bg-[#1A1D24] p-2 rounded mt-1">
                  {questionData.examples[activeCase].output}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCases; 