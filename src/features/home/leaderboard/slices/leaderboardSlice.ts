import { createSlice } from "@reduxjs/toolkit";
import { LeaderboardState } from "../types/leaderboard.types";
import { fetchLeaderboard } from "../thunks/leaderboardThunks";

const initialState: LeaderboardState = {
  players: [],
  userRank: 0,
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    clearLeaderboard: (state) => {
      state.players = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload.leaderboard;
        state.userRank = action.payload.userRank;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
