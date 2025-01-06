export interface User {
  id: string;
  email: string;
  verified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  registrationStep: 'initial' | 'verification' | 'complete';
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  }
}

export interface ResetPasswordPayload {
  email: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}