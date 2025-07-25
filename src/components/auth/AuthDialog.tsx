// src/components/Auth/AuthDialog.tsx
import React, { useState } from 'react';
import { Modal, Paper, Stack, Typography } from '@mui/material';
import Login from './Login/LoginPage';
import Register from './Register/RegisterPage';
import styles from './AuthDialog.module.css';

interface AuthDialogProps {
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  open: boolean;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ onClose, defaultTab = 'login', open }) => {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setTab(tab);
  };

  const handleSuccess = () => {
    onClose(); // Close the dialog when login/register is successful
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="auth-dialog">
      <Paper className={styles.dialog} sx={{ padding: 3 }}>
        <Stack direction="row" justifyContent="space-around" className={styles.tabs}>
          <Typography
            variant="subtitle1"
            className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </Typography>
          <Typography
            variant="subtitle1"
            className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            Register
          </Typography>
        </Stack>

        {tab === 'login' && <Login onSuccess={handleSuccess} />}
        {tab === 'register' && <Register onSuccess={handleSuccess} />}
      </Paper>
    </Modal>
  );
};

export default AuthDialog;
