import { AppDispatch } from '@/store/store'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { NextRouter } from 'next/router'
import { UseFormReturn } from 'react-hook-form'
import { ForgotPasswordFormSchema, GetStartedFormSchema, LoginFormSchema, RegisterFormSchema, ResetPasswordFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

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

export interface ResetPasswordWithTokenPayload {
  token: string;
  password: string;
}

export interface CheckEmailPayload {
  email: string;
}

export interface CheckEmailResponse {
  success: boolean;
  message: string;
  data?: {
    flow: 1 | 2 | 3;
  }
}

export interface CheckEmailError {
  success: boolean;
  message: string;
  response?: {
    data: {
      error: string;
    };
    status: number;
  };
}

export interface GoogleOAuthResponse {
  success: boolean;
  message: string;
  data?: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  }
}

export interface GoogleAuthError {
  response?: {
    data: {
      error: string;
      success: boolean;
    };
    status: number;
  };
  message: string;
}

export interface TempTokenPayload {
  tempOAuthToken: string;
}

export interface AuthError {
  success: boolean;
  message: string;
  status?: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    tokens: {
      accessToken: string;
    };
  };
}

export interface RefreshTokenError {
  success: boolean;
  message: string;
}

// Update BaseAuthHandlerProps to be generic
export interface BaseAuthHandlerProps<T> {
  values: T;
  dispatch: AppDispatch;
  setIsSubmitting: (value: boolean) => void;
}

export interface ResetPasswordHandlerProps extends BaseAuthHandlerProps<z.infer<typeof ResetPasswordFormSchema>> {
  token?: string;
  form: UseFormReturn<z.infer<typeof ResetPasswordFormSchema>>;
}

export interface LoginHandlerProps extends BaseAuthHandlerProps<z.infer<typeof LoginFormSchema>> {
  form: UseFormReturn<z.infer<typeof LoginFormSchema>>;
  router: AppRouterInstance;
}

export interface RegisterHandlerProps extends BaseAuthHandlerProps<z.infer<typeof RegisterFormSchema>> {
  router: AppRouterInstance | NextRouter;
}

export interface ForgotPasswordHandlerProps extends BaseAuthHandlerProps<z.infer<typeof ForgotPasswordFormSchema>> {
  setResetLinkSent: (value: boolean) => void;
  setTimeLeft: (value: number) => void;
  onResetLinkSent?: (email: string) => void;
}

export interface GetStartedHandlerProps extends BaseAuthHandlerProps<z.infer<typeof GetStartedFormSchema>> {
  router: AppRouterInstance | NextRouter;
}

export type AuthFormType = 'login' | 'register' | 'reset-password' | 'forgot-password' | 'get-started';

export type FormData = 
  | z.infer<typeof LoginFormSchema>
  | z.infer<typeof RegisterFormSchema>
  | z.infer<typeof ResetPasswordFormSchema>
  | z.infer<typeof ForgotPasswordFormSchema>
  | z.infer<typeof GetStartedFormSchema>;