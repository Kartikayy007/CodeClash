import React from 'react';

interface SubmissionDetailsProps {
  isOpen: boolean;
  onToggle: () => void;
  submission: {
    id: string;
    status: string;
    testCasesPassed?: number;
    totalTestCases?: number;
    createdAt: string;
    code?: string;
    input?: string;
    expectedOutput?: string;
    actualOutput?: string;
  };
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
  submission
}) => {
  return (
    <div className="h-full bg-[#1A1D24] text-white">
      <div className="grid grid-cols-4 p-4 text-sm font-medium text-white/60">
        <div>Time</div>
        <div>Test Cases</div>
        <div>Status</div>
        <div>Score</div>
      </div>
      <div className="p-4">
        <div className="border border-[#232323] rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 p-4 bg-[#1A1D24] items-center">
            <div className="text-sm">
              {new Date(submission.createdAt).toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }).replace(',', '')}
            </div>
            <div className="text-sm">
              {submission.testCasesPassed}/{submission.totalTestCases}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getStatusIcon(submission.status)}</span>
              <span className="text-sm">{getStatusText(submission.status)}</span>
            </div>
            <div className="text-sm">00</div>
          </div>

          <div className="p-4 space-y-4 bg-[#1A1D24] border-t border-[#232323]">
            <h3 className="text-lg font-medium">Analysis :</h3>
            {submission.input && (
              <div>
                <p className="text-white/60">Input value :</p>
                <p className="font-mono">{submission.input}</p>
              </div>
            )}
            {submission.expectedOutput && (
              <div>
                <p className="text-white/60">Expected Output :</p>
                <p className="font-mono">{submission.expectedOutput}</p>
              </div>
            )}
            {submission.actualOutput && (
              <div>
                <p className="text-white/60">Your Output :</p>
                <p className="font-mono">{submission.actualOutput}</p>
              </div>
            )}
            {submission.code && (
              <div>
                <p className="text-white/60 mb-2">Your Code :</p>
                <div className="bg-[#292C33] p-4 rounded-lg">
                  <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {submission.code}
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