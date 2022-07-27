import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import postReducer from "../features/postSlice";
import chatReducer from "../features/chatSlice";
import userReducer, { login, logout, updateUser } from "../features/userSlice";
import axios from "axios";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: login,
  effect(action, listenerApi) {
    localStorage.setItem("user", JSON.stringify(action.payload.user));
    localStorage.setItem("token", action.payload.token);
    axios.defaults.headers.common["authorization"] = action.payload.token;
  },
});

listenerMiddleware.startListening({
  actionCreator: logout,
  effect(action, listenerApi) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    axios.defaults.headers.common["authorization"] = false;
  },
});

listenerMiddleware.startListening({
  actionCreator: updateUser.fulfilled,
  effect(action) {
    localStorage.setItem("user", JSON.stringify(action.payload.data.data));
  },
});

export const store = configureStore({
  reducer: {
    postSlice: postReducer,
    chatSlice: chatReducer,
    userSlice: userReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({ serializableCheck: false }).prepend(
      listenerMiddleware.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
