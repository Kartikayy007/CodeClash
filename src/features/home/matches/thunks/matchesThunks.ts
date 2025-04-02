import { createAsyncThunk } from "@reduxjs/toolkit";
import { matchesApi } from "../api/matchesApi";
import { FetchMatchesParams, MatchesResponse } from "../types/matches.types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
export const fetchMatches = createAsyncThunk<
  MatchesResponse,
  FetchMatchesParams
>("matches/fetchMatches", async (params, { rejectWithValue }) => {
  try {
    const response = await matchesApi.getRecentMatches(params);
    return response;
  } catch (error) {
    const err = error as ApiError;
    return rejectWithValue(err.response?.data || "Failed to fetch matches");
  }
});
