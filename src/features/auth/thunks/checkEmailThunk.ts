import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CheckEmailError,
  CheckEmailPayload,
  CheckEmailResponse,
} from "../types/auth.types";
import { authApi } from "../api/authApi";

export const checkEmail = createAsyncThunk<
  CheckEmailResponse,
  CheckEmailPayload
>("auth/checkEmail", async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.checkEmail(data);
    return response;
  } catch (error: unknown) {
    const apiError = error as CheckEmailError;
    return rejectWithValue({
      success: false,
      message: apiError.response?.data?.error || apiError.message,
    });
  }
});
