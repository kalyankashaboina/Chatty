import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import styles from './ChatInput.module.css';

// 1. ADD 'isSending' TO THE PROPS INTERFACE
interface ChatInputProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  selectedUserId: string;
  handleTyping: () => void;
  handleStoppedTyping: () => void;
  isSending?: boolean; // Make it optional for safety
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleTyping,
  handleStoppedTyping,
  isSending, // 2. DESTRUCTURE THE NEW PROP
}) => {
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNewMessage(inputValue);

    handleTyping();

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        handleStoppedTyping();
      }, 2000),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent sending on Enter if a message is already being sent
    if (e.key === 'Enter' && !isSending) {
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
        // Disable the input while sending
        disabled={isSending}
      />
      {/* 3. USE THE 'isSending' PROP TO DISABLE THE BUTTON */}
      <Button variant="contained" onClick={handleSendMessage} disabled={isSending}>
        {/* 4. (Optional) Change button text to give user feedback */}
        {isSending ? 'Sending...' : 'Send'}
      </Button>
    </Box>
  );
};

export default ChatInput;
