import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
} from '@mui/material';
import AdminAnalytics from '../components/AdminAnalytics';
import { QuizResultWithDate } from '../types/quiz';
import { calculateAnalytics, formatDate } from '../utils/analytics';
import { getStudentName } from '../models/Students';
import { getSessions } from '../models/Sessions';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.text.primary,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const ActionCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    '& .action-icon': {
      transform: 'scale(1.1)',
    },
  },
}));

const ActionIconWrapper = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
}));

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResultWithDate[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeSessions, setActiveSessions] = useState(0);
  
  const open = Boolean(anchorEl);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const regNumber = localStorage.getItem('regNumber');
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    const currentTime = new Date().getTime();

    // Check if the login has expired (30 minutes)
    if (lastLoginTime && currentTime - parseInt(lastLoginTime) > 30 * 60 * 1000) {
      localStorage.removeItem('regNumber');
      localStorage.removeItem('lastLoginTime');
      router.push('/');
      return;
    }

    if (!regNumber) {
      router.push('/');
      return;
    }

    if (regNumber !== 'RA2411043010075') {
      router.push('/quiz');
      return;
    }

    // Update last login time
    localStorage.setItem('lastLoginTime', currentTime.toString());
    setIsAdmin(true);
    loadQuizResults();
    
    // Get active sessions count
    const sessions = getSessions();
    setActiveSessions(sessions.length);
  }, [router]);

  const loadQuizResults = () => {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        const resultsWithDate = parsedResults.map((result: any) => ({
          ...result,
          date: new Date(result.timestamp).toISOString().split('T')[0]
        }));
        setQuizResults(resultsWithDate);
      } catch (error) {
        console.error('Error loading quiz results:', error);
      }
    }
  };

  const clearLeaderboard = () => {
    if (confirm('Are you sure you want to clear the leaderboard? This action cannot be undone.')) {
      localStorage.removeItem('quizResults');
      setQuizResults([]);
      alert('Leaderboard cleared successfully!');
    }
  };

  const manageStudents = () => {
    router.push('/admin/students');
  };

  const manageQuestions = () => {
    router.push('/admin/questions');
  };

  if (!isAdmin) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)'
      }}>
        <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 600 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  const analytics = calculateAnalytics(quizResults);

  return (
    <>
      <Head>
        <title>Admin Panel - C++ Quiz</title>
      </Head>
      
      {/* App Bar */}
      <StyledAppBar position="sticky">
        <Toolbar>
          <MenuIconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </MenuIconButton>
          
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DashboardIcon color="primary" />
            C++ Quiz Admin
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Active Sessions">
              <Chip
                label={`${activeSessions} active ${activeSessions === 1 ? 'session' : 'sessions'}`}
                color="primary"
                size="small"
                variant="outlined"
                sx={{ mr: 2 }}
              />
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={quizResults.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Admin Account">
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                </StyledBadge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem onClick={() => router.push('/admin')}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => router.push('/admin/students')}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Students</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => router.push('/admin/questions')}>
          <ListItemIcon>
            <QuizIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Questions</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => router.push('/logout')}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      <Box sx={{ 
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)',
        py: 4
      }}>
        <Container maxWidth="xl">
          {/* Dashboard Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your quiz application, students, and view analytics
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <ActionCard>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '200px' }}>
                  <ActionIconWrapper sx={{ bgcolor: alpha('#3f51b5', 0.1) }}>
                    <QuizIcon className="action-icon" sx={{ color: '#3f51b5', fontSize: 30, transition: 'all 0.3s ease' }} />
                  </ActionIconWrapper>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                    Question Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto', flex: 1 }}>
                    Manage quiz questions, add new ones, or modify existing questions.
                  </Typography>
                  <ActionButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={manageQuestions}
                    startIcon={<QuizIcon />}
                  >
                    Manage Questions
                  </ActionButton>
                </CardContent>
              </ActionCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ActionCard>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '200px' }}>
                  <ActionIconWrapper sx={{ bgcolor: alpha('#9c27b0', 0.1) }}>
                    <PeopleIcon className="action-icon" sx={{ color: '#9c27b0', fontSize: 30, transition: 'all 0.3s ease' }} />
                  </ActionIconWrapper>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                    Student Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto', flex: 1 }}>
                    Add, remove, or modify student information and access.
                  </Typography>
                  <ActionButton
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={manageStudents}
                    startIcon={<PeopleIcon />}
                  >
                    Manage Students
                  </ActionButton>
                </CardContent>
              </ActionCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ActionCard>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '200px' }}>
                  <ActionIconWrapper sx={{ bgcolor: alpha('#f44336', 0.1) }}>
                    <DeleteIcon className="action-icon" sx={{ color: '#f44336', fontSize: 30, transition: 'all 0.3s ease' }} />
                  </ActionIconWrapper>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                    Leaderboard Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto', flex: 1 }}>
                    Clear leaderboard data and manage quiz results.
                  </Typography>
                  <ActionButton
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={clearLeaderboard}
                    startIcon={<DeleteIcon />}
                  >
                    Clear Leaderboard
                  </ActionButton>
                </CardContent>
              </ActionCard>
            </Grid>
          </Grid>

          {/* Analytics Dashboard */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 3 }}>
              Analytics Overview
            </Typography>
          </Box>
          <AdminAnalytics analytics={analytics} />
          
          {/* Quick Links */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => router.push('/quiz')}
              startIcon={<QuizIcon />}
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              View Quiz
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => router.push('/leaderboard')}
              startIcon={<LeaderboardIcon />}
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              View Leaderboard
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => router.push('/logout')}
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
} 