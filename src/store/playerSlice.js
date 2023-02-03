import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newPosition: "",
};

export const playerSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    set: (state, action) => {
      state.newPosition = JSON.stringify(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { set } = playerSlice.actions;

export default playerSlice.reducer;
