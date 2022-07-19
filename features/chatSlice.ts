import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, ChatMessage } from "../interfaces/Common.interface";

const initialState: Chat[] = [];

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    append(state, action: PayloadAction<{ newChats: Chat[] }>) {
      state.push(...action.payload.newChats);
    },
    appendMessages(
      state,
      action: PayloadAction<{ chatID: string; newMessages: ChatMessage[] }>
    ) {
      state
        .find((chat) => chat._id === action.payload.chatID)
        ?.conversation.push(...action.payload.newMessages);
    },
    refresh(state, action: PayloadAction<{ newChats: Chat[] }>) {
      return action.payload.newChats;
    },
    reset(state, action) {
      return [];
    },
  },
});

export const { append, appendMessages, refresh, reset } = chatSlice.actions;

export default chatSlice.reducer;
