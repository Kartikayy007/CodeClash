import { createSlice } from '@reduxjs/toolkit';

export const toggleStateSlice = createSlice({
    name: 'toggleState',
    initialState: {
        showToggle: false,
    },
    reducers: {
        setToggleState: (state, action) => {
            state.showToggle = action.payload;
        },
    },
});

export const { setToggleState } = toggleStateSlice.actions;
export default toggleStateSlice.reducer;
