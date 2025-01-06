import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResendOtpPayload, ResendOtpResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

export const resendOtp = createAsyncThunk<ResendOtpResponse, ResendOtpPayload>(
  'auth/resendOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resendOtp(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
    }
  }
);