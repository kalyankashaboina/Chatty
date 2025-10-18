// src/components/Auth/Login/LoginPage.tsx

import React, { useState } from 'react';
import { TextField, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/slices/authSlice';
import { initializeSocket } from '../../../utils/socket';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation, useLoginWithGoogleMutation } from '@/store/slices/api';

interface LoginProps {
  onSuccess: () => void;
  // --- PROPS FOR LIFTED STATE ---
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, error, setError, loading, setLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Local state for error and loading is now removed

  const [login] = useLoginMutation();
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Email/Password login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: data.user }));
      const socket = initializeSocket();
      if (!socket) throw new Error('Socket initialization failed');
      onSuccess();
      navigate('/home');
    } catch (err: any) {
      setError(err?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async (googleToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginWithGoogle({ googleToken }).unwrap();
      dispatch(setCredentials({ user: data.user }));
      const socket = initializeSocket();
      if (!socket) throw new Error('Socket initialization failed');
      onSuccess();
      navigate('/home');
    } catch (err: any) {
      setError(err?.data?.message || err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // Edge Case: Disable button if fields are empty for better UX
  const isFormInvalid = !email || password.length < 6;

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Login</Typography>

      <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {error && <Typography color="error">{error}</Typography>}

      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: '#7c3aed', color: '#fff' }}
        onClick={handleLogin}
        disabled={loading || isFormInvalid}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <Typography textAlign="center" mt={1}>
        OR
      </Typography>

      <GoogleLogin
        onSuccess={res => {
          if (res.credential) {
            handleGoogleLogin(res.credential);
          } else {
            setError('Google login failed: no credential returned');
          }
        }}
        onError={() => setError('Google login failed')}
      />
    </Stack>
  );
};

export default Login;
