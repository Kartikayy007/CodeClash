import { createAsyncThunk } from "@reduxjs/toolkit";
import { GoogleAuthError, GoogleOAuthResponse } from "../types/auth.types";
import { authApi } from "../api/authApi";

export const exchangeGoogleToken = createAsyncThunk<
  GoogleOAuthResponse,
  { tempOAuthToken: string }
>("auth/googleToken", async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.exchangeGoogleToken(data);
    return response;
  } catch (error: unknown) {
    const apiError = error as GoogleAuthError;
    return rejectWithValue({
      success: false,
      message: apiError.response?.data?.error || apiError.message,
    });
  }
});
