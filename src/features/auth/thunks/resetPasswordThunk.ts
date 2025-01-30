import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResetPasswordPayload, ResetPasswordResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { AuthApiError } from '@/features/auth/types/error.types';

export const resetPassword = createAsyncThunk<ResetPasswordResponse, ResetPasswordPayload>(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as AuthApiError;
      return rejectWithValue(apiError.response?.data);
    }
  }
);