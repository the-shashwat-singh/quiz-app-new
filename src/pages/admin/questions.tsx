import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Question, QuizSettings, getAllQuestions, getQuizSettings, updateQuizSettings, updateTimeLimits } from '../../models/Question';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { getAllBonusQuestions, addBonusQuestion, updateBonusQuestion, deleteBonusQuestion } from '@/models/BonusQuestions';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const DifficultyChip = styled('span')<{ difficulty: string }>(({ difficulty }) => ({
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.875rem',
  fontWeight: 600,
  backgroundColor: 
    difficulty === 'easy' ? 'rgba(46, 204, 113, 0.1)' :
    difficulty === 'medium' ? 'rgba(241, 196, 15, 0.1)' :
    'rgba(231, 76, 60, 0.1)',
  color:
    difficulty === 'easy' ? '#27ae60' :
    difficulty === 'medium' ? '#f39c12' :
    '#c0392b',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 120,
  '&.Mui-selected': {
    fontWeight: 600,
  },
}));

const CodeBlock = styled('pre')(({ theme }) => ({
  margin: '16px 0',
  padding: '16px',
  borderRadius: '8px',
  backgroundColor: '#1e293b',
  color: '#e2e8f0',
  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  fontSize: '14px',
  lineHeight: 1.5,
  overflow: 'auto',
  '& code': {
    fontFamily: 'inherit',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    color: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function QuestionsManagement() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: Date.now(),
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'easy',
    timeLimit: 30,
    isStrict: false
  });
  const [quizSettings, setQuizSettings] = useState<QuizSettings>(getQuizSettings());
  const [tabValue, setTabValue] = useState(0);
  const [activeTab, setActiveTab] = useState('regular');
  const [bonusQuestions, setBonusQuestions] = useState<Question[]>([]);
  const [newBonusQuestion, setNewBonusQuestion] = useState<Question>({
    id: Date.now(),
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'difficult',
    timeLimit: 60,
    explanation: '',
    isBonus: true
  });

  useEffect(() => {
    const regNumber = localStorage.getItem('regNumber');
    if (!regNumber) {
      router.push('/');
      return;
    }
    if (regNumber !== 'RA2411043010075') {
      router.push('/quiz');
      return;
    }
    setIsAdmin(true);
    loadQuestions();
    loadBonusQuestions();
  }, [router]);

  const loadQuestions = () => {
    setQuestions(getAllQuestions());
  };

  const loadBonusQuestions = () => {
    const questions = getAllBonusQuestions();
    setBonusQuestions(questions);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      handleUpdateQuestion();
    } else {
      handleAddQuestion();
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuizSettings(quizSettings);
    alert('Quiz settings updated successfully!');
  };

  const handleBulkTimeUpdate = (difficulty: 'easy' | 'medium' | 'difficult') => {
    const timeLimit = difficulty === 'easy' ? quizSettings.easyTimeLimit :
                     difficulty === 'medium' ? quizSettings.mediumTimeLimit :
                     quizSettings.difficultTimeLimit;
    updateTimeLimits(difficulty, timeLimit);
    loadQuestions();
    alert(`Time limits updated for all ${difficulty} questions!`);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) {
      setError('Please enter a question');
      return;
    }

    if (newQuestion.options.some(opt => !opt.trim())) {
      setError('Please fill in all options');
      return;
    }

    const questionToAdd: Question = {
      ...newQuestion,
      id: Math.max(30, ...questions.map(q => q.id)) + 1
    };

    const updatedQuestions = [...questions, questionToAdd];
    const additionalQuestions = updatedQuestions.filter(q => q.id > 30);
    localStorage.setItem('additionalQuestions', JSON.stringify(additionalQuestions));
    loadQuestions();

    resetNewQuestion();
    setError('');
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    if (!newQuestion.text.trim()) {
      setError('Please enter a question');
      return;
    }

    if (newQuestion.options.some(opt => !opt.trim())) {
      setError('Please fill in all options');
      return;
    }

    // Create updated question with correct isStrict value
    const updatedQuestion: Question = {
      ...newQuestion,
      id: editingQuestion.id,
      isStrict: newQuestion.isStrict // Use the value directly from newQuestion
    };

    console.log('Updating question:', {
      original: editingQuestion,
      updated: updatedQuestion,
      isStrictBefore: editingQuestion.isStrict,
      isStrictAfter: updatedQuestion.isStrict
    });

    if (editingQuestion.id <= 30) {
      // Store modifications to default questions
      const storedModifications = JSON.parse(localStorage.getItem('modifiedQuestions') || '[]');
      const updatedModifications = [
        ...storedModifications.filter((q: Question) => q.id !== editingQuestion.id),
        updatedQuestion
      ];
      localStorage.setItem('modifiedQuestions', JSON.stringify(updatedModifications));
    } else {
      // Update additional question
      const additionalQuestions = questions.filter(q => q.id > 30).map(q =>
        q.id === editingQuestion.id ? updatedQuestion : q
      );
      localStorage.setItem('additionalQuestions', JSON.stringify(additionalQuestions));
    }

    loadQuestions(); // Reload questions to reflect changes
    setEditingQuestion(null);
    resetNewQuestion();
    setError('');
  };

  const handleDeleteQuestion = (question: Question) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      if (question.id <= 30) {
        // Reset default question modifications
        const modifiedQuestions = JSON.parse(localStorage.getItem('modifiedQuestions') || '[]');
        const updatedModifications = modifiedQuestions.filter((q: Question) => q.id !== question.id);
        localStorage.setItem('modifiedQuestions', JSON.stringify(updatedModifications));
      } else {
        // Delete additional question
        const additionalQuestions = questions.filter(q => q.id > 30 && q.id !== question.id);
        localStorage.setItem('additionalQuestions', JSON.stringify(additionalQuestions));
      }
      loadQuestions();
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      ...question,
      options: [...question.options]
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    resetNewQuestion();
    setError('');
  };

  const handleAddBonusQuestion = () => {
    if (newBonusQuestion.text && newBonusQuestion.options.every(opt => opt)) {
      addBonusQuestion(newBonusQuestion);
      setBonusQuestions(prev => [...prev, newBonusQuestion]);
      setNewBonusQuestion({
        id: Date.now(),
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'difficult',
        timeLimit: 60,
        explanation: '',
        isBonus: true
      });
    }
  };

  const handleUpdateBonusQuestion = (updatedQuestion: Question) => {
    updateBonusQuestion(updatedQuestion);
    setBonusQuestions(prev =>
      prev.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const handleDeleteBonusQuestion = (questionId: number) => {
    deleteBonusQuestion(questionId);
    setBonusQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      id: Date.now(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'easy',
      timeLimit: 30,
      isStrict: false
    });
  };

  if (!isAdmin) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #EEF2FF, #FAF5FF, #FDF2F8)'
      }}>
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }
  
  return (
    <>
      <Head>
        <title>Question Management - C++ Quiz</title>
      </Head>
      <Container maxWidth="lg">
        <Box sx={{ 
          minHeight: '100vh',
          py: 6,
          background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f4f8 100%)'
        }}>
          <StyledPaper elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #2c3e50, #3498db)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Question Management
              </Typography>
            </Box>
            
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              mb: 4,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <StyledTab label="Add/Edit Questions" />
                <StyledTab label="Quiz Settings" />
                <StyledTab label="High Stakes Questions" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                    Add New Question
                  </Typography>
                  <form onSubmit={handleQuestionSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Question Text"
                          value={editingQuestion?.text || newQuestion.text}
                          onChange={(e) => editingQuestion ? 
                            setEditingQuestion({...editingQuestion, text: e.target.value}) :
                            setNewQuestion({...newQuestion, text: e.target.value})}
                          required
                          multiline
                          rows={4}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      {[0, 1, 2, 3].map((index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            fullWidth
                            label={`Option ${index + 1}`}
                            value={editingQuestion?.options[index] || newQuestion.options[index]}
                            onChange={(e) => {
                              const options = editingQuestion ? 
                                [...editingQuestion.options] : 
                                [...newQuestion.options];
                              options[index] = e.target.value;
                              editingQuestion ?
                                setEditingQuestion({...editingQuestion, options}) :
                                setNewQuestion({...newQuestion, options});
                            }}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#fff'
                              }
                            }}
                          />
                        </Grid>
                      ))}

                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Correct Answer</InputLabel>
                          <Select
                            value={editingQuestion?.correctAnswer || newQuestion.correctAnswer}
                            onChange={(e) => editingQuestion ?
                              setEditingQuestion({...editingQuestion, correctAnswer: Number(e.target.value)}) :
                              setNewQuestion({...newQuestion, correctAnswer: Number(e.target.value)})}
                            label="Correct Answer"
                            sx={{
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }}
                          >
                            {[0, 1, 2, 3].map((index) => (
                              <MenuItem key={index} value={index}>Option {index + 1}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Difficulty</InputLabel>
                          <Select
                            value={editingQuestion?.difficulty || newQuestion.difficulty}
                            onChange={(e) => editingQuestion ?
                              setEditingQuestion({...editingQuestion, difficulty: e.target.value as 'easy' | 'medium' | 'difficult'}) :
                              setNewQuestion({...newQuestion, difficulty: e.target.value as 'easy' | 'medium' | 'difficult'})}
                            label="Difficulty"
                            sx={{
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }}
                          >
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="difficult">Difficult</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Time Limit (seconds)"
                          value={editingQuestion?.timeLimit || newQuestion.timeLimit}
                          onChange={(e) => editingQuestion ?
                            setEditingQuestion({...editingQuestion, timeLimit: Number(e.target.value)}) :
                            setNewQuestion({...newQuestion, timeLimit: Number(e.target.value)})}
                          inputProps={{ min: 5, max: 30 }}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={editingQuestion?.isStrict || newQuestion.isStrict}
                              onChange={(e) => editingQuestion ?
                                setEditingQuestion({...editingQuestion, isStrict: e.target.checked}) :
                                setNewQuestion({...newQuestion, isStrict: e.target.checked})}
                            />
                          }
                          label={
                            <Typography sx={{ color: '#4a5568' }}>
                              Strict Question (Must appear in quiz)
                            </Typography>
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            sx={{
                              flex: 1,
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '1rem',
                              fontWeight: 600,
                              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                              }
                            }}
                          >
                            {editingQuestion ? 'Update Question' : 'Add Question'}
                          </Button>
                          {editingQuestion && (
                            <Button
                              variant="outlined"
                              onClick={handleCancel}
                              sx={{ 
                                flex: 1,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600
                              }}
                            >
                              Cancel Edit
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>

                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  Question List
                </Typography>
                <Grid container spacing={3}>
                  {questions.map((question) => (
                    <Grid item xs={12} key={question.id}>
                      <StyledCard>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', flex: 1 }}>
                              {question.text}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                              <DifficultyChip difficulty={question.difficulty}>
                                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                              </DifficultyChip>
                              {question.isStrict && (
                                <Typography 
                                  component="span" 
                                  sx={{ 
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    color: '#4f46e5'
                                  }}
                                >
                                  Strict
                                </Typography>
                              )}
                              <Typography 
                                component="span" 
                                sx={{ 
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1.5,
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                  color: '#4f46e5'
                                }}
                              >
                                {question.timeLimit}s
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 3 }}>
                            {question.options.map((option, index) => (
                              <Typography 
                                key={index}
                                sx={{ 
                                  py: 1,
                                  px: 2,
                                  mb: 1,
                                  borderRadius: 1,
                                  backgroundColor: index === question.correctAnswer ? 'rgba(46, 204, 113, 0.1)' : 'transparent',
                                  color: index === question.correctAnswer ? '#27ae60' : '#4a5568',
                                  border: '1px solid',
                                  borderColor: index === question.correctAnswer ? '#27ae60' : 'rgba(0,0,0,0.08)'
                                }}
                              >
                                {index + 1}. {option}
                              </Typography>
                            ))}
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={() => handleEditQuestion(question)}
                              sx={{ 
                                flex: 1,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteQuestion(question)}
                              sx={{ 
                                flex: 1,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}
                >
                  <form onSubmit={handleSettingsSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                          General Settings
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Total Questions in Quiz"
                          value={quizSettings.totalQuestions}
                          onChange={(e) => setQuizSettings({
                            ...quizSettings,
                            totalQuestions: Number(e.target.value)
                          })}
                          inputProps={{ min: 5, max: 50 }}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mt: 4, mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                          Question Distribution
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Easy Questions"
                          value={quizSettings.easyCount}
                          onChange={(e) => setQuizSettings({
                            ...quizSettings,
                            easyCount: Number(e.target.value)
                          })}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Medium Questions"
                          value={quizSettings.mediumCount}
                          onChange={(e) => setQuizSettings({
                            ...quizSettings,
                            mediumCount: Number(e.target.value)
                          })}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Difficult Questions"
                          value={quizSettings.difficultCount}
                          onChange={(e) => setQuizSettings({
                            ...quizSettings,
                            difficultCount: Number(e.target.value)
                          })}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff'
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mt: 4, mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                          Time Limits
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ 
                          p: 3, 
                          borderRadius: 2, 
                          border: '1px solid rgba(0,0,0,0.08)',
                          backgroundColor: '#fff'
                        }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                            Easy Questions
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            label="Time Limit (seconds)"
                            value={quizSettings.easyTimeLimit}
                            onChange={(e) => setQuizSettings({
                              ...quizSettings,
                              easyTimeLimit: Number(e.target.value)
                            })}
                            inputProps={{ min: 5, max: 30 }}
                            required
                            sx={{
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                          <Button
                            variant="outlined"
                            onClick={() => handleBulkTimeUpdate('easy')}
                            fullWidth
                            sx={{ 
                              py: 1,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Apply to All Easy Questions
                          </Button>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ 
                          p: 3, 
                          borderRadius: 2, 
                          border: '1px solid rgba(0,0,0,0.08)',
                          backgroundColor: '#fff'
                        }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                            Medium Questions
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            label="Time Limit (seconds)"
                            value={quizSettings.mediumTimeLimit}
                            onChange={(e) => setQuizSettings({
                              ...quizSettings,
                              mediumTimeLimit: Number(e.target.value)
                            })}
                            inputProps={{ min: 5, max: 30 }}
                            required
                            sx={{
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                          <Button
                            variant="outlined"
                            onClick={() => handleBulkTimeUpdate('medium')}
                            fullWidth
                            sx={{ 
                              py: 1,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Apply to All Medium Questions
                          </Button>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ 
                          p: 3, 
                          borderRadius: 2, 
                          border: '1px solid rgba(0,0,0,0.08)',
                          backgroundColor: '#fff'
                        }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                            Difficult Questions
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            label="Time Limit (seconds)"
                            value={quizSettings.difficultTimeLimit}
                            onChange={(e) => setQuizSettings({
                              ...quizSettings,
                              difficultTimeLimit: Number(e.target.value)
                            })}
                            inputProps={{ min: 5, max: 30 }}
                            required
                            sx={{
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                          <Button
                            variant="outlined"
                            onClick={() => handleBulkTimeUpdate('difficult')}
                            fullWidth
                            sx={{ 
                              py: 1,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Apply to All Difficult Questions
                          </Button>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          color="primary"
                          sx={{
                            py: 1.5,
                            px: 4,
                            mt: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #4f46e5, #7c3aed)'
                            }
                          }}
                        >
                          Save Settings
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    mb: 4, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                    Add New High Stakes Question
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#4a5568' }}>
                        Question Text
                      </Typography>
                      <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#718096' }}>
                        Use ```cpp ... ``` to wrap code snippets for proper formatting
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        placeholder="Enter your question text here. For code snippets, wrap them in ```cpp ... ```
Example:
What will be the output of this code?
```cpp
int arr[] = {1, 2, 3};
cout << arr[1];
```"
                        value={newBonusQuestion.text}
                        onChange={(e) => setNewBonusQuestion(prev => ({ ...prev, text: e.target.value }))}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            fontFamily: 'Consolas, Monaco, monospace'
                          }
                        }}
                      />
                      {newBonusQuestion.text.includes('```cpp') && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, color: '#4a5568' }}>
                            Preview:
                          </Typography>
                          <CodeBlock>
                            <code>
                              {newBonusQuestion.text.split('```cpp')[1].split('```')[0].trim()}
                            </code>
                          </CodeBlock>
                        </Box>
                      )}
                    </Grid>
                    
                    {newBonusQuestion.options.map((option, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#4a5568' }}>
                          Option {index + 1}
                        </Typography>
                        <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#718096' }}>
                          Use ```...``` to format code in options
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Enter option text. Use ```...``` for code formatting"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newBonusQuestion.options];
                            newOptions[index] = e.target.value;
                            setNewBonusQuestion(prev => ({ ...prev, options: newOptions }));
                          }}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#fff',
                              fontFamily: option.includes('```') ? 'Consolas, Monaco, monospace' : 'inherit'
                            }
                          }}
                        />
                      </Grid>
                    ))}
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Correct Answer</InputLabel>
                        <Select
                          value={newBonusQuestion.correctAnswer}
                          onChange={(e) => setNewBonusQuestion(prev => ({ 
                            ...prev, 
                            correctAnswer: Number(e.target.value)
                          }))}
                          label="Correct Answer"
                          sx={{
                            borderRadius: 2,
                            backgroundColor: '#fff'
                          }}
                        >
                          {[0, 1, 2, 3].map((index) => (
                            <MenuItem key={index} value={index}>Option {index + 1}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Time Limit (seconds)"
                        value={newBonusQuestion.timeLimit}
                        onChange={(e) => setNewBonusQuestion(prev => ({ 
                          ...prev, 
                          timeLimit: parseInt(e.target.value) 
                        }))}
                        inputProps={{ min: 30, max: 120 }}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Explanation"
                        value={newBonusQuestion.explanation}
                        onChange={(e) => setNewBonusQuestion(prev => ({ 
                          ...prev, 
                          explanation: e.target.value 
                        }))}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#fff'
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddBonusQuestion}
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                          }
                        }}
                      >
                        {editingQuestion ? 'Update High Stakes Question' : 'Add High Stakes Question'}
                      </Button>
                      {editingQuestion && (
                        <Button
                          variant="outlined"
                          onClick={handleCancel}
                          fullWidth
                          sx={{ 
                            mt: 1,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Paper>

                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  Existing High Stakes Questions
                </Typography>
                <Grid container spacing={3}>
                  {bonusQuestions.map((question) => (
                    <Grid item xs={12} key={question.id}>
                      <StyledCard>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2 }}>
                                {question.text.split('```cpp')[0]}
                              </Typography>
                              {question.text.includes('```cpp') && (
                                <CodeBlock>
                                  <code>
                                    {question.text.split('```cpp')[1].split('```')[0].trim()}
                                  </code>
                                </CodeBlock>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                              <DifficultyChip difficulty={question.difficulty}>
                                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                              </DifficultyChip>
                              <Typography 
                                component="span" 
                                sx={{ 
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1.5,
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                  color: '#4f46e5'
                                }}
                              >
                                {question.timeLimit}s
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 3 }}>
                            {question.options.map((option, index) => (
                              <Typography 
                                key={index}
                                sx={{ 
                                  py: 1,
                                  px: 2,
                                  mb: 1,
                                  borderRadius: 1,
                                  backgroundColor: index === question.correctAnswer ? 'rgba(46, 204, 113, 0.1)' : 'transparent',
                                  color: index === question.correctAnswer ? '#27ae60' : '#4a5568',
                                  border: '1px solid',
                                  borderColor: index === question.correctAnswer ? '#27ae60' : 'rgba(0,0,0,0.08)',
                                  fontFamily: option.includes('```') ? 'Consolas, Monaco, monospace' : 'inherit'
                                }}
                              >
                                {index + 1}. {option.includes('```') ? 
                                  option.split('```')[1].split('```')[0].trim() : 
                                  option}
                              </Typography>
                            ))}
                          </Box>
                          
                          <Typography 
                            sx={{ 
                              p: 2,
                              mb: 2,
                              borderRadius: 2,
                              backgroundColor: 'rgba(99, 102, 241, 0.05)',
                              color: '#4a5568',
                              fontSize: '0.9rem'
                            }}
                          >
                            <strong>Explanation:</strong> {question.explanation}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setNewBonusQuestion({...question});
                                setEditingQuestion(question);
                              }}
                              sx={{ 
                                flex: 1,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteBonusQuestion(question.id)}
                              sx={{ 
                                flex: 1,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin')}
              >
                Back to Admin Panel
              </Button>
            </Box>
          </StyledPaper>
        </Box>
      </Container>
    </>
  );
} 