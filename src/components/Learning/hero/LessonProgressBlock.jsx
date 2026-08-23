// ─── Lesson Progress Block ───────────────────────────────────
// Live lesson progress: animated blue→cyan gradient bar plus the
// per-part checklist (video / assignment / challenge). The value
// is passed straight from the page's progress store — never 0.
import { FiCheck } from 'react-icons/fi';

const LessonProgressBlock = ({ percent, parts = [] }) => (
  <div className="lh-progress">
    <div className="lh-progress-head">
      <span className="lh-progress-label">Lesson Progress</span>
      <strong className="lh-progress-value">{percent}% Complete</strong>
    </div>
    <div
      className="lh-progress-track"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Lesson progress"
    >
      <span style={{ width: `${percent}%` }} />
    </div>
    {parts.length > 0 && (
      <ul className="lh-progress-parts">
        {parts.map((p) => (
          <li key={p.label} className={p.done ? 'done' : ''}>
            <FiCheck aria-hidden="true" /> {p.label}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default LessonProgressBlock;
