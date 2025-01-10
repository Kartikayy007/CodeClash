import { AppDispatch } from '@/store/store'
import { NextRouter } from 'next/router'
import { UseFormReturn } from 'react-hook-form'
import { AuthFormSchema } from '@/lib/schemas/authSchema'
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

export interface TempTokenPayload {
  tempOAuthToken: string;
}

export interface BaseAuthHandlerProps {
  values: z.infer<typeof AuthFormSchema>;
  dispatch: AppDispatch;
  setIsSubmitting: (value: boolean) => void;
}

export interface ResetPasswordHandlerProps extends BaseAuthHandlerProps {
  token: string | undefined;
  router: NextRouter;
  form: UseFormReturn<z.infer<typeof AuthFormSchema>>;
}

export interface LoginHandlerProps extends BaseAuthHandlerProps {
  router: NextRouter;
  form: UseFormReturn<z.infer<typeof AuthFormSchema>>;
}

export interface RegisterHandlerProps extends BaseAuthHandlerProps {
  router: NextRouter;
}

export interface ForgotPasswordHandlerProps extends BaseAuthHandlerProps {
  setResetLinkSent: (value: boolean) => void;
  setTimeLeft: (value: number) => void;
  onResetLinkSent?: (email: string) => void;
}

export interface GetStartedHandlerProps extends BaseAuthHandlerProps {
  router: NextRouter;
}

export type AuthFormType = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'get-started';