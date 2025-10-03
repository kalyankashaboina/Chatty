import React, { useEffect, useState } from 'react';
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
import { useSendMessageMutation } from '@/store/slices/api';

interface ChatProps {
  selectedUser: User | null;
  messages: ChatMessage[];
  isMobileView: boolean;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoadingMessages: boolean;
}

const Chat: React.FC<ChatProps> = ({
  selectedUser,
  messages,
  setSelectedUser,
  isLoadingMessages,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myUserId = user?.id || '';

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;

    const messageHandler = (message: any) => {
      console.log('Received real-time message from socket:', message);
      // In a production app, you would update the RTK Query cache here
      // to show the new message without a full refetch.
    };

    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
    };
  }, [selectedUser]);

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // The payload is now much simpler.
      // We no longer create or send a `chatId`. The backend handles this logic.
      await sendMessage({
        content: newMessage,
        receiver: selectedUser.id,
        // The 'type' field is also removed, as the backend defaults it to 'text'.
      }).unwrap(); // .unwrap() throws an error on failure

      // SUCCESS! Clear the input field.
      setNewMessage('');

      // RTK Query's `invalidatesTags` will automatically refetch the messages
      // to show the new message you just sent.
    } catch (error) {
      console.error('Failed to send message:', error);
      setDialogMessage('Failed to send the message. Please try again.');
      setDialogOpen(true);
    }
  };

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
        {/* Pass isLoadingMessages to ChatBody to show a spinner if needed */}
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
          isSending={isSendingMessage}
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
