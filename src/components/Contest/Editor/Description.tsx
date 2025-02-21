'use client';

import React, { useEffect, useState } from 'react';

interface DescriptionProps {
  problemId: string;
}

const Description = ({ problemId }: DescriptionProps) => {
  const [problem, ] = useState<any>(null);

  useEffect(() => {
    // Fetch problem details
    const fetchProblem = async () => {
      try {
        // Implement API call to fetch problem details
        // const response = await fetch(`/api/problems/${problemId}`);
        // const data = await response.json();
        // setProblem(data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [problemId]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">{problem?.title || 'Loading...'}</h1>
      <div className="prose prose-invert">
        {problem?.description || 'Problem description will appear here'}
      </div>
    </div>
  );
};

export default Description; 