import React from "react";
import { ChevronUp, ChevronDown, Check, X } from "lucide-react";
import { TestCase } from "@/features/battle/editor/api/problems";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface TestCaseResult {
  passed: boolean;
  output: string | null;
}

interface TestCasesProps {
  testCases: TestCase[];
  isCollapsed: boolean;
  onCollapse: (value: boolean) => void;
  className?: string;
}

const TestCases: React.FC<TestCasesProps> = ({
  testCases,
  isCollapsed,
  onCollapse,
  className = "",
}) => {
  const { output, error, submissionResponse } = useSelector(
    (state: RootState) => state.editor,
  );
  const [selectedCase, setSelectedCase] = React.useState(0);
  const [testResults, setTestResults] = React.useState<
    Record<number, TestCaseResult>
  >({});

  React.useEffect(() => {
    if (output && !error) {
      const expectedOutput = testCases[selectedCase]?.output.trim();
      const actualOutput = output.trim();

      setTestResults((prev) => ({
        ...prev,
        [selectedCase]: {
          passed: expectedOutput === actualOutput,
          output: actualOutput,
        },
      }));
    }
  }, [output, error, testCases, selectedCase]);

  React.useEffect(() => {
    if (submissionResponse) {
      const newResults: Record<number, TestCaseResult> = {};
      testCases.forEach((_, index) => {
        if (index < submissionResponse.testCasesPassed) {
          newResults[index] = {
            passed: true,
            output: null,
          };
        } else if (
          index === submissionResponse.testCasesPassed &&
          submissionResponse.failedTestCase
        ) {
          newResults[index] = {
            passed: false,
            output: submissionResponse.failedTestCase,
          };
        }
      });
      setTestResults(newResults);
    }
  }, [submissionResponse, testCases]);

  return (
    <div
      className={`bg-[#1A1D24] rounded-lg flex flex-col h-full ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#1C202A] ">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">Test Cases</h2>
        </div>
        <button
          className="p-1 hover:bg-[#292C33] rounded"
          onClick={() => onCollapse(!isCollapsed)}
        >
          {isCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col flex-1">
          <div className="h-12 flex gap-2 px-4 bg-[#1C202A]/50 overflow-x-auto">
            {testCases.map((_, index) => {
              const result = testResults[index];
              const isSelected = selectedCase === index;
              const statusColor = result
                ? result.passed
                  ? "bg-green-500/10 text-green-500 border-green-500"
                  : "bg-red-500/10 text-red-500 border-red-500"
                : isSelected
                  ? "bg-white/10 text-white border-white"
                  : "text-gray-500 border-[#232323] hover:border-gray-500";

              return (
                <button
                  key={index}
                  onClick={() => setSelectedCase(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border ${statusColor} transition-colors`}
                >
                  <span>Case {index + 1}</span>
                  {result &&
                    (result.passed ? <Check size={16} /> : <X size={16} />)}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="bg-[#292C33] p-3 rounded-lg px-4 py-2">
                <p className="text-white/60 mb-2 font-medium">Input:</p>
                <pre className="text-white/90 font-mono text-sm max-h-[100px]">
                  {testCases[selectedCase]?.input}
                </pre>
              </div>

              <div className="bg-[#292C33] p-3 rounded-lg  px-4 py-2">
                <p className="text-white/60 mb-2 font-medium">Output:</p>
                <pre className="text-white/90 font-mono text-sm max-h-[100px]">
                  {testCases[selectedCase]?.output}
                </pre>
              </div>

              {testResults[selectedCase]?.output && (
                <div
                  className={`bg-[#292C33] px-4 py-2 rounded-lg ${
                    testResults[selectedCase].passed
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  <p className="text-white/60 mb-2 font-medium">Your Output:</p>
                  <pre className="font-mono text-sm max-h-[100px] overflow-y-auto">
                    {testResults[selectedCase].output}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCases;
