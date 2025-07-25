import React, { useEffect, useRef, useState } from 'react';
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
import axiosInstance from '../../utils/axios';

interface ChatProps {
  selectedUser: User | null;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isMobileView?: boolean;
  setSelectedUser?: React.Dispatch<React.SetStateAction<User | null>>;
}

const Chat: React.FC<ChatProps> = ({ selectedUser, messages, setMessages, setSelectedUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myUserId = user?.id || '';
  const messageListenerAttached = useRef(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('❌ No socket connection available.');
      return;
    }

    console.log('🔌 Socket initialized:', socket.id);

    if (messageListenerAttached.current) return;

    const messageHandler = (message: any) => {
      console.log('📥 Received message:', message);
      const isMe = message.senderId === myUserId;

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: message.content,
          type: message.type,
          sender: isMe ? myUserId : message.senderId,
          receiver: isMe ? selectedUser?.id || '' : myUserId,
        },
      ]);
    };

    socket.on('message', messageHandler);
    messageListenerAttached.current = true;

    // Socket connection logs
    if (socket.connected) {
      console.log('🔌 Socket connected:', socket.id);
    } else {
      socket.on('connect', () => console.log('🔌 Socket connected:', socket.id));
      socket.on('disconnect', () => console.log('❌ Socket disconnected'));
    }

    return () => {
      socket.off('message', messageHandler);
    };
  }, [myUserId, selectedUser?.id, setMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await axiosInstance.get(
          `/chat/last20?userId=${myUserId}&selectedUserId=${selectedUser.id}`
        );
        console.log('Fetched messages:', res.data);
        if (Array.isArray(res.data)) setMessages(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
      }
    };

    fetchMessages();
  }, [selectedUser?.id, myUserId, setMessages]);

  const handleSendMessage = () => {
    const socket = getSocket();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const messagePayload = {
      recipientId: selectedUser.id,
      content: newMessage,
      type: 'text',
    };

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newMessage,
        type: 'text',
        sender: myUserId,
        receiver: selectedUser.id,
      },
    ]);

    socket.emit('sendMessage', messagePayload);
    setNewMessage('');
    console.log('📤 Sent message:', messagePayload);
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket && selectedUser) {
      console.log("Emitting 'typing' event for user:", selectedUser.id);
      socket.emit('typing', { recipientId: selectedUser.id });
    }
  };

  const handleStoppedTyping = () => {
    const socket = getSocket();
    if (socket && selectedUser) {
      console.log("Emitting 'stoppedTyping' event for user:", selectedUser.id);
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
      {/* Chat Header */}
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleCall={handleCall}
      />

      {/* Chat Body */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '8px 16px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <ChatBody filteredMessages={messages} myUserId={myUserId} />
      </Box>

      {/* Chat Input */}
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
        />
      </Box>

      {/* Dialog for unavailable features */}
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
        <DialogContent
          sx={{
            backgroundColor: '#f3f4f6',
            padding: '20px',
            textAlign: 'center',
          }}
        >
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
