import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
interface NavbarProps {
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
}
const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout service

      navigate('/'); // Redirect to login after logout
    } catch (error: any) {
      console.error('Logout error', error);
      alert('Logout failed. Please try again.');
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
