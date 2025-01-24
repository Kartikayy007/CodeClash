import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, Language } from '../types/editor.types';

const initialState: EditorState = {
  language: 'cpp',
  code: '',
  isFullscreen: false,
  theme: 'vs-dark',
  fontSize: 14,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    resetEditor: () => initialState,
  },
});

export const {
  setLanguage,
  setCode,
  toggleFullscreen,
  setTheme,
  setFontSize,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer; 