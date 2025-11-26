import { io, Socket } from 'socket.io-client';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let socket: AuthenticatedSocket | null = null;
const SOCKET_URL =
  (global as any).importMeta?.env?.VITE_API_URL || 'https://chatty-server-uhm7.onrender.com';

export const initializeSocket = (): Socket | null => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => console.log('✅ Socket connected:', socket!.id));
  socket.on('disconnect', (reason) => console.warn('❌ Disconnected:', reason));
  socket.io.on('reconnect_attempt', (attempt) =>
    console.log(`⚡ Reconnecting, attempt #${attempt}`),
  );
  socket.io.on('reconnect', (attempt) => console.log(`✅ Reconnected after ${attempt} attempt(s)`));
  socket.io.on('reconnect_error', (err) => console.error('❗ Reconnect error:', err.message));
  socket.io.on('reconnect_failed', () => console.error('❌ Permanent reconnect failure.'));
  socket.on('connect_error', (err) => console.error('🚫 Connection error:', err.message));

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
