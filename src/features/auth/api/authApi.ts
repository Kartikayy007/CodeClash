import { api } from '@/utils/api';
import { RegisterPayload, RegisterResponse, ResendOtpPayload, ResendOtpResponse, VerifyOtpPayload, VerifyOtpResponse, LoginPayload, LoginResponse, ResetPasswordPayload, ResetPasswordResponse, ResetPasswordWithTokenPayload, CheckEmailPayload, CheckEmailResponse, TempTokenPayload, GoogleOAuthResponse, RefreshTokenResponse } from '../types/auth.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(`${BASE_URL}/api/v1/auth/register`, data);
    return response.data;
  },
  verifyOtp: async (data: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>(
      `${BASE_URL}/api/v1/auth/verify/register`,
      data
    );
    return response.data;
  },
  resendOtp: async (data: ResendOtpPayload): Promise<ResendOtpResponse> => {
    const response = await api.post<ResendOtpResponse>(
      `${BASE_URL}/api/v1/auth/resend-otp`,
      data
    );
    return response.data;
  },
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      `${BASE_URL}/api/v1/auth/login`,
      data
    );
    return response.data;
  },
  resetPassword: async (data: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>(
      `${BASE_URL}/api/v1/auth/reset-password`,
      data
    );
    return response.data;
  },
  resetPasswordWithToken: async ({ token, password }: ResetPasswordWithTokenPayload): Promise<ResetPasswordResponse> => {
    const response = await api.patch<ResetPasswordResponse>(
      `${BASE_URL}/api/v1/auth/reset-password/${token}`,
      { password }
    );
    return response.data;
  },
  checkEmail: async (data: CheckEmailPayload): Promise<CheckEmailResponse> => {
    const response = await api.post<CheckEmailResponse>(
      `${BASE_URL}/api/v1/auth/email`,
      data
    );
    return response.data;
  },
  googleAuth: {
    initiate: () => `${BASE_URL}/api/v1/auth/google`,
    exchangeToken: async (data: TempTokenPayload): Promise<GoogleOAuthResponse> => {
      const response = await api.post<GoogleOAuthResponse>(
        `${BASE_URL}/api/v1/auth/google/tokens`,
        data
      );
      return response.data;
    }
  },
  exchangeGoogleToken: async (data: TempTokenPayload): Promise<GoogleOAuthResponse> => {
    const response = await api.post<GoogleOAuthResponse>(
      `${BASE_URL}/api/v1/auth/google/tokens`,
      data
    );
    return response.data;
  },
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const formData = new URLSearchParams();
    formData.append('refreshToken', refreshToken);
    
    const response = await api.post<RefreshTokenResponse>(
      `${BASE_URL}/api/v1/auth/refresh-token`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },
};