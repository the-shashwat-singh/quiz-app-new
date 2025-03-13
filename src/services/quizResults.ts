import { supabase } from '../lib/supabaseClient';

export interface QuizResult {
  id: string;
  student_reg_no: string;
  student_name: string;
  score: number;
  total_questions: number;
  time_taken: number;
  timestamp: string;
  quiz_type: string;
  answers: Array<{
    question_id: string;
    answer: string;
    is_correct: boolean;
  }>;
}

export const quizResultsService = {
  // Save a new quiz result
  async saveResult(result: Omit<QuizResult, 'id' | 'timestamp'>): Promise<QuizResult> {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([result])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all quiz results
  async getResults(): Promise<QuizResult[]> {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get results for a specific student
  async getStudentResults(regNo: string): Promise<QuizResult[]> {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('student_reg_no', regNo)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Clear all results (admin only)
  async clearResults(): Promise<void> {
    const { error } = await supabase
      .from('quiz_results')
      .delete()
      .neq('id', 'dummy'); // Delete all records

    if (error) throw error;
  },

  // Subscribe to real-time updates
  subscribeToResults(callback: (payload: any) => void) {
    return supabase
      .channel('quiz_results')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_results'
        },
        callback
      )
      .subscribe();
  }
}; 