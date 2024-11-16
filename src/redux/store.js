
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/features/authSlice';
import sidebarReducer from '../platform/features/sidebarSlice';
import joinedClassesReducer from '../platform/features/joinedClasses'
import createdClassesReducer from '../platform/features/createdClasses'
import toggleReducer from '../platform/features/toggleSlice'; 

import userReducer from '../platform/features/userSlice'; 


const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
    joinedClasses: joinedClassesReducer,
    createdClasses: createdClassesReducer,
    toggleState: toggleReducer,
    user: userReducer,




  },
});

export default store;
