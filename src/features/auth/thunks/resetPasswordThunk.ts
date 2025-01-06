import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResetPasswordPayload, ResetPasswordResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

export const resetPassword = createAsyncThunk<ResetPasswordResponse, ResetPasswordPayload>(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);