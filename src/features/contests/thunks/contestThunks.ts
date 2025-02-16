import { createAsyncThunk } from '@reduxjs/toolkit';
import { contestApi } from '../api/contestApi';
import { LeaderboardResponse, UpdateLeaderboardResponse } from '../types/contest.types';

export const fetchLeaderboard = createAsyncThunk<LeaderboardResponse, { contestId: string; page?: number }>(
  'contest/fetchLeaderboard',
  async ({ contestId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await contestApi.getLeaderboard(contestId, page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

export const updateLeaderboard = createAsyncThunk<UpdateLeaderboardResponse, string>(
  'contest/updateLeaderboard',
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await contestApi.updateLeaderboard(contestId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update leaderboard');
    }
  }
); 