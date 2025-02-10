import { createAsyncThunk } from '@reduxjs/toolkit';
import { matchesApi } from '../api/matchesApi';
import { FetchMatchesParams, MatchesResponse } from '../types/matches.types';

export const fetchMatches = createAsyncThunk<MatchesResponse, FetchMatchesParams>(
  'matches/fetchMatches',
  async (params, { rejectWithValue }) => {
    try {
      const response = await matchesApi.getRecentMatches(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch matches');
    }
  }
); 