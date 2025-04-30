import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { VideoCall, Call, ArrowBack } from "@mui/icons-material";
import { User } from "../../../types/types";
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  selectedUser: User | null;
  setSelectedUser?: React.Dispatch<React.SetStateAction<User | null>>;
  handleCall: (type: "audio" | "video") => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, setSelectedUser, handleCall }) => {
  const handleBackClick = () => {
    if (setSelectedUser) {
      setSelectedUser(null);
    }
  };



  return (
    <Box className={styles.chatHeader}>
      {/* Left Section: Back arrow (mobile only) + Username */}
      <Box className={styles.leftSection}>
        <IconButton onClick={handleBackClick} className={styles.backArrow}>
          <ArrowBack sx={{ color: "#ffffff" }} />
        </IconButton>
        <Typography className={styles.username}>
          {selectedUser ? selectedUser.username : "Select a user"}
        </Typography>
      </Box>

      {/* Right Section: Call Buttons */}
      <Box className={styles.callButtons}>
        <IconButton onClick={() => handleCall("audio")}>
          <Call sx={{ color: "#ffffff" }} />
        </IconButton>
        <IconButton onClick={() => handleCall("video")}>
          <VideoCall sx={{ color: "#ffffff" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatHeader;
