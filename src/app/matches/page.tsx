'use client';

import { useState } from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';
import { Search, Home, Settings, Edit, BarChart2, Trash } from 'lucide-react';
import Link from 'next/link';

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
      duration: '2 hour',
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
    <div className="min-h-screen bg-[#15171B]">
      <NavbarPlain />
      <div className="p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="text-white text-lg flex items-center gap-2">
              <span>←</span> Manage
            </button>
            <button className="text-purple-500 border-b-2 border-purple-500 pb-1">
              Contests
            </button>
            <button className="text-gray-400">
              Questions
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Problem Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#282C34] text-white px-4 py-2 pl-10 rounded-lg w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button className="bg-purple-500 text-black px-4 py-2 rounded-lg">
              Create Contest
            </button>
          </div>
        </div>

<div className='flex'>

        <div className="mb-6 w-[20%]">
          <h2 className="text-white mb-4 flex items-center gap-2">
            <span className="text-lg">Filters</span>
          </h2>
          <div className="space-y-2">
            {(['All', 'Scheduled', 'Ongoing', 'Completed'] as ContestStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`block w-[90%] text-left px-4 py-2 rounded ${
                  selectedStatus === status ? 'bg-[#282C34] text-white' : 'text-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2127] rounded-lg overflow-hidden w-[80%]">
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
        </div>
      </div>
    </div>
  );
}