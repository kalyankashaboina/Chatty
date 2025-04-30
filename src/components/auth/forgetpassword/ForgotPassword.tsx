import React, { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation after success

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");  // For success or error messages
  const [error, setError] = useState<string>("");      // For error handling
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage("");  // Clear any previous messages
    setError("");    // Clear any previous errors

    // Temporarily show that the feature is under development
    setTimeout(() => {
      setMessage("This feature is under development. Please check back later.");
      setLoading(false);
    }, 2000); // Simulate a delay (like an actual request)
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      
      {/* Email input */}
      <TextField
        fullWidth
        label="Email Address"
        margin="normal"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}  // Disable input while loading
      />

      {/* Display error or success message */}
      {error && <Typography color="error" mt={2}>{error}</Typography>}
      {message && <Typography color="primary" mt={2}>{message}</Typography>}

      {/* Submit button */}
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, backgroundColor: "#7c3aed", color: "#ffffff" }}
        onClick={handleForgotPassword}
        disabled={loading}  // Disable button while loading
      >
        {loading ? <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> : "Send Reset Link"}
      </Button>

      {/* Option to go back to login */}
      <Box mt={2} textAlign="center">
        <Button onClick={() => navigate("/")}>Back to Login</Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
