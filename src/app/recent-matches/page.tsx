'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import NavbarPlain from '@/components/ui/NavbarPlain';
import ModeSelector from '@/components/RecentMatches/ModeSelector';
import MatchTable from '@/components/RecentMatches/MatchTable';
import WinsOverview from '@/components/RecentMatches/WinsOverview';
import WinningMomentum from '@/components/RecentMatches/WinningMomentum';
import WinTrend from '@/components/RecentMatches/WinTrend';
import { fetchMatches } from '@/features/home/matches/thunks/matchesThunks';
import { MatchMode } from '@/features/home/matches/types/matches.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const winTrendData = [
  Array(8).fill('inactive'),
  ['inactive', 'inactive', 'inactive', 'inactive', 'loss', 'inactive', 'inactive', 'inactive'],
  ['inactive', 'inactive', 'inactive', 'inactive', 'inactive', 'win', 'win', 'inactive'],
  Array(8).fill('inactive'),
];

export default function MatchesPage() {
  const [selectedMode, setSelectedMode] = useState<MatchMode | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const dispatch = useDispatch<AppDispatch>();
  const { matches, loading, error, winsCount, lossesCount, totalMatches, pagination } = useSelector((state: RootState) => state.matches);

  useEffect(() => {
    dispatch(fetchMatches({
      page: currentPage,
      limit: PAGE_SIZE,
      mode: selectedMode === 'All' ? undefined : selectedMode
    }));
  }, [dispatch, selectedMode, currentPage]);

  const formatMatches = matches.map(match => ({
    mode: match.mode,
    player: match.players[0].username,
    opponent: match.players[1].username,
    result: match.winnerId === match.players[0].id ? 'win' as const : 'loss' as const,
    duration: match.duration,
    date: new Date(match.createdAt).toLocaleDateString()
  }));

  const winRate = totalMatches > 0 ? Math.round((winsCount / totalMatches) * 10) : 0;
  const currentStreak = 0; // This should come from API
  const longestStreak = 0; // This should come from API

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15171B] flex items-center justify-center">
        <div className="text-white text-xl">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#15171B] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#15171B]">
      <NavbarPlain />
      <div className="container mx-auto p-6">
        <ModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-4">
            <MatchTable matches={formatMatches} />
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center bg-[#1A1D24] rounded-lg p-4">
                <div className="text-gray-400">
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, pagination.totalCount)} of {pagination.totalCount} matches
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
          <div className="col-span-4 flex flex-col gap-5">
            <div className='flex justify-between'>
              <WinsOverview winRate={winRate} />
              <WinningMomentum 
                currentStreak={currentStreak} 
                longestStreak={longestStreak} 
              />
            </div>
            <WinTrend winTrendData={winTrendData} />
          </div>
        </div>
      </div>
    </div>
  );
}
