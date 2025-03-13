import React from 'react';
import { Question } from '../models/Question';
import { QuizAnswer } from '../types/quiz';

interface QuizReportCardProps {
  question: Question;
  answer: QuizAnswer;
  index: number;
}

const QuizReportCard: React.FC<QuizReportCardProps> = ({ question, answer, index }) => {
  const isBonus = question.isBonus;
  const isCorrect = answer.isCorrect;
  const selectedAnswer = answer.selectedAnswer;

  return (
    <div className={`p-6 rounded-xl shadow-lg mb-6 transform transition-all duration-300 hover:scale-[1.01] ${
      isBonus
        ? isCorrect
          ? 'bg-purple-50 border-2 border-purple-200'
          : 'bg-red-50 border-2 border-red-200'
        : isCorrect
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-red-50 border-2 border-red-200'
    }`}>
      {/* Question Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-bold text-gray-700">
            {isBonus ? 'High Stakes Question' : `Question ${index + 1}`}
          </span>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.difficulty === 'easy'
                ? 'bg-green-100 text-green-800'
                : question.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
            {isBonus && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                High Stakes
              </span>
            )}
          </div>
        </div>
        <div className={`flex items-center ${
          isCorrect
            ? isBonus
              ? 'text-purple-600'
              : 'text-green-600'
            : 'text-red-600'
        }`}>
          {isCorrect ? (
            <>
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">
                {isBonus ? '+10 points' : 'Correct'}
              </span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-medium">
                {isBonus ? '-8 points' : 'Incorrect'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-gray-800 font-medium mb-3">{question.text}</p>
        {question.text.includes('```cpp') && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {question.text.split('```cpp')[1].split('```')[0].trim()}
            </pre>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg flex items-center ${
              idx === question.correctAnswer
                ? 'bg-green-100 border-2 border-green-300'
                : idx === selectedAnswer && !isCorrect
                  ? 'bg-red-100 border-2 border-red-300'
                  : 'bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-3 ${
              idx === question.correctAnswer
                ? 'bg-green-500 text-white'
                : idx === selectedAnswer && !isCorrect
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
            }`}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span className={`flex-1 ${
              idx === question.correctAnswer
                ? 'text-green-800 font-medium'
                : idx === selectedAnswer && !isCorrect
                  ? 'text-red-800 font-medium'
                  : 'text-gray-700'
            }`}>
              {option}
            </span>
            {idx === question.correctAnswer && (
              <svg className="w-6 h-6 text-green-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-bold text-blue-800 mb-2">Explanation:</h3>
          <p className="text-blue-700 text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizReportCard; 