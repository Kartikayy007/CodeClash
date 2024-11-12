import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  createdClasses: [],
  
};

const createdClassesSlice = createSlice({
  name: 'joinedClasses',
  initialState,
  reducers: {
    setCreatedClasses: (state, action) => {
      state.joinedClasses = action.payload;
    },
  },
});

export const { setCreatedClasses } = createdClassesSlice.actions;
export default createdClassesSlice.reducer;
