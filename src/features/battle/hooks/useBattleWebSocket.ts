import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { socketService } from '@/lib/socket';
import { fetchProblem } from '@/features/editor/api/problems';
import { useDispatch } from 'react-redux';
import { setProblems, setStatus, setPlayer1, setPlayer2, setMatchId, updateProblemStatus } from '@/features/battle/slices/battleSlice';
import { store } from '@/store/store';

interface MatchFoundData {
  matchId: string;
  players: string[];
}

type BattleStatus = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
type GameMode = 'STANDARD' | 'SPEED' | 'ACCURACY';

interface MatchStateData {
  matchId: string;
  players: Array<{
    id: string;
    name: string;
    isReady: boolean;
  }>;
  status: BattleStatus;
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
  const dispatch = useDispatch();

  const onGameStart = async (data: GameStartData) => {
    console.log('🎮 Game start handler called');
    
    if (!currentMatchId.current) {
      console.error('❌ No match ID available');
      setState(prev => ({ ...prev, error: 'Failed to start game: No match ID' }));
      router.push('/dashboard');
      return;
    } 

    try {
      console.log('🚀 Navigating to:', `/battle/${currentMatchId.current}`);
      
      const problemPromises = data.problems.map(problemId => fetchProblem(problemId));
      const problems = await Promise.all(problemPromises);
      console.log('🎯 Fetched problems:', problems);
      
      const battleProblems = problems.map(problem => ({
        ...problem,
        description: [problem.description],
        constraints: [problem.constraints],
        examples: problem.testCases.map((testCase, index) => ({
          id: index + 1,
          input: testCase.input,
          output: testCase.output
        }))
      }));
      
      dispatch(setProblems(battleProblems));
      dispatch(setMatchId(currentMatchId.current as string));
      dispatch(setStatus('in-progress'));
      
      const [player1, player2] = data.gameState;
      if (player1) {
        dispatch(setPlayer1({
          id: player1.userId,
          name: player1.userId,
          isReady: true,
          code: '',
          language: 'cpp',
          output: null,
          error: null,
          score: 0
        }));
      }
      if (player2) {
        dispatch(setPlayer2({
          id: player2.userId,
          name: player2.userId,
          isReady: true,
          code: '',
          language: 'cpp',
          output: null,
          error: null,
          score: 0
        }));
      }
      
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

    const onGameStateUpdate = (data: { userId: string; problemId: string; status: string }) => {
      console.log('🎮 Game state update received in hook:', {
        data,
        matchId: currentMatchId.current,
        timestamp: new Date().toISOString()
      });
      
      if (!data.userId || !data.problemId || !data.status) {
        console.warn('❌ Invalid game state update data:', data);
        return;
      }
      const myId = store.getState().auth.user?.id;
      console.log("myId", myId);
      dispatch(updateProblemStatus({
        problemId: data.problemId,
        status: data.status as 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR',
        userId: data.userId,
        myId: myId as string
      }));
      console.log('✅ Problem status updated in store');
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

    

    socketService.on('game_state_update', onGameStateUpdate);
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
      socketService.off('game_state_update', onGameStateUpdate);
      
      if (!window.location.pathname.includes('/battle') && socketService.isConnected()) {
        socketService.leaveMatchmaking();
        currentMatchId.current = null;
      }
    };
  }, [router]);

  const findMatch = (mode: 'STANDARD' | 'SPEED' | 'ACCURACY') => {
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
        socketService.joinMatchmaking(mode);
      });
    } else {
      console.log('✅ Socket already connected, starting matchmaking');
      socketService.joinMatchmaking(mode);
    }
  };

  return {
    ...state,
    findMatch
  };
}; 