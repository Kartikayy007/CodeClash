import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socketService } from '@/lib/socket';
import {
  setRoomId,
  setPlayer1,
  setPlayer2,
  updateTimeLeft,
  setStatus,
  setIsConnected,
  setError,
  updatePlayerCode,
  updatePlayerOutput,
} from '../slices/battleSlice';

export const useBattleWebSocket = (token: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('🔌 Initializing Socket.IO connection with token:', token);
    socketService.connect(token);

    // Game state events
    socketService.on('game_start', (data) => {
      console.log('🎮 Game Start Event:', data);
      dispatch(setStatus('in-progress'));
      dispatch(setRoomId(data.roomId));
      if (data.player1) dispatch(setPlayer1(data.player1));
      if (data.player2) dispatch(setPlayer2(data.player2));
    });

    socketService.on('game_state', (data) => {
      console.log('🎯 Game State Event:', data);
      if (data.timeLeft) dispatch(updateTimeLeft(data.timeLeft));
      if (data.status) dispatch(setStatus(data.status));
    });

    socketService.on('game_state_update', (data) => {
      console.log('🔄 Game State Update Event:', data);
      if (data.timeLeft) dispatch(updateTimeLeft(data.timeLeft));
      if (data.player1) dispatch(setPlayer1(data.player1));
      if (data.player2) dispatch(setPlayer2(data.player2));
    });

    socketService.on('game_end', (data) => {
      console.log('🏁 Game End Event:', data);
      dispatch(setStatus('completed'));
      if (data.player1) dispatch(setPlayer1(data.player1));
      if (data.player2) dispatch(setPlayer2(data.player2));
    });

    // Code and output events
    socketService.on('code_update', (data) => {
      console.log('📝 Code Update Event:', data);
      dispatch(updatePlayerCode({
        playerId: data.playerId,
        code: data.code,
      }));
    });

    socketService.on('code_result', (data) => {
      console.log('✨ Code Result Event:', data);
      dispatch(updatePlayerOutput({
        playerId: data.playerId,
        output: data.output,
        error: data.error,
      }));
    });

    // Error events
    socketService.on('game_error', (data) => {
      console.error('❌ Game Error Event:', data);
      dispatch(setError(data.message));
    });

    socketService.on('match_error', (data) => {
      console.error('⚠️ Match Error Event:', data);
      dispatch(setError(data.message));
    });

    socketService.on('matchmaking_error', (data) => {
      console.error('🚫 Matchmaking Error Event:', data);
      dispatch(setError(data.message));
    });

    // Connection events
    socketService.on('connect', () => {
      console.log('✅ Socket.IO Connected');
      dispatch(setIsConnected(true));
      dispatch(setError(null));
    });

    socketService.on('disconnect', () => {
      console.log('❌ Socket.IO Disconnected');
      dispatch(setIsConnected(false));
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up Socket.IO connection');
      socketService.disconnect();
    };
  }, [dispatch, token]);

  return socketService;
};

export default useBattleWebSocket; 