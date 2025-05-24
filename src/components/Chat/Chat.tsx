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
import { fetchPaginatedMessages } from "../../services/chatServices";
import useInfiniteScroll from "../../hooks/InfinateScrool";

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
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // ✅ new

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // Load older messages
  const loadOlderMessages = async () => {
    if (!selectedUser || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const prevScrollHeight = chatContainer.scrollHeight;

    console.log("⬆️ [PAGINATION] Loading older messages");
    console.log("📤 [PAGINATION] Sending to API:", {
      senderId: myUserId,
      receiverId: selectedUser.id,
      page: page + 1,
      limit: 20,
    });

    try {
      const data = await fetchPaginatedMessages(myUserId, selectedUser.id, page + 1, 20);

      if (Array.isArray(data.messages) && data.messages.length > 0) {
        setMessages((prev) => [...data.messages, ...prev]);
        setPage((prev) => prev + 1);
        setHasMore(messages.length + data.messages.length < data.total);

        requestAnimationFrame(() => {
          const newScrollHeight = chatContainer.scrollHeight;
          const diff = newScrollHeight - prevScrollHeight;
          chatContainer.scrollTop += diff;
        });
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ [PAGINATION] Failed to fetch older messages:", err);
    } finally {
      setIsLoadingMore(false); // ✅ ensure this always resets
    }
  };

  useInfiniteScroll({
    containerRef: chatContainerRef,
    isWindow: false,
    threshold: 20,
    throttleMs: 500,
    onTopReach: () => {
      if (!initialScrollDone) return;
      console.log("⬆️ Top reached — trying to load more messages");
      loadOlderMessages();
    },
    onBottomReach: () => {
      console.log("🔚 Reached bottom — current view is latest");
    },
  });

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      console.log("📤 [INIT] Sending to API:", {
        senderId: myUserId,
        receiverId: selectedUser.id,
        page: 1,
        limit: 20,
      });

      try {
        const data = await fetchPaginatedMessages(myUserId, selectedUser.id, 1, 20);
        console.log("📥 Initial fetch:", data);

        setMessages(data.messages);
        setPage(1);
        setHasMore(data.messages.length < data.total);

        // Scroll to bottom after initial load
        setTimeout(() => {
          requestAnimationFrame(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              console.log("🔽 Scrolled to bottom after initial load");
              setInitialScrollDone(true);
            }
          });
        }, 100);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      }
    };

    setInitialScrollDone(false);
    fetchMessages();
  }, [selectedUser?.id]);

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100dvh" }}>
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleCall={() => {
          setDialogOpen(true);
          setDialogMessage("Call feature is not available yet");
        }}
      />

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

      <Box
        sx={{
          padding: "8px 16px",
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      >
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedUserId={selectedUser?.id || ""}
          handleSendMessage={() => {
            /* your send message code here */
          }}
          handleTyping={() => {
            /* your typing handler */
          }}
          handleStoppedTyping={() => {
            /* your stopped typing handler */
          }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
            onClick={() => setDialogOpen(false)}
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
