import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { RegisterPayload, RegisterResponse } from '../types/auth.types';

export const register = createAsyncThunk<RegisterResponse, RegisterPayload>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);