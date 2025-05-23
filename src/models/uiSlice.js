import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // 'light' ou 'dark'
  sidebarOpen: true,
  currentView: 'editor', // 'editor', 'simulator', 'tutorial'
  editorMode: 'visual', // 'visual' ou 'table'
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';

      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setEditorMode: (state, action) => {
      state.editorMode = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setCurrentView,
  setEditorMode
} = uiSlice.actions;

export default uiSlice.reducer;
