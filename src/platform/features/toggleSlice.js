import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    showToggle: false, 
    isEnrolled: (() => {
      if (typeof window !== "undefined" && sessionStorage.getItem("isEnrolled") !== null) {
        return JSON.parse(sessionStorage.getItem("isEnrolled"));
      }
      return true;

    })(),
  };
  

const toggleStateSlice = createSlice({
    name: 'toggleState',
    initialState,
    reducers: {
        setToggleState(state, action) {
            state.showToggle = action.payload;
        },
        setIsEnrolled(state, action) {
            state.isEnrolled = action.payload;
            
            if (typeof window !== 'undefined') {
                sessionStorage.setItem("isEnrolled", JSON.stringify(state.isEnrolled));
            }
        }
    }
});

export const { setToggleState, setIsEnrolled } = toggleStateSlice.actions;

export default toggleStateSlice.reducer;
