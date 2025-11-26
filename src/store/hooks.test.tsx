// src/store/hooks.test.tsx
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import { store } from '.';
import { useAppDispatch, useAppSelector } from './hooks';

describe('Redux hooks', () => {
  // Wrapper to provide the Redux store
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  test('useAppDispatch returns the dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  test('useAppSelector can read state', () => {
    const { result } = renderHook(() => useAppSelector((state) => state.auth), { wrapper });
    expect(result.current).toHaveProperty('user'); // Replace with actual properties of auth slice
  });
});
