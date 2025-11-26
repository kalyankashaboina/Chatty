// src/store/index.test.ts

import { store, type RootState } from '.';
import { setCredentials } from './slices/authSlice';
describe('Redux store', () => {
  it('should initialize with the correct default state', () => {
    const state: RootState = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('chat');
    expect(state).toHaveProperty('api');
  });

  it('should handle auth/setCredentials action', () => {
    const mockUser = { id: 1, username: 'test' };
    store.dispatch(setCredentials({ user: mockUser }));

    const state: RootState = store.getState();
    expect(state.auth.user).toEqual(mockUser);
  });

  it('should allow dispatching arbitrary actions', () => {
    const dummyAction = { type: 'chat/dummy' };
    expect(() => store.dispatch(dummyAction)).not.toThrow();
  });
});
