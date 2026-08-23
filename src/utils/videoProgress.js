// ─── Video Progress Store ────────────────────────────────────
// Per-lesson video watch state in localStorage:
//   { seconds, percent, completed }
// `completed` flips only through real engagement: watching ≥90%
// of an actual video, or passing the lesson's understanding
// check when no video source exists yet. Idempotent.

const KEY = 'cq-video-progress';

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

export const getVideoProgress = (techId, lessonId) => ({
  seconds: 0,
  percent: 0,
  completed: false,
  ...(readAll()[`${techId}/${lessonId}`] || {}),
});

export const saveWatchPosition = (techId, lessonId, { seconds, percent }) => {
  const all = readAll();
  const k = `${techId}/${lessonId}`;
  all[k] = { ...getVideoProgress(techId, lessonId), seconds, percent };
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const isVideoComplete = (techId, lessonId) =>
  getVideoProgress(techId, lessonId).completed;

/** Marks the video section complete. Returns true only on the first call. */
export const markVideoComplete = (techId, lessonId) => {
  const all = readAll();
  const k = `${techId}/${lessonId}`;
  if (all[k]?.completed) return false;
  all[k] = { ...getVideoProgress(techId, lessonId), completed: true };
  localStorage.setItem(KEY, JSON.stringify(all));
  return true;
};
