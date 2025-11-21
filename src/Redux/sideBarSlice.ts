import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
  isOpen: boolean;
};

const initialState: State = { isOpen: false };

const sideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = sideBarSlice.actions;
export const sideBarReducer = sideBarSlice.reducer;
