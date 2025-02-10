import { createSlice } from '@reduxjs/toolkit';
import { MatchesState } from '../types/matches.types';
import { fetchMatches } from '../thunks/matchesThunks';

const initialState: MatchesState = {
  matches: [],
  winsCount: 0,
  lossesCount: 0,
  totalMatches: 0,
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  },
  loading: false,
  error: null
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearMatches: (state) => {
      state.matches = [];
      state.pagination = initialState.pagination;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload.recentMatches;
        state.winsCount = action.payload.winsCount;
        state.lossesCount = action.payload.lossesCount;
        state.totalMatches = action.payload.totalMatches;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearMatches } = matchesSlice.actions;
export default matchesSlice.reducer; 