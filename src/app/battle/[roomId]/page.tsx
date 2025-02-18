'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@/lib/socket';
import EditorLayout from '@/features/editor/components/EditorLayout';
import Editor from '@/features/editor/components/Editor';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Problem } from '@/features/editor/api/problems';

type Language = 'cpp' | 'c' | 'python' | 'java' | 'javascript';

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  code: string;
  language: string;
  output: string;
  error: string;
  score: number;
  problemsSolved: number;
  solvedProblems: Record<string, any>;
}

type BattleStatus = 'waiting' | 'in-progress' | 'completed';

interface MatchStateData {
  matchId: string;
  players: Player[];
  status: BattleStatus;
  problems?: Problem[];
}

interface GameStartData {
  problems: string[];
  gameState: {
    userId: string;
    problemsSolved: number;
    solvedProblems: Record<string, any>;
  }[];
}

const BattleRoom = () => {
  const params = useParams<{ matchId: string }>();
  // const matchId = params?.matchId;
  const dispatch = useDispatch();
  const router = useRouter();
  const token = localStorage.getItem('accessToken');
  const [language, setLanguage] = useState<Language>('cpp');
  const [isMaximized, setIsMaximized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const battleState = useSelector((state: RootState) => state.battle);
  // const matchId = battleState.matchId;
  
   ('🔍 Battle state:', battleState);


  const handleLanguageChange = (newLanguage: string) => {
    const validLanguage = newLanguage as Language;
    setLanguage(validLanguage);
    socketService.emit('code_update', {
      matchId: battleState.matchId as string,
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

  const currentProblem = battleState.problems[battleState.currentProblemIndex];

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111827]">
        <div className="text-white text-xl">Waiting for problem data...</div>
      </div>
    );
  }

   ('battleState.matchId', battleState.matchId);

  return (
    <EditorLayout questionData={currentProblem} matchId={battleState.matchId as string}>
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

