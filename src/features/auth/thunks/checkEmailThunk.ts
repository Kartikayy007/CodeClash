import { createAsyncThunk } from '@reduxjs/toolkit';
import { CheckEmailPayload, CheckEmailResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { ApiError } from '@/types/error.types';

export const checkEmail = createAsyncThunk<CheckEmailResponse, CheckEmailPayload>(
  'auth/checkEmail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.checkEmail(data);
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