import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchSubmissionById } from '@/features/editor/slices/submissionSlice';

interface SubmissionDetailsProps {
  submissionId: string;
  onBack: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return '✓';
    case 'TIME_LIMIT_EXCEEDED':
      return '⏱';
    case 'RUNTIME_ERROR':
      return '⚠';
    case 'WRONG_ANSWER':
      return '✕';
    case 'COMPILATION_ERROR':
      return '⚙';
    case 'MEMORY_LIMIT_EXCEEDED':
      return '📊';
    case 'SEGMENTATION_FAULT':
      return '🔒';
    case 'INFINITE_LOOP':
      return '♾';
    default:
      return '?';
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

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  submissionId,
  onBack
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const submissionDetails = useSelector((state: RootState) => state.submissions.selectedSubmission);

  useEffect(() => {
    dispatch(fetchSubmissionById(submissionId));
  }, [submissionId, dispatch]);

  if (!submissionDetails) {
    return (
      <div className="h-full bg-[#1A1D24] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-t-[#DB84D9] border-r-[#DB84D9] border-b-transparent border-l-transparent rounded-full animate-spin" />
        <div className="text-lg">Loading submission details...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1A1D24] text-white">
      <div className="flex items-center gap-4 p-4 border-b border-[#232323]">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back to Submissions</span>
        </button>
      </div>

      <div className="grid grid-cols-4 p-4 text-sm text-center font-medium text-white/60">
        <div>Time</div>
        <div>Test Cases</div>
        <div>Status</div>
        <div>Score</div>
      </div>
      <div className="p-4">
        <div className="border border-[#232323] rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 p-4 bg-[#1A1D24] items-center">
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
            <div className="flex items-center gap-2">
              <span className="text-lg">{getStatusIcon(submissionDetails.status)}</span>
              <span className="text-sm">{getStatusText(submissionDetails.status)}</span>
            </div>
            <div className="text-sm">00</div>
          </div>

          <div className="p-4 space-y-4 bg-[#1A1D24] border-t border-[#232323]">
            <h3 className="text-lg font-medium">Analysis :</h3>
            {submissionDetails.input && (
              <div>
                <p className="text-white/60">Input value :</p>
                <p className="font-mono">{submissionDetails.input}</p>
              </div>
            )}
            {submissionDetails.expectedOutput && (
              <div>
                <p className="text-white/60">Expected Output :</p>
                <p className="font-mono">{submissionDetails.expectedOutput}</p>
              </div>
            )}
            {submissionDetails.actualOutput && (
              <div>
                <p className="text-white/60">Your Output :</p>
                <p className="font-mono">{submissionDetails.actualOutput}</p>
              </div>
            )}
            {submissionDetails.code && (
              <div>
                <p className="text-white/60 mb-2">Your Code :</p>
                <div className="bg-[#292C33] p-4 rounded-lg">
                  <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {submissionDetails.code}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails; 