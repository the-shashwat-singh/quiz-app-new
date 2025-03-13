import { Question } from '../models/Question';

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  isBonus?: boolean;
}

export interface QuizData {
  questions: Question[];
  answers: QuizAnswer[];
  regularScore: number;
  bonusScore: number;
  score: number;
  totalQuestions: number;
  tookBonusQuestion: boolean;
}

export interface QuizResultWithDate {
  regNumber: string;
  name: string;
  regularScore: number;
  bonusScore: number;
  score: number;
  tookBonusQuestion: boolean;
  timestamp: string;
  date: string;
  difficultyScores: {
    easy: number;
    medium: number;
    difficult: number;
  };
}

export interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  participantsToday: number;
  averageScoreToday: number;
  participantsThisWeek: number;
  averageScoreThisWeek: number;
  participantsThisMonth: number;
  averageScoreThisMonth: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    difficult: number;
  };
  topPerformers: QuizResultWithDate[];
} 