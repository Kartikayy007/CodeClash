import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string[];
  constraints: string[];
  examples: {
    id: number;
    input: string;
    output: string;
    explanation?: string;
  }[];
}

interface Player {
  id: string;
  name: string;
  avatar?: string;
  isReady: boolean;
  code: string;
  language: string;
  output: string | null;
  error: string | null;
  score: number;
}

interface BattleState {
  roomId: string | null;
  player1: Player | null;
  player2: Player | null;
  problems: Problem[];
  currentProblemIndex: number;
  timeLeft: number;
  status: 'waiting' | 'in-progress' | 'completed';
  isConnected: boolean;
  error: string | null;
}

const initialState: BattleState = {
  roomId: null,
  player1: null,
  player2: null,
  problems: [],
  currentProblemIndex: 0,
  timeLeft: 0,
  status: 'waiting',
  isConnected: false,
  error: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setPlayer1: (state, action: PayloadAction<Player>) => {
      state.player1 = action.payload;
    },
    setPlayer2: (state, action: PayloadAction<Player>) => {
      state.player2 = action.payload;
    },
    setProblems: (state, action: PayloadAction<Problem[]>) => {
      state.problems = action.payload;
    },
    setCurrentProblemIndex: (state, action: PayloadAction<number>) => {
      state.currentProblemIndex = action.payload;
    },
    updateTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },
    setStatus: (state, action: PayloadAction<'waiting' | 'in-progress' | 'completed'>) => {
      state.status = action.payload;
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updatePlayerCode: (state, action: PayloadAction<{ playerId: string; code: string }>) => {
      const { playerId, code } = action.payload;
      if (state.player1?.id === playerId) {
        state.player1.code = code;
      } else if (state.player2?.id === playerId) {
        state.player2.code = code;
      }
    },
    updatePlayerLanguage: (state, action: PayloadAction<{ playerId: string; language: string }>) => {
      const { playerId, language } = action.payload;
      if (state.player1?.id === playerId) {
        state.player1.language = language;
      } else if (state.player2?.id === playerId) {
        state.player2.language = language;
      }
    },
    updatePlayerOutput: (state, action: PayloadAction<{ 
      playerId: string; 
      output: string | null;
      error: string | null;
    }>) => {
      const { playerId, output, error } = action.payload;
      if (state.player1?.id === playerId) {
        state.player1.output = output;
        state.player1.error = error;
      } else if (state.player2?.id === playerId) {
        state.player2.output = output;
        state.player2.error = error;
      }
    },
    updatePlayerScore: (state, action: PayloadAction<{ playerId: string; score: number }>) => {
      const { playerId, score } = action.payload;
      if (state.player1?.id === playerId) {
        state.player1.score = score;
      } else if (state.player2?.id === playerId) {
        state.player2.score = score;
      }
    },
    resetBattle: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setRoomId,
  setPlayer1,
  setPlayer2,
  setProblems,
  setCurrentProblemIndex,
  updateTimeLeft,
  setStatus,
  setIsConnected,
  setError,
  updatePlayerCode,
  updatePlayerLanguage,
  updatePlayerOutput,
  updatePlayerScore,
  resetBattle,
} = battleSlice.actions;

export default battleSlice.reducer; 