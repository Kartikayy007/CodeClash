import { createAsyncThunk } from '@reduxjs/toolkit';
import { leaderboardApi } from '../api/leaderboardApi';
import { FetchLeaderboardParams, LeaderboardResponse } from '../types/leaderboard.types';
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
export const fetchLeaderboard = createAsyncThunk<LeaderboardResponse, FetchLeaderboardParams>(
  'leaderboard/fetchLeaderboard',
  async (params, { rejectWithValue }) => {
    try {
      const response = await leaderboardApi.getLeaderboard(params);
      return response;
    } catch (error) {
      const err = error as ApiError;  
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
); 