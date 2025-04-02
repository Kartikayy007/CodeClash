import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginPayload, LoginResponse } from "../types/auth.types";
import { authApi } from "../api/authApi";
import { AuthApiError } from "@/features/auth/types/error.types";

export const login = createAsyncThunk<LoginResponse, LoginPayload>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data?.tokens) {
        localStorage.setItem("accessToken", response.data.tokens.accessToken);
        localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
        document.cookie = `accessToken=${response.data.tokens.accessToken}; path=/`;
        document.cookie = `refreshToken=${response.data.tokens.refreshToken}; path=/`;
      }
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
