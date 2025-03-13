import React from 'react';
import { useQuizResults } from '../hooks/useQuizResults';

export default function AdminAnalytics() {
  const { results, loading, error, clearResults } = useQuizResults();

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div>Error loading analytics: {error.message}</div>;
  }

  const averageScore = results.length > 0
    ? results.reduce((acc, result) => acc + result.score, 0) / results.length
    : 0;

  const highestScore = results.length > 0
    ? Math.max(...results.map(result => result.score))
    : 0;

  const lowestScore = results.length > 0
    ? Math.min(...results.map(result => result.score))
    : 0;

  const totalParticipants = results.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quiz Analytics</h2>
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear All Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Participants</h3>
          <p className="text-2xl font-bold">{totalParticipants}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Score</h3>
          <p className="text-2xl font-bold">{averageScore.toFixed(1)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Highest Score</h3>
          <p className="text-2xl font-bold">{highestScore}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Lowest Score</h3>
          <p className="text-2xl font-bold">{lowestScore}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Taken
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {result.student_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {result.student_reg_no}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {result.score} / {result.total_questions}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {Math.floor(result.time_taken / 60)}m {result.time_taken % 60}s
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 