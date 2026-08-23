// ─── Lesson Meta Bar ─────────────────────────────────────────
// Professional metadata row: duration · level · topics · XP.
// Every value comes from real lesson data (no hardcoding).
import { FiClock, FiTarget, FiZap } from 'react-icons/fi';

const LessonMetaBar = ({ minutes, level = 'BEGINNER', topics, xp }) => (
  <ul className="lh-meta" aria-label="Lesson details">
    <li>
      <FiClock className="lh-meta-ic is-cyan" aria-hidden="true" />
      <span><strong>{minutes}</strong> min</span>
    </li>
    <li>
      <span className="lh-meta-dot" data-level={level} aria-hidden="true" />
      <span className="lh-cap">{level.toLowerCase()}</span>
    </li>
    <li>
      <FiTarget className="lh-meta-ic is-purple" aria-hidden="true" />
      <span><strong>{topics}</strong> topic{topics === 1 ? '' : 's'}</span>
    </li>
    <li>
      <FiZap className="lh-meta-ic is-amber" aria-hidden="true" />
      <span><strong>+{xp}</strong> XP</span>
    </li>
  </ul>
);

export default LessonMetaBar;
