import { useState, useEffect } from 'react';
import { quizResultsService, QuizResult } from '../services/quizResults';

export const useQuizResults = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch initial results
    fetchResults();

    // Subscribe to real-time updates
    const subscription = quizResultsService.subscribeToResults((payload) => {
      if (payload.eventType === 'INSERT') {
        setResults(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setResults(prev => prev.filter(r => r.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await quizResultsService.getResults();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch results'));
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (result: Omit<QuizResult, 'id' | 'timestamp'>) => {
    try {
      const newResult = await quizResultsService.saveResult(result);
      setResults(prev => [newResult, ...prev]);
      return newResult;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save result'));
      throw err;
    }
  };

  const clearResults = async () => {
    try {
      await quizResultsService.clearResults();
      setResults([]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear results'));
      throw err;
    }
  };

  return {
    results,
    loading,
    error,
    saveResult,
    clearResults,
    refreshResults: fetchResults
  };
}; 