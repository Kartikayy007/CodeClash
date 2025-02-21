'use client';

import React from 'react';
import ContestEditor from '@/components/Contest/Editor/ContestEditor';
import { useParams } from 'next/navigation';

const ProblemPage = () => {
  const params = useParams();
  const problemId = params?.ProblemId as string;

  return (
    <div className="min-h-screen bg-[#10141D]">
      <ContestEditor problemId={problemId} />
    </div>
  );
};

export default ProblemPage;
