import React from 'react';
import { Check, X, AlertTriangle, Clock } from 'lucide-react';

interface Submission {
  id: string;
  problem: string;
  language: 'C' | 'C++';
  status: string;
  time: string;
  score: string;
}

const MySubmissions: React.FC = () => {
  const submissions: Submission[] = [
    {
      id: '1',
      problem: 'Abcdef',
      language: 'C',
      status: 'Passed',
      time: '12:02 am',
      score: '90.00'
    },
    {
      id: '2',
      problem: 'Efghij',
      language: 'C++',
      status: 'TLE',
      time: '12:02 am',
      score: '80.00'
    },
    {
      id: '3',
      problem: 'Qwetyu',
      language: 'C',
      status: 'Wrong Answer',
      time: '12:12 am',
      score: '70.00'
    },
    {
      id: '4',
      problem: 'Ytrefgv',
      language: 'C++',
      status: 'Passed',
      time: '12:24 am',
      score: '60.00'
    },
    {
      id: '5',
      problem: 'Dfghksis',
      language: 'C',
      status: 'Passed',
      time: '11:22 pm',
      score: '50.00'
    },
    {
      id: '6',
      problem: 'Asdfhjc',
      language: 'C++',
      status: 'Passed',
      time: '11:22 pm',
      score: '46.00'
    },
    {
      id: '7',
      problem: 'Zxfdteyfb',
      language: 'C',
      status: 'Passed',
      time: '11:22 pm',
      score: '40.00'
    },
    {
      id: '8',
      problem: 'Qeryuincksm',
      language: 'C++',
      status: 'Passed',
      time: '11:22 pm',
      score: '30.00'
    },
    {
      id: '9',
      problem: 'Qpryu n n',
      language: 'C',
      status: 'Passed',
      time: '11:22 pm',
      score: '20.00'
    },
    {
      id: '10',
      problem: 'Ghjilkhgd',
      language: 'C++',
      status: 'Wrong Answer',
      time: '11:22 pm',
      score: '10.00'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'TLE':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Wrong Answer':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-[#1A1D24] rounded-lg p-6">
      <div className="rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold mb-6">My Submissions</h2>
        <div className="grid grid-cols-5 bg-[#282C33] p-4 text-sm font-medium text-white">
          <div>Problem</div>
          <div>Language</div>
          <div>Status</div>
          <div>Time</div>
          <div>Score</div>
        </div>
        
        {/* Submissions */}
        <div className="space-y-2 mt-2">
          {submissions.map((submission) => (
            <div 
              key={submission.id}
              className="grid grid-cols-5 p-4 items-center bg-[#1E2127] hover:bg-[#282C33] transition-colors"
            >
              <div>{submission.problem}</div>
              <div>{submission.language}</div>
              <div>{submission.status}</div>
              <div>{submission.time}</div>
              <div>{submission.score}</div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4 text-gray-400">
          <button className="hover:text-white">←</button>
          <button className="text-purple-500">1</button>
          <button className="hover:text-white">2</button>
          <button className="hover:text-white">3</button>
          <button className="hover:text-white">→</button>
        </div>
      </div>
    </div>
  );
};

export default MySubmissions; 