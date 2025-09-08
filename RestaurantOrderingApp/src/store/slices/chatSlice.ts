import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '@types/index';

interface ChatState {
  messages: { [orderId: string]: ChatMessage[] };
  unreadCount: { [orderId: string]: number };
  isConnected: boolean;
}

const initialState: ChatState = {
  messages: {},
  unreadCount: {},
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;
      const orderId = message.orderId;
      
      if (!state.messages[orderId]) {
        state.messages[orderId] = [];
      }
      
      state.messages[orderId].push(message);
      
      // Update unread count if message is from chef
      if (message.senderType === 'chef' && !message.isRead) {
        state.unreadCount[orderId] = (state.unreadCount[orderId] || 0) + 1;
      }
    },
    
    markMessagesAsRead: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      
      if (state.messages[orderId]) {
        state.messages[orderId].forEach(message => {
          message.isRead = true;
        });
      }
      
      state.unreadCount[orderId] = 0;
    },
    
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    
    clearChat: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      delete state.messages[orderId];
      delete state.unreadCount[orderId];
    },
  },
});

export const { addMessage, markMessagesAsRead, setConnectionStatus, clearChat } = chatSlice.actions;
export default chatSlice.reducer;