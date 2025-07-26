// src/components/Chat/ChatHeader.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, IconButton, Box } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { User } from '../../../types/types';


// Updated props to match what Chat.tsx is sending
interface ChatHeaderProps {
  selectedUser: User | null;
  onStartCall: (type: 'audio' | 'video') => void;
  // This prop is optional, used for mobile navigation
  setSelectedUser?: React.Dispatch<React.SetStateAction<User | null>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, onStartCall, setSelectedUser }) => {
  
  // This function allows the user to go back to the user list on mobile
  const handleBackClick = () => {
    if (setSelectedUser) {
      setSelectedUser(null);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Responsive Back Arrow: Only shows on small screens (mobile) */}
        <IconButton
          edge="start"
          onClick={handleBackClick}
          sx={{
            mr: 1,
            // Uses MUI's responsive breakpoints
            display: { xs: 'inline-flex', md: 'none' }, 
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Display user info and call buttons ONLY if a user is selected */}
        {selectedUser ? (
          <>
            <Avatar src={selectedUser.profilePic} sx={{ mr: 2 }}>
              {/* Fallback to the first letter of the username if no avatar */}
              {selectedUser.username.charAt(0)}
            </Avatar>
            
            {/* This Box grows to push the call buttons to the right */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" noWrap>
                {selectedUser.username}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: selectedUser.isOnline ? 'green' : 'text.secondary' }}
              >
                {selectedUser.isOnline ? 'Online' : 'Offline'}
              </Typography>
            </Box>

            {/* Call Buttons */}
            <IconButton color="primary" onClick={() => onStartCall('audio')}>
              <CallIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => onStartCall('video')}>
              <VideocamIcon />
            </IconButton>
          </>
        ) : (
          // Placeholder text when no user is selected
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Select a conversation
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;