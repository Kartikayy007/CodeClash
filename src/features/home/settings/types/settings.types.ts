export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeUsernamePayload {
  username: string;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
}

export interface SettingsError {
  success: boolean;
  message: string;
} 