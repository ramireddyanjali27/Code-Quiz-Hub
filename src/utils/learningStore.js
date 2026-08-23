// ─── Learning Progress Store ─────────────────────────────────
// Tracks roadmap/lesson/assignment/challenge completion per
// technology in localStorage — separate from quiz performance.

const KEY = 'cq-learning-progress';

const EMPTY_TECH = {
  lessons: [],        // [lessonId]
  assignments: [],    // [assignmentId]
  challenges: [],     // [challengeId]
  lastLessonId: null, // for "Continue Learning"
};

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const writeAll = (all) => localStorage.setItem(KEY, JSON.stringify(all));

export const getTechProgress = (techId) => ({
  ...EMPTY_TECH,
  ...(readAll()[techId] || {}),
});

const updateTech = (techId, mutator) => {
  const all = readAll();
  const current = { ...EMPTY_TECH, ...(all[techId] || {}) };
  all[techId] = mutator(current);
  writeAll(all);
  return all[techId];
};

export const isLessonComplete = (techId, lessonId) =>
  getTechProgress(techId).lessons.includes(lessonId);

export const isAssignmentComplete = (techId, assignmentId) =>
  getTechProgress(techId).assignments.includes(assignmentId);

export const isChallengeComplete = (techId, challengeId) =>
  getTechProgress(techId).challenges.includes(challengeId);

export const markLessonComplete = (techId, lessonId) => {
  updateTech(techId, (t) => ({
    ...t,
    lessons: t.lessons.includes(lessonId) ? t.lessons : [...t.lessons, lessonId],
    lastLessonId: lessonId,
  }));
};

export const setLastLesson = (techId, lessonId) => {
  updateTech(techId, (t) => ({ ...t, lastLessonId: lessonId }));
};

export const toggleAssignmentComplete = (techId, assignmentId) => {
  return updateTech(techId, (t) => ({
    ...t,
    assignments: t.assignments.includes(assignmentId)
      ? t.assignments.filter((a) => a !== assignmentId)
      : [...t.assignments, assignmentId],
  })).assignments.includes(assignmentId);
};

export const markChallengeComplete = (techId, challengeId) => {
  updateTech(techId, (t) => ({
    ...t,
    challenges: t.challenges.includes(challengeId) ? t.challenges : [...t.challenges, challengeId],
  }));
};

// ─── Aggregated progress ─────────────────────────────────────
// Learning % is based on lessons (70%), assignments (15%),
// coding challenges (15%).
export const computeProgressPercent = (tech, progress) => {
  const total = tech.modules.length;
  if (!total) return 0;
  const lessons = progress.lessons.length / total;
  const assignments = progress.assignments.length / total;
  const challenges = progress.challenges.length / total;
  return Math.round((lessons * 0.7 + assignments * 0.15 + challenges * 0.15) * 100);
};

// Status of a module within its roadmap.
// Modules unlock sequentially: index 0 is always available;
// module N unlocks when module N-1's lesson is completed.
export const getModuleStatus = (tech, index, progress) => {
  const mod = tech.modules[index];
  if (!mod) return 'locked';
  if (progress.lessons.includes(mod.id)) return 'completed';
  if (progress.lastLessonId === mod.id) return 'in-progress';
  if (index === 0) return 'available';
  const prev = tech.modules[index - 1];
  return progress.lessons.includes(prev.id) ? 'available' : 'locked';
};

// First module that still needs attention — used by "Continue Learning".
export const getNextLesson = (tech, progress) => {
  const next =
    tech.modules.find(
      (m, i) => getModuleStatus(tech, i, progress) === 'in-progress'
    ) ||
    tech.modules.find(
      (m, i) => getModuleStatus(tech, i, progress) === 'available'
    );
  return next || tech.modules[0];
};
