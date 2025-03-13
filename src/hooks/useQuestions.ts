import { useState, useEffect } from 'react';
import { Question } from '../models/Question';
import { supabaseService } from '../services/supabase';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch initial questions
    fetchQuestions();

    // Subscribe to real-time updates
    const subscription = supabaseService.subscribeToQuestions((payload) => {
      if (payload.eventType === 'INSERT') {
        setQuestions(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setQuestions(prev => 
          prev.map(q => q.id === payload.new.id ? payload.new : q)
        );
      } else if (payload.eventType === 'DELETE') {
        setQuestions(prev => 
          prev.filter(q => q.id !== payload.old.id)
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (question: Omit<Question, 'id'>) => {
    try {
      const newQuestion = await supabaseService.addQuestion(question);
      setQuestions(prev => [...prev, newQuestion]);
      return newQuestion;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add question'));
      throw err;
    }
  };

  const updateQuestion = async (id: number, question: Partial<Question>) => {
    try {
      const updatedQuestion = await supabaseService.updateQuestion(id, question);
      setQuestions(prev => 
        prev.map(q => q.id === id ? updatedQuestion : q)
      );
      return updatedQuestion;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update question'));
      throw err;
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      await supabaseService.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete question'));
      throw err;
    }
  };

  return {
    questions,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    refreshQuestions: fetchQuestions
  };
}; 