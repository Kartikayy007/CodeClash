import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../types/auth.types";
import { register } from "../thunks/registerThunk";
import { refreshToken } from "../thunks/refreshTokenThunk";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  registrationStep: "initial",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.registrationStep = "initial";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registrationStep = "verification";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Registration failed";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload.data?.tokens) {
          state.token = action.payload.data.tokens.accessToken;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.registrationStep = "initial";
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
