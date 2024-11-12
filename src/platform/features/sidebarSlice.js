import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    iisCollapsed: false, 
   width:'18%'

};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isCollapsed = !state.isCollapsed;
            state.width = state.isCollapsed ? '80px' : '18%'; 

        },
    },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
