import React from 'react';
import { ChevronUp, ChevronDown, Play, Check, X } from 'lucide-react';
import { TestCase } from '@/features/editor/api/problems';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

interface TestCaseResult {
  passed: boolean;
  output: string | null;
}

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
  const dispatch = useDispatch<AppDispatch>();
  const { code, language, isRunning, output, error } = useSelector((state: RootState) => state.editor);
  const { roomId } = useSelector((state: RootState) => state.battle);
  const [testResults, setTestResults] = React.useState<Record<number, TestCaseResult>>({});

  console.log(output, error);

  React.useEffect(() => {
    if (output && !error) {
      const expectedOutput = testCases[0]?.output.trim();
      const actualOutput = output.trim();
      
      setTestResults(prev => ({
        ...prev,
        0: {
          passed: expectedOutput === actualOutput,
          output: actualOutput
        }
      }));
    }
  }, [output, error, testCases]);


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
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {testCases.map((testCase, index) => {
            const result = testResults[index];
            const statusColor = result 
              ? result.passed 
                ? 'border-green-500 bg-green-500/10 text-green-500'
                : 'border-red-500 bg-red-500/10 text-red-500'
              : 'border-[#232323] text-gray-500';

            return (
              <div key={testCase.id} className="space-y-4">
                <div className={`flex items-center justify-between p-2 rounded-md border ${statusColor}`}>
                  <h3 className="font-medium">Case {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    {result && (
                      result.passed 
                        ? <Check size={16} className="text-green-500" />
                        : <X size={16} className="text-red-500" />
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#292C33] p-4 rounded-lg">
                    <p className="text-white/60 mb-2 font-medium">Input:</p>
                    <pre className="text-white/90 font-mono text-sm whitespace-pre-wrap">{testCase.input}</pre>
                  </div>
                  <div className="bg-[#292C33] p-4 rounded-lg">
                    <p className="text-white/60 mb-2 font-medium">Expected Output:</p>
                    <pre className="text-white/90 font-mono text-sm whitespace-pre-wrap">{testCase.output}</pre>
                  </div>
                  {result && (
                    <div className={`p-4 rounded-lg ${result.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      <p className={`mb-2 font-medium ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                        Your Output:
                      </p>
                      <pre className="font-mono text-sm whitespace-pre-wrap">{result.output}</pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestCases; 