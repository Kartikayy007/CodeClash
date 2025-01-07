import { createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleOAuthResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { GoogleAuthError } from '@/types/error.types';

export const exchangeGoogleToken = createAsyncThunk<GoogleOAuthResponse, { token: string }>(
  'auth/googleToken',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.exchangeGoogleToken(data);
      return response;
    } catch (error: unknown) {
      const authError = error as GoogleAuthError;
      return rejectWithValue(authError.response?.data?.message || 'Failed to authenticate with Google');
    }
  }
);