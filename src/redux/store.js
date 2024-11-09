
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/features/authSlice';
import sidebarReducer from '../platform/features/sidebarSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,

  },
});

export default store;
