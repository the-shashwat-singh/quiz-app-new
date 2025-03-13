import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginForm from '../components/LoginForm';
import { getStudentName } from '../models/Students';
import CodeIcon from '@mui/icons-material/Code';
import { createSession, validateSession, getSessions, removeSession, cleanupSessions } from '../models/Sessions';
import Footer from '../components/Footer';

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(4),
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(63, 81, 181, 0.1)',
  borderRadius: '12px',
  width: '48px',
  height: '48px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
  color: 'white',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(63, 81, 181, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-30px',
    left: '-30px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

export default function HomePage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{regNumber: string, password: string} | null>(null);
  const [notification, setNotification] = useState<{message: string, severity: 'success' | 'error' | 'info' | 'warning'} | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Clean up expired sessions
    cleanupSessions();
    
    // Check if the logout parameter is present in the URL
    if (router.query.logout === 'true') {
      // Clear localStorage to force logout
      const regNumber = localStorage.getItem('regNumber');
      if (regNumber) {
        removeSession(regNumber);
      }
      
      localStorage.removeItem('regNumber');
      localStorage.removeItem('lastLoginTime');
      
      // Show notification
      setNotification({
        message: 'You have been successfully logged out',
        severity: 'success'
      });
      
      // Remove the logout parameter from the URL
      router.replace('/', undefined, { shallow: true });
      setLoading(false);
      return;
    }
    
    // Check if user is already logged in
    const regNumber = localStorage.getItem('regNumber');
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    const currentTime = Date.now();

    // If there's no regNumber or the session has expired (30 minutes), show login page
    if (!regNumber || !lastLoginTime || (currentTime - parseInt(lastLoginTime)) > 30 * 60 * 1000) {
      localStorage.removeItem('regNumber');
      localStorage.removeItem('lastLoginTime');
      setLoading(false);
      return;
    }

    // Validate the session
    if (validateSession(regNumber)) {
      // Update last login time
      localStorage.setItem('lastLoginTime', currentTime.toString());
      
      // Only redirect if we're not already on the login page
      if (router.pathname === '/') {
        if (regNumber === 'RA2411043010075') {
          router.push('/admin');
        } else {
          router.push('/quiz');
        }
      }
    } else {
      // Session is invalid, force logout
      localStorage.removeItem('regNumber');
      localStorage.removeItem('lastLoginTime');
      setNotification({
        message: 'Your session has expired or is invalid. Please log in again.',
        severity: 'warning'
      });
      setLoading(false);
    }
  }, [router]);

  const handleLogin = (regNumber: string, password: string) => {
    // Admin authentication
    if (regNumber === 'RA2411043010075') {
      if (password === '110604') {
        // Create a new session
        createSession(regNumber);
        localStorage.setItem('regNumber', regNumber);
        localStorage.setItem('lastLoginTime', Date.now().toString());
        router.push('/admin');
      } else {
        setError('Invalid admin password');
      }
      return;
    }

    // Student authentication
    const studentName = getStudentName(regNumber);
    if (!studentName) {
      setError('Invalid registration number');
      return;
    }

    // For students, password should match their registration number
    if (password !== regNumber) {
      setError('Invalid password');
      return;
    }

    // Check if this student is already logged in on another device
    const sessions = getSessions();
    const existingSession = sessions.find(s => s.regNumber === regNumber);
    
    if (existingSession) {
      // Store the pending login and show the dialog
      setPendingLogin({ regNumber, password });
      setShowSessionDialog(true);
    } else {
      // No existing session, proceed with login
      completeLogin(regNumber);
    }
  };

  const completeLogin = (regNumber: string) => {
    // Create a new session
    createSession(regNumber);
    
    // Store registration number and redirect to quiz
    localStorage.setItem('regNumber', regNumber);
    localStorage.setItem('lastLoginTime', Date.now().toString());
    router.push('/quiz');
  };

  const handleForceLogin = () => {
    if (pendingLogin) {
      completeLogin(pendingLogin.regNumber);
    }
    setShowSessionDialog(false);
  };

  const handleCancelLogin = () => {
    setPendingLogin(null);
    setShowSessionDialog(false);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)',
      }}>
        <Typography variant="h6" sx={{ color: '#3f51b5' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>C++ Quiz - Login</title>
        <meta name="description" content="Test your C++ programming skills with our interactive quiz" />
      </Head>
      <GradientBackground>
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <WelcomeCard>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <CodeIcon sx={{ fontSize: 40, mr: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        C++ Quiz
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.2 }}>
                      Test Your C++ Programming Skills
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, maxWidth: '90%' }}>
                      Challenge yourself with our comprehensive C++ quiz designed to test your knowledge and improve your programming skills.
                    </Typography>
                    
                    <Box sx={{ mt: 4 }}>
                      <FeatureItem>
                        <FeatureIcon>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#3f51b5' }}>1</Typography>
                          </Box>
                        </FeatureIcon>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Interactive Questions
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Engage with a variety of question formats to test your knowledge
                          </Typography>
                        </Box>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <FeatureIcon>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#3f51b5' }}>2</Typography>
                          </Box>
                        </FeatureIcon>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Real-time Feedback
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Get immediate results and explanations for each question
                          </Typography>
                        </Box>
                      </FeatureItem>
                      
                      <FeatureItem sx={{ mb: 0 }}>
                        <FeatureIcon>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#3f51b5' }}>3</Typography>
                          </Box>
                        </FeatureIcon>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Performance Tracking
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Monitor your progress and compare with other students
                          </Typography>
                        </Box>
                      </FeatureItem>
                    </Box>
                  </Box>
                </WelcomeCard>
              </Grid>
            )}
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: '450px' }}>
                {isMobile && (
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 800, 
                      color: '#2c3e50',
                      mb: 2
                    }}>
                      C++ Quiz
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#4a5568',
                      mb: 4
                    }}>
                      Test your C++ programming skills
                    </Typography>
                  </Box>
                )}
                <LoginForm error={error} onLogin={handleLogin} />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </GradientBackground>

      {/* Session Dialog */}
      <Dialog
        open={showSessionDialog}
        onClose={handleCancelLogin}
        aria-labelledby="session-dialog-title"
        aria-describedby="session-dialog-description"
      >
        <DialogTitle id="session-dialog-title" sx={{ 
          background: 'linear-gradient(90deg, #3f51b5, #5c6bc0)',
          color: 'white',
          fontWeight: 600
        }}>
          Active Session Detected
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="session-dialog-description">
            You already have an active session on another device. Continuing will log you out from the other device.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCancelLogin} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleForceLogin} color="primary" variant="contained" autoFocus>
            Continue Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={!!notification} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {notification && (
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
