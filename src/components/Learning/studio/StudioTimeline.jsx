// ─── Studio Timeline ─────────────────────────────────────────
// Horizontal lesson timeline. Completed topics show ✓, the active
// topic glows cyan, unvisited topics stay dimmed. Topics already
// reached are clickable; future topics unlock as you advance.
import { FiCheck } from 'react-icons/fi';
import { formatTimestamp } from '../../../data/lessonVideos';

const StudioTimeline = ({ topics, index, maxReached, onJump }) => (
  <nav className="als-timeline" aria-label="Lesson topic timeline">
    <ol>
      {topics.map((t, i) => {
        const done = i < maxReached && i !== index;
        const active = i === index;
        const reachable = i <= maxReached;
        return (
          <li
            key={t.id}
            className={`${done ? 'done' : ''} ${active ? 'active' : ''} ${reachable ? '' : 'locked'}`}
          >
            <button
              type="button"
              onClick={() => reachable && onJump(i)}
              disabled={!reachable}
              aria-label={`Topic ${i + 1}: ${t.title}${done ? ' (completed)' : active ? ' (current)' : ''}`}
              aria-current={active ? 'step' : undefined}
              title={t.title}
            >
              <span className="als-tl-dot">{done ? <FiCheck size={10} /> : i + 1}</span>
              <span className="als-tl-meta">
                <span className="als-tl-title">{t.title}</span>
                <span className="als-tl-time">{formatTimestamp(t.start)}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default StudioTimeline;
