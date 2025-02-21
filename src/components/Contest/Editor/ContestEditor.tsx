'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Problem, TestCase, fetchProblem } from '@/features/editor/api/problems';
import Topbar from './Topbar';
import CodeEditor from './CodeEditor';
import Question from './Question';
import Submissions from './Submissions';
import TestCases from './TestCases';
import { runCode, submitCode } from '@/features/editor/api/editorApi';

interface ContestEditorProps {
  problemId: string;
}

const ContestEditor = ({ problemId }: ContestEditorProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
  const [code, setCode] = useState('');
  const [language, ] = useState('cpp');
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [isDescriptionMaximized, setIsDescriptionMaximized] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [, setIsSubmitting] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProblem = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProblem(problemId);
        setProblem(data);
        const visibleTestCases = data.testCases.filter(test => !test.isHidden);
        setTestCases(visibleTestCases);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getProblem();
  }, [problemId]);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setRunError(null);
      setRunResult(null);

      const response = await runCode({
        code,
        language,
        input: testCases[0]?.input || '',
        matchId: problemId // Using problemId as matchId for now
      });

      if (response.body.error) {
        setRunError(response.body.error);
      } else {
        setRunResult(response.body.output);
      }
    } catch (error) {
      setRunError('Failed to run code. Please try again.');
      console.error('Run error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await submitCode({
        code,
        language,
        matchId: problemId,
        questionId: problemId
      });

      // Handle submission response
      console.log('Submission result:', response);
      // You might want to show a success message or redirect
      
    } catch (error) {
      console.error('Submit error:', error);
      // Handle submission error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen p-4 gap-4 flex-col lg:flex-row">
      <div className={`overflow-scroll rounded-lg flex flex-col ${
        isDescriptionMaximized ? 'w-full' :
        isDescriptionCollapsed ? 'w-12' :
        'lg:w-[50%] w-full'
      }`}>
        <div className="mb-4">
          <Topbar
            onRun={handleRun}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="flex items-center justify-between p-4 sticky top-0 bg-[#1C202A] rounded-t-lg z-10">
          <div className={`flex gap-4 ${isDescriptionCollapsed ? 'hidden' : ''}`}>
            <button
              className={`${activeTab === 'description' ? 'text-white bg-white/10 rounded-md px-2 py-1' : 'text-gray-500'} hover:text-gray-300 font-bold text-lg`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${activeTab === 'submissions' ? 'text-white bg-white/10 rounded-md px-2 py-1' : 'text-gray-500'} hover:text-gray-300 font-bold text-lg`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
          </div>

          <div className={`flex gap-2 ${isDescriptionCollapsed ? 'flex-col [&>button]:rotate-90' : ''}`}>
            <button
              className="p-1 hover:bg-[#292C33] rounded"
              onClick={() => setIsDescriptionMaximized(!isDescriptionMaximized)}
            >
              {isDescriptionCollapsed ? null : isDescriptionMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              className="p-1 hover:bg-[#292C33] rounded"
              onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
            >
              {isDescriptionMaximized ? null : isDescriptionCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        <div className={`overflow-y-auto flex-1 bg-[#1C202A] ${isDescriptionCollapsed ? 'hidden' : ''}`}>
          {activeTab === 'description' ? (
            <Question 
              problem={problem}
              isLoading={isLoading}
            />
          ) : (
            <Submissions problemId={problemId} />
          )}
        </div>
      </div>

      <div className={`flex flex-col ${
        isDescriptionMaximized ? 'hidden' :
        isDescriptionCollapsed ? 'lg:w-[calc(100%-3rem)] w-full' :
        'lg:w-[50%] w-full'
      }`}>
        <div className="flex flex-col h-full gap-4">
          <div>
            <CodeEditor 
              code={code}
              setCode={setCode}
              language={language}
            />
          </div>
          <div className="h-full">
            <TestCases 
              testCases={testCases} 
              runResult={runResult}
              runError={runError}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestEditor; 