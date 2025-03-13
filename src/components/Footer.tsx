import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(2, 0),
  marginTop: 'auto',
  width: '100%',
  position: 'relative',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #3f51b5, #6366f1)',
    opacity: 0.1
  }
}));

export default function Footer() {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 1
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5,
              fontWeight: 500
            }}
          >
            Made with <FavoriteIcon sx={{ color: '#e91e63', fontSize: 16 }} /> by
            <Typography
              component="span"
              sx={{
                background: 'linear-gradient(90deg, #3f51b5, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600
              }}
            >
              Shashwat Singh
            </Typography>
            and
            <Typography
              component="span"
              sx={{
                background: 'linear-gradient(90deg, #3f51b5, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600
              }}
            >
              Yash Sharma
            </Typography>
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
} 