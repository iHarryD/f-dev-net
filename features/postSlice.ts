import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../interfaces/Common.interface";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: Post[] = [];

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    append(state, action: PayloadAction<{ newPosts: Post[] }>) {
      state.push(...action.payload.newPosts);
    },
    refresh(state, action: PayloadAction<{ newPosts: Post[] }>) {
      state = action.payload.newPosts;
    },
    reset(state) {
      state = [];
    },
  },
});

export const { append, refresh, reset } = postSlice.actions;

export default postSlice.reducer;
