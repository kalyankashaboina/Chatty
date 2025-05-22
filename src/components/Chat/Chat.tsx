import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { ChatMessage, User } from "../../types/types";
import ChatBody from "./ChatBody/ChatBody";
import ChatInput from "./ChatInput/ChatInput";
import ChatHeader from "./ChatHeader/ChatHeader";
import { getSocket } from "../../utils/socket";
import useInfiniteScroll from "../../hooks/infinateScrool";
import { fetchPaginatedMessages } from "../../services/chatServices";

interface ChatProps {
  selectedUser: User | null;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isMobileView?: boolean;
  setSelectedUser?: React.Dispatch<React.SetStateAction<User | null>>;
}

const Chat: React.FC<ChatProps> = ({
  selectedUser,
  messages,
  setMessages,
  setSelectedUser,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const myUserId = user?._id || "";
  const messageListenerAttached = useRef(false);
  const chatContainerRef = useRef<HTMLElement | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // Load older messages
  const loadOlderMessages = async () => {
    if (!selectedUser || !hasMore) return;
  
    const currentScrollPosition = chatContainerRef.current?.scrollTop || 0;
  
    try {
      const data = await fetchPaginatedMessages(myUserId, selectedUser.id, page + 1, 20);
  
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const totalFetched = messages.length + data.messages.length;
  
        setMessages((prev) => [...data.messages, ...prev]);
        setPage((prev) => prev + 1);
        setHasMore(totalFetched < data.total);
  
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = currentScrollPosition + 100;
        }
  
        console.log(`📊 Total fetched after merge: ${totalFetched} / ${data.total}`);
      } else {
        console.log("📭 No new messages, hasMore set to false");
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Failed to load older messages:", err);
    }
  };
  

  // Infinite Scroll Hook
  useInfiniteScroll({
    containerRef: chatContainerRef,
    isWindow: false,
    threshold: 20,
    throttleMs: 500,
    onTopReach: () => {
      console.log("⬆️ Top reached — trying to load more messages");
      loadOlderMessages();
    },
    onBottomReach: () => {
      console.log("🔚 Reached bottom — current view is latest");
    },
  });

  // Socket listener
  useEffect(() => {
    const socket = getSocket();
    if (!socket || messageListenerAttached.current) return;

    socket.on("message", (message) => {
      const isMe = message.senderId === myUserId;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: message.content,
          type: message.type,
          sender: isMe ? myUserId : message.senderId,
          receiver: isMe ? selectedUser?.id || "" : myUserId,
        },
      ]);
    });

    messageListenerAttached.current = true;

    socket.on("connect", () => console.log("🔌 Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
  }, []);

  // Fetch initial messages when user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const data = await fetchPaginatedMessages(myUserId, selectedUser.id, 1, 20);
        console.log("📥 Initial fetch:", data);
        setMessages(data.messages);
        setPage(1);
        setTotalMessages(data.total);
        setHasMore(data.messages.length < data.total);

        // Scroll to bottom after initial load
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            console.log("🔽 Scrolled to bottom after initial load");
          }
        }, 100);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser?.id]);

  // Send message
  const handleSendMessage = () => {
    const socket = getSocket();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const messagePayload = {
      recipientId: selectedUser.id,
      content: newMessage,
      type: "text",
    };

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newMessage,
        type: "text",
        sender: myUserId,
        receiver: selectedUser.id,
      },
    ]);

    socket.emit("sendMessage", messagePayload);
    setNewMessage("");
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket && selectedUser) {
      socket.emit("typing", { recipientId: selectedUser.id });
    }
  };

  const handleStoppedTyping = () => {
    const socket = getSocket();
    if (socket && selectedUser) {
      socket.emit("stoppedTyping", { recipientId: selectedUser.id });
    }
  };

  const handleCall = (type: "audio" | "video") => {
    setDialogMessage(`The ${type} call feature is currently unavailable. This feature will be available soon!`);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  if (!selectedUser) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#888",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>👋 Welcome!</Typography>
        <Typography>Select a user from the left to start chatting 💬</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100dvh" }}>
      <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser} handleCall={handleCall} />

      <Box
        ref={chatContainerRef}
        className="chat-body"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          minHeight: 0,
          padding: "8px 16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <ChatBody filteredMessages={messages} myUserId={myUserId} />
      </Box>

      <Box sx={{ padding: "8px 16px", borderTop: "1px solid #ddd", backgroundColor: "#fff", flexShrink: 0 }}>
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedUserId={selectedUser.id}
          handleSendMessage={handleSendMessage}
          handleTyping={handleTyping}
          handleStoppedTyping={handleStoppedTyping}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle sx={{ backgroundColor: "#8a2be2", color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Feature Not Available
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f3f4f6", padding: "20px", textAlign: "center" }}>
          <Typography variant="body1" sx={{ fontSize: "16px", color: "#333" }}>
            {dialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "20px" }}>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{
              backgroundColor: "#8a2be2",
              color: "#fff",
              "&:hover": { backgroundColor: "#7a1ab1" },
              padding: "8px 16px",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
