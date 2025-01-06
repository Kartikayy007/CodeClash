import { createAsyncThunk } from '@reduxjs/toolkit';
import { VerifyOtpPayload, VerifyOtpResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

export const verifyOtp = createAsyncThunk<VerifyOtpResponse, VerifyOtpPayload>(
  'auth/verifyOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);