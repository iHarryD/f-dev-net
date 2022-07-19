import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/postSlice";
import chatReducer from "../features/chatSlice";

export const store = configureStore({
  reducer: {
    postSlice: postReducer,
    chatSlice: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
