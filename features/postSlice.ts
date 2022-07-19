import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../interfaces/Common.interface";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: Post[] = [];

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    append(state, action: PayloadAction<{ newPosts: Post[] }>) {
      state.unshift(...action.payload.newPosts);
    },
    refresh(state, action: PayloadAction<{ newPosts: Post[] }>) {
      return action.payload.newPosts;
    },
    reset(state) {
      return [];
    },
  },
});

export const { append, refresh, reset } = postSlice.actions;

export default postSlice.reducer;
