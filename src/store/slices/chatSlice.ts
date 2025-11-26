// src/store/slices/chatSlice.ts
import type { ChatMessage } from 'src/types/mesagetypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  activeChatUserId: string | null;
  onlineUsers: Record<string, string[]>; // userId -> socketIds
  messages: Record<string, ChatMessage[]>; // userId -> messages
}

const initialState: ChatState = {
  activeChatUserId: null,
  onlineUsers: {},
  messages: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatUserId = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<Record<string, string[]>>) => {
      state.onlineUsers = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ userId: string; message: ChatMessage }>) => {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) state.messages[userId] = [];
      state.messages[userId].push(message);
    },
  },
});

export const { setActiveChat, setOnlineUsers, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
