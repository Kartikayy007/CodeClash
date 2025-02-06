import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchSubmissions, fetchSubmissionById, setPage, fetchSubmissionsByMatchId } from '../slices/submissionSlice';
import { format } from 'date-fns';

const SubmissionDetails: React.FC<{ submissionId: string; isOpen: boolean }> = ({ submissionId, isOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const submission = useSelector((state: RootState) => state.submissions.selectedSubmission);

  useEffect(() => {
    if (isOpen && submissionId) {
      dispatch(fetchSubmissionById(submissionId));
    }
  }, [isOpen, submissionId, dispatch]);

  if (!isOpen || !submission) return null;

  return (
    <div className="p-4 space-y-4 bg-[#1A1D24] rounded-b-lg border-t border-[#232323]">
      <h3 className="text-lg font-medium">Analysis :</h3>
      <div>
        <p className="text-white/60">Question :</p>
        <p className="font-medium">{submission.question.title} ({submission.question.difficulty})</p>
      </div>
      <div>
        <p className="text-white/60 mb-2">Your Code :</p>
        <div className="bg-[#292C33] p-4 rounded-lg">
          <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {submission.code || 'Code not available'}
          </pre>
        </div>
      </div>
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

const Submissions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedSubmission, setSelectedSubmission] = React.useState<string | null>(null);
  const { submissions, pagination, loading } = useSelector((state: RootState) => state.submissions);
  const { matchId } = useSelector((state: RootState) => state.battle);

  useEffect(() => {
    if (matchId) {
      dispatch(fetchSubmissionsByMatchId(matchId));
    }
  }, [dispatch, matchId]);

  if (loading) {
    return (
      <div className="h-full bg-[#1A1D24] text-white flex items-center justify-center">
        Loading submissions...
      </div>
    );
  } else if (submissions.length === 0) {
    return (
      <div className="h-full bg-[#1A1D24] text-white flex items-center justify-center">
        No submissions found
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1A1D24] text-white">
      <div className="grid grid-cols-4 p-4 text-sm font-medium text-white/60">
        <div>Time</div>
        <div>Question</div>
        <div>Status</div>
        <div>Language</div>
      </div>
      <div className="space-y-2">
        {submissions.map((submission) => (
          <React.Fragment key={submission.id}>
            <div
              className="grid grid-cols-4 p-4 hover:bg-[#292C33] cursor-pointer items-center"
              onClick={() => setSelectedSubmission(
                selectedSubmission === submission.id ? null : submission.id
              )}
            >
              <div className="text-sm">
                {format(new Date(submission.createdAt), 'dd MMM hh:mm a')}
              </div>
              <div className="text-sm flex items-center gap-2">
                <span>{submission.question.title}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  submission.question.difficulty === 'EASY' ? 'bg-green-500/20 text-green-500' :
                  submission.question.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {submission.question.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getStatusIcon(submission.status)}</span>
                <span className="text-sm">{getStatusText(submission.status)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase">{submission.language}</span>
                {selectedSubmission === submission.id ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>
            <SubmissionDetails 
              submissionId={submission.id} 
              isOpen={selectedSubmission === submission.id} 
            />
          </React.Fragment>
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 p-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => dispatch(setPage(i + 1))}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === i + 1
                  ? 'bg-[#DB84D9] text-white'
                  : 'bg-[#292C33] text-white/60 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submissions;
