import { createAsyncThunk } from '@reduxjs/toolkit';
import { VerifyOtpPayload, VerifyOtpResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { AuthApiError } from '@/types/error.types';

export const verifyOtp = createAsyncThunk<VerifyOtpResponse, VerifyOtpPayload>(
  'auth/verifyOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as AuthApiError;
      // console.log(apiError.response?.data?.error);
      return rejectWithValue(apiError.response?.data?.error || 'OTP verification failed');
    }
  }
);