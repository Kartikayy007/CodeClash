import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Problem } from '@/features/editor/api/problems';

interface ProblemDetailModalProps {
  problem?: Problem;
  isLoading?: boolean;
  onClose: () => void;
}

const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({ 
  problem, 
  isLoading = false,
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1D24] w-[800px] max-h-[80vh] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">
            {isLoading ? 'Loading...' : problem?.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm">
                <span className={`px-3 py-1 rounded ${
                  problem?.difficulty === 'EASY' ? 'bg-green-500/20 text-green-500' :
                  problem?.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {problem?.difficulty}
                </span>
                <span className="text-gray-400">Rating: {problem?.rating}</span>
                <span className="text-gray-400">Time Limit: {problem?.timeLimit}ms</span>
                <span className="text-gray-400">Memory Limit: {problem?.memoryLimit}MB</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {problem?.description}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Input Format</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {problem?.inputFormat}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Output Format</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {problem?.outputFormat}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Constraints</h3>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {problem?.constraints}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Example Test Cases</h3>
                <div className="space-y-4">
                  {problem?.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
                    <div key={testCase.id} className="space-y-2">
                      <h4 className="font-medium">Test Case {index + 1}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Input:</p>
                          <pre className="bg-[#282C33] p-3 rounded whitespace-pre-wrap">
                            {testCase.input}
                          </pre>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Output:</p>
                          <pre className="bg-[#282C33] p-3 rounded whitespace-pre-wrap">
                            {testCase.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailModal;