import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 



import authReducer from '../auth/features/authSlice';
import sidebarReducer from '../platform/features/sidebarSlice';
import joinedClassesReducer from '../platform/features/joinedClasses';
import createdClassesReducer from '../platform/features/createdClasses';
import toggleReducer from '../platform/features/toggleSlice';
import userReducer from '../platform/features/userSlice';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], 

};


const rootReducer = combineReducers({
  auth: authReducer,
  sidebar: sidebarReducer,
  joinedClasses: joinedClassesReducer,
  createdClasses: createdClassesReducer,
  toggleState: toggleReducer,
  user: userReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,

    }),
});

export const persistor = persistStore(store);

export default store;
