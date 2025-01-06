import { createAsyncThunk } from '@reduxjs/toolkit';
import { CheckEmailPayload, CheckEmailResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

export const checkEmail = createAsyncThunk<CheckEmailResponse, CheckEmailPayload>(
  'auth/checkEmail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.checkEmail(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check email');
    }
  }
);