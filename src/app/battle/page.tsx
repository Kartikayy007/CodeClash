'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { socketService } from '@/lib/socket';
import LabelButton from '@/components/ui/LabelButton';

export default function BattleLobbyPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Setup event listeners for matchmaking
    const onMatchFound = (data: any) => {
      console.log('✅ Match found:', data);
      setIsSearching(false);
      
      // Join the match
      socketService.joinRoom(data.roomId);
      
      // Navigate to the battle page
      router.push(`/battle/${data.roomId}`);
    };

    const onMatchmakingError = (data: any) => {
      console.error('❌ Matchmaking error:', data);
      setIsSearching(false);
      setError(data.message || 'Failed to find a match');
    };

    const onMatchmakingTimeout = () => {
      console.log('⏰ Matchmaking timeout');
      setIsSearching(false);
      setError('Failed to find a match in time. Please try again.');
    };

    // Register event listeners
    socketService.on('match_found', onMatchFound);
    socketService.on('matchmaking_error', onMatchmakingError);
    socketService.on('matchmaking_timeout', onMatchmakingTimeout);

    // Cleanup listeners on unmount
    return () => {
      socketService.off('match_found', onMatchFound);
      socketService.off('matchmaking_error', onMatchmakingError);
      socketService.off('matchmaking_timeout', onMatchmakingTimeout);
      
      // Leave matchmaking if still searching
      if (isSearching) {
        socketService.leaveMatchmaking();
      }
    };
  }, [router, isSearching]);

  const handleFindMatch = () => {
    setIsSearching(true);
    setError(null);
    console.log('🎮 Starting matchmaking...');
    
    // Join matchmaking queue
    socketService.joinMatchmaking('STANDARD');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111827]">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">Battle Lobby</h1>
        <div className="space-y-4">
          <p className="text-lg text-white">
            {isSearching ? 'Finding a worthy opponent...' : 'Ready to start a match?'}
          </p>
          <LabelButton
            onClick={handleFindMatch}
            disabled={isSearching}
            className="w-40 h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            {isSearching ? 'Searching...' : 'Find Match'}
          </LabelButton>
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 