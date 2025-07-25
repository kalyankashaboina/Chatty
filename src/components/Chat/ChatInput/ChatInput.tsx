import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  selectedUserId: string;
  handleTyping: () => void;
  handleStoppedTyping: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleTyping,
  handleStoppedTyping,
}) => {
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNewMessage(inputValue);

    // Log typing change
    console.log('Input changed:', inputValue);

    // Emit typing event when the user starts typing
    console.log("Emitting 'typing' event...");
    handleTyping();

    // Clear the previous timeout and set a new one
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Emit "stoppedTyping" after 2 seconds of inactivity
    setTypingTimeout(
      setTimeout(() => {
        console.log("Emitting 'stoppedTyping' event...");
        handleStoppedTyping();
      }, 2000)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('Sending message:', newMessage);
      handleSendMessage();
    }
  };

  return (
    <Box className={styles.inputArea}>
      <TextField
        className={styles.inputField}
        variant="outlined"
        placeholder="Type a message..."
        value={newMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Button variant="contained" onClick={handleSendMessage}>
        Send
      </Button>
    </Box>
  );
};

export default ChatInput;
