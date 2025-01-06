import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResetPasswordWithTokenPayload, ResetPasswordResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

export const resetPasswordWithToken = createAsyncThunk<ResetPasswordResponse, ResetPasswordWithTokenPayload>(
  'auth/resetPasswordWithToken',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPasswordWithToken(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);