import React from "react";
import { Box, TextField, Button } from "@mui/material";
import styles from "./ChatInput.module.css";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
}) => {
  return (
    <Box className={styles.inputArea}>
      <TextField
        className={styles.inputField}
        variant="outlined"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <Button variant="contained" onClick={handleSendMessage}>
        Send
      </Button>
    </Box>
  );
};

export default ChatInput;
