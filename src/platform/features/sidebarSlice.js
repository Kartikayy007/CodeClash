import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isCollapsed: JSON.parse(localStorage.getItem('sidebarCollapsed')) || false,
    width: JSON.parse(localStorage.getItem('sidebarCollapsed')) ? '80px' : '18%' 
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isCollapsed = !state.isCollapsed;
            state.width = state.isCollapsed ? '80px' : '18%';
            localStorage.setItem('sidebarCollapsed', JSON.stringify(state.isCollapsed));
        },
    },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
