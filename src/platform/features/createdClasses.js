import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  createdClasses: [],
  
};

const createdClassesSlice = createSlice({
  name: 'createdClasses',
  initialState,
  reducers: {
    setCreatedClasses: (state, action) => {
      state.createdClasses = action.payload;
    },
  },
});

export const { setCreatedClasses } = createdClassesSlice.actions;
export default createdClassesSlice.reducer;
