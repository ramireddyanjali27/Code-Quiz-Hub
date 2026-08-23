// ─── Gamification: XP, Levels & Achievements ─────────────────
// Stats are persisted in localStorage so the experience works
// without a backend connection.

const STATS_KEY = 'cq-gamification-stats';

// ─── Level ranks (every 500 XP) ──────────────────────────────
export const LEVEL_RANKS = [
  { min: 0, name: 'Novice', icon: '🌱' },
  { min: 500, name: 'Coder', icon: '💻' },
  { min: 1000, name: 'Hacker', icon: '⚡' },
  { min: 2000, name: 'Wizard', icon: '🧙' },
  { min: 3500, name: 'Master', icon: '🏆' },
  { min: 5000, name: 'Grandmaster', icon: '👑' },
];

export const XP_PER_LEVEL = 500;

export const getLevelInfo = (xp) => {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const rank =
    [...LEVEL_RANKS].reverse().find((r) => xp >= r.min) || LEVEL_RANKS[0];
  return {
    level,
    rank: rank.name,
    rankIcon: rank.icon,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    progressPercent: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
  };
};

// ─── Achievement definitions ─────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_quiz', icon: '🎬', title: 'First Steps', desc: 'Complete your very first quiz', xp: 50 },
  { id: 'first_pass', icon: '🥉', title: 'Rookie Passer', desc: 'Pass your first quiz', xp: 100 },
  { id: 'perfect_score', icon: '💎', title: 'Flawless Mind', desc: 'Score 100% on any quiz', xp: 250 },
  { id: 'speed_demon', icon: '🌪️', title: 'Speed Demon', desc: 'Finish a quiz with over half the time left', xp: 150 },
  { id: 'five_quizzes', icon: '🔥', title: 'On Fire', desc: 'Complete 5 quizzes', xp: 200 },
  { id: 'advanced_pass', icon: '🏔️', title: 'Summit Climber', desc: 'Pass an Advanced quiz', xp: 300 },
  { id: 'explorer', icon: '🧭', title: 'Explorer', desc: 'Try quizzes from 3 different technologies', xp: 200 },
  { id: 'no_skip', icon: '🎯', title: 'No Hesitation', desc: 'Answer every question — no skips', xp: 120 },
  { id: 'veteran', icon: '🛡️', title: 'Veteran', desc: 'Complete 10 quizzes', xp: 400 },
  { id: 'high_scorer', icon: '🌟', title: 'High Scorer', desc: 'Score 90% or above', xp: 180 },
  { id: 'first_lesson', icon: '📖', title: 'Bookworm', desc: 'Complete your first lesson', xp: 50 },
  { id: 'code_challenger', icon: '🧑‍💻', title: 'Code Challenger', desc: 'Submit a coding challenge', xp: 80 },
  { id: 'roadmap_25', icon: '🛤️', title: 'Pathfinder', desc: 'Reach 25% on any roadmap', xp: 150 },
  { id: 'roadmap_50', icon: '⛰️', title: 'Halfway Hero', desc: 'Reach 50% on any roadmap', xp: 250 },
  { id: 'roadmap_100', icon: '🎓', title: 'Roadmap Completed', desc: 'Finish an entire technology roadmap', xp: 500 },
  { id: 'streak_7', icon: '🔥', title: '7 Day Streak', desc: 'Learn something 7 days in a row', xp: 300 },
];

// XP awarded per learning activity type
export const ACTIVITY_XP = {
  lesson: 30,
  assignment: 40,
  challenge: 50,
  video: 50,
  checkpoint: 10,
};

// ─── Default stats shape ─────────────────────────────────────
const DEFAULT_STATS = {
  totalXp: 0,
  quizzesCompleted: 0,
  quizzesPassed: 0,
  perfectScores: 0,
  technologiesTried: [],
  unlockedIds: [],
  lessonsCompleted: 0,
  assignmentsCompleted: 0,
  challengesCompleted: 0,
  videosCompleted: 0,
  checkpointsPassed: 0,
  streakBest: 0,
};

export const getStats = () => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
};

const saveStats = (stats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// ─── Record a finished quiz & detect new achievements ────────
// `result`: { percentage, passed, skippedCount, totalQuestions, timeLeftRatio }
// `quiz`:   { technology, difficulty }
// Returns { stats, newlyUnlocked: [achievement] }
export const recordQuizResult = ({ result, quiz }) => {
  const stats = getStats();
  const before = new Set(stats.unlockedIds);
  const newlyUnlocked = [];

  const grant = (id) => {
    if (before.has(id)) return;
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;
    stats.unlockedIds.push(id);
    stats.totalXp += ach.xp;
    newlyUnlocked.push(ach);
  };

  stats.quizzesCompleted += 1;
  if (!stats.technologiesTried.includes(quiz.technology)) {
    stats.technologiesTried.push(quiz.technology);
  }

  if (result.passed) {
    stats.quizzesPassed += 1;
    if (result.percentage >= 90) grant('high_scorer');
    if (result.percentage === 100) {
      stats.perfectScores += 1;
      grant('perfect_score');
    }
    if (result.timeLeftRatio > 0.5) grant('speed_demon');
    if (quiz.difficulty === 'ADVANCED') grant('advanced_pass');
    grant('first_pass');
  }

  if (result.skippedCount === 0 && result.totalQuestions > 0) grant('no_skip');
  if (stats.quizzesCompleted >= 5) grant('five_quizzes');
  if (stats.quizzesCompleted >= 10) grant('veteran');
  if (stats.technologiesTried.length >= 3) grant('explorer');
  grant('first_quiz');

  saveStats(stats);
  return { stats, newlyUnlocked };
};

// ─── Record a learning activity (lesson / assignment / challenge) ──
// Returns { stats, newlyUnlocked, xpGained }
export const recordActivity = (type, { roadmapPercent = 0 } = {}) => {
  const stats = getStats();
  const before = new Set(stats.unlockedIds);
  const newlyUnlocked = [];

  const grant = (id) => {
    if (before.has(id)) return;
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;
    stats.unlockedIds.push(id);
    stats.totalXp += ach.xp;
    newlyUnlocked.push(ach);
  };

  if (type === 'lesson') {
    stats.lessonsCompleted += 1;
    grant('first_lesson');
  } else if (type === 'assignment') {
    stats.assignmentsCompleted += 1;
  } else if (type === 'challenge') {
    stats.challengesCompleted += 1;
    grant('code_challenger');
  } else if (type === 'video') {
    stats.videosCompleted = (stats.videosCompleted || 0) + 1;
  } else if (type === 'checkpoint') {
    stats.checkpointsPassed = (stats.checkpointsPassed || 0) + 1;
  }

  if (roadmapPercent >= 25) grant('roadmap_25');
  if (roadmapPercent >= 50) grant('roadmap_50');
  if (roadmapPercent >= 100) grant('roadmap_100');

  const xpGained = ACTIVITY_XP[type] || 0;
  stats.totalXp += xpGained;
  saveStats(stats);
  return { stats, newlyUnlocked, xpGained };
};

// ─── Learning streak (consecutive active days) ───────────────
const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const touchStreak = () => {
  const raw = localStorage.getItem('cq-streak');
  let data = raw ? JSON.parse(raw) : { last: null, current: 0 };
  const today = dayKey();
  if (data.last === today) return data.current;

  const yesterday = dayKey(new Date(Date.now() - 86400000));
  data.current = data.last === yesterday ? data.current + 1 : 1;
  data.last = today;
  localStorage.setItem('cq-streak', JSON.stringify(data));

  // Award streak achievement (with XP) the first time 7 days is hit
  if (data.current >= 7) {
    const stats = getStats();
    if (!stats.unlockedIds.includes('streak_7')) {
      const ach = ACHIEVEMENTS.find((a) => a.id === 'streak_7');
      stats.unlockedIds.push('streak_7');
      stats.totalXp += ach.xp;
      saveStats(stats);
    } else {
      const fresh = getStats();
      if (data.current > (fresh.streakBest || 0)) {
        fresh.streakBest = data.current;
        saveStats(fresh);
      }
    }
  }

  const stats2 = getStats();
  if (data.current > (stats2.streakBest || 0)) {
    stats2.streakBest = data.current;
    saveStats(stats2);
  }
  return data.current;
};

export const getStreak = () => {
  try {
    const data = JSON.parse(localStorage.getItem('cq-streak'));
    if (!data) return 0;
    // streak only counts if user was active today or yesterday
    const today = dayKey();
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    return data.last === today || data.last === yesterday ? data.current : 0;
  } catch {
    return 0;
  }
};

// ─── Daily goal: complete N lessons per day ──────────────────
export const DAILY_GOAL_LESSONS = 3;

export const getDailyGoal = () => {
  try {
    const raw = JSON.parse(localStorage.getItem('cq-daily-lessons'));
    const today = dayKey();
    if (!raw || raw.date !== today) return { date: today, count: 0 };
    return raw;
  } catch {
    return { date: dayKey(), count: 0 };
  }
};

export const incrementDailyLessons = () => {
  const goal = getDailyGoal();
  goal.count += 1;
  localStorage.setItem('cq-daily-lessons', JSON.stringify(goal));
  return goal;
};
