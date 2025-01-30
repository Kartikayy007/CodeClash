export interface ApiError {
  response?: {
    data: {
      success: boolean;
    };
    status: number;
  };
  error: string; 
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
  response?: {
    data: {
      message: string;
      error: string;
      success: boolean;
    };
    status: number;
  };
  message: string;
}