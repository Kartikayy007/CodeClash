import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  joinedClasses: [],
  
};

const joinedClassesSlice = createSlice({
  name: 'joinedClasses',
  initialState,
  reducers: {
    setJoinedClasses: (state, action) => {
      state.joinedClasses = action.payload;
    },
  },
});

export const { setJoinedClasses } = joinedClassesSlice.actions;
export default joinedClassesSlice.reducer;
