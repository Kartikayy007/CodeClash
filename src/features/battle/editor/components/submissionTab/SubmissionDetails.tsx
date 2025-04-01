import React, { useEffect, useState } from 'react';
import { ChevronLeft, Check, X, AlertTriangle, Clock, Settings, BarChart, Lock, Infinity, HelpCircle, Copy, CheckCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchSubmissionById } from '@/features/battle/editor/slices/submissionSlice';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';

interface SubmissionDetailsProps {
  submissionId: string;
  onBack: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return <Check className="w-4 h-4 text-green-500" />;
    case 'TIME_LIMIT_EXCEEDED':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'RUNTIME_ERROR':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'WRONG_ANSWER':
      return <X className="w-4 h-4 text-red-500" />;
    case 'COMPILATION_ERROR':
      return <Settings className="w-4 h-4 text-blue-500" />;
    case 'MEMORY_LIMIT_EXCEEDED':
      return <BarChart className="w-4 h-4 text-purple-500" />;
    case 'SEGMENTATION_FAULT':
      return <Lock className="w-4 h-4 text-orange-500" />;
    case 'INFINITE_LOOP':
      return <Infinity className="w-4 h-4 text-red-500" />;
    default:
      return <HelpCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return 'Accepted';
    case 'TIME_LIMIT_EXCEEDED':
      return 'Time Limit Exceeded';
    case 'RUNTIME_ERROR':
      return 'Runtime Error';
    case 'WRONG_ANSWER':
      return 'Wrong Answer';
    case 'COMPILATION_ERROR':
      return 'Compilation Error';
    case 'MEMORY_LIMIT_EXCEEDED':
      return 'Memory Limit Exceeded';
    case 'SEGMENTATION_FAULT':
      return 'Segmentation Fault';
    case 'INFINITE_LOOP':
      return 'Infinite Loop';
    default:
      return 'Undefined Behavior';
  }
};

const getLanguageExtension = (lang: string) => {
  switch (lang) {
    case 'cpp':
    case 'c':
      return cpp();
    case 'javascript':
      return javascript();
    case 'python':
      return python();
    case 'java':
      return java();
    default:
      return cpp();
  }
};

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  submissionId,
  onBack
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const submissionDetails = useSelector((state: RootState) => state.submissions.selectedSubmission);
  const { loading } = useSelector((state: RootState) => state.submissions);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchSubmissionById(submissionId));
  }, [submissionId, dispatch]);


  return (
    <div className="h-full bg-[#1A1D24] text-white">

      <div className="grid grid-cols-4 p-4 text-lg font-semibold text-white">
      <button 
          onClick={onBack}
          className="absolute flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <div className='text-center'>Time</div>
        <div className='text-center'>Test Cases</div>
        <div className='text-center'>Status</div>
        <div className='text-center'>Score</div>
      </div>

    <div className='px-4'>
      <div className='p-4 border border-[#5D5D5D] rounded-lg'>
        <div className="rounded-lg overflow-hidden ">
          <div className="w-full grid text-center grid-cols-4  mb-4 rounded-lg bg-[#1A1D24] items-center  text-[#5D5D5D]">
            {submissionDetails ? (
              <>
                <div className="text-sm">
                  {new Date(submissionDetails.createdAt).toLocaleString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }).replace(',', '')}
                </div>
                <div className="text-sm">
                  {submissionDetails.testCasesPassed}/{submissionDetails.totalTestCases}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{getStatusIcon(submissionDetails.status)}</span>
                  <span className="text-sm">{getStatusText(submissionDetails.status)}</span>
                </div>
                <div className="text-sm">
                  {submissionDetails.score}
                </div>
              </>
            ) : (
              <>
                <div className="text-sm animate-pulse bg-gray-700/20 h-4 rounded"></div>
                <div className="text-sm animate-pulse bg-gray-700/20 h-4 rounded"></div>
                <div className="text-sm animate-pulse bg-gray-700/20 h-4 rounded"></div>
                <div className="text-sm"></div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 bg-[#1A1D24] border-[#232323]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-8 h-8 border-4 border-t-[#DB84D9] border-r-[#DB84D9] border-b-transparent border-l-transparent rounded-full animate-spin" />
              <div className="text-lg">Loading analysis...</div>
            </div>
          ) : submissionDetails && (
            <>
              <h3 className="text-lg font-medium flex justify-between items-center">
                <span>Your code</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(submissionDetails.code || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1A1D24] hover:bg-[#292C33] transition-colors text-sm text-gray-400 hover:text-white"
                >
                  {copied ? (
                    <>
                      <CheckCheck size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </h3>
              {submissionDetails.code && (
                <div>
                  <div className="bg-[#292C33] p-4 rounded-lg">
                    <CodeMirror
                      value={submissionDetails.code}
                      height="30rem"
                      width="100%"
                      theme="dark"
                      extensions={[getLanguageExtension(submissionDetails.language || 'cpp')]}
                      editable={false}
                      style={{ overflow: 'auto' }}
                      basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        foldGutter: true,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: false,
                        rectangularSelection: false,
                        crosshairCursor: false,
                        highlightActiveLine: false,
                        highlightSelectionMatches: false,
                        closeBracketsKeymap: false,
                        searchKeymap: false,
                        foldKeymap: false,
                        completionKeymap: true,
                        lintKeymap: false
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
      </div>
    </div>
  );
};

export default SubmissionDetails; 