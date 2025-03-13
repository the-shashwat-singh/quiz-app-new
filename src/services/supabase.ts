import { supabase } from '../config/supabase';
import { Question } from '../models/Question';

export const supabaseService = {
  // Fetch all questions
  async getQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id');

    if (error) throw error;
    return data.map(q => ({
      ...q,
      options: q.answer_options,
      correctAnswer: q.correct_answer,
      timeLimit: q.time_limit,
      isStrict: q.is_strict,
      isBonus: q.is_bonus
    }));
  },

  // Add a new question
  async addQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        text: question.text,
        answer_options: question.options,
        correct_answer: question.correctAnswer,
        difficulty: question.difficulty,
        time_limit: question.timeLimit,
        is_strict: question.isStrict,
        explanation: question.explanation,
        is_bonus: question.isBonus
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      options: data.answer_options,
      correctAnswer: data.correct_answer,
      timeLimit: data.time_limit,
      isStrict: data.is_strict,
      isBonus: data.is_bonus
    };
  },

  // Update a question
  async updateQuestion(id: number, question: Partial<Question>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .update({
        text: question.text,
        answer_options: question.options,
        correct_answer: question.correctAnswer,
        difficulty: question.difficulty,
        time_limit: question.timeLimit,
        is_strict: question.isStrict,
        explanation: question.explanation,
        is_bonus: question.isBonus
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      options: data.answer_options,
      correctAnswer: data.correct_answer,
      timeLimit: data.time_limit,
      isStrict: data.is_strict,
      isBonus: data.is_bonus
    };
  },

  // Delete a question
  async deleteQuestion(id: number): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Subscribe to real-time updates
  subscribeToQuestions(callback: (payload: any) => void) {
    return supabase
      .channel('questions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'questions' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
}; 