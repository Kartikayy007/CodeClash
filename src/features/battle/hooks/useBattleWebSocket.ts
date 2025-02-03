import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { socketService } from '@/lib/socket';
import { fetchProblem } from '@/features/editor/api/problems';

interface MatchFoundData {
  matchId: string;
  players: string[];
}

interface MatchStateData {
  matchId: string;
  players: any[];
  status: boolean;
  problems?: string[];
}

interface GameStartData {
  problems: string[];  
  gameState: Array<{
    userId: string;
    problemsSolved: number;
    solvedProblems: Record<string, any>;
  }>;
}

interface ErrorData {
  message: string;
}

interface BattleWebSocketState {
  isSearching: boolean;
  error: string | null;
  hasStartedGame: boolean;
}

export const useBattleWebSocket = () => {
  const [state, setState] = useState<BattleWebSocketState>({
    isSearching: false,
    error: null,
    hasStartedGame: false
  });
  const currentMatchId = useRef<string | null>(null);
  const router = useRouter();

  const onGameStart = async (data: GameStartData) => {
    console.log('🎮 Game start handler called');
    
    if (!currentMatchId.current) {
      console.error('❌ No match ID available');
      setState(prev => ({ ...prev, error: 'Failed to start game: No match ID' }));
      return;
    } 

    try {
      console.log('🚀 Navigating to:', `/battle/${currentMatchId.current}`);
      const problem = await fetchProblem(data.problems[0]);
      console.log('🎯 Fetched problem:', problem);  
      router.push(`/battle/${currentMatchId.current}`);
    } catch (error) {
      console.error('❌ Failed to handle game start:', error);
      setState(prev => ({ ...prev, error: 'Failed to start game' }));
    }
  };

  useEffect(() => {
    console.log('🎮 Setting up battle websocket event listeners');
    
    const onConnect = () => {
      console.log('✅ Connected to socket');
    };

    const onMatchFound = (data: MatchFoundData) => {
      console.log('✅ Match found:', data);
      setState(prev => ({
        ...prev,
        isSearching: false,
        error: null,
        hasStartedGame: false
      }));
      
      console.log('🎯 Joining match:', data.matchId);
      socketService.joinRoom(data.matchId);
    };

    const onMatchState = (response: MatchStateData) => {
      console.log('📊 Match state received in PlayButton:', response);
      currentMatchId.current = response.matchId;

      if (response.status) {
        console.log('✅ Successfully joined match, starting game');
        console.log('🎮 Starting game with matchId:', response.matchId);
        socketService.startGame(response.matchId);
      } else {
        console.log('❌ Match state received but status not true:', response);
      }
    };

    const onMatchError = (data: ErrorData) => {
      console.error('❌ Match error:', data);
      setState(prev => ({ ...prev, isSearching: false, error: data.message }));
    };

    const onMatchAborted = (data: ErrorData) => {
      console.error('❌ Match aborted:', data);
      setState(prev => ({ ...prev, isSearching: false, error: data.message }));
      setTimeout(() => router.push('/'), 3000);
    };

    const onGameError = (data: ErrorData) => {
      console.error('❌ Game error:', data);
      setState(prev => ({ ...prev, error: data.message }));
    };

    const onMatchmakingError = (data: ErrorData) => {
      console.error('❌ Matchmaking error:', data);
      setState(prev => ({ 
        ...prev, 
        isSearching: false, 
        error: data.message || 'Failed to find a match' 
      }));
      router.push('/');
    };

    const onAuthError = (data: ErrorData) => {
      console.error('❌ Auth error:', data);
      setState(prev => ({ ...prev, error: data.message }));
    };

    socketService.on('connect', onConnect);
    socketService.on('match_found', onMatchFound);
    socketService.on('match_state', onMatchState);
    socketService.on('game_start', onGameStart);
    socketService.on('match_error', onMatchError);
    socketService.on('match_aborted', onMatchAborted);
    socketService.on('game_error', onGameError);
    socketService.on('matchmaking_error', onMatchmakingError);
    socketService.on('auth_error', onAuthError);

    return () => {
      console.log('🧹 Cleaning up battle websocket event listeners');
      socketService.off('connect', onConnect);
      socketService.off('match_found', onMatchFound);
      socketService.off('match_state', onMatchState);
      socketService.off('game_start', onGameStart);
      socketService.off('match_error', onMatchError);
      socketService.off('match_aborted', onMatchAborted);
      socketService.off('game_error', onGameError);
      socketService.off('matchmaking_error', onMatchmakingError);
      socketService.off('auth_error', onAuthError);
      
      if (!window.location.pathname.includes('/battle') && socketService.isConnected()) {
        socketService.leaveMatchmaking();
        currentMatchId.current = null;
      }
    };
  }, [router]);

  const findMatch = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setState(prev => ({ ...prev, error: 'Please log in to play' }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true, error: null }));
    console.log('🎮 Starting matchmaking...');
    
    if (!socketService.isConnected()) {
      console.log('🔌 Connecting socket from battle hook');
      socketService.connect(token);
      socketService.on('connect', () => {
        console.log('✅ Socket connected, starting matchmaking');
        socketService.joinMatchmaking('STANDARD');
      });
    } else {
      console.log('✅ Socket already connected, starting matchmaking');
      socketService.joinMatchmaking('STANDARD');
    }
  };

  return {
    ...state,
    findMatch
  };
}; 