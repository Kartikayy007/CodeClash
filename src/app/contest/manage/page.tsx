'use client';

import { useState } from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';
import { Search, Edit, BarChart2, Trash, Filter, ChevronDown, Plus } from 'lucide-react';
import LabelButton from '@/components/ui/LabelButton';
// import Link from 'next/link';

type ContestStatus = 'All' | 'Scheduled' | 'Ongoing' | 'Completed';

interface Contest {
  name: string;
  startDate: string;
  duration: string;
  participants: number;
}

export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const contests: Contest[] = [
    {
      name: 'Abcdef',
      startDate: '1 Jan 2024',
      duration: '1 hour',
      participants: 20
    },
    {
      name: 'Efghij',
      startDate: '1 Jan 2024',
      duration: '2 hours',
      participants: 10
    },
    {
      name: 'Qwetyu',
      startDate: '2 Jan 2024',
      duration: '20 mins',
      participants: 15
    },
    {
      name: 'Asdfhjc',
      startDate: '2 Jan 2024',
      duration: '40 mins',
      participants: 10
    }
  ];

  return (
    <div className="min-h-screen ">
      <div className="p-4 md:p-6 lg:p-12">
        {/* Header area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0">
            <button className="text-white text-lg flex items-center gap-2 whitespace-nowrap">
              <span>←</span> Manage
            </button>
            <button className="text-purple-500 border-b-2 border-purple-500 pb-1 whitespace-nowrap">
              Contests
            </button>
            <button className="text-gray-400 whitespace-nowrap">
              Questions
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Enter Problem Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#282C34] text-white px-4 py-2 pl-10 rounded-lg w-full sm:w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="w-full sm:w-auto">
              <LabelButton
                variant="filled"
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => {/* Handle create contest */}}
              >
                <Plus size={20} />
                Create Contest
              </LabelButton>
            </div>
          </div>
        </div>

        {/* Mobile filters toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center justify-between w-full bg-[#282C34] p-3 rounded-lg text-white"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} />
              <span>Filters: {selectedStatus}</span>
            </div>
            <ChevronDown size={18} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {filtersOpen && (
            <div className="bg-[#1E2127] mt-2 p-2 rounded-lg">
              {(['All', 'Scheduled', 'Ongoing', 'Completed'] as ContestStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setFiltersOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded ${
                    selectedStatus === status ? 'bg-[#282C34] text-white' : 'text-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col md:flex-row gap-6'>
          {/* Desktop filters sidebar */}
          <div className="hidden md:block w-full md:w-1/4">
            <h2 className="text-white mb-4 flex items-center gap-2">
              <span className="text-lg">Filters</span>
            </h2>
            <div className="space-y-2">
              {(['All', 'Scheduled', 'Ongoing', 'Completed'] as ContestStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`block w-full text-left px-4 py-2 rounded ${
                    selectedStatus === status ? 'bg-[#282C34] text-white' : 'text-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Contest table - regular view for desktop */}
          <div className="hidden md:block bg-[#1E2127] rounded-lg overflow-hidden w-full md:w-3/4">
            <div className="grid grid-cols-4 p-4 text-gray-400 border-b border-gray-700">
              <div>Contest Name</div>
              <div>Start Date</div>
              <div>Duration</div>
              <div>Participants</div>
            </div>
            {contests.map((contest, index) => (
              <div 
                key={index}
                className="grid grid-cols-4 p-4 text-white border-b border-gray-700 hover:bg-[#282C34]"
              >
                <div>{contest.name}</div>
                <div>{contest.startDate}</div>
                <div>{contest.duration}</div>
                <div className="flex items-center justify-between">
                  <span>{contest.participants}</span>
                  <div className="flex gap-4">
                    <button className="text-gray-400 hover:text-white">
                      <Edit size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <BarChart2 size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contest cards - mobile view */}
          <div className="md:hidden w-full">
            {contests.map((contest, index) => (
              <div 
                key={index}
                className="bg-[#1E2127] mb-4 p-4 rounded-lg text-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{contest.name}</h3>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-white">
                      <Edit size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <BarChart2 size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Start Date:</div>
                  <div>{contest.startDate}</div>
                  <div className="text-gray-400">Duration:</div>
                  <div>{contest.duration}</div>
                  <div className="text-gray-400">Participants:</div>
                  <div>{contest.participants}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}