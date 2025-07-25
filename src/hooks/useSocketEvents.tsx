import { useEffect } from "react";
import { getSocket } from "../utils/socket";
import { User, ChatMessage } from "../types/types";

interface UseSocketEventsProps {
  selectedUser: User | null;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const useSocketEvents = ({ selectedUser, setUsers, setMessages }: UseSocketEventsProps) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    console.log("🔌 Socket initialized:", socket.id);
    
    if (selectedUser) {
      socket.emit("getRecentMessages", selectedUser.id);
    }

    socket.on("recentMessages", (messages: ChatMessage[]) => {
      setMessages(messages);
    });

    socket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

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

    socket.on("typing", (username: string) => {
      console.log(`${username} is typing...`);
    });

    // Cleanup on unmount
    return () => {
      socket.off("recentMessages");
      socket.off("newMessage");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("typing");
    };
  }, [selectedUser, setMessages, setUsers]);
};

export default useSocketEvents;
