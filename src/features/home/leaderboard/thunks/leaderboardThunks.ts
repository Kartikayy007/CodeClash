import { createAsyncThunk } from '@reduxjs/toolkit';
import { leaderboardApi } from '../api/leaderboardApi';
import { FetchLeaderboardParams, LeaderboardResponse } from '../types/leaderboard.types';

export const fetchLeaderboard = createAsyncThunk<LeaderboardResponse, FetchLeaderboardParams>(
  'leaderboard/fetchLeaderboard',
  async (params, { rejectWithValue }) => {
    try {
      const response = await leaderboardApi.getLeaderboard(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
); 