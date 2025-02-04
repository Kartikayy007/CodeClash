export type Language = 'cpp' | 'python' | 'java';

export interface TestCase {
  id: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  examples: TestCase[];
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
}

export interface EditorState {
  language: Language;
  code: string;
  isFullscreen: boolean;
  theme: string;
  fontSize: number;
}

export interface PlayerState {
  id: string;
  name: string;
  avatar?: string;
  solvedProblems: number[];
  isReady: boolean;
}

export interface BattleState {
  id: string;
  problem: Problem;
  player1: PlayerState;
  player2: PlayerState;
  timeLeft: number;
  status: 'waiting' | 'in-progress' | 'completed';
}

export interface RunCodePayload {
  code: string;
  language: string;
  matchId: string;
  input: string;
}

export interface RunCodeResponse {
  body: {
    taskId: string;
    output: string;
    error: string | null;
  };
  output: string;
  error: string | null;
} 