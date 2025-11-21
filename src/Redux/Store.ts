import { configureStore } from "@reduxjs/toolkit";
import { authModalReducer } from "./authModalSlice";
import { sideBarReducer } from "./sideBarSlice";
import { authStateReducer } from "./authStateSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      authModal: authModalReducer,
      sideBar: sideBarReducer,
      auth: authStateReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
