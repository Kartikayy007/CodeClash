'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@/lib/socket';
import EditorLayout from '@/features/editor/components/EditorLayout';
import Editor from '@/features/editor/components/Editor';
import { RootState } from '@/store/store';
import { setRoomId, setStatus } from '@/features/battle/slices/battleSlice';

type Language = 'cpp' | 'c' | 'python' | 'java' | 'javascript';

const BattleRoom = () => {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId;
  const dispatch = useDispatch();
  const token = localStorage.getItem('accessToken');
  const [language, setLanguage] = useState<Language>('cpp');
  const [isMaximized, setIsMaximized] = useState(false);
  const battleState = useSelector((state: RootState) => state.battle);

  useEffect(() => {
    if (!token || !roomId) return;

    // Set initial room ID in Redux store
    dispatch(setRoomId(roomId));
    dispatch(setStatus('waiting'));

    // Connect to Socket.IO server
    socketService.connect(token);

    // Join the room once connected
    const handleConnect = () => {
      console.log('✅ Connected to Socket.IO - joining room:', roomId);
      socketService.joinRoom(roomId);
    };

    socketService.on('connect', handleConnect);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up BattleRoom component');
      socketService.off('connect', handleConnect);
      socketService.disconnect();
    };
  }, [dispatch, roomId, token]);

  const handleLanguageChange = (newLanguage: string) => {
    const validLanguage = newLanguage as Language;
    setLanguage(validLanguage);
    socketService.emit('code_update', {
      roomId,
      language: validLanguage
    });
  };

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
