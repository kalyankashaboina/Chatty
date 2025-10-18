import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import styles from './HomeScreen.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Chat from '../Chat/Chat';
// 1. ✅ REMOVED unused 'ChatMessage' import to clean up warnings
import { User } from '../../types/types';
import { initializeSocket } from '../../utils/socket';
import { RootState } from '@/store';
import { useFetchMessagesQuery, useFetchUsersQuery } from '@/store/slices/api';
// 2. ✅ IMPORTED the hook correctly
import useSocketEvents from '../../hooks/useSocketEvents';

const HomeScreen: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth <= 500);

  // --- State and Data ---
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const myUserId = loggedInUser?.id || '';
  const selectedUserId = selectedUser?.id;

  // --- Data Fetching from RTK Query ---
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useFetchUsersQuery(undefined);

  const { data: messagesData, isLoading: isMessagesLoading } = useFetchMessagesQuery(
    { selectedUserId: selectedUserId! },
    { skip: !loggedInUser || !selectedUserId }
  );

  const { sendMessage } = useSocketEvents({ myUserId, selectedUserId });

  // --- Side Effects ---
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      console.log('User is logged in, initializing socket...');
      initializeSocket();
    }
  }, [loggedInUser]);

  if (isUsersLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isUsersError || !usersResponse) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}
      >
        <Typography color="error">Failed to load users. Please refresh the page.</Typography>
      </Box>
    );
  }

  const users: User[] =
    (usersResponse as any)?.users?.map(
      (user: { _id: string; username: string; isOnline?: boolean }) => ({
        id: user._id,
        username: user.username,
        isOnline: user.isOnline,
      })
    ) || [];

  return (
    <Box className={styles.container}>
      {!isMobileView ? (
        // Desktop View
        <>
          <Sidebar users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          <Chat
            selectedUser={selectedUser}
            messages={messagesData?.messages || []}
            isMobileView={false}
            setSelectedUser={setSelectedUser}
            isLoadingMessages={isMessagesLoading}
            sendMessage={sendMessage}
          />
        </>
      ) : !selectedUser ? (
        // Mobile View - User List
        <Sidebar users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      ) : (
        // Mobile View - Chat Window
        <Chat
          selectedUser={selectedUser}
          messages={messagesData?.messages || []}
          isMobileView={true}
          setSelectedUser={setSelectedUser}
          isLoadingMessages={isMessagesLoading}
          sendMessage={sendMessage}
        />
      )}
    </Box>
  );
};

export default HomeScreen;
