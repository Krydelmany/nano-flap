import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  zoomFactor: 1,
  position: { x: 0, y: 0 },
  // Counters to trigger actions in React Flow via useEffect
  fitViewCounter: 0,
  zoomInCounter: 0,
  zoomOutCounter: 0,
  // Potentially add other canvas-specific UI states
  isInteractive: true, // Example: to toggle canvas interactivity from controls
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setZoomFactor: (state, action) => {
      state.zoomFactor = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    triggerFitView: (state) => {
      state.fitViewCounter += 1;
    },
    triggerZoomIn: (state) => {
      state.zoomInCounter += 1;
    },
    triggerZoomOut: (state) => {
      state.zoomOutCounter += 1;
    },
    toggleInteractivity: (state) => {
      state.isInteractive = !state.isInteractive;
    },
    // Reset counters if needed, though incrementing should be fine
  },
});

export const {
  setZoomFactor,
  setPosition,
  triggerFitView,
  triggerZoomIn,
  triggerZoomOut,
  toggleInteractivity,
} = canvasSlice.actions;

export default canvasSlice.reducer;
