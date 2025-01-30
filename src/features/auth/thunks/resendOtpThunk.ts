import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResendOtpPayload, ResendOtpResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { AuthApiError } from '@/features/auth/types/error.types';

interface ResendOtpError {
  success: false;
  message: string;
  statusCode?: number;
}

export const resendOtp = createAsyncThunk<ResendOtpResponse, ResendOtpPayload>(
  'auth/resendOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resendOtp(data);
      return response;
    } catch (error: unknown) {
      const apiError = error as AuthApiError;
      
      if (apiError.response?.status === 429) {
        return rejectWithValue({
          success: false,
          message: 'OTP requests are limited to one per 30 seconds.',
          statusCode: 429
        } as ResendOtpError);
      }
      
      if (apiError.response?.status === 400) {
        const errorMessage = apiError.response.data?.message;
        
        if (errorMessage === 'User not found!') {
          return rejectWithValue({
            success: false,
            message: 'User not found!',
            statusCode: 400
          } as ResendOtpError);
        }
        
        if (errorMessage === 'Email already verified!') {
          return rejectWithValue({
            success: false,
            message: 'Email already verified!',
            statusCode: 400
          } as ResendOtpError);
        }
      }
    
      return rejectWithValue({
        success: false,
        message: apiError.response?.data?.message || 'Failed to resend OTP',
        statusCode: apiError.response?.status || 500
      } as ResendOtpError);
    }
  }
);