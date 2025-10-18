import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import { ChatMessage, User } from '../../types/types';
import ChatBody from './ChatBody/ChatBody';
import ChatInput from './ChatInput/ChatInput';
import ChatHeader from './ChatHeader/ChatHeader';
import { getSocket } from '../../utils/socket';

// The props interface is now simpler and expects the `sendMessage` function
interface ChatProps {
  selectedUser: User | null;
  messages: ChatMessage[];
  isMobileView: boolean;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoadingMessages: boolean;
  sendMessage: (recipientId: string, content: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  selectedUser,
  messages,
  // isMobileView,
  setSelectedUser,
  isLoadingMessages,
  sendMessage, // Get the sendMessage function from props
}) => {
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myUserId = user?.id || '';

  // Dialog state for feature announcements
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  // This function is now very simple: it just calls the function from props.
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    // Call the function passed down from HomeScreen
    sendMessage(selectedUser.id, newMessage);

    // Clear the input field
    setNewMessage('');
  };

  // The typing handlers still emit directly as they are UI-specific
  const handleTyping = () => {
    const socket = getSocket();
    if (socket && selectedUser) {
      socket.emit('typing', { recipientId: selectedUser.id });
    }
  };

  const handleStoppedTyping = () => {
    const socket = getSocket();
    if (socket && selectedUser) {
      socket.emit('stoppedTyping', { recipientId: selectedUser.id });
    }
  };

  const handleCall = (type: 'audio' | 'video') => {
    setDialogMessage(
      `The ${type} call feature is currently unavailable. This feature will be available soon!`
    );
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  // Fallback UI when no user is selected
  if (!selectedUser) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#888',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          👋 Welcome!
        </Typography>
        <Typography>Select a user from the left to start chatting 💬</Typography>
      </Box>
    );
  }

  // Main component JSX
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleCall={handleCall}
      />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '8px 16px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <ChatBody
          filteredMessages={messages}
          myUserId={myUserId}
          isLoadingMessages={isLoadingMessages}
        />
      </Box>
      <Box
        sx={{
          padding: '8px 16px',
          borderTop: '1px solid #ddd',
          backgroundColor: '#fff',
          flexShrink: 0,
        }}
      >
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedUserId={selectedUser.id}
          handleSendMessage={handleSendMessage}
          handleTyping={handleTyping}
          handleStoppedTyping={handleStoppedTyping}
          isSending={false} // This is now false as the old loading state is gone
        />
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            backgroundColor: '#8a2be2',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Feature Not Available
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f3f4f6', padding: '20px', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontSize: '16px', color: '#333' }}>
            {dialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{
              backgroundColor: '#8a2be2',
              color: '#fff',
              '&:hover': { backgroundColor: '#7a1ab1' },
              padding: '8px 16px',
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
