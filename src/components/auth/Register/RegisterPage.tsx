// src/components/Auth/Register/RegisterPage.tsx

import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { useRegisterMutation } from '@/store/slices/api';

interface RegisterProps {
  onSuccess: () => void;
  // --- PROPS FOR LIFTED STATE ---
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, error, setError, loading, setLoading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Local state for error and loading is now removed

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ user: data.user }));
      onSuccess();
      navigate('/home');
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !username || !email || password.length < 6;

  return (
    <>
      <Typography variant="h6" mb={2}>
        Register
      </Typography>
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        variant="outlined"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        variant="outlined"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        type="password"
        variant="outlined"
        value={password}
        onChange={e => setPassword(e.target.value)}
        helperText="Password must be at least 6 characters long."
      />
      {error && (
        <Typography color="error" mt={1} mb={2}>
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#7c3aed', color: '#fff' }}
        onClick={handleRegister}
        disabled={loading || isFormInvalid}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </>
  );
};

export default Register;
