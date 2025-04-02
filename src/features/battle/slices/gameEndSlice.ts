import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RatingChanges {
  [userId: string]: number;
}

interface GameEndState {
  isOpen: boolean;
  winnerId: string | null;
  ratingChanges: RatingChanges;
}

const initialState: GameEndState = {
  isOpen: false,
  winnerId: null,
  ratingChanges: {},
};

const gameEndSlice = createSlice({
  name: "gameEnd",
  initialState,
  reducers: {
    setGameEnd: (
      state,
      action: PayloadAction<{
        winnerId: string;
        ratingChanges: RatingChanges;
      }>,
    ) => {
      console.log("🎮 Setting game end state:", action.payload);
      state.isOpen = true;
      state.winnerId = action.payload.winnerId;
      state.ratingChanges = action.payload.ratingChanges;
      console.log("🎮 New game end state:", state);
    },
    resetGameEnd: () => {
      console.log("🔄 Resetting game end state");
      return initialState;
    },
  },
});

export const { setGameEnd, resetGameEnd } = gameEndSlice.actions;
export default gameEndSlice.reducer;
