import React, { useState, useEffect } from 'react';
import { Question } from '../models/Question';
import { useQuestions } from '../hooks/useQuestions';
import { useQuizResults } from '../hooks/useQuizResults';
import Timer from './Timer';
import QuizReportCard from './QuizReportCard';

interface QuizProps {
  studentRegNo: string;
  studentName: string;
  onComplete: () => void;
}

export default function Quiz({ studentRegNo, studentName, onComplete }: QuizProps) {
  const { questions, loading: questionsLoading } = useQuestions();
  const { saveResult } = useQuizResults();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      setTimeLeft(questions[0].time_limit);
    }
  }, [questions]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(questions[currentQuestionIndex + 1].time_limit);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const score = questions.reduce((acc, question) => {
        const userAnswer = answers[question.id];
        if (userAnswer === question.correct_answer) {
          return acc + (question.is_bonus ? 2 : 1);
        }
        return acc;
      }, 0);

      await saveResult({
        student_reg_no: studentRegNo,
        student_name: studentName,
        score,
        total_questions: questions.length,
        time_taken: questions.reduce((acc, q) => acc + q.time_limit - timeLeft, 0),
        quiz_type: 'general',
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: questionId,
          answer,
          is_correct: answer === questions.find(q => q.id === questionId)?.correct_answer
        }))
      });

      setIsComplete(true);
      setShowReport(true);
      onComplete();
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      // Handle error appropriately
    }
  };

  if (questionsLoading) {
    return <div>Loading quiz...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!showReport ? (
        <div>
          <div className="mb-4">
            <Timer
              timeLeft={timeLeft}
              onTimeUp={handleNext}
              isStrict={currentQuestion.is_strict}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            
            <p className="text-lg mb-4">{currentQuestion.text}</p>
            
            <div className="space-y-3">
              {currentQuestion.answer_options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                  className={`w-full p-3 text-left rounded-lg border ${
                    answers[currentQuestion.id] === option
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuizReportCard
                key={question.id}
                question={question}
                userAnswer={answers[question.id]}
                isCorrect={answers[question.id] === question.correct_answer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 