import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from '../api/profileApi';
import { Profile } from '../types/profile.types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
export const fetchProfile = createAsyncThunk<Profile, void>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfile();
      return response.data;
    } catch (error) {
      const err = error as ApiError;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
); 