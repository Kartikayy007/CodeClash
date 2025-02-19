'use client';

import React, { useEffect, useState } from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';
import { Search, Edit, BarChart2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ContestStatus = 'All' | 'Scheduled' | 'Ongoing' | 'Completed';

interface Contest {
  contestId: string;
  title: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  status: ContestStatus;
}

export default function ContestsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<ContestStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await fetch('https://goyalshivansh.me/api/v1/contest/my-contests', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Fetched Contests:', data); 
        if (Array.isArray(data)) {
          setContests(data);
        } else if (data && data.contests && Array.isArray(data.contests)) {
          setContests(data.contests);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();
  }, []);

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Function to calculate duration
  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // Filter contests based on selected status and search query
  const filteredContests = contests.filter((contest) => {
    return (
      (selectedStatus === 'All' || contest.status === selectedStatus) &&
      contest.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
            <button className="text-gray-400">Questions</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Contest Name"
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

        <div className="flex">
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

            {filteredContests.length > 0 ? (
              filteredContests.map((contest) => (
                <div
                  key={contest.contestId}
                  className="grid grid-cols-4 p-4 text-white border-b border-gray-700 hover:bg-[#282C34] cursor-pointer"
                  onClick={() => router.push(`/contest/statistics/${contest.contestId}`)}
                >
                  <div>{contest.title}</div>
                  <div>{formatDate(contest.startTime)}</div>
                  <div>{calculateDuration(contest.startTime, contest.endTime)}</div>
                  <div className="flex items-center justify-between">
                    <span>{contest.participantCount}</span>
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
              ))
            ) : (
              <div className="p-6 text-center text-gray-400">No contests found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
