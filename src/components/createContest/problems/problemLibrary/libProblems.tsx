'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import LabelButton from '@/components/ui/LabelButton';
import { Problem } from '@/types/problem.types';

interface LibProblemsProps {
  onBack: () => void;
  onAddProblems: (selectedProblems: Problem[]) => void;
}

const LibProblems: React.FC<LibProblemsProps> = ({ onBack, onAddProblems }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProblems, setSelectedProblems] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API call
  const problems: Problem[] = [
    {
      id: '1',
      name: 'Two Sum',
      maxScore: 100,
      rating: 800,
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      inputFormat: 'First line contains n and target...',
      constraints: '2 <= nums.length <= 104\n-109 <= nums[i] <= 109',
      outputFormat: 'Return indices of the two numbers such that they add up to target.',
      testCases: []
    },
    {
      id: '2',
      name: 'Insert Linked List',
      maxScore: 100,
      rating: 1200,
      description: 'Insert a node into a sorted linked list...',
      inputFormat: 'First line contains n...',
      constraints: '1 <= n <= 1000',
      outputFormat: 'Return the head of the modified linked list.',
      testCases: []
    }
  ];

  const handleToggleSelect = (problemId: string) => {
    const newSelected = new Set(selectedProblems);
    if (newSelected.has(problemId)) {
      newSelected.delete(problemId);
    } else {
      newSelected.add(problemId);
    }
    setSelectedProblems(newSelected);
  };

  const handleAddSelected = () => {
    const selectedProblemsList = problems.filter(p => selectedProblems.has(p.id || ''));
    onAddProblems(selectedProblemsList);
  };

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex-1 mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter Problem Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[45px] pl-12 pr-4 rounded-lg bg-[#1A1D24] border-none focus:outline-none text-white"
              />
            </div>
          </div>
          <LabelButton variant='light' onClick={handleAddSelected} disabled={selectedProblems.size === 0}>
            Add Questions
          </LabelButton>
        </div>

        <div className="flex flex-1">
          <div className="w-56">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span className="text-gray-400">Filters</span>
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedFilter === 'all'
                    ? 'bg-[#1A1D24] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('created')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedFilter === 'created'
                    ? 'bg-[#1A1D24] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Your Created Problems
              </button>
              <div className="py-4">
                <h3 className="text-gray-400 mb-2">Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input type="radio" name="rating" value="all" defaultChecked />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input type="radio" name="rating" value="less1000" />
                    <span>less than 1000</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input type="radio" name="rating" value="greater1000" />
                    <span>greater than 1000</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input type="radio" name="rating" value="greater1500" />
                    <span>greater than 1500</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                    <input type="radio" name="rating" value="custom" />
                    <span>Custom</span>
                  </label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      placeholder="from"
                      className="w-20 px-2 py-1 bg-[#1A1D24] rounded border border-gray-700"
                    />
                    <input
                      type="number"
                      placeholder="to"
                      className="w-20 px-2 py-1 bg-[#1A1D24] rounded border border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 ml-8">
            <div className="bg-[#1A1D24] rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 p-4 text-white border-b border-gray-700">
                <div className="text-center">Select</div>
                <div className="text-center">Problem Name</div>
                <div className="text-center">Rating</div>
              </div>

              <div className="divide-y divide-gray-700">
                {problems.map((problem) => (
                  <div key={problem.id} className="grid grid-cols-3 p-4 items-center">
                    <div className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedProblems.has(problem.id)}
                        onChange={() => handleToggleSelect(problem.id)}
                        className="form-checkbox"
                      />
                    </div>
                    <div className="text-center">{problem.name}</div>
                    <div className="text-center">{problem.rating}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibProblems;
