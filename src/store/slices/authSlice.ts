// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  // The 'token' property is completely removed from the state.
  user: { id: string; username: string; email: string } | null;
}

const initialState: AuthState = {
  // We only load the user from localStorage, not the token.
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // The payload for setCredentials no longer contains a 'token'.
    setCredentials: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      // No more token management here.
    },
    logout: state => {
      state.user = null;
      localStorage.removeItem('user');
      // No more token management here.
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
