import { QuizResultWithDate, QuizAnalytics } from '../types/quiz';

export function calculateAnalytics(results: QuizResultWithDate[]): QuizAnalytics {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todayResults = results.filter(r => r.date === today);
  const weekResults = results.filter(r => r.date >= weekAgo);
  const monthResults = results.filter(r => r.date >= monthAgo);

  const calculateAverage = (arr: QuizResultWithDate[]) => 
    arr.length ? arr.reduce((sum, r) => sum + r.score, 0) / arr.length : 0;

  // Calculate total correct answers for each difficulty level
  const difficultyTotals = results.reduce((acc, result) => {
    if (result.difficultyScores) {
      acc.easy += result.difficultyScores.easy;
      acc.medium += result.difficultyScores.medium;
      acc.difficult += result.difficultyScores.difficult;
    }
    return acc;
  }, { easy: 0, medium: 0, difficult: 0 });

  const totalCorrectAnswers = difficultyTotals.easy + difficultyTotals.medium + difficultyTotals.difficult;

  // Calculate percentage distribution
  const difficultyDistribution = {
    easy: totalCorrectAnswers ? Math.round((difficultyTotals.easy / totalCorrectAnswers) * 100) : 0,
    medium: totalCorrectAnswers ? Math.round((difficultyTotals.medium / totalCorrectAnswers) * 100) : 0,
    difficult: totalCorrectAnswers ? Math.round((difficultyTotals.difficult / totalCorrectAnswers) * 100) : 0
  };

  // Sort by score and get top 10 performers
  const topPerformers = [...results]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return {
    totalAttempts: results.length,
    averageScore: calculateAverage(results),
    highestScore: results.length ? Math.max(...results.map(r => r.score)) : 0,
    participantsToday: todayResults.length,
    averageScoreToday: calculateAverage(todayResults),
    participantsThisWeek: weekResults.length,
    averageScoreThisWeek: calculateAverage(weekResults),
    participantsThisMonth: monthResults.length,
    averageScoreThisMonth: calculateAverage(monthResults),
    difficultyDistribution,
    topPerformers
  };
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
} 