import React, { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { Question } from '../models/Question';

const QuestionAdmin: React.FC = () => {
  const { questions, loading, error, addQuestion, deleteQuestion } = useQuestions();
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'easy' as 'easy' | 'medium' | 'difficult',
    timeLimit: 20,
    isStrict: false,
    explanation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addQuestion(newQuestion);
      // Reset form
      setNewQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'easy',
        timeLimit: 20,
        isStrict: false,
        explanation: ''
      });
    } catch (err) {
      console.error('Failed to add question:', err);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Question Management</h1>
      
      {/* Question List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Existing Questions</h2>
        {questions.map((q: Question) => (
          <div key={q.id} className="border p-4 mb-4 rounded-lg">
            <p className="font-medium">{q.text}</p>
            <div className="mt-2">
              {q.options.map((option, index) => (
                <p key={index} className={index === q.correctAnswer ? 'text-green-600' : ''}>
                  {index + 1}. {option}
                </p>
              ))}
            </div>
            <p className="mt-2 text-sm">Difficulty: {q.difficulty}</p>
            <button
              onClick={() => deleteQuestion(q.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Question Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Question Text:</label>
            <textarea
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Options:</label>
            {newQuestion.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder={`Option ${index + 1}`}
                required
              />
            ))}
          </div>

          <div>
            <label className="block mb-2">Correct Answer:</label>
            <select
              value={newQuestion.correctAnswer}
              onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            >
              {newQuestion.options.map((_, index) => (
                <option key={index} value={index}>Option {index + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Difficulty:</label>
            <select
              value={newQuestion.difficulty}
              onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as 'easy' | 'medium' | 'difficult' })}
              className="w-full p-2 border rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Time Limit (seconds):</label>
            <input
              type="number"
              value={newQuestion.timeLimit}
              onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newQuestion.isStrict}
                onChange={(e) => setNewQuestion({ ...newQuestion, isStrict: e.target.checked })}
                className="mr-2"
              />
              Strict Mode
            </label>
          </div>

          <div>
            <label className="block mb-2">Explanation:</label>
            <textarea
              value={newQuestion.explanation}
              onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionAdmin; 