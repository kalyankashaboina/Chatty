import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import styles from './HomeScreen.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Chat from '../Chat/Chat';
import { User } from '../../types/types';
import { initializeSocket } from '../../utils/socket';
import { RootState } from '@/store';
import { useFetchMessagesQuery, useFetchUsersQuery } from '@/store/slices/api';

const HomeScreen: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth <= 500);

  // --- Data Fetching (Corrected for Cookie Auth) ---

  // 1. Fetch the list of users for the sidebar. This is perfect.
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useFetchUsersQuery(undefined);

  // 2. Get the LOGGED IN USER from the Redux store.
  // This is now our proof that the user is authenticated.
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const selectedUserId = selectedUser?.id;

  // 3. Fetch messages. The 'skip' condition now depends on 'loggedInUser'.
  const { data: messagesData, isLoading: isMessagesLoading } = useFetchMessagesQuery(
    { selectedUserId: selectedUserId! },
    {
      // This query will only run if the user is logged in AND a chat is selected.
      skip: !loggedInUser || !selectedUserId,
    }
  );

  // --- Side Effects ---

  // Listener for mobile view resizing
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize socket connection once the user object is available
  useEffect(() => {
    if (loggedInUser) {
      console.log('User is logged in, initializing socket...');
      initializeSocket();
    }
  }, [loggedInUser]);

  // --- Render Logic ---

  if (isUsersLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isUsersError) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}
      >
        <Typography color="error">Failed to load users.</Typography>
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
        />
      )}
    </Box>
  );
};

export default HomeScreen;
