import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthView = "login" | "register" | "reset";

type State = {
  isOpen: boolean;
  view: AuthView;
};

const initialState: State = { isOpen: false, view: "login" };

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
      state.view = "login";
    },
    close: (state) => {
      state.isOpen = false;
      state.view = "login";
    },
    setView: (state, action: PayloadAction<"login" | "register" | "reset">) => {
      state.view = action.payload;
    },
  },
});

export const { open, close, setView } = authModalSlice.actions;
export const authModalReducer = authModalSlice.reducer;
