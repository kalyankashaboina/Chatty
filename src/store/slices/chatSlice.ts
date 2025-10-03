// src/store/slices/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../../types/types';

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
