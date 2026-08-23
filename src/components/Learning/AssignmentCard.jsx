// ─── Assignment Card ─────────────────────────────────────────
// Guided task checklist per module. Completing every task marks
// the assignment done and awards XP via gamification utils.
// Task state persists per device under `cq-asg-<moduleId>`.
import { useState } from 'react';
import { FiClock, FiCheckCircle, FiFlag, FiZap } from 'react-icons/fi';
import { ACTIVITY_XP } from '../../utils/gamification';
import './Learning.css';

const DIFF_COLOR = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#f43f5e', Project: '#8b5cf6' };

const AssignmentCard = ({ module, isCompleted, onComplete }) => {
  const tasks = module.assignment?.tasks || [];
  const storageKey = `cq-asg-${module.id}`;

  // Restore checked tasks for this session/device
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });
  const [started, setStarted] = useState(checked.length > 0);

  const persist = (next) => {
    setChecked(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    if (next.length === tasks.length && !isCompleted) onComplete();
  };

  const toggleTask = (i) => {
    const next = checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i];
    persist(next);
  };

  const allDone = tasks.length > 0 && checked.length === tasks.length;
  const percent = tasks.length ? Math.round((checked.length / tasks.length) * 100) : 0;
  const diffColor = DIFF_COLOR[module.assignment?.difficulty] || '#f59e0b';
  const finished = allDone || isCompleted;

  if (!module.assignment) return null;

  return (
    <div className={`asg-card ${finished ? 'asg-done' : ''}`}>
      <div className="asg-header">
        <div className="asg-heading">
          <h3><FiFlag /> {module.assignment.title}</h3>
          <div className="asg-meta">
            <span className="asg-diff" style={{ color: diffColor, background: `${diffColor}14`, borderColor: `${diffColor}30` }}>
              {module.assignment.difficulty}
            </span>
            <span className="asg-time"><FiClock /> Est. {module.assignment.estimatedMinutes} min</span>
            <span className="asg-reward"><FiZap /> +{ACTIVITY_XP.assignment} XP on completion</span>
          </div>
        </div>
        {isCompleted && (
          <span className="asg-complete-badge"><FiCheckCircle /> Assignment Completed</span>
        )}
      </div>

      <p className="asg-instructions">Complete the following tasks:</p>

      <ul className="asg-tasks">
        {tasks.map((task, i) => {
          const done = checked.includes(i);
          return (
            <li key={i}>
              <label className={`asg-task ${done ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleTask(i)}
                  disabled={isCompleted && !started}
                  aria-label={task}
                />
                <span className="asg-check" aria-hidden="true">
                  <svg viewBox="0 0 22 22">
                    <circle className="asg-check-ring" cx="11" cy="11" r="9" />
                    <path className="asg-check-mark" d="M6.5 11.5l3 3 6-6.5" />
                  </svg>
                </span>
                <span className="asg-task-text">
                  <span className="asg-step">{String(i + 1).padStart(2, '0')}</span>
                  {task}
                </span>
                {done && <span className="asg-done-tag">✓ Done</span>}
              </label>
            </li>
          );
        })}
      </ul>

      <div className="asg-footer">
        <div className="asg-progress-track" aria-hidden="true">
          <div className="asg-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="asg-progress-label" role="status">
          {checked.length}/{tasks.length} Tasks Completed · {percent}%
        </span>
      </div>

      {!started && !finished && (
        <button type="button" className="btn btn-primary asg-start-btn" onClick={() => setStarted(true)}>
          Start Assignment
        </button>
      )}
      {finished && (
        <div className="asg-success-note" role="status">✓ Nice work — assignment complete! (+{ACTIVITY_XP.assignment} XP)</div>
      )}
    </div>
  );
};

export default AssignmentCard;
