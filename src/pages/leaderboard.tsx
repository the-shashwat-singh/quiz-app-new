import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getStudentNameSync } from '../models/Students';
import { QuizResultWithDate } from '../types/quiz';
import { formatDate } from '../utils/analytics';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  ButtonGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Footer from '../components/Footer';

interface Quiz {
  id: string;
  title: string;
}

interface QuizResult {
  id: string;
  studentName: string;
  quizTitle: string;
  score: number;
  regularScore: number;
  bonusScore: number;
  date: string;
  timestamp: number;
  regNumber: string;
  tookBonusQuestion: boolean;
  tabSwitchPenalties?: number;
  penaltyPoints: number;
  rawScore: number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 16,
  fontWeight: 'bold',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.default,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& td': {
    padding: theme.spacing(2),
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

type TimeFilter = 'all' | 'today' | 'week' | 'month';

export default function LeaderboardPage() {
  const router = useRouter();
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<QuizResult[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState('all');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get quiz results from localStorage
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    
    // Process results
    const processedResults = results.map((result: any) => {
      const regularScore = result.regularScore || 0;
      const bonusScore = result.bonusScore || 0;
      const tabSwitchPenalties = result.tabSwitchPenalties || 0;
      const penaltyPoints = tabSwitchPenalties * 2; // Each penalty is -2 points
      
      // Calculate total score by subtracting penalties
      const totalScore = Math.max(0, regularScore + bonusScore - penaltyPoints);
      
      return {
        ...result,
        date: result.date || new Date(result.timestamp).toISOString().split('T')[0],
        studentName: result.name || 'Unknown Student',
        quizTitle: result.quizTitle || 'Regular Quiz',
        regularScore: regularScore,
        bonusScore: bonusScore,
        tabSwitchPenalties: tabSwitchPenalties,
        penaltyPoints: penaltyPoints,
        // Store both the raw score and the final score with penalties
        rawScore: regularScore + bonusScore,
        score: totalScore
      };
    });
    
    // Extract unique quizzes
    const quizTitles = processedResults.map((r: any) => r.quizTitle);
    const uniqueQuizzes = Array.from(new Set(quizTitles)).map(title => ({
      id: title as string,
      title: title as string
    }));
    
    setQuizResults(processedResults);
    setQuizzes(uniqueQuizzes);
    
    const initialQuizId = uniqueQuizzes.length > 0 ? uniqueQuizzes[0].id : 'all';
    setSelectedQuiz(initialQuizId);
    
    // Initialize filtered results
    filterResults(processedResults, 'all', initialQuizId);
    
    setLoading(false);
  }, []);

  const filterResults = (results: QuizResult[], filter: TimeFilter, quizId: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let filtered = [...results];
    
    // Apply time filter
    if (filter === 'today') {
      filtered = filtered.filter(r => r.date === today);
    } else if (filter === 'week') {
      filtered = filtered.filter(r => r.date >= weekAgo);
    } else if (filter === 'month') {
      filtered = filtered.filter(r => r.date >= monthAgo);
    }

    // Apply quiz filter
    if (quizId !== 'all') {
      filtered = filtered.filter(r => r.quizTitle === quizId);
    }

    // Sort by final score (with penalties) descending, then by timestamp
    filtered.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.timestamp - a.timestamp;
    });

    setFilteredResults(filtered);
    setTotalParticipants(filtered.length);
    
    if (filtered.length > 0) {
      // Calculate average score with penalties included
      const totalScores = filtered.reduce((sum, result) => sum + result.score, 0);
      setAverageScore(Math.round(totalScores / filtered.length));
      
      // Set highest score (already includes penalties from processing)
      setHighestScore(Math.max(...filtered.map(r => r.score)));
    } else {
      setAverageScore(0);
      setHighestScore(0);
    }
  };

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
    filterResults(quizResults, filter, selectedQuiz);
  };

  const handleQuizFilter = (quizId: string) => {
    setSelectedQuiz(quizId);
    filterResults(quizResults, timeFilter, quizId);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f5f7fa', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600, mb: 4 }}>
          Leaderboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatCard>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Participants
              </Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {totalParticipants}
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {averageScore}
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Highest Score
              </Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {highestScore}
              </Typography>
            </StatCard>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
                Time Period:
              </Typography>
              <ButtonGroup variant="outlined" size="large">
                <Button 
                  onClick={() => handleTimeFilterChange('all')}
                  variant={timeFilter === 'all' ? 'contained' : 'outlined'}
                >
                  All Time
                </Button>
                <Button 
                  onClick={() => handleTimeFilterChange('today')}
                  variant={timeFilter === 'today' ? 'contained' : 'outlined'}
                >
                  Today
                </Button>
                <Button 
                  onClick={() => handleTimeFilterChange('week')}
                  variant={timeFilter === 'week' ? 'contained' : 'outlined'}
                >
                  This Week
                </Button>
                <Button 
                  onClick={() => handleTimeFilterChange('month')}
                  variant={timeFilter === 'month' ? 'contained' : 'outlined'}
                >
                  This Month
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
                Quiz:
              </Typography>
              <ButtonGroup variant="outlined" size="large">
                <Button
                  onClick={() => handleQuizFilter('all')}
                  variant={selectedQuiz === 'all' ? 'contained' : 'outlined'}
                >
                  All Quizzes
                </Button>
                {quizzes.map((quiz) => (
                  <Button
                    key={quiz.id}
                    onClick={() => handleQuizFilter(quiz.id)}
                    variant={selectedQuiz === quiz.id ? 'contained' : 'outlined'}
                  >
                    {quiz.title}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Table */}
        <TableContainer component={Paper} sx={{ bgcolor: '#fff', borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Rank</StyledTableCell>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>Registration No.</StyledTableCell>
                <StyledTableCell>Quiz Title</StyledTableCell>
                <StyledTableCell align="right">Quiz Score</StyledTableCell>
                <StyledTableCell align="right">High Stake Bonus</StyledTableCell>
                <StyledTableCell align="right">Penalties</StyledTableCell>
                <StyledTableCell align="right">Total Score</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResults.map((result, index) => (
                <StyledTableRow key={result.id}>
                  <TableCell sx={{ fontWeight: 600 }}>#{index + 1}</TableCell>
                  <TableCell>{result.studentName}</TableCell>
                  <TableCell>{result.regNumber}</TableCell>
                  <TableCell>{result.quizTitle}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>{result.regularScore}</TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 500,
                      color: !result.tookBonusQuestion 
                        ? 'text.secondary'
                        : result.bonusScore > 0 
                          ? 'success.main' 
                          : 'error.main'
                    }}
                  >
                    {result.tookBonusQuestion 
                      ? (result.bonusScore > 0 ? `+${result.bonusScore}` : result.bonusScore)
                      : 'Not Taken'
                    }
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 500,
                      color: result.tabSwitchPenalties ? 'error.main' : 'text.secondary'
                    }}
                  >
                    {result.tabSwitchPenalties ? `-${result.tabSwitchPenalties * 2}` : 'None'}
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 700,
                      color: result.bonusScore > 0 ? 'success.main' : 
                             result.bonusScore < 0 || result.tabSwitchPenalties ? 'error.main' : 
                             'text.primary'
                    }}
                  >
                    {result.score}
                  </TableCell>
                  <TableCell align="right">{formatDate(result.date)}</TableCell>
                </StyledTableRow>
              ))}
              {filteredResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No results found for the selected filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </Box>
  );
}
