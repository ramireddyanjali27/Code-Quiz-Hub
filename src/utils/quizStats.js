// ─── Quiz Attempt Stats Store ────────────────────────────────
// Persists per-quiz attempts & best scores, plus overall
// practice performance — fully separate from learning progress.

const KEY = 'cq-quiz-stats';

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

// quiz: { id, title }, attempt: { percentage }
export const recordAttempt = (quiz, { percentage }) => {
  const all = readAll();
  const s = all[quiz.id] || { attempts: 0, bestScore: 0, lastScore: 0, scores: [] };
  s.attempts += 1;
  s.lastScore = percentage;
  s.bestScore = Math.max(s.bestScore, percentage);
  s.scores = [...(s.scores || []), percentage].slice(-10);
  s.title = quiz.title;
  s.technology = quiz.technology;
  all[quiz.id] = s;
  localStorage.setItem(KEY, JSON.stringify(all));
  return s;
};

export const getQuizStats = (quizId) =>
  readAll()[quizId] || { attempts: 0, bestScore: null, lastScore: null };

// Overall practice stats for the dashboard
export const getOverallQuizStats = () => {
  const all = Object.values(readAll());
  const quizzesCompleted = all.reduce((n, s) => n + s.attempts, 0);
  const scores = all.flatMap((s) => s.scores || []);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  return { quizzesCompleted, avgScore, bestScore, technologies: all.length };
};
