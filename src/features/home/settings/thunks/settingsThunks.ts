import { createAsyncThunk } from '@reduxjs/toolkit';
import { settingsApi } from '../apis/settingsApi';
import { 
  ChangePasswordPayload, 
  ChangeUsernamePayload, 
  SettingsResponse,
  LogoutResponse,
  DeleteAccountResponse 
} from '../types/settings.types';

export const changePassword = createAsyncThunk<SettingsResponse, ChangePasswordPayload>(
  'settings/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await settingsApi.changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const changeUsername = createAsyncThunk<SettingsResponse, ChangeUsernamePayload>(
  'settings/changeUsername',
  async (data, { rejectWithValue }) => {
    try {
      const response = await settingsApi.changeUsername(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change username');
    }
  }
);

export const deleteAccount = createAsyncThunk<DeleteAccountResponse, void>(
  'settings/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsApi.deleteAccount();
      if (response.success) {
        localStorage.removeItem('accessToken');
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

export const logoutAllDevices = createAsyncThunk<LogoutResponse, void>(
  'settings/logoutAllDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsApi.logoutAllDevices();
      if (response.success) {
        localStorage.removeItem('accessToken');
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to logout from all devices');
    }
  }
); 