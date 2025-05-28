import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: false,
  currentView: 'editor', // 'editor', 'simulator', 'tutorial'
  menuOpen: false,
  editorMode: 'visual', // Adicionar modo do editor: 'visual', 'table', etc.
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
    toggleMenu: (state) => {
      state.menuOpen = !state.menuOpen;
    },
    setEditorMode: (state, action) => {
      state.editorMode = action.payload;
    },
    setType: (state, action) => {
      // Esta ação deve estar no automatonSlice, não no uiSlice
      // Vou comentar para evitar conflito
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setCurrentView,
  toggleMenu,
  setEditorMode
  // setType - removido daqui
} = uiSlice.actions;

export default uiSlice.reducer;
