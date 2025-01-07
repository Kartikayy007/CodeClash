export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export interface OtpError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface GoogleAuthError {
  message: string;
  response?: {
    data?: {
      message?: string;
      status?: number;
    };
  };
}

export interface AuthApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
      status?: number;
    };
  };
}