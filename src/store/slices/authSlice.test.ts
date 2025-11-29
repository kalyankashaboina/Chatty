import authReducer, { setCredentials, logout } from './authSlice';

describe('authSlice reducer', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    const initialState = authReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      user: null, // because localStorage is empty
    });
  });

  test('setCredentials should update user and write to localStorage', () => {
    const userData = { id: '1', username: 'john', email: 'john@example.com' };

    const state = authReducer({ user: null }, setCredentials({ user: userData }));

    expect(state.user).toEqual(userData);

    // Ensure localStorage was updated
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(userData));
  });

  test('logout should clear user and remove from localStorage', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ id: '5', username: 'test', email: 'test@mail.com' }),
    );

    const state = authReducer(
      { user: { id: '5', username: 'test', email: 'test@mail.com' } },
      logout(),
    );

    expect(state.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
