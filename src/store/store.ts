import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import authReducer from '@/features/auth/slices/authSlice';
import editorReducer from '@/features/editor/slices/editorSlice';
import battleReducer from '@/features/battle/slices/battleSlice';

const battlePersistConfig = {
  key: 'battle',
  storage,
  whitelist: ['problems', 'currentProblemIndex', 'player1', 'player2', 'roomId', 'status'] // Only persist these fields
};

const persistedBattleReducer = persistReducer(battlePersistConfig, battleReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    editor: editorReducer,
    battle: persistedBattleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(logger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;