import { createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleOAuthResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { GoogleAuthError } from '@/types/error.types';

export const exchangeGoogleToken = createAsyncThunk<GoogleOAuthResponse, { tempOAuthToken: string }>(
  'auth/googleToken',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.exchangeGoogleToken(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as any;
      return rejectWithValue({
        success: false,
        message: apiError.response?.data?.error || apiError.message
      });
    }
  }
);