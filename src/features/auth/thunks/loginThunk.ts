import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginPayload, LoginResponse } from '../types/auth.types';
import { authApi } from '../api/authApi';

export const login = createAsyncThunk<LoginResponse, LoginPayload>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data?.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);