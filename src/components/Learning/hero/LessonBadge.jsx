// ─── Lesson Badge ────────────────────────────────────────────
// Pill-shaped metadata badge used in the lesson hero.
// tone: tech | beginner | intermediate | advanced | project | neutral
const LessonBadge = ({ icon, children, tone = 'neutral', mono = false }) => (
  <span className={`lh-badge is-${tone}${mono ? ' lh-mono' : ''}`}>
    {icon != null && <span className="lh-badge-ic" aria-hidden="true">{icon}</span>}
    <span className="lh-badge-label">{children}</span>
  </span>
);

export default LessonBadge;
