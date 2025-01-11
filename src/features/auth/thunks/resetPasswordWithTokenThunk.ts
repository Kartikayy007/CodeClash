import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResetPasswordWithTokenPayload, ResetPasswordResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { AuthApiError } from '@/types/error.types';

export const resetPasswordWithToken = createAsyncThunk<ResetPasswordResponse, ResetPasswordWithTokenPayload>(
  'auth/resetPasswordWithToken',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPasswordWithToken(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as any;

      console.log(apiError.response);

      return rejectWithValue({
        success: false,
        message: apiError.response?.data?.error || apiError.message
      });
    }
  }
);