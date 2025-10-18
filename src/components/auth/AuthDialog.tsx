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

  // --- LIFTED STATE ---
  // We will manage error and loading state here in the parent
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // When switching tabs, clear any previous errors for a better user experience
  const handleTabSwitch = (newTab: 'login' | 'register') => {
    if (tab !== newTab) {
      setError(null); // Clear error on tab switch
      setTab(newTab);
    }
  };

  const handleSuccess = () => {
    setError(null); // Clear any errors on success
    onClose(); // Close the dialog
  };

  // If the modal is closed, reset the state
  const handleClose = () => {
    setError(null);
    setTab('login'); // Reset to default tab
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="auth-dialog">
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

        {/* Pass the state and setters down as props */}
        {tab === 'login' && (
          <Login
            onSuccess={handleSuccess}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        {tab === 'register' && (
          <Register
            onSuccess={handleSuccess}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </Paper>
    </Modal>
  );
};

export default AuthDialog;
