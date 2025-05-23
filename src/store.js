import { configureStore } from '@reduxjs/toolkit';
import automatonReducer from './models/automatonSlice';
import uiReducer from './models/uiSlice';
import tutorialReducer from './models/tutorialSlice';

export const store = configureStore({
  reducer: {
    automaton: automatonReducer,
    ui: uiReducer,
    tutorial: tutorialReducer,
  },
});
