import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { useRegisterMutation } from '@/store/slices/api';

interface RegisterProps {
  onSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [register] = useRegisterMutation();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await register({ username, email, password }).unwrap();

      // Save user + token to Redux state
      dispatch(setCredentials({ user: data.user, token: data.token }));

      onSuccess();
      navigate('/home'); // Redirect after successful registration
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      />
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#7c3aed', color: '#fff' }}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </>
  );
};

export default Register;
