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
  success: boolean;
  code?: string;
  status?: number;
  message: string;
  response?: {
    data: {
      error: string;    
      message?: string; 
    };
    status: number;   
    statusText: string;
  };
}