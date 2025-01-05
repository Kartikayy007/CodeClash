import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { RegisterPayload, RegisterResponse } from '../types/auth.types';

export const register = createAsyncThunk<RegisterResponse, RegisterPayload>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Register thunk called with:', credentials);
      const response = await authApi.register(credentials);
      console.log('Register API response:', response);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      console.error('Register error:', error);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);