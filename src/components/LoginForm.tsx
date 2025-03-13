import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  Grow,
  Fade,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '24px',
  background: '#fff',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
  width: '100%',
  maxWidth: '420px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.18)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #3f51b5, #7986cb, #9fa8da, #3f51b5)',
    backgroundSize: '300% 300%',
    animation: `${gradientAnimation} 6s ease infinite`,
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
  borderRadius: '50%',
  width: '70px',
  height: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  marginBottom: theme.spacing(2),
  boxShadow: '0 8px 20px rgba(63, 81, 181, 0.3)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05) rotate(5deg)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 14px',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(90deg, #3f51b5, #5c6bc0)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
    background: 'linear-gradient(90deg, #3949ab, #5c6bc0)',
    transform: 'translateY(-2px)',
  },
}));

const UserTypeButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '10px 16px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  flex: 1,
  transition: 'all 0.2s ease',
}));

interface LoginFormProps {
  onLogin: (regNumber: string, password: string) => void;
  error?: string;
}

export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState<'student' | 'admin'>('student');
  const theme = useTheme();

  // Set admin registration number when admin is selected
  useEffect(() => {
    if (userType === 'admin') {
      setRegNumber('RA2411043010075');
    } else {
      setRegNumber('');
    }
  }, [userType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onLogin(regNumber, password);
      setIsSubmitting(false);
    }, 600);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grow in={true} timeout={800}>
      <StyledPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <LogoBox>
            <Box sx={{ textAlign: 'center' }}>
              <LogoIcon>
                <CodeIcon fontSize="large" />
              </LogoIcon>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#2c3e50', 
                textAlign: 'center',
                letterSpacing: '0.5px',
              }}>
                C++ Quiz Login
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#64748b', 
                mt: 1,
                mb: 3,
              }}>
                Enter your credentials to continue
              </Typography>
              
              {/* User Type Selection */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3,
                p: 0.5,
                borderRadius: '14px',
                bgcolor: 'rgba(0,0,0,0.04)',
              }}>
                <UserTypeButton
                  variant={userType === 'student' ? 'contained' : 'text'}
                  color="primary"
                  onClick={() => setUserType('student')}
                  startIcon={<SchoolIcon />}
                  sx={{
                    bgcolor: userType === 'student' ? 'primary.main' : 'transparent',
                    color: userType === 'student' ? 'white' : 'text.secondary',
                    '&:hover': {
                      bgcolor: userType === 'student' ? 'primary.dark' : 'rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  Student
                </UserTypeButton>
                <UserTypeButton
                  variant={userType === 'admin' ? 'contained' : 'text'}
                  color="primary"
                  onClick={() => setUserType('admin')}
                  startIcon={<PersonOutlineOutlinedIcon />}
                  sx={{
                    bgcolor: userType === 'admin' ? 'primary.main' : 'transparent',
                    color: userType === 'admin' ? 'white' : 'text.secondary',
                    '&:hover': {
                      bgcolor: userType === 'admin' ? 'primary.dark' : 'rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  Admin
                </UserTypeButton>
              </Box>
            </Box>
          </LogoBox>
          
          <Fade in={true} timeout={1000}>
            <Box>
              <StyledTextField
                fullWidth
                label="Registration Number"
                variant="outlined"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                sx={{ mb: 3 }}
                required
                disabled={userType === 'admin'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your registration number"
              />
              
              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: error ? 2 : 3 }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your password"
              />

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '10px',
                    '& .MuiAlert-icon': {
                      color: '#e53e3e',
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <LoginButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </LoginButton>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {userType === 'student' ? 'For students, use your registration number as password' : 'Admin access is restricted'}
                </Typography>
              </Box>
            </Box>
          </Fade>
        </form>
      </StyledPaper>
    </Grow>
  );
} 