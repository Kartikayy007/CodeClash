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
<<<<<<< HEAD
      message: string;
=======
      message: any;
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)
      error: string;
      success: boolean;
    };
    status: number;
  };
  message: string;
}