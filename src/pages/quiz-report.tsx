import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { Question } from '../models/Question';
import { getStudentName } from '../models/Students';
import { QuizAnswer, QuizData } from '../types/quiz';
import QuizReportCard from '../components/QuizReportCard';

export default function QuizReport() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [regularScore, setRegularScore] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionAnswerMap, setQuestionAnswerMap] = useState<Map<number, QuizAnswer>>(new Map());
  const [tookBonusQuestion, setTookBonusQuestion] = useState(false);

  useEffect(() => {
    const regNumber = localStorage.getItem('regNumber');
    if (!regNumber) {
      router.push('/');
      return;
    }

    const fetchStudentName = async () => {
      const name = await getStudentName(regNumber);
      setStudentName(name);
    };
    fetchStudentName();

    const quizData = localStorage.getItem('currentQuizData');
    if (!quizData) {
      router.push('/quiz');
      return;
    }

    try {
      const parsedData = JSON.parse(quizData) as QuizData;
      const answerMap = new Map<number, QuizAnswer>();
      parsedData.answers.forEach(answer => {
        answerMap.set(answer.questionId, answer);
      });
      
      setQuizQuestions(parsedData.questions);
      setAnswers(parsedData.answers);
      setRegularScore(parsedData.regularScore);
      setBonusScore(parsedData.bonusScore);
      setTotalScore(parsedData.score);
      setTotalQuestions(parsedData.totalQuestions);
      setQuestionAnswerMap(answerMap);
      setTookBonusQuestion(parsedData.tookBonusQuestion);
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      router.push('/quiz');
    }
  }, [router]);

  const handleReturnHome = () => {
    router.push('/');
  };

  const handleViewLeaderboard = () => {
    router.push('/leaderboard');
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('quiz-report');
    if (!reportElement) return;
    
    try {
      // Dynamically import html2pdf only on the client side
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      
      const options = {
        margin: 10,
        filename: `${studentName.replace(/\s+/g, '_')}_C++_Quiz_Report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(options).from(reportElement).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
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
        <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 600 }}>
          Loading report...
        </Typography>
      </Box>
    );
  }

  const regularPercentage = totalQuestions > 0 
    ? Math.round((regularScore / totalQuestions) * 100) 
    : 0;

  return (
    <>
      <Head>
        <title>Quiz Report - C++ Quiz</title>
      </Head>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Paper id="quiz-report" sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            background: '#fff',
          }}>
            {/* Header */}
            <Box sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: '#fff'
            }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Quiz Report
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9 }}>
                Hello, {studentName}!
              </Typography>
            </Box>
            
            {/* Score Summary */}
            <Box sx={{ p: 4, borderBottom: 1, borderColor: 'divider' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ 
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    border: 1,
                    borderColor: '#6ee7b7'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1,
                      color: '#065f46',
                      fontWeight: 600
                    }}>
                      Regular Questions
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: '#059669'
                    }}>
                      {regularScore}/{totalQuestions}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      mt: 0.5,
                      color: '#065f46'
                    }}>
                      {regularPercentage}% correct
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ 
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                    border: 1,
                    borderColor: '#c084fc'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1,
                      color: '#6d28d9',
                      fontWeight: 600
                    }}>
                      High Stakes Bonus
                    </Typography>
                    {tookBonusQuestion ? (
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: bonusScore > 0 ? '#059669' : '#dc2626'
                      }}>
                        {bonusScore > 0 ? '+' : ''}{bonusScore}
                      </Typography>
                    ) : (
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: '#9ca3af'
                      }}>
                        Not attempted
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ 
                      mt: 0.5,
                      color: '#6d28d9'
                    }}>
                      {tookBonusQuestion ? (bonusScore > 0 ? 'Excellent work!' : 'Keep practicing!') : 'Maybe next time!'}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ 
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: 1,
                    borderColor: '#93c5fd'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1,
                      color: '#1e40af',
                      fontWeight: 600
                    }}>
                      Total Score
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: '#2563eb'
                    }}>
                      {totalScore}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      mt: 0.5,
                      color: '#1e40af'
                    }}>
                      {Math.round((totalScore / (totalQuestions + (tookBonusQuestion ? 1 : 0))) * 100)}% overall
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Questions Review */}
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 4,
                color: '#2c3e50'
              }}>
                Question Review
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {quizQuestions.map((question, index) => {
                  const answer = questionAnswerMap.get(question.id);
                  if (!answer) return null;
                  
                  return (
                    <QuizReportCard
                      key={question.id}
                      question={question}
                      answer={answer}
                      index={index}
                    />
                  );
                })}
              </Box>
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleReturnHome}
              sx={{ 
                px: 3,
                py: 1.5,
                bgcolor: 'rgba(0,0,0,0.1)',
                color: '#4a5568',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.2)',
                }
              }}
            >
              Return Home
            </Button>
            <Button
              variant="contained"
              onClick={handleViewLeaderboard}
              sx={{ 
                px: 3,
                py: 1.5,
                bgcolor: '#4f46e5',
                '&:hover': {
                  bgcolor: '#4338ca',
                }
              }}
            >
              View Leaderboard
            </Button>
            <Button
              variant="contained"
              onClick={handleDownloadPDF}
              sx={{ 
                px: 3,
                py: 1.5,
                bgcolor: '#10b981',
                '&:hover': {
                  bgcolor: '#059669',
                }
              }}
            >
              Download PDF
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
} 