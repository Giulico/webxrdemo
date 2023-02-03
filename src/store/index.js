import { configureStore } from "@reduxjs/toolkit";

// Slices
import playerSlice from "./playerSlice";

export const store = configureStore({
  reducer: {
    player: playerSlice,
  },
});
