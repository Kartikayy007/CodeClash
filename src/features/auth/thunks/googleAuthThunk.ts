import { createAsyncThunk } from '@reduxjs/toolkit';
import { TempTokenPayload, GoogleOAuthResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

export const exchangeGoogleToken = createAsyncThunk<GoogleOAuthResponse, TempTokenPayload>(
  'auth/googleExchange',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.googleAuth.exchangeToken(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OAuth failed');
    }
  }
);