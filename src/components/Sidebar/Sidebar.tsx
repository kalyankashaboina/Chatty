import React, { useEffect, useState } from 'react';
import {
  Paper,
  List,
  ListItemButton,
  Typography,
  Stack,
  Box,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import styles from './Sidebar.module.css';
import { FiberManualRecord } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import type { User } from 'src/types/mesagetypes';

interface SidebarProps {
  users: User[];
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({ users, selectedUser, setSelectedUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Only one useEffect for updating --vh custom property
  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      console.log(`Updated --vh to ${vh}px (window.innerHeight = ${window.innerHeight})`);
    };

    updateVh();
    window.addEventListener('resize', updateVh);
    return () => window.removeEventListener('resize', updateVh);
  }, []);

  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Something went wrong while logging out.');
    }
  };

  return (
    <Paper elevation={2} className={styles.sidebar}>
      {/* Sidebar header */}
      <Box className={styles.sidebarHeaderContainer}>
        <Typography variant="h6" className={styles.sidebarHeader}>
          Users
        </Typography>
        <Button className={styles.logoutButton} variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Search */}
      <Box className={styles.searchBox}>
        <TextField
          fullWidth
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Button
        fullWidth
        className={styles.addUserBtn}
        onClick={() => console.log('Add User clicked')}
        variant="contained"
      >
        + Add User
      </Button>

      {/* Scrollable user list wrapper */}
      <Box className={styles.sidebarListWrapper}>
        <List className={styles.sidebarList}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <ListItemButton
                key={user.id}
                selected={user.id === selectedUser?.id}
                onClick={() => setSelectedUser(user)}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: '100%' }}
                  className={styles.singleUser}
                >
                  <Box>
                    <Avatar
                      src={user.profilePic || undefined}
                      alt={user.username}
                      sx={{ width: 40, height: 40, position: 'relative' }}
                    >
                      <FiberManualRecord
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          fontSize: 12,
                          color: user.isOnline ? '#44b700' : 'gray',
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          border: '2px solid white',
                        }}
                      />
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>{user.username}</Typography>
                      <Typography className={styles.time}>Today</Typography>
                    </Box>
                    <Box className={styles.userMessageDetails}>
                      <Typography className={styles.lastMessage}>Last message here</Typography>
                    </Box>
                  </Box>
                </Stack>
              </ListItemButton>
            ))
          ) : (
            <Box p={2}>
              <Typography variant="body2" color="textSecondary">
                No users found
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default Sidebar;
