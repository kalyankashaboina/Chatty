import chatReducer, { setActiveChat, setOnlineUsers, addMessage } from './chatSlice';
import type { ChatMessage } from 'src/types/mesagetypes';
import type { MessageType } from 'src/types/mesagetypes';

describe('chatSlice reducer', () => {
  const initialState = {
    activeChatUserId: null,
    onlineUsers: {},
    messages: {},
  };

  test('should return initial state', () => {
    const state = chatReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('setActiveChat should set active user ID', () => {
    const state = chatReducer(initialState, setActiveChat('user123'));
    expect(state.activeChatUserId).toBe('user123');
  });

  test('setOnlineUsers should update online users list', () => {
    const online = { user1: ['socket1'], user2: ['socket2', 'socket3'] };
    const state = chatReducer(initialState, setOnlineUsers(online));
    expect(state.onlineUsers).toEqual(online);
  });

  test('addMessage should add a message to a new user thread', () => {
    const message: ChatMessage = {
      id: 'msg1',
      sender: 'user123',
      receiver: 'user456',
      content: 'Hello',
      type: 'text' as MessageType,
      timestamp: new Date(),
    };

    const state = chatReducer(initialState, addMessage({ userId: 'user123', message }));
    expect(state.messages['user123']).toEqual([message]);
  });

  test('addMessage should push a message to existing array', () => {
    const existingState = {
      activeChatUserId: null,
      onlineUsers: {},
      messages: {
        user123: [
          {
            id: 'old-msg',
            sender: 'user123',
            receiver: 'user456',
            content: 'Hi',
            type: 'text' as MessageType,
            timestamp: new Date(),
          },
        ],
      },
    };

    const newMessage: ChatMessage = {
      id: 'msg2',
      sender: 'user123',
      receiver: 'user456',
      content: 'How are you?',
      type: 'text' as MessageType,
      timestamp: new Date(),
    };

    const state = chatReducer(
      existingState,
      addMessage({ userId: 'user123', message: newMessage }),
    );

    expect(state.messages['user123'].length).toBe(2);
    expect(state.messages['user123'][1]).toEqual(newMessage);
  });
});
