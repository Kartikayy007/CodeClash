import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearSelectedSubmission } from '@/features/battle/editor/slices/submissionSlice';
import Submissions from './Submissions';
import SubmissionDetails from './SubmissionDetails';

const SubmissionTab: React.FC<{ matchId: string }> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { submissionResponse } = useSelector((state: RootState) => state.editor);

  const handleSelectSubmission = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
  };

  const handleBack = () => {
    setSelectedSubmissionId(null);
    dispatch(clearSelectedSubmission());
  };

  if (submissionResponse || selectedSubmissionId) {
    return (
      <SubmissionDetails
        submissionId={selectedSubmissionId || submissionResponse?.submissionId || ''}
        onBack={handleBack}
      />
    );
  }

  return <Submissions onSelectSubmission={handleSelectSubmission} />;
};

export default SubmissionTab;
