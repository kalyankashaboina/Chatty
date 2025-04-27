import { useEffect } from "react";
import { getSocket } from "../src/utils/socket";
import { User, ChatMessage } from "../types";

interface UseSocketEventsProps {
  selectedUser: User | null;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const useSocketEvents = ({ selectedUser, setUsers, setMessages }: UseSocketEventsProps) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // ✅ Emit recent messages request when selectedUser changes
    if (selectedUser) {
      socket.emit("getRecentMessages", selectedUser.id);
    }

    // ✅ On receiving recent messages
    socket.on("recentMessages", (messages: ChatMessage[]) => {
      setMessages(messages);
    });

    // ✅ On receiving new messages
    socket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    // ✅ User online/offline
    socket.on("userOnline", (userId: string) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isOnline: true } : user))
      );
    });

    socket.on("userOffline", (userId: string) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isOnline: false } : user))
      );
    });

    // ✅ Typing event (optional)
    socket.on("typing", (username: string) => {
      console.log(`${username} is typing...`);
    });

    // ✅ Handle reconnection attempts
    socket.on("reconnect_attempt", () => {
      console.log("⚡ Attempting to reconnect...");
    });

    socket.on("reconnect", (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempt(s)`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${reason}`);
    });

    socket.on("connect_error", (err) => {
      console.error("❗ Socket connection error:", err.message);
      alert("Connection error. Please try again later.");
    });

    // ✅ Cleanup socket listeners on component unmount or changes
    return () => {
      socket.off("recentMessages");
      socket.off("newMessage");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("typing");
      socket.off("reconnect_attempt");
      socket.off("reconnect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [selectedUser, setMessages, setUsers]);
};

export default useSocketEvents;
