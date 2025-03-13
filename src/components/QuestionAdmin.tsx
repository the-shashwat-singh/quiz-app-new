import React, { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { Question } from '../models/Question';

export default function QuestionAdmin() {
  const { addQuestion, deleteQuestion, loading } = useQuestions();
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id' | 'created_at'>>({
    text: '',
    answer_options: ['', '', '', ''],
    correct_answer: '',
    difficulty: 'easy',
    time_limit: 20,
    is_strict: true,
    explanation: '',
    is_bonus: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addQuestion(newQuestion);
      // Reset form
      setNewQuestion({
        text: '',
        answer_options: ['', '', '', ''],
        correct_answer: '',
        difficulty: 'easy',
        time_limit: 20,
        is_strict: true,
        explanation: '',
        is_bonus: false
      });
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.answer_options];
    newOptions[index] = value;
    setNewQuestion(prev => ({ ...prev, answer_options: newOptions }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Add New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Question Text</label>
          <textarea
            value={newQuestion.text}
            onChange={e => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Answer Options</label>
          <div className="space-y-2">
            {newQuestion.answer_options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={e => handleOptionChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder={`Option ${index + 1}`}
                required
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
          <select
            value={newQuestion.correct_answer}
            onChange={e => setNewQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select correct answer</option>
            {newQuestion.answer_options.map((option, index) => (
              <option key={index} value={option}>
                {option || `Option ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={newQuestion.difficulty}
            onChange={e => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value as Question['difficulty'] }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time Limit (seconds)</label>
          <input
            type="number"
            value={newQuestion.time_limit}
            onChange={e => setNewQuestion(prev => ({ ...prev, time_limit: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            min="10"
            max="300"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={newQuestion.is_strict}
            onChange={e => setNewQuestion(prev => ({ ...prev, is_strict: e.target.checked }))}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Strict Mode (Auto-submit when time runs out)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={newQuestion.is_bonus}
            onChange={e => setNewQuestion(prev => ({ ...prev, is_bonus: e.target.checked }))}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Bonus Question (Worth double points)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Explanation</label>
          <textarea
            value={newQuestion.explanation}
            onChange={e => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Question
        </button>
      </form>
    </div>
  );
} 