import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { ChatMessage } from "../../../types/types";
import { getSocket } from "../../../utils/socket";
import BubbleTypingIndicator from "../../Animations/BubbleTypingIndicator/BubbleTypingIndicator";
interface User {
  senderId: string;
}
interface ChatBodyProps {
  filteredMessages: ChatMessage[];
  myUserId: string;
}

const ChatBody: React.FC<ChatBodyProps> = ({ filteredMessages, myUserId }) => {
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("typing", (senderId: User) => {
      //   console.log(`🟢 Typing event from: ${JSON.stringify(senderId)}, I'm: ${JSON.stringify(myUserId)}`);
      // reciver and sender are different users
      if (senderId.senderId !== myUserId) {
        setTypingUser(senderId);
      }
    });

    socket.on("stoppedTyping", (senderId: User) => {

      //typing user and senderId are same
      if (typingUser?.senderId === senderId.senderId) {
        console.log(`✅ Clearing typing indicator for: ${JSON.stringify(senderId)}`);
        setTypingUser(null);
      } else {
        console.log(`⏭️ No match. Typing indicator remains for: ${JSON.stringify(typingUser)}`);
      }
    });


    return () => {
      socket.off("typing");
      socket.off("stoppedTyping");
    };
  }, [myUserId, typingUser]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredMessages]);

  const isMe = (userId: string) => userId === myUserId;

  return (
    <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
      {filteredMessages.map((msg) => {
        const isMeMessage = isMe(msg.sender);
        console.log(`📩 Rendering message from ${msg.sender} (${isMeMessage ? "me" : "them"}): ${msg.content}`);

        return (
          <Box
            key={msg.id}
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: isMeMessage ? "flex-end" : "flex-start",
            }}
            
          >
            <Box
              sx={{
                maxWidth: "70%",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isMeMessage ? "#B794F4" : "#63b3ed",
                boxShadow: 1,
              }}
            >
              {msg.type === "text" && (
                <Typography variant="body1">{msg.content}</Typography>
              )}
              {msg.type === "image" && (
                <img
                  src={msg.content}
                  alt="Image"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              )}
              {msg.type === "video" && (
                <video controls width="100%">
                  <source src={msg.content} type="video/mp4" />
                </video>
              )}
              {msg.type === "audio" && (
                <audio controls>
                  <source src={msg.content} type="audio/mpeg" />
                </audio>
              )}
            </Box>
          </Box>
        );
      })}

      {/* Typing Indicator */}
      {typingUser && typingUser.senderId !== myUserId && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
          <BubbleTypingIndicator />
        </Box>
      )}

      <div ref={chatEndRef} />
    </Box>
  );
};

export default ChatBody;
