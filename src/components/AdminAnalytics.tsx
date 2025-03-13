import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Paper,
} from '@mui/material';
import { QuizAnalytics } from '../types/quiz';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
  border: '1px solid rgba(0,0,0,0.08)',
  height: '100%',
}));

interface AdminAnalyticsProps {
  analytics: QuizAnalytics;
}

export default function AdminAnalytics({ analytics }: AdminAnalyticsProps) {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#2c3e50' }}>
        Quiz Analytics Dashboard
      </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="subtitle2" color="text.secondary">Total Attempts</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
              {analytics.totalAttempts}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="subtitle2" color="text.secondary">Average Score</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
              {Math.round(analytics.averageScore)}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="subtitle2" color="text.secondary">Highest Score</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 600, color: '#4f46e5' }}>
              {analytics.highestScore}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="subtitle2" color="text.secondary">Today's Participants</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
              {analytics.participantsToday}
            </Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Time-based Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Today</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Participants</Typography>
                <Typography variant="h5">{analytics.participantsToday}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Average Score</Typography>
                <Typography variant="h5">{Math.round(analytics.averageScoreToday)}</Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>This Week</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Participants</Typography>
                <Typography variant="h5">{analytics.participantsThisWeek}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Average Score</Typography>
                <Typography variant="h5">{Math.round(analytics.averageScoreThisWeek)}</Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>This Month</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Participants</Typography>
                <Typography variant="h5">{analytics.participantsThisMonth}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Average Score</Typography>
                <Typography variant="h5">{Math.round(analytics.averageScoreThisMonth)}</Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Difficulty Distribution */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Difficulty Distribution
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Easy</Typography>
                  <Typography variant="body2">{analytics.difficultyDistribution.easy}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={analytics.difficultyDistribution.easy}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#2ecc71'
                    }
                  }} 
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Medium</Typography>
                  <Typography variant="body2">{analytics.difficultyDistribution.medium}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={analytics.difficultyDistribution.medium}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(241, 196, 15, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#f1c40f'
                    }
                  }} 
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Difficult</Typography>
                  <Typography variant="body2">{analytics.difficultyDistribution.difficult}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={analytics.difficultyDistribution.difficult}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#e74c3c'
                    }
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Top Performers */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Top Performers
          </Typography>
          <Grid container spacing={2}>
            {analytics.topPerformers.map((result, index) => (
              <Grid item xs={12} key={result.regNumber + result.timestamp}>
                <Box 
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: index < 3 ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    border: '1px solid',
                    borderColor: index < 3 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={1}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: index < 3 ? '#4f46e5' : 'text.secondary',
                          fontWeight: 600 
                        }}
                      >
                        #{index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {result.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.regNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">Score</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {result.score}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Date</Typography>
                      <Typography variant="subtitle1">
                        {result.date}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </StyledCard>
    </Box>
  );
} 