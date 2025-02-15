import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import authReducer from '@/features/auth/slices/authSlice';
import editorReducer from '@/features/editor/slices/editorSlice';
import battleReducer from '@/features/battle/slices/battleSlice';
import submissionReducer from '@/features/editor/slices/submissionSlice';
import profileReducer from '@/features/home/profile/slices/profileSlice';
import matchesReducer from '@/features/home/matches/slices/matchesSlice';
import leaderboardReducer from '@/features/home/leaderboard/slices/leaderboardSlice';

const battlePersistConfig = {
  key: 'battle',
  storage,
  whitelist: ['problems', 'currentProblemIndex', 'player1', 'player2', 'matchId', 'status'] 
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user']
};

const persistedBattleReducer = persistReducer(battlePersistConfig, battleReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = {
  auth: persistedAuthReducer,
  editor: editorReducer,
  battle: persistedBattleReducer,
  submissions: submissionReducer,
  profile: profileReducer,
  matches: matchesReducer,
  leaderboard: leaderboardReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

 ("editor state", store.getState().editor);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;