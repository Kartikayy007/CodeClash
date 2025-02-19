'use client';

import { useEffect, useState } from 'react';
import ContestFilters from '@/components/RecentContests/ContestFilters';
import ContestTable from '@/components/RecentContests/ContestTable';
import { fetchMatches } from '@/features/home/matches/thunks/matchesThunks';
import { RootState } from '@/store/store';
import { AppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { MatchStatus } from '@/features/home/matches/types/matches.types';
import { Search, Plus } from 'lucide-react';
import LabelButton from '@/components/ui/LabelButton';

export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const dispatch = useDispatch<AppDispatch>();
  const { matches, loading, error, pagination } = useSelector((state: RootState) => state.matches);

  useEffect(() => {
    dispatch(fetchMatches({
      page: currentPage,
      limit: PAGE_SIZE,
      status: selectedStatus === 'All' ? undefined : selectedStatus,
      searchQuery: searchQuery || undefined
    }));
  }, [dispatch, selectedStatus, currentPage, searchQuery]);

  const formatMatches = matches.map(match => ({
    name: `Match #${match.players.map(p => p.username).join(' vs ')}`,
    startDate: new Date(match.createdAt).toLocaleDateString(),
    duration: match.duration,
    participants: match.players.length,
    status: match.status,
    mode: match.mode
  }));

  return (
    <div className="min-h-screen bg-[#15171B]">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8 flex-wrap">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1A1D24] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <LabelButton
            variant="filled"
            className="flex items-center gap-2 mt-4 md:mt-0"
            onClick={() => {/* Handle create contest */}}
          >
            <Plus size={20} />
            Create Contest
          </LabelButton>
        </div>

        <div className='flex flex-col md:flex-row'>
          <div className="md:w-1/4">
            <ContestFilters 
              selectedStatus={selectedStatus as "All" | "Scheduled" | "Ongoing" | "Completed"} 
              setSelectedStatus={setSelectedStatus as (status: "All" | "Scheduled" | "Ongoing" | "Completed") => void} 
            />
          </div>
          <div className="md:w-3/4">
            <ContestTable 
              contests={formatMatches}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
