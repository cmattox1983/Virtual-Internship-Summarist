import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  uid: string;
  email: string | null;
  isAnonymous: boolean;
};

type State = {
  user: User | null;
  authLoaded: boolean;
};

const initialState: State = {
  user: null,
  authLoaded: false,
};

const authStateSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.authLoaded = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.authLoaded = true;
    },
  },
});

export const { setUser, clearUser } = authStateSlice.actions;
export const authStateReducer = authStateSlice.reducer;
