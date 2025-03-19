'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ArrowLeft } from 'lucide-react';
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

interface SubmissionResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  runtime: number;
  message?: string;
}

const ContestEditor = ({ problemId }: ContestEditorProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [isDescriptionMaximized, setIsDescriptionMaximized] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [showSubmissionResult, setShowSubmissionResult] = useState(false);
  const testCasesRef = useRef<HTMLDivElement>(null);

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

  const handleLanguageChange = (newLanguage: string) => {
    console.log('Language changed to:', newLanguage);
    setLanguage(newLanguage);
  };

  const scrollToTestCases = () => {
    testCasesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setRunError(null);
      setRunResult(null);

      const response = await runCode({
        code,
        language,
        input: testCases[0]?.input || '',
        matchId: problemId,
        questionId: problemId
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
      setTimeout(scrollToTestCases, 100);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      const response = await submitCode({
        code,
        language,
        matchId: problemId,
        questionId: problemId
      });

      if (response.error) {
        setSubmissionResult({
          status: 'RUNTIME_ERROR',
          runtime: 0,
          message: response.error
        });
      } else {
        setSubmissionResult({
          status: response.status,
          runtime: response.runtime || 0,
          message: response.message
        });
      }
      setShowSubmissionResult(true);
    } catch (error) {
      setSubmissionResult({
        status: 'RUNTIME_ERROR',
        runtime: 0,
        message: 'Failed to submit code. Please try again.'
      });
      setShowSubmissionResult(true);
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: SubmissionResult['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-green-500';
      case 'WRONG_ANSWER':
        return 'text-red-500';
      case 'RUNTIME_ERROR':
        return 'text-orange-500';
      case 'COMPILATION_ERROR':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderDescriptionContent = () => {
    if (showSubmissionResult && submissionResult) {
      return (
        <div className="p-6">
          <button
            onClick={() => setShowSubmissionResult(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft size={20} />
            Back to Question
          </button>
          <div className="bg-[#292C33] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Submission Result</h3>
              <span className={`font-medium text-lg ${getStatusColor(submissionResult.status)}`}>
                {submissionResult.status}
              </span>
            </div>
            <div className="text-gray-400 mb-4">
              Runtime: {submissionResult.runtime}ms
            </div>
            {submissionResult.message && (
              <div className="mt-4 p-4 bg-[#1C202A] rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Message</h4>
                <p className="text-sm text-gray-400 whitespace-pre-wrap">
                  {submissionResult.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <Question 
        problem={problem}
        isLoading={isLoading}
      />
    );
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
            isRunning={isRunning}
            isSubmitting={isSubmitting}
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
            renderDescriptionContent()
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
              onLanguageChange={handleLanguageChange}
            />
          </div>
          <div ref={testCasesRef} className="h-full">
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