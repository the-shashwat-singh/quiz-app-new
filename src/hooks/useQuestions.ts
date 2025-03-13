import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Question } from '../models/Question';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchQuestions();
    
    const subscription = supabase
      .channel('questions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'questions'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setQuestions(prev => [payload.new as Question, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setQuestions(prev => prev.filter(q => q.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (question: Omit<Question, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([question])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add question');
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete question');
    }
  };

  return {
    questions,
    loading,
    error,
    addQuestion,
    deleteQuestion,
    refreshQuestions: fetchQuestions
  };
}; 