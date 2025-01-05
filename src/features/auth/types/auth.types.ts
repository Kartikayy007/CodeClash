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
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}