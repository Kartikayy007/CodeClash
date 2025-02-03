import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TestCase } from '@/features/editor/api/problems';

interface TestCasesProps {
  testCases: TestCase[];
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const TestCases: React.FC<TestCasesProps> = ({
  testCases,
  isCollapsed,
  onCollapse,
}) => {
  return (
    <div className="bg-[#1A1D24] rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-[#1C202A]">
        <h2 className="font-bold text-lg">Test Cases</h2>
        <button
          className="p-1 hover:bg-[#292C33] rounded"
          onClick={() => onCollapse(!isCollapsed)}
        >
          {isCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {testCases.map((testCase, index) => (
            <div key={testCase.id} className="space-y-2">
              <h3 className="font-medium">Test Case {index + 1}:</h3>
              <div className="bg-[#292C33] p-3 rounded">
                <p className="text-gray-400">Input:</p>
                <pre className="text-gray-300 whitespace-pre-wrap">{testCase.input}</pre>
              </div>
              <div className="bg-[#292C33] p-3 rounded">
                <p className="text-gray-400">Expected Output:</p>
                <pre className="text-gray-300 whitespace-pre-wrap">{testCase.output}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestCases; 