import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from '../api/profileApi';
import { Profile } from '../types/profile.types';

export const fetchProfile = createAsyncThunk<Profile, void>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
); 