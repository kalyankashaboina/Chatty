// utils/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://chatty-server-uhm7.onrender.com';

export const initializeSocket = (): Socket | null => {
  if (socket) {
    console.log('⚠️ Socket already initialized. Reusing existing instance.');
    return socket;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❗ No token found in localStorage. Cannot initialize socket.');
    return null;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    withCredentials: true,
    auth: { token },
  });

  console.log('🔌 Socket initialized with URL:', SOCKET_URL);

  // Global connection event listeners
  socket.on('connect', () => {
    console.log('✅ Socket connected');
    console.log('🆔 Socket ID:', socket?.id);
  });

  socket.on('disconnect', reason => {
    console.warn('❌ Disconnected:', reason);
    if (reason === 'io server disconnect') {
      console.warn('🛑 Disconnected by server. Manual reconnect may be required.');
    } else if (reason === 'io client disconnect') {
      console.warn('🔌 Client manually disconnected.');
    } else {
      console.warn('⚠️ Unexpected disconnect:', reason);
    }
  });

  socket.io.on('reconnect_attempt', attempt => {
    console.log(`⚡ Reconnecting... Attempt #${attempt}`);
  });

  socket.io.on('reconnect', attempt => {
    console.log(`✅ Reconnected after ${attempt} attempt(s)`);
  });

  socket.io.on('reconnect_error', err => {
    console.error('❗ Reconnect error:', err.message);
  });

  socket.io.on('reconnect_failed', () => {
    console.error('❌ Permanent reconnect failure.');
  });

  socket.on('connect_error', err => {
    console.error('🚫 Connection error:', err.message);
    if (err.message.includes('jwt')) {
      console.warn('🔐 Token may be expired or invalid.');
    }
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket manually disconnected');
  }
};
