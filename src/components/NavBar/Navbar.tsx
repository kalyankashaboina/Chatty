// src/components/Navbar.tsx

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as clearAuthAction } from '../../store/slices/authSlice';
import { useLogoutMutation } from '@/store/slices/api';
import { disconnectSocket } from '@/utils/socket';

interface NavbarProps {
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
}

const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 4. Initialize the mutation hook. It gives you a trigger function.
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(clearAuthAction());
      disconnectSocket();
      navigate('/');
    } catch (error: any) {
      console.error('Logout error', error);
      alert(error.data?.message || 'Logout failed. Please try again.');
    }
  };

  return (
    <AppBar position="static" className="MuiAppBar-root" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" className="chatty-logo">
          💬 Chatty
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
