import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, CircularProgress } from '@mui/material';
import { removeSession } from '../models/Sessions';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Get the registration number before clearing
    const regNumber = localStorage.getItem('regNumber');
    
    // Remove session if there is one
    if (regNumber) {
      removeSession(regNumber);
    }
    
    // Clear localStorage
    localStorage.removeItem('regNumber');
    localStorage.removeItem('lastLoginTime');
    
    // Redirect to login page
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, [router]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)',
    }}>
      <CircularProgress size={40} sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ color: '#3f51b5' }}>
        Logging out...
      </Typography>
    </Box>
  );
} 