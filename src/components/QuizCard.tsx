import React from 'react';
import { Question } from '../models/Question';
import Image from 'next/image';

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  isAnswered: boolean;
  onAnswerSelect: (index: number) => void;
  timeLimit: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  isAnswered,
  onAnswerSelect,
  timeLimit,
}) => {
  // Check if the question contains an image
  const hasImage = question.text.includes('![');
  // Get the question text without the code block if there's an image
  const questionText = hasImage 
    ? question.text.split('![')[0].trim() 
    : question.text;
  // Extract image URL if present
  const imageUrl = hasImage 
    ? question.text.match(/!\[.*?\]\((.*?)\)/)?.[1] 
    : null;
  // Get code block only if there's no image
  const codeBlock = !hasImage && question.text.includes('```cpp') 
    ? question.text.split('```cpp')[1].split('```')[0].trim()
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            question.difficulty === 'easy' 
              ? 'bg-green-100 text-green-800'
              : question.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          {question.isBonus && (
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
              High Stakes
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-gray-600 text-sm">Time Limit:</span>
          <span className="ml-2 font-bold text-indigo-600">{timeLimit}s</span>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{questionText}</h2>
        
        {/* Display image if present */}
        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Image
                src={imageUrl}
                alt="Code snippet"
                width={800}
                height={400}
                className="rounded-lg shadow-md"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        {/* Display code block only if no image is present */}
        {codeBlock && (
          <div className="bg-gray-800 rounded-lg p-4">
            <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {codeBlock}
            </pre>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isAnswered && onAnswerSelect(index)}
            disabled={isAnswered}
            className={`p-4 text-left rounded-lg transition-all duration-200 transform hover:scale-[1.01] ${
              !isAnswered
                ? 'hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300'
                : selectedAnswer === index
                  ? selectedAnswer === question.correctAnswer
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                  : index === question.correctAnswer
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-50 border-2 border-gray-200'
            } ${
              !isAnswered && 'hover:shadow-md cursor-pointer'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                !isAnswered
                  ? 'bg-gray-200 text-gray-700'
                  : selectedAnswer === index
                    ? selectedAnswer === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : index === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={`flex-1 font-medium ${
                isAnswered && index === question.correctAnswer ? 'text-green-700' : 'text-gray-700'
              }`}>
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation (shown after answering) */}
      {isAnswered && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-bold text-blue-800 mb-2">Explanation:</h3>
          <p className="text-blue-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizCard; 