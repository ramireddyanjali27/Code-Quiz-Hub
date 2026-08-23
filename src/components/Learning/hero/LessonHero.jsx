// ─── Lesson Hero ─────────────────────────────────────────────
// Premium glassmorphism header for the lesson workspace.
//
//   [● INTERACTIVE LESSON]
//   [PYTHON][BEGINNER][40 MIN][MODULE 01]
//   Title · description · status · actions
//   ◷ 40 min | ● level | ◆ topics | ⚡ XP      ← live meta bar
//   LESSON PROGRESS ───────────── 0% COMPLETE  ← real store value
//
// Right column: Lesson3DVisual (CSS-3D, cursor-aware tilt).
// The bottom strip hosts the page's completion & tool controls so
// every existing behaviour stays exactly where learners expect it.
import { Link } from 'react-router-dom';
import {
  FiPlay,
  FiPlayCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { ACTIVITY_XP } from '../../../utils/gamification';
import LessonBadge from './LessonBadge';
import LessonMetaBar from './LessonMetaBar';
import LessonProgressBlock from './LessonProgressBlock';
import Lesson3DVisual from './Lesson3DVisual';
import './lessonHero.css';

/* Split "Python Introduction & Setup" → body + gradient-accent word */
const splitAccent = (title = '') => {
  const words = title.split(' ');
  if (words.length < 2) return [title, null];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
};

const STATUS = {
  available: { cls: 'ready', label: 'Ready to Learn' },
  'in-progress': { cls: 'live', label: 'In Progress' },
  completed: { cls: 'done', label: 'Lesson Completed' },
};

const LessonHero = ({
  roadmap,
  techMeta,
  mod,
  index,
  status = 'available',
  lessonPercent = 0,
  videoDone = false,
  hasAssignment = false,
  assignmentDone = false,
  hasChallenge = false,
  challengeDone = false,
  completing = false,
  completed = false,
  onStart,
  onWatch,
  heroRef,
  onMouseMove,
  onMouseLeave,
  children, // toolbar slot (completion CTA + bookmark/notes/focus)
}) => {
  const [titleBody, titleAccent] = splitAccent(mod.title);
  const st = completed ? STATUS.completed : status === 'in-progress' || videoDone || lessonPercent > 0 ? STATUS['in-progress'] : STATUS.available;

  const xpTotal =
    ACTIVITY_XP.video +
    ACTIVITY_XP.lesson +
    (hasAssignment ? ACTIVITY_XP.assignment : 0) +
    (hasChallenge ? ACTIVITY_XP.challenge : 0);

  const progressParts = [
    { label: 'Video', done: videoDone || completed },
    hasAssignment && { label: 'Assignment', done: assignmentDone },
    hasChallenge && { label: 'Challenge', done: challengeDone },
  ].filter(Boolean);

  return (
    <header
      className="lp-hero"
      ref={heroRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* ambient light */}
      <span className="lh-glow lh-glow-cyan" aria-hidden="true" />
      <span className="lh-glow lh-glow-purple" aria-hidden="true" />
      <span className="lh-sheen" aria-hidden="true" />

      <nav className="lp-crumb" aria-label="Breadcrumb">
        <Link to="/technologies">Technologies</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/technologies/${roadmap.id}`}>{roadmap.name}</Link>
        <span aria-hidden="true">/</span>
        <span className="lp-crumb-here">{mod.title}</span>
      </nav>

      <div className="lh-main">
        <div className="lh-copy">
          <p className={`lh-kicker anim a1`}>
            <span className="lh-kicker-dot" aria-hidden="true" />
            Interactive Lesson
          </p>

          <div className="lh-badges anim a2">
            <LessonBadge tone="tech" icon={<span aria-hidden="true">{techMeta?.icon || '◆'}</span>}>
              {roadmap.name.toUpperCase()}
            </LessonBadge>
            <LessonBadge tone={mod.level.toLowerCase()}>{mod.level}</LessonBadge>
            <LessonBadge tone="neutral" mono icon={<FiPlayCircle aria-hidden="true" />}>
              {String(mod.minutes).padStart(2, '0')} MIN
            </LessonBadge>
            <LessonBadge tone="module" mono>MODULE {String(index + 1).padStart(2, '0')}</LessonBadge>
          </div>

          <h1 className="lh-title anim a3">
            {titleBody} {titleAccent && <span className="lh-title-accent">{titleAccent}</span>}
          </h1>

          <p className="lh-summary anim a4">{mod.summary}</p>

          <div className="anim a5">
            <LessonMetaBar minutes={mod.minutes} level={mod.level} topics={(mod.objectives || []).length} xp={xpTotal} />
          </div>

          <p className={`lh-status is-${st.cls} anim a6`}>
            {completed ? (
              <FiCheckCircle className="lh-status-ic" aria-hidden="true" />
            ) : (
              <span className="lh-status-dot" aria-hidden="true" />
            )}
            <span>{st.label}</span>
          </p>
        </div>

        {/* 3D visual — order handled in CSS for mobile stacking */}
        <Lesson3DVisual accent={roadmap.color} />

        <div className="lh-actions anim a7">
          {!completed ? (
            <button type="button" className="lh-btn lh-btn-start" onClick={onStart}>
              <FiPlay aria-hidden="true" /> Start Lesson
            </button>
          ) : (
            <button type="button" className="lh-btn lh-btn-start" onClick={onStart}>
              <FiPlay aria-hidden="true" /> Review Lesson
            </button>
          )}
          <button type="button" className="lh-btn lh-btn-watch" onClick={onWatch}>
            <FiPlayCircle aria-hidden="true" /> Watch Lesson
          </button>
        </div>

        <div className="lh-progress-wrap anim a8">
          <LessonProgressBlock percent={lessonPercent} parts={progressParts} />
        </div>
      </div>

      {/* completion / tools strip — existing functionality */}
      <div className="lh-toolbar">{children}</div>

      {completing && <span className="sr-only" role="status">Completing lesson…</span>}
    </header>
  );
};

export default LessonHero;
