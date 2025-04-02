import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterPayload, RegisterResponse } from "../types/auth.types";
import { authApi } from "../api/authApi";
import { AuthApiError } from "@/features/auth/types/error.types";

export const register = createAsyncThunk<RegisterResponse, RegisterPayload>(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      return response;
    } catch (error: unknown) {
      const apiError = error as AuthApiError;
      return rejectWithValue({
        success: false,
        message: apiError.response?.data?.error || apiError.message,
      });
    }
  },
);
