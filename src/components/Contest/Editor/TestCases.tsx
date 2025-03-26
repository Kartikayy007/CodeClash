'use client';

import React, { useState, useEffect } from 'react';
import { TestCase } from '@/features/editor/api/problems';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (runResult && !isRunning && !runError) {
      const expectedOutput = testCases[activeCase]?.output || '';
      const normalizedExpected = expectedOutput.trim().replace(/\r\n/g, '\n');
      const normalizedActual = runResult.trim().replace(/\r\n/g, '\n');
      
      setIsCorrect(normalizedExpected === normalizedActual);
    } else {
      setIsCorrect(null);
    }
  }, [runResult, runError, isRunning, activeCase, testCases]);

  const formatCompilerError = (error: string) => {
    if (!error) return null;

    const filePathRegex = /\/tmp\/prog_[a-z0-9]+\.(cpp|py|java|js|c)/g;
    
    const cleanedError = error.replace(filePathRegex, 'code');
    
    const lines = cleanedError.split('\n');
    
    return (
      <div className="whitespace-pre-wrap font-mono text-sm">
        {lines.map((line, index) => {
          const isErrorLine = line.includes('error:');
          const isCodeLine = line.includes('|');
          const isIndicatorLine = line.includes('^');

          return (
            <div 
              key={index} 
              className={`
                ${isErrorLine ? 'text-red-400 font-semibold' : ''}
                ${isCodeLine ? 'text-amber-300 pl-4' : ''}
                ${isIndicatorLine ? 'text-green-400 pl-4' : ''}
              `}
            >
              {line}
            </div>
          );
        })}
      </div>
    );
  };

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
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm text-gray-400">Your Output:</h4>
                {!isRunning && !runError && isCorrect !== null && (
                  <div className={`flex items-center gap-1 text-sm ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle size={16} />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {isRunning ? (
                <div className="bg-[#292C33] rounded-md p-3 text-sm flex items-center justify-center h-12">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span className="ml-2">Running code...</span>
                </div>
              ) : runError ? (
                <div className="bg-[#1A1D24] text-red-500 border border-red-600/30 rounded-md p-3 overflow-auto max-h-[200px]">
                  {formatCompilerError(runError)}
                </div>
              ) : runResult ? (
                <div className={`rounded-md p-3 text-sm overflow-auto ${
                  isCorrect === true ? 'bg-green-900/20 border border-green-600/30 text-green-200' :
                  isCorrect === false ? 'bg-red-900/20 border border-red-600/30 text-red-200' :
                  'bg-[#292C33] text-white'
                }`}>
                  <pre className="whitespace-pre-wrap">{runResult}</pre>
                </div>
              ) : (
                <div className="bg-[#292C33] rounded-md p-3 text-sm text-gray-500">
                  Run your code to see the output here
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCases; 