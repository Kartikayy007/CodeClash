'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
// import LeaderboardHeader from '@/components/leaderboard/LeaderboardHeader';
import TopPlayers from '@/components/leaderboard/TopPlayers';
import PlayerList from '@/components/leaderboard/PlayerList';
import SearchInput from '@/components/leaderboard/SearchInput';
import PlayerRankCard from '@/components/leaderboard/PlayerRankCard';
import { fetchLeaderboard } from '@/features/home/leaderboard/thunks/leaderboardThunks';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const dispatch = useDispatch<AppDispatch>();
  const { players, loading, error, userRank, pagination } = useSelector((state: RootState) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard({
      page: currentPage,
      limit: PAGE_SIZE,
      searchQuery: searchQuery || undefined
    }));
  }, [dispatch, currentPage, searchQuery]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const topPlayers = players.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex flex-col p-4">
      <div className="flex flex-col lg:flex-row lg:gap-4">
        <div className='w-full lg:w-[70%]'>
          {/* <LeaderboardHeader /> */}
          <TopPlayers topPlayers={topPlayers} />
          <PlayerList players={players} />
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center bg-[#1A1D24] rounded-lg p-4 mt-4">
              <div className="text-gray-400">
                Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, pagination.totalCount)} of {pagination.totalCount} players
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-[#292C33] text-gray-500 cursor-not-allowed'
                      : 'bg-[#292C33] text-white hover:bg-[#31343C]'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center px-4 bg-[#292C33] rounded-lg">
                  <span className="text-white">Page {currentPage} of {pagination.totalPages}</span>
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === pagination.totalPages
                      ? 'bg-[#292C33] text-gray-500 cursor-not-allowed'
                      : 'bg-[#292C33] text-white hover:bg-[#31343C]'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 gap-8 flex flex-col w-full lg:w-[30%] lg:pl-[20px]">
          <SearchInput 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          <PlayerRankCard title="Current Rank" value={userRank} iconSrc="/current.svg" />
          <PlayerRankCard title="Your Highest Rank" value={userRank} iconSrc="/highest.svg" />
        </div>
      </div>
    </div>
  );
}