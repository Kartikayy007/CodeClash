import { createAsyncThunk } from '@reduxjs/toolkit';
import { RefreshTokenResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { AuthApiError } from '@/features/auth/types/error.types';

export const refreshToken = createAsyncThunk<RefreshTokenResponse, void>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return rejectWithValue({
          success: false,
          message: 'No refresh token found'
        });
      }

      const response = await authApi.refreshToken(refreshToken);
      
      if (response.success && response.data?.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken);
      }
      
      return response;
    } catch (error: unknown) {
      const apiError = error as AuthApiError;
      return rejectWithValue({
        success: false,
        message: apiError.response?.data?.message || 'Failed to refresh token'
      });
    }
  }
);