import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { socketService } from '@/lib/socket';
import LabelButton from '@/components/ui/LabelButton';
// import { Button } from '@/components/ui/button';

export const PlayButton = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    console.log('🎮 Setting up PlayButton event listeners');
    
    const onConnect = () => {
      console.log('✅ Namespace connected - starting matchmaking');
      socketService.joinMatchmaking('STANDARD');
    };

    const onMatchFound = (data: any) => {
      console.log('✅ Match found:', data);
      setIsSearching(false);
      setError(null);
      
      const roomId = data.roomId;
      console.log('🎯 Joining room:', roomId);
      
      // Join the room
      socketService.joinRoom(roomId);
      
      // Navigate to the battle page
      console.log('🚀 Navigating to battle page:', `/battle/${roomId}`);
      router.push(`/battle/${roomId}`);
    };

    const onMatchmakingError = (data: any) => {
      console.error('❌ Matchmaking error:', data);
      setIsSearching(false);
      setError(data.message || 'Failed to find a match');
    };

    socketService.on('connect', onConnect);
    socketService.on('match_found', onMatchFound);
    socketService.on('matchmaking_error', onMatchmakingError);
    socketService.on('auth_error', (data) => setError(data.message));

    return () => {
      console.log('🧹 Cleaning up PlayButton event listeners');
      socketService.off('connect', onConnect);
      socketService.off('match_found', onMatchFound);
      socketService.off('matchmaking_error', onMatchmakingError);
      if (socketService.isConnected()) {
        socketService.leaveMatchmaking();
      }
    };
  }, [router]);

  const handleFindMatch = () => {
    if (!token) {
      setError('Please log in to play');
      return;
    }

    setIsSearching(true);
    setError(null);
    console.log('🎮 Starting matchmaking...');
    
    // Connect to Socket.IO server with token
    socketService.connect(token);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <LabelButton
        onClick={handleFindMatch}
        disabled={isSearching}
        className="w-40 h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
      >
        {isSearching ? 'Searching...' : 'Play Now'}
      </LabelButton>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default PlayButton; 