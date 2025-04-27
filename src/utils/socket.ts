import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://chatty-server-uhm7.onrender.com';

export const initializeSocket = (): Socket => {
  if (socket) return socket; // Return existing socket if already initialized

  socket = io(SOCKET_URL, {
    transports: ["websocket"],  // Use websocket transport
    withCredentials: true,       // Ensure cookies are sent with the request
  });

  console.log("🔌 Socket initialized");

  socket.io.on("reconnect_attempt", () => {
    console.log("⚡ Attempting to reconnect...");
  });

  socket.io.on("reconnect", (attempt) => {
    console.log(`✅ Reconnected after ${attempt} attempt(s)`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Socket disconnected: ${reason}`);
  });

  socket.on("connect_error", (err) => {
    console.error("❗ Socket connection error:", err.message);
    alert("Connection error. Please try again later.");
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("❌ Socket manually disconnected");
  }
};
