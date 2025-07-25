import React from 'react';
import { Button, Stack } from '@mui/material';
import styles from './Welcome.module.css'; // Importing the CSS Module

interface WelcomeProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onLogin, onRegister }) => {
  return (
    <main className={styles.chattyContent}>
      {' '}
      {/* Applying styles from module */}
      <h1 className={styles.heading}>Welcome to Chatty 👋</h1>
      <p className={styles.description}>
        Join conversations around the world. Sign in or register to start chatting!
      </p>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary" onClick={onLogin} className={styles.button}>
          Login
        </Button>
        <Button variant="outlined" color="primary" onClick={onRegister} className={styles.button}>
          Register
        </Button>
      </Stack>
    </main>
  );
};

export default Welcome;
