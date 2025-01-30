import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authReducer from '@/features/auth/slices/authSlice';
import editorReducer from '@/features/editor/slices/editorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    editor: editorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;