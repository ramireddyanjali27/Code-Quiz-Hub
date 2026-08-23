// ─── Video Lesson ────────────────────────────────────────────
// Premium cinematic player card for the lesson workspace. The
// lesson title / objectives live in the page hero & "What You'll
// Learn" grid, so this component stays a focused media teaser.
// The play button opens the full Interactive Lesson Video
// Studio (LessonVideoModal) — nothing is faked as "playing".
import { FiPlay, FiClock, FiCode } from 'react-icons/fi';
import { LuBraces } from 'react-icons/lu';
import './Learning.css';

const VideoLesson = ({ module, color = 'var(--primary)', onLaunch }) => {
  const mm = String(Math.floor(module.minutes)).padStart(2, '0');
  const ss = String(Math.round((module.minutes % 1) * 60)).padStart(2, '0');

  return (
    <div className="vl-wrap">
      <div
        className="vl-player"
        style={{ '--tech-color': color }}
        role="group"
        aria-label={`Video lesson: ${module.title} (${mm}:${ss})`}
      >
        {/* decorative screen effects (icon-based, never raw glyphs) */}
        <div className="vl-screen-vignette" aria-hidden="true">
          <span className="vl-token vl-t1"><FiCode /></span>
          <span className="vl-token vl-t2"><LuBraces /></span>
          <span className="vl-scanline" aria-hidden="true" />
        </div>

        <div className="vl-idle-meta" aria-hidden="true">
          <span className="vl-kicker">
            <span className="vl-live-dot" /> Interactive Lesson
          </span>
          <span className="vl-idle-title">{module.title}</span>
        </div>

        <button
          type="button"
          className="vl-play-btn"
          onClick={onLaunch}
          aria-label={`Open the interactive video studio for ${module.title}`}
        >
          <FiPlay size={26} />
        </button>

        <button type="button" className="vl-launch-caption" onClick={onLaunch}>
          <FiPlay size={11} /> Watch Lesson
        </button>

        <span className="vl-duration-badge">
          <FiClock /> {mm}:{ss}
        </span>
      </div>
    </div>
  );
};

export default VideoLesson;
