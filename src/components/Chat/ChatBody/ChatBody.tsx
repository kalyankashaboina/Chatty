// src/components/Chat/ChatBody/ChatBody.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { ChatMessage } from "../../../../types";


interface ChatBodyProps {
  filteredMessages: ChatMessage[];
  myUserId: string;
}

const ChatBody: React.FC<ChatBodyProps> = ({ filteredMessages, myUserId }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
      {filteredMessages.map((msg) => {
        const isMe = msg.sender === myUserId;

        return (
          <Box
            key={msg.id}
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: isMe ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isMe ? "#B794F4" : "#63b3ed",
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
                  Your browser does not support the video tag.
                </video>
              )}

              {msg.type === "audio" && (
                <audio controls>
                  <source src={msg.content} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChatBody;
