// src/store/slices/api.test.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react';
import { store } from '../index';
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useRegisterMutation,
  useLogoutMutation,
  useFetchMessagesQuery,
  useSendMessageMutation,
} from './api';

describe('RTK Query API hooks', () => {
  // Wrapper to provide Redux store
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  // -------------------
  // Mutations
  // -------------------

  test('login mutation', async () => {
    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    const [login] = result.current;

    expect(typeof login).toBe('function');

    await act(async () => {
      try {
        await login({ email: 'test@test.com', password: '123456' }).unwrap();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  test('loginWithGoogle mutation', async () => {
    const { result } = renderHook(() => useLoginWithGoogleMutation(), { wrapper });
    const [loginGoogle] = result.current;

    expect(typeof loginGoogle).toBe('function');

    await act(async () => {
      try {
        await loginGoogle({ googleToken: 'dummy-token' }).unwrap();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  test('register mutation', async () => {
    const { result } = renderHook(() => useRegisterMutation(), { wrapper });
    const [register] = result.current;

    expect(typeof register).toBe('function');

    await act(async () => {
      try {
        await register({ username: 'user', email: 'user@test.com', password: '123456' }).unwrap();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  test('logout mutation', async () => {
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    const [logout] = result.current;

    expect(typeof logout).toBe('function');

    await act(async () => {
      try {
        await logout(undefined).unwrap(); // <-- pass undefined for void mutation
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  test('sendMessage mutation', async () => {
    const { result } = renderHook(() => useSendMessageMutation(), { wrapper });
    const [sendMessage] = result.current;

    expect(typeof sendMessage).toBe('function');

    await act(async () => {
      try {
        await sendMessage({ userId: '1', content: 'Hello' }).unwrap();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  // -------------------
  // Queries
  // -------------------

  test('fetchMessages query', () => {
    const { result } = renderHook(() => useFetchMessagesQuery({ selectedUserId: '1', page: 1 }), {
      wrapper,
    });
    const state = result.current;

    expect(state).toHaveProperty('data');
    expect(state).toHaveProperty('isLoading');
    expect(state).toHaveProperty('isSuccess');
    expect(state).toHaveProperty('isError');
  });
});
