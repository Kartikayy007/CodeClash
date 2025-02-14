import React from 'react';
import LabelButton from '@/components/ui/LabelButton';

interface Problem {
  id: string;
  title: string;
  rating: number;
  score: number;
  status: 'SOLVED' | 'UNSOLVED' | null;
}

interface ProblemSetProps {
  problems: Problem[];
  onSolveProblem: (problemId: string) => void;
}

const ProblemSet: React.FC<ProblemSetProps> = ({ problems, onSolveProblem }) => {
  return (
    <div className="bg-[#1A1D24] rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Problem Set</h2>
      <div className="space-y-4">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="flex items-center justify-between bg-[#282C33] rounded-lg p-4"
          >
            <div>
              <h3 className="text-lg">{problem.title}</h3>
              <div className="flex gap-8 text-sm text-gray-400">
                <span>Rating: {problem.rating}</span>
                <span>Score: {problem.score}</span>
              </div>
            </div>
            <LabelButton
              variant={problem.status === 'SOLVED' ? 'light' : 'filled'}
              onClick={() => onSolveProblem(problem.id)}
              className="w-24"
            >
              {problem.status === 'SOLVED' ? 'Solved' : 'Solve'}
            </LabelButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSet;
