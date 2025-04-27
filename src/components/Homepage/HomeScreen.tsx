import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import styles from "./HomeScreen.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Chat from "../Chat/Chat";
import { User, ChatMessage } from "../../../types";
import { initializeSocket } from "../../utils/socket";
import axiosInstance from "../../utils/axios";
import useSocketEvents from "../../../hooks/useSocketEvents"; // ✅ using the custom hook

type RawUser = {
  _id: string;
  username: string;
  isOnline?: boolean;
  lastMessage?: string;
};

const HomeScreen: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth <= 426);

  // ✅ Resize listener for mobile
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 426);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Initialize socket on token presence
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) initializeSocket();
  }, []);

  // ✅ Fetch users for sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/sidebar");
        const mappedUsers: User[] = response.data.users.map((user: RawUser) => ({
          id: user._id,
          username: user.username,

        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
        console.error('Error fetching users:');
      }
    };

    fetchUsers();
  }, []);

  // ✅ Listen to real-time events (includes recentMessages on user select)
  useSocketEvents({ selectedUser, setUsers, setMessages });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
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
