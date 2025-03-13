import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  LinearProgress,
  Paper,
  Alert,
  Snackbar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Fade,
  Grow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Timer from '../components/Timer';
import { Question, getRandomQuestions } from '../models/Question';
import { getStudentName } from '../models/Students';
import { getRandomBonusQuestion } from '../models/BonusQuestions';
import { getQuizSettings } from '../models/ServerStorage';
import QuizCard from '../components/QuizCard';
import Footer from '../components/Footer';

// Icons
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';

interface QuizAnswer {
  questionId: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  isBonus?: boolean;
}

const WelcomeCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  maxWidth: '800px',
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #3f51b5, #7986cb, #9fa8da)',
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '14px 32px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1.1rem',
  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(90deg, #3f51b5, #5c6bc0)',
  marginTop: theme.spacing(4),
  '&:hover': {
    boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
    background: 'linear-gradient(90deg, #3949ab, #5c6bc0)',
    transform: 'translateY(-2px)',
  },
}));

const InstructionIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '36px',
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [regularScore, setRegularScore] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showBonusPrompt, setShowBonusPrompt] = useState(false);
  const [bonusQuestion, setBonusQuestion] = useState<Question | null>(null);
  const [tookBonusQuestion, setTookBonusQuestion] = useState(false);
  const [showingBonusQuestion, setShowingBonusQuestion] = useState(false);
  const [tabSwitchPenalties, setTabSwitchPenalties] = useState(0);
  const [showPenaltyAlert, setShowPenaltyAlert] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSettings, setQuizSettings] = useState<any>(null);
  
  // Use a ref to track answers to avoid closure issues with setTimeout
  const answersRef = useRef<QuizAnswer[]>([]);
  
  // Update the ref whenever answers state changes
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  
  // Determine which question to show
  const currentQuestion = showBonusPrompt 
    ? null 
    : showingBonusQuestion 
      ? bonusQuestion 
      : currentQuestionIndex < questions.length 
        ? questions[currentQuestionIndex] 
        : null;

  // Tab switching detection and penalty
  useEffect(() => {
    if (!quizStarted) return; // Only apply penalties after quiz has started
    
    let isHidden = false;
    let wasBlurred = false;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !showBonusPrompt && !isHidden) {
        isHidden = true;
        applyPenalty('visibility change');
      } else if (document.visibilityState === 'visible') {
        isHidden = false;
      }
    };

    const handleBlur = () => {
      if (!showBonusPrompt && !wasBlurred) {
        wasBlurred = true;
        applyPenalty('window blur');
      }
    };

    const handleFocus = () => {
      wasBlurred = false;
    };

    const applyPenalty = (reason: string) => {
      // Only apply penalty if not in bonus prompt and quiz is active
      if (!showBonusPrompt && quizStarted) {
        setTabSwitchPenalties(prev => prev + 1);
        setRegularScore(prev => Math.max(0, prev - 2)); // Deduct 2 points, minimum 0
        setShowPenaltyAlert(true);
        
        // Log the penalty
        console.log(`Tab switch penalty applied (${reason}): -2 points`);
      }
    };

    // Add event listeners for both visibility and blur/focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Clean up event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [showBonusPrompt, quizStarted]);

  useEffect(() => {
    const regNumber = localStorage.getItem('regNumber');
    if (!regNumber) {
      router.push('/');
      return;
    }
    
    // Get student name
    const fetchStudentName = async () => {
      const name = await getStudentName(regNumber);
      setStudentName(name);
    };
    fetchStudentName();

    // Get quiz settings and generate questions
    const settings = getQuizSettings();
    setQuizSettings(settings);
    const randomQuestions = getRandomQuestions(settings.totalQuestions);
    setQuestions(randomQuestions);
    
    // Generate a random bonus question
    const randomBonusQuestion = getRandomBonusQuestion();
    setBonusQuestion(randomBonusQuestion);
    
    // Clear any previous quiz data
    localStorage.removeItem('currentQuizData');
  }, [router]);

  // Don't render anything until questions are loaded
  if (!questions.length) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)',
      }}>
        <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 600 }}>
          Loading quiz...
        </Typography>
      </Box>
    );
  }

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else if (!showBonusPrompt && !showingBonusQuestion) {
      // Show the bonus question prompt after all regular questions
      setShowBonusPrompt(true);
    } else {
      // Use the ref to get the latest answers
      const currentAnswers = answersRef.current;
      console.log('Moving to finish quiz. Current answers:', currentAnswers);
      
      // Finish the quiz
      finishQuiz(currentAnswers);
    }
  };

  const finishQuiz = (finalAnswers: QuizAnswer[]) => {
    // Quiz completed, store score and answers
    const regNumber = localStorage.getItem('regNumber') || 'Unknown';
    
    // Calculate regular score (only from non-bonus questions)
    const regularFinalScore = finalAnswers
      .filter(a => !a.isBonus && a.isCorrect)
      .length;
    
    // Apply tab switching penalties to the regular score
    const finalRegularScoreWithPenalties = Math.max(0, regularFinalScore - (tabSwitchPenalties * 2));
    
    // Calculate bonus score
    let finalBonusScore = 0;
    const bonusAnswer = finalAnswers.find(a => a.isBonus);
    
    if (bonusAnswer) {
      finalBonusScore = bonusAnswer.isCorrect ? 10 : -8;
    }
    
    // Calculate total score (ensure it's not negative)
    const totalScore = Math.max(0, finalRegularScoreWithPenalties + finalBonusScore);

    // Calculate difficulty-wise scores
    const difficultyScores = finalAnswers
      .filter(a => !a.isBonus && a.isCorrect)
      .reduce((acc, answer) => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question) {
          acc[question.difficulty]++;
        }
        return acc;
      }, { easy: 0, medium: 0, difficult: 0 });
    
    console.log('QUIZ COMPLETED - Storing quiz results:', {
      regNumber,
      name: studentName,
      regularScore: finalRegularScoreWithPenalties,
      bonusScore: finalBonusScore,
      totalScore,
      tookBonusQuestion,
      difficultyScores,
      tabSwitchPenalties,
      timestamp: new Date().toISOString(),
      allAnswers: finalAnswers
    });
    
    // Log each answer with its corresponding question
    console.log('Detailed answers:');
    finalAnswers.forEach((answer, index) => {
      const question = answer.isBonus 
        ? bonusQuestion 
        : questions.find(q => q.id === answer.questionId);
      
      console.log(`Answer ${index + 1}:`, {
        questionId: answer.questionId,
        questionText: question ? question.text.substring(0, 30) + '...' : 'Question not found',
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question ? question.correctAnswer : 'Unknown',
        isCorrect: answer.isCorrect,
        isBonus: answer.isBonus || false
      });
    });
    
    // Store results for leaderboard
    const now = new Date();
    const quizResult = {
      id: `${regNumber}-${now.getTime()}`, // Add unique ID for each attempt
      regNumber,
      name: studentName,
      regularScore: finalRegularScoreWithPenalties,
      bonusScore: finalBonusScore,
      score: totalScore,
      tookBonusQuestion,
      difficultyScores,
      tabSwitchPenalties,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      quizTitle: quizSettings?.title || 'Regular Quiz'
    };
    
    // Get existing results and add new result
    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    existingResults.push(quizResult);
    localStorage.setItem('quizResults', JSON.stringify(existingResults));
    console.log('Updated leaderboard data:', existingResults);
    
    // Store detailed quiz data for the report
    const quizData = {
      questions: [...questions, ...(bonusQuestion && tookBonusQuestion ? [bonusQuestion] : [])],
      answers: finalAnswers,
      regularScore: finalRegularScoreWithPenalties,
      bonusScore: finalBonusScore,
      score: totalScore,
      totalQuestions: questions.length,
      tookBonusQuestion
    };
    
    localStorage.setItem('currentQuizData', JSON.stringify({
      ...quizData,
      questions,
      answers,
      bonusQuestion,
      bonusAnswer: answers.find(a => a.isBonus) || null
    }));
    console.log('Stored quiz data for report:', quizData);
    
    // Redirect to the report page
    router.push('/quiz-report');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    const isBonus = showingBonusQuestion;
    const questionToCheck = currentQuestion;
    
    if (!questionToCheck) return;
    
    const isCorrect = answerIndex === questionToCheck.correctAnswer;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    // Record the answer
    const newAnswer = {
      questionId: questionToCheck.id,
      selectedAnswer: answerIndex,
      isCorrect,
      isBonus
    };
    
    console.log('Recording answer:', newAnswer);
    
    // Update answers state and ref
    setAnswers(prev => {
      const newAnswers = [...prev, newAnswer];
      console.log('Updated answers array:', newAnswers);
      return newAnswers;
    });

    if (isCorrect) {
      // Update score
      if (isBonus) {
        setBonusScore(10);
      } else {
        setRegularScore(prev => prev + 1);
      }
    } else if (isBonus) {
      // Penalty for incorrect bonus answer
      setBonusScore(-8);
    }

    // Wait a bit longer to ensure the answer is recorded
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      setSelectedAnswer(null);
      
      const isBonus = showingBonusQuestion;
      const questionToCheck = currentQuestion;
      
      if (!questionToCheck) return;
      
      // Record the timeout as a null answer
      const timeoutAnswer = {
        questionId: questionToCheck.id,
        selectedAnswer: null,
        isCorrect: false,
        isBonus
      };
      
      console.log('Recording timeout answer:', timeoutAnswer);
      
      // Update answers state and ref
      setAnswers(prev => {
        const newAnswers = [...prev, timeoutAnswer];
        console.log('Updated answers array after timeout:', newAnswers);
        return newAnswers;
      });
      
      // For bonus question, apply penalty
      if (isBonus) {
        setBonusScore(-8);
      }
      
      // Wait a bit longer to ensure the answer is recorded
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const handleBonusChoice = (takeBonusQuestion: boolean) => {
    setTookBonusQuestion(takeBonusQuestion);
    setShowBonusPrompt(false);
    
    if (takeBonusQuestion) {
      // Reset answer state for the bonus question
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowingBonusQuestion(true);
    } else {
      // If they don't want to take the bonus, finish the quiz
      finishQuiz(answersRef.current);
    }
  };

  const calculateRegularScore = (): number => {
    return answers
      .filter(a => !a.isBonus && a.isCorrect)
      .length - (tabSwitchPenalties * 2);
  };

  const calculateBonusScore = (): number => {
    const bonusAnswer = answers.find(a => a.isBonus);
    if (bonusAnswer && bonusAnswer.isCorrect) {
      return 10;
    } else if (bonusAnswer && !bonusAnswer.isCorrect) {
      return -8;
    }
    return 0;
  };

  const handleSubmit = async () => {
    const regNumber = localStorage.getItem('regNumber');
    if (!regNumber) {
      router.push('/');
      return;
    }

    // Calculate scores
    const regularScore = calculateRegularScore();
    const bonusScore = calculateBonusScore();
    const totalScore = regularScore + bonusScore;

    // Save quiz data
    const quizData = {
      regNumber,
      date: new Date().toISOString(),
      regularScore,
      bonusScore,
      totalScore,
      quizTitle: 'Regular Quiz'
    };

    try {
      // Store results in localStorage
      const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
      
      // Remove any previous results for this student
      const filteredResults = results.filter((r: any) => r.regNumber !== regNumber);
      
      // Add the new result
      filteredResults.push(quizData);
      
      // Save back to localStorage
      localStorage.setItem('quizResults', JSON.stringify(filteredResults));

      // Store current quiz data for the report page
      localStorage.setItem('currentQuizData', JSON.stringify({
        ...quizData,
        questions,
        answers,
        bonusQuestion,
        bonusAnswer: answers.find(a => a.isBonus) || null
      }));

      router.push('/quiz-report');
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      alert('Failed to submit quiz results. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>C++ Quiz</title>
      </Head>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F8F9FF 50%, #FDF2F8 100%)',
        display: 'flex',
        flexDirection: 'column',
        py: 4
      }}>
        <Container maxWidth="xl" sx={{ flex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              mb: 2
            }}>
              C++ Programming Quiz
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ 
                color: '#4a5568'
              }}>
                Welcome, {studentName}!
              </Typography>
              {quizStarted && tabSwitchPenalties > 0 && (
                <Typography variant="subtitle1" sx={{ 
                  color: '#e74c3c',
                  mt: 2,
                  fontWeight: 500
                }}>
                  Tab Switch Penalties: -{tabSwitchPenalties * 2} points
                </Typography>
              )}
              <Button 
                variant="outlined"
                color="error"
                size="small"
                onClick={() => router.push('/logout')}
                sx={{ 
                  mt: 2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          {!quizStarted ? (
            <Grow in={!quizStarted} timeout={800}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <WelcomeCard>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SchoolIcon sx={{ fontSize: 32, color: '#3f51b5', mr: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        Quiz Instructions
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, color: '#4a5568' }}>
                      Please read the following instructions carefully before starting the quiz:
                    </Typography>
                    
                    <List sx={{ mb: 3 }}>
                      <ListItem>
                        <InstructionIcon>
                          <TimerIcon />
                        </InstructionIcon>
                        <ListItemText 
                          primary="Time Limit" 
                          secondary={`Each question has a specific time limit. Once the time is up, the quiz will automatically move to the next question.`}
                          primaryTypographyProps={{ fontWeight: 600, color: '#2c3e50' }}
                        />
                      </ListItem>
                      
                      <Divider variant="inset" component="li" />
                      
                      <ListItem>
                        <InstructionIcon>
                          <InfoIcon />
                        </InstructionIcon>
                        <ListItemText 
                          primary="Quiz Format" 
                          secondary={`The quiz consists of ${quizSettings?.totalQuestions || 10} multiple-choice questions on C++ programming concepts.`}
                          primaryTypographyProps={{ fontWeight: 600, color: '#2c3e50' }}
                        />
                      </ListItem>
                      
                      <Divider variant="inset" component="li" />
                      
                      <ListItem>
                        <InstructionIcon>
                          <CheckCircleIcon />
                        </InstructionIcon>
                        <ListItemText 
                          primary="Scoring" 
                          secondary="You will receive 1 point for each correct answer. There is no negative marking for incorrect answers."
                          primaryTypographyProps={{ fontWeight: 600, color: '#2c3e50' }}
                        />
                      </ListItem>
                      
                      <Divider variant="inset" component="li" />
                      
                      <ListItem>
                        <InstructionIcon>
                          <WarningIcon />
                        </InstructionIcon>
                        <ListItemText 
                          primary="Tab Switching Penalty" 
                          secondary="Switching tabs or windows during the quiz will result in a 2-point penalty each time."
                          primaryTypographyProps={{ fontWeight: 600, color: '#2c3e50' }}
                        />
                      </ListItem>
                      
                      <Divider variant="inset" component="li" />
                      
                      <ListItem>
                        <InstructionIcon>
                          <InfoIcon />
                        </InstructionIcon>
                        <ListItemText 
                          primary="Bonus Question" 
                          secondary="After completing all regular questions, you'll have the option to attempt a bonus question worth 10 points. However, an incorrect answer will result in a deduction of 8 points."
                          primaryTypographyProps={{ fontWeight: 600, color: '#2c3e50' }}
                        />
                      </ListItem>
                    </List>
                    
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#4a5568', mb: 4 }}>
                      Once you start the quiz, you cannot pause or restart it. Make sure you're ready before clicking the Start button.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <StartButton
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={startQuiz}
                        startIcon={<PlayArrowIcon />}
                      >
                        Start Quiz
                      </StartButton>
                    </Box>
                  </CardContent>
                </WelcomeCard>
              </Box>
            </Grow>
          ) : (
            <>
              {/* Progress Bar - Only show for regular questions */}
              {!showingBonusQuestion && !showBonusPrompt && (
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: '#4a5568'
                    }}>
                      Progress
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#4a5568'
                    }}>
                      {currentQuestionIndex + 1} of {questions.length} Questions
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((currentQuestionIndex + 1) / questions.length) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4f46e5',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              )}

              {/* Score Display */}
              <Box sx={{ 
                mb: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 4
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ 
                    color: '#4a5568',
                    mb: 1
                  }}>
                    Regular Score
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    color: '#4f46e5'
                  }}>
                    {regularScore}
                  </Typography>
                </Box>
                {tookBonusQuestion && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      color: '#4a5568',
                      mb: 1
                    }}>
                      Bonus Score
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: bonusScore > 0 ? '#22c55e' : '#dc2626'
                    }}>
                      {bonusScore > 0 ? '+' : ''}{bonusScore}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Main Content */}
              <Fade in={quizStarted} timeout={500}>
                <Box sx={{ position: 'relative' }}>
                  {showBonusPrompt ? (
                    <Paper sx={{ 
                      maxWidth: '4xl',
                      mx: 'auto',
                      p: 4,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h2 className="text-3xl font-bold text-purple-600 mb-4">High Stakes Question</h2>
                      <p className="text-lg text-gray-700 mb-6">
                        Would you like to attempt a high stakes question?
                      </p>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          ✨ Correct answer: <span className="text-green-600 font-bold">+10 points</span>
                          <br />
                          ❌ Wrong answer: <span className="text-red-600 font-bold">-8 points</span>
                        </p>
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => handleBonusChoice(true)}
                            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                          >
                            Take the Challenge
                          </button>
                          <button
                            onClick={() => handleBonusChoice(false)}
                            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                          >
                            Skip & Finish
                          </button>
                        </div>
                      </div>
                    </Paper>
                  ) : currentQuestion ? (
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{ position: 'absolute', top: -16, right: 0, zIndex: 10 }}>
                        <Timer
                          timeLimit={currentQuestion.timeLimit}
                          onTimeUp={handleTimeUp}
                          isAnswered={isAnswered}
                        />
                      </Box>
                      <QuizCard
                        question={currentQuestion}
                        selectedAnswer={selectedAnswer}
                        isAnswered={isAnswered}
                        onAnswerSelect={handleAnswerSelect}
                        timeLimit={currentQuestion.timeLimit}
                      />
                    </Box>
                  ) : null}
                </Box>
              </Fade>
            </>
          )}

          {/* Penalty Alert */}
          <Snackbar 
            open={showPenaltyAlert} 
            autoHideDuration={3000} 
            onClose={() => setShowPenaltyAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => setShowPenaltyAlert(false)} 
              severity="error" 
              variant="filled"
              sx={{ width: '100%' }}
            >
              Tab switching detected! -2 points penalty applied.
            </Alert>
          </Snackbar>
        </Container>
        <Footer />
      </Box>
    </>
  );
}
