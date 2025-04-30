import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authService"; // Import register service

interface RegisterProps {
  onSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // To handle error messages
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError(null); // Reset error on every attempt

    try {
      await registerUser(username, email, password); // Call the register service
      alert("Registration successful! You can now log in.");
      onSuccess();
      navigate("/login");
    } catch (err: any) {
      setError(err.message); // Display error message from the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h6" mb={2}>Register</Typography>
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, backgroundColor: "#7c3aed", color: "#ffffff" }}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
    </>
  );
};

export default Register;
