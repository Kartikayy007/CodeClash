import React from 'react';
import LabelButton from '@/components/ui/LabelButton';

interface Problem {
  id: string;
  title: string;
  rating: number;
  score: number;
  difficulty: string;
  status?: 'SOLVED' | 'UNSOLVED' | null;
}

interface ProblemSetProps {
  problems: Problem[];
  onSolveProblem: (problemId: string) => void;
}

const ProblemSet: React.FC<ProblemSetProps> = ({ problems, onSolveProblem }) => {
  return (
    <div className="bg-[#1A1D24] rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Problem Set</h2>
      {problems.length > 0 ? (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="flex items-center justify-between bg-[#282C33] rounded-lg p-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium">{problem.title}</h3>
                <div className="flex gap-8 text-sm text-gray-400 mt-1">
                  <span>Rating: {problem.rating}</span>
                  <span>Score: {problem.score}</span>
                  <span className={`${
                    problem.difficulty === 'EASY' ? 'text-green-400' :
                    problem.difficulty === 'MEDIUM' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
              <div>
              <LabelButton
                variant={problem.status === 'SOLVED' ? 'light' : 'filled'}
                onClick={() => onSolveProblem(problem.id)}
                className="w-24"
              >
                {problem.status === 'SOLVED' ? 'Solved' : 'Solve'}
              </LabelButton>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          No problems available in this contest
        </div>
      )}
    </div>
  );
};

export default ProblemSet;
