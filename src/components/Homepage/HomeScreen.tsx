import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import styles from "./HomeScreen.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Chat from "../Chat/Chat";
import { User, ChatMessage } from "../../../types";
import { getSocket, initializeSocket } from "../../utils/socket";
import axiosInstance from "../../utils/axios";

const HomeScreen: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth <= 426);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 426);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/sidebar");
        const mappedUsers: User[] = response.data.users.map((user: any) => ({
          id: user._id,
          username: user.fullName,
        }));
        setUsers(mappedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) initializeSocket(token);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (selectedUser) socket.emit("getRecentMessages", selectedUser.id);

    socket.on("recentMessages", (messages: ChatMessage[]) => setMessages(messages));
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

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [selectedUser]);

  if (loading) {
    return (
      <Box className={styles.container}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      {/* DESKTOP view: Show both sidebar and chat */}
      {!isMobileView && (
        <>
          <Sidebar users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          <Chat
            selectedUser={selectedUser}
            messages={messages}
            setMessages={setMessages}
            isMobileView={false}
            setSelectedUser={setSelectedUser}
          />
        </>
      )}

      {/* MOBILE view */}
      {isMobileView && !selectedUser && (
        <Sidebar users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      )}

      {isMobileView && selectedUser && (
        <Chat
          selectedUser={selectedUser}
          messages={messages}
          setMessages={setMessages}
          isMobileView={true}
          setSelectedUser={setSelectedUser}
        />
      )}
    </Box>
  );
};

export default HomeScreen;
