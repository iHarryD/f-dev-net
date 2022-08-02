import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Post, PostComment } from "../interfaces/Common.interface";
import { PayloadAction } from "@reduxjs/toolkit";
import { getPost } from "../services/postServices";

const initialState: Post[] = [];

export const syncPost = createAsyncThunk("post/update", (postID: string) => {
  return getPost(postID);
});

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
    like(state, action: PayloadAction<{ postID: string; username: string }>) {
      const indexOfPost = state.findIndex(
        (post) => post._id === action.payload.postID
      );
      if (indexOfPost >= 0) {
        state[indexOfPost].likes.push(action.payload.username);
      }
    },
    unlike(state, action: PayloadAction<{ postID: string; username: string }>) {
      const indexOfPost = state.findIndex(
        (post) => post._id === action.payload.postID
      );
      if (indexOfPost >= 0) {
        state[indexOfPost].likes = state[indexOfPost].likes.filter(
          (likeBy) => likeBy !== action.payload.username
        );
      }
    },
    deletePost(state, action: PayloadAction<{ postID: string }>) {
      return state.filter((post) => post._id !== action.payload.postID);
    },
  },
  extraReducers(builder) {
    builder.addCase(syncPost.fulfilled, (state, action) => {
      const indexOfPost = state.findIndex(
        (post) =>
          post._id === JSON.parse(JSON.stringify(action.payload.data.data._id))
      );
      if (indexOfPost >= 0) {
        state[indexOfPost] = JSON.parse(
          JSON.stringify(action.payload.data.data)
        );
      }
    });
  },
});

export const { append, refresh, reset, like, unlike, deletePost } =
  postSlice.actions;

export default postSlice.reducer;
