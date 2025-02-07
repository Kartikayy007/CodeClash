import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchSubmissions, fetchSubmissionById, setPage, fetchSubmissionsByMatchId, clearSelectedSubmission } from '../../slices/submissionSlice';
import { format } from 'date-fns';

const SubmissionDetails: React.FC<{ submission: any; onBack: () => void }> = ({ submission, onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const submissionDetails = useSelector((state: RootState) => state.submissions.selectedSubmission);

  useEffect(() => {
    if (submission.id) {
      dispatch(fetchSubmissionById(submission.id));
    }
  }, [submission.id, dispatch]);

  if (!submissionDetails) return null;

  return (
    <div className="p-4 space-y-4 bg-[#1A1D24] rounded-b-lg border-t border-[#232323]">
      <h3 className="text-lg font-medium">Analysis :</h3>
      <div>
        <p className="text-white/60">Question :</p>
        <p className="font-medium">{submissionDetails.question.title} ({submissionDetails.question.difficulty})</p>
      </div>
      <div>
        <p className="text-white/60 mb-2">Your Code :</p>
        <div className="bg-[#292C33] p-4 rounded-lg">
          <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {submissionDetails.code || 'Code not available'}
          </pre>
        </div>
      </div>
      <div>
        <p className="text-white/60 mb-2">Test Cases Passed :</p>
        <p className="font-medium">{submissionDetails.testCasesPassed || 0} / {submissionDetails.totalTestCases || 0}</p>
      </div>
      <div>
        <p className="text-white/60 mb-2">Status :</p>
        <p className="font-medium">{submissionDetails.status}</p>
      </div>
      <div>
        <p className="text-white/60 mb-2">Created At :</p>
        <p className="font-medium">{format(new Date(submissionDetails.createdAt), 'dd MMM hh:mm a')}</p>
      </div>
      <div>
        <p className="text-white/60 mb-2">Input :</p>
        <div className="bg-[#292C33] p-4 rounded-lg">
          <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {submissionDetails.input || 'Input not available'}
          </pre>
        </div>
      </div>
      <div>
        <p className="text-white/60 mb-2">Expected Output :</p>
        <div className="bg-[#292C33] p-4 rounded-lg">
          <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {submissionDetails.expectedOutput || 'Expected output not available'}
          </pre>
        </div>
      </div>
      <div>
        <p className="text-white/60 mb-2">Actual Output :</p>
        <div className="bg-[#292C33] p-4 rounded-lg">
          <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {submissionDetails.actualOutput || 'Actual output not available'}
          </pre>
        </div>
      </div>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-[#DB84D9] text-white rounded-lg hover:bg-[#DB84D9]/90"
      >
        Back
      </button>
    </div>
  );
};

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

interface SubmissionsProps {
  onSelectSubmission: (submissionId: string) => void;
}

const Submissions: React.FC<SubmissionsProps> = ({ onSelectSubmission }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedSubmission, setSelectedSubmission] = React.useState<string | null>(null);
  const { submissions, pagination, loading, selectedSubmission: submissionDetails } = useSelector((state: RootState) => state.submissions);
  const { matchId } = useSelector((state: RootState) => state.battle);

  useEffect(() => {
    if (matchId) {
      dispatch(fetchSubmissionsByMatchId(matchId));
    }
  }, [dispatch, matchId]);

  if (loading || submissionDetails?.status === 'PROCESSING') {
    return (
      <div className="h-full bg-[#1A1D24] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-t-[#DB84D9] border-r-[#DB84D9] border-b-transparent border-l-transparent rounded-full animate-spin" />
        <div className="text-lg">Processing submission...</div>
      </div>
    );
  }

  if (selectedSubmission && submissionDetails) {
    return (
      <SubmissionDetails
        submission={{
          id: submissionDetails.id,
          status: submissionDetails.status,
          testCasesPassed: submissionDetails.testCasesPassed || 0,
          totalTestCases: submissionDetails.totalTestCases || 0,
          createdAt: submissionDetails.createdAt,
          code: submissionDetails.code,
          input: submissionDetails.input || '',
          expectedOutput: submissionDetails.expectedOutput || '',
          actualOutput: submissionDetails.actualOutput || '',
        }}
        onBack={() => {
          setSelectedSubmission(null);
          dispatch(clearSelectedSubmission());
        }}
      />
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="h-full bg-[#1A1D24] text-white flex flex-col items-center justify-center gap-4">
        <div className="text-lg">No submissions yet</div>
      </div>
    );
  }

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
          {submissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => onSelectSubmission(submission.id)}
              className="w-full grid grid-cols-4 p-4 bg-[#1A1D24] items-center hover:bg-[#232323] transition-colors border-b border-[#232323] last:border-b-0"
            >
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
