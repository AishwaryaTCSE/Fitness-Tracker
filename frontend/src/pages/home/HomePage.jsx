import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Titan Health
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Redirecting to login...
      </Typography>
      <Box mt={2}>
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default HomePage;
