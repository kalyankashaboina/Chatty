import { io, Socket } from "socket.io-client";


let socket: Socket | null = null;


export const initializeSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      query: { token },
      transports: ["websocket"], 
      withCredentials: true,     
    });

    console.log("🔌 Socket initialized");

    // Optional: Listen for reconnect attempts
    socket.io.on("reconnect_attempt", () => {
      console.log("⚡ Attempting to reconnect...");
    });

    // Optional: Listen for successful reconnection
    socket.io.on("reconnect", (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempt(s)`);
    });


    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${reason}`);
    });

    // Optional: Handle connection error
    socket.on("connect_error", (err) => {
      console.error("❗ Socket connection error:", err.message);
    });
  }

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
