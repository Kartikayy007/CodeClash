import { createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleAuthError, GoogleOAuthResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

// Thunk to handle the initial OAuth redirect
export const initiateGoogleAuth = createAsyncThunk(
  'auth/initiateGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const authUrl = authApi.googleAuth.getAuthUrl();
      window.location.href = authUrl;
      return true;
    } catch (error: unknown) {
      const apiError = error as GoogleAuthError;
      return rejectWithValue({
        success: false,
        message: apiError.message
      });
    }
  }
);

// Thunk to handle the OAuth callback and token exchange
export const handleGoogleCallback = createAsyncThunk<GoogleOAuthResponse, { code: string }>(
  'auth/googleCallback',
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await authApi.googleAuth.handleCallback(code);
      return response;
    } catch (error: unknown) {
      const apiError = error as GoogleAuthError;
      return rejectWithValue({
        success: false,
        message: apiError.response?.data?.error || apiError.message
      });
    }
  }
);