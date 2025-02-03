'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@/lib/socket';
import EditorLayout from '@/features/editor/components/EditorLayout';
import Editor from '@/features/editor/components/Editor';
import { RootState } from '@/store/store';
import { setRoomId, setStatus, setPlayer1, setPlayer2, setProblems } from '@/features/battle/slices/battleSlice';
import { useRouter } from 'next/navigation';

type Language = 'cpp' | 'c' | 'python' | 'java' | 'javascript';

const BattleRoom = () => {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId;
  const dispatch = useDispatch();
  const router = useRouter();
  const token = localStorage.getItem('accessToken');
  const [language, setLanguage] = useState<Language>('cpp');
  const [isMaximized, setIsMaximized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const battleState = useSelector((state: RootState) => state.battle);

  useEffect(() => {
    if (!token || !roomId) return;

    dispatch(setRoomId(roomId));
    dispatch(setStatus('waiting'));

    socketService.connect(token);

    const handleConnect = () => {
      console.log('✅ Connected to Socket.IO - joining room:', roomId);
      socketService.joinRoom(roomId);
      if(battleState.player1 && battleState.player2){
        socketService.startGame(roomId);
      }
    };

    // Handle match found event
    const handleMatchFound = (data: { matchId: string; players: string[] }) => {
      console.log('🎯 Match found:', data);
      router.push(`/battle/${data.matchId}`);
    };

    const handleMatchState = (data: { roomId: string; players: any[]; status: string; problems?: any[] }) => {
      console.log('📊 Match state received:', data);
      dispatch(setStatus(data.status as any));
      if (data.players[0]) dispatch(setPlayer1(data.players[0]));
      if (data.players[1]) dispatch(setPlayer2(data.players[1]));
      if (data.problems) dispatch(setProblems(data.problems));
    };

    // Handle game start event
    const handleGameStart = (data: { roomId: string; player1: any; player2: any; problems: any[] }) => {
      console.log('🎮 Game started:', data);
      dispatch(setStatus('in-progress'));
      dispatch(setPlayer1(data.player1));
      dispatch(setPlayer2(data.player2));
      dispatch(setProblems(data.problems));
    };

    // Handle error events
    const handleMatchError = (data: { message: string }) => {
      console.error('❌ Match error:', data);
      setError(data.message);
    };

    const handleMatchAborted = (data: { message: string }) => {
      console.error('❌ Match aborted:', data);
      setError(data.message);
      setTimeout(() => router.push('/'), 3000); 
    };

    const handleGameError = (data: { message: string }) => {
      console.error('❌ Game error:', data);
      setError(data.message);
    };

    socketService.on('connect', handleConnect);
    socketService.on('match_found', handleMatchFound);
    socketService.on('match_state', handleMatchState);
    socketService.on('match_error', handleMatchError);
    socketService.on('match_aborted', handleMatchAborted);
    socketService.on('game_start', handleGameStart);
    socketService.on('game_error', handleGameError);

    // Start the game when both players are ready
    if (battleState.player1 && battleState.player2) {
      socketService.startGame(roomId);
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up BattleRoom component');
      socketService.off('connect', handleConnect);
      socketService.off('match_found', handleMatchFound);
      socketService.off('match_state', handleMatchState);
      socketService.off('match_error', handleMatchError);
      socketService.off('match_aborted', handleMatchAborted);
      socketService.off('game_start', handleGameStart);
      socketService.off('game_error', handleGameError);
      socketService.disconnect();
    };
  }, [dispatch, roomId, token, router, battleState.player1, battleState.player2]);

  const handleLanguageChange = (newLanguage: string) => {
    const validLanguage = newLanguage as Language;
    setLanguage(validLanguage);
    socketService.emit('code_update', {
      roomId: roomId as string,
      language: validLanguage
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111827]">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!battleState.roomId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111827]">
        <div className="text-white text-xl">Loading battle...</div>
      </div>
    );
  }

  const currentProblem = battleState.problems[battleState.currentProblemIndex];

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111827]">
        <div className="text-white text-xl">Waiting for problem...</div>
      </div>
    );
  }
  return (
    <EditorLayout questionData={currentProblem}>
      <Editor
        language={language}
        onLanguageChange={handleLanguageChange}
        onMaximize={setIsMaximized}
        className={isMaximized ? 'fixed inset-0 z-50' : ''}
      />
    </EditorLayout>
  );
};

export default BattleRoom;

