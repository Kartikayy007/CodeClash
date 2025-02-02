import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { socketService } from '@/lib/socket';
import LabelButton from '@/components/ui/LabelButton';
// import { Button } from '@/components/ui/button';

interface MatchFoundData {
  matchId: string;
  players: string[];
}

interface MatchStateData {
  matchId: string;
  players: any[];
  status: string;
  problems?: any[];
}

interface GameStartData {
  matchId: string;
  player1: any;
  player2: any;
  problems: any[];
}

interface ErrorData {
  message: string;
}

export const PlayButton = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const router = useRouter();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    console.log('🎮 Setting up PlayButton event listeners');
    
    const onConnect = () => {
      console.log('✅ Connected - starting matchmaking');
      socketService.joinMatchmaking('STANDARD');
    };

    const onMatchFound = (data: MatchFoundData) => {
      console.log('✅ Match found:', data);
      setIsSearching(false);
      setError(null);
      setHasStartedGame(false);
      
      console.log('🎯 Joining match:', data.matchId);
      socketService.joinRoom(data.matchId);
      // socketService.startGame(data.matchId);
    };

    const onMatchError = (data: ErrorData) => {
      console.error('❌ Match error:', data);
      setIsSearching(false);
      setError(data.message);
    };

    const onMatchAborted = (data: ErrorData) => {
      console.error('❌ Match aborted:', data);
      setIsSearching(false);
      setError(data.message);
      setTimeout(() => router.push('/'), 3000);
    };

    const onGameError = (data: ErrorData) => {
      console.error('❌ Game error:', data);
      setError(data.message);
    };

    const onMatchmakingError = (data: ErrorData) => {
      console.error('❌ Matchmaking error:', data);
      setIsSearching(false);
      setError(data.message || 'Failed to find a match');
      router.push('/');
    };

    const onAuthError = (data: ErrorData) => {
      console.error('❌ Auth error:', data);
      setError(data.message);
    };

    socketService.on('connect', onConnect);
    socketService.on('match_found', onMatchFound);
    socketService.on('match_error', onMatchError);
    socketService.on('match_aborted', onMatchAborted);
    socketService.on('game_error', onGameError);
    socketService.on('matchmaking_error', onMatchmakingError);
    socketService.on('auth_error', onAuthError);

    return () => {
      console.log('🧹 Cleaning up PlayButton event listeners');
      socketService.off('connect', onConnect);
      socketService.off('match_found', onMatchFound);
      socketService.off('match_error', onMatchError);
      socketService.off('match_aborted', onMatchAborted);
      socketService.off('game_error', onGameError);
      socketService.off('matchmaking_error', onMatchmakingError);
      socketService.off('auth_error', onAuthError);
      
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
    
    socketService.connect(token);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <LabelButton
        onClick={handleFindMatch}
        disabled={isSearching}
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