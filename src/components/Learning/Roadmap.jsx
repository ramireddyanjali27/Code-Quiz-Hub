// ─── Visual Learning Roadmap ─────────────────────────────────
// Premium vertical learning path: glowing gradient spine with a
// traveling light, glassmorphism module cards with subtle 3D
// tilt, per-module coding icons, XP rewards and lock states.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiPlay, FiCheck, FiClock, FiFileText, FiCode, FiZap, FiArrowDown } from 'react-icons/fi';
import { getModuleStatus } from '../../utils/learningStore';
import { formatMinutes, ROADMAP_LEVELS } from '../../data/roadmaps';
import { ACTIVITY_XP } from '../../utils/gamification';
import { getModuleIcon } from './moduleIcon';
import './Roadmap.css';

const STATUS_META = {
  completed: { icon: <FiCheck />, label: 'Completed' },
  'in-progress': { icon: <span className="rm-pause-icon" />, label: 'In Progress' },
  available: { icon: <FiPlay size={13} />, label: 'Available' },
  locked: { icon: <FiLock size={13} />, label: 'Locked' },
};

const levelMeta = (value) =>
  ROADMAP_LEVELS.find((l) => l.value === value) || ROADMAP_LEVELS[0];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const RoadmapNode = ({ module: mod, status, index, onNavigate }) => {
  const [shaking, setShaking] = useState(false);
  const cardRef = useRef(null);
  const rafRef = useRef(0);
  const meta = STATUS_META[status];
  const lvl = levelMeta(mod.level);
  const isLocked = status === 'locked';
  const isDone = status === 'completed';
  const isAvailable = status === 'available';

  // Total XP this module is worth (lesson + assignment + challenge)
  const xpReward =
    ACTIVITY_XP.lesson +
    (mod.assignment ? ACTIVITY_XP.assignment : 0) +
    (mod.challenge ? ACTIVITY_XP.challenge : 0);

  const handleClick = () => {
    if (isLocked) {
      setShaking(true);
      setTimeout(() => setShaking(false), 550);
      return;
    }
    onNavigate(mod);
  };

  /* Subtle 3D tilt — pointer devices only, disabled with reduced motion */
  const handleTilt = (e) => {
    if (isLocked || prefersReducedMotion()) return;
    const card = cardRef.current;
    if (!card || e.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-6px)`;
    });
  };
  const resetTilt = () => {
    cancelAnimationFrame(rafRef.current);
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <li
      className={[
        'rm-item',
        index % 2 ? 'rm-right' : 'rm-left',
        `rm-${status}`,
        shaking ? 'rm-shake' : '',
      ].join(' ')}
      id={`module-${mod.id}`}
      style={{ '--node-color': isDone ? '#10b981' : lvl.color }}
    >
      {/* Status node on the spine */}
      <div className="rm-node" aria-hidden="true">
        <span className="rm-node-inner">{meta.icon}</span>
        {(status === 'in-progress' || isAvailable) && <span className="rm-node-ring" />}
        {isDone && <span className="rm-node-burst" />}
      </div>

      {/* Module card */}
      <button
        type="button"
        ref={cardRef}
        className="rm-card"
        onClick={handleClick}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        disabled={false}
        aria-label={`${mod.title} — ${meta.label}. ${
          isLocked ? 'Complete the previous module to unlock.' : 'Open lesson.'
        }`}
      >
        <span className="rm-card-glow" aria-hidden="true" />
        <div className="rm-card-top">
          <span className="rm-step-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="rm-module-icon" aria-hidden="true">{getModuleIcon(mod.title)}</span>
          <span className="rm-level-chip" style={{ color: lvl.color, background: `${lvl.color}14`, borderColor: `${lvl.color}30` }}>
            {lvl.label}
          </span>
          <span className={`rm-status-chip rm-status-${status}`}>
            {isDone ? '✓ Completed' : meta.label.toUpperCase()}
          </span>
        </div>

        <h4 className="rm-card-title">{mod.title}</h4>
        <p className="rm-card-summary">{mod.summary}</p>

        <div className="rm-card-meta">
          <span><FiClock /> {formatMinutes(mod.minutes)}</span>
          {mod.assignment && <span><FiFileText /> Assignment</span>}
          {mod.challenge && <span><FiCode /> Challenge</span>}
          {!isLocked && (
            <span className="rm-card-xp"><FiZap /> +{xpReward} XP</span>
          )}
        </div>

        {isLocked ? (
          <span className="rm-card-cta rm-cta-locked">
            <FiLock size={11} /> Complete previous module
            <em className="rm-lock-hint">Complete the previous lesson to unlock this module.</em>
          </span>
        ) : (
          <span className={`rm-card-cta ${isDone ? 'rm-cta-done' : ''}`}>
            <span className="rm-play-dot" aria-hidden="true"><FiPlay size={10} /></span>
            {isDone ? 'Review Lesson →' : status === 'in-progress' ? 'Continue Lesson →' : 'Start Lesson →'}
          </span>
        )}
      </button>
    </li>
  );
};

const Roadmap = ({ roadmap, progress, techColor }) => {
  const navigate = useNavigate();
  const listRef = useRef(null);
  const spineRef = useRef(null);

  // Scroll-reveal for items
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.rm-item');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rm-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, [roadmap]);

  const completedCount = roadmap.modules.filter(
    (m, i) => getModuleStatus(roadmap, i, progress) === 'completed'
  ).length;
  const allDone = completedCount === roadmap.modules.length;

  const scrollToFirstModule = () => {
    const target =
      document.getElementById(`module-${roadmap.modules[0]?.id}`) || spineRef.current;
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  const handleNavigate = (module) => {
    navigate(`/technologies/${roadmap.id}/lesson/${module.id}`);
  };

  return (
    <section className="roadmap-section" aria-label={`${roadmap.name} learning roadmap`}>
      <header className="rm-header">
        <span className="rm-header-badge">INTERACTIVE LEARNING PATH</span>
        <h2>{roadmap.name} Roadmap</h2>
        <p>
          Follow the path step by step — each module unlocks as you complete the one before.
        </p>
      </header>

      <div className="rm-timeline" ref={spineRef}>
        <div className="rm-spine" aria-hidden="true">
          <span
            className="rm-spine-fill"
            style={{
              height: `${(completedCount / Math.max(1, roadmap.modules.length)) * 100}%`,
              background: `linear-gradient(180deg, #10b981 ${Math.max(0, ((completedCount - 1) / roadmap.modules.length) * 100)}%, ${techColor || '#2563eb'})`,
            }}
          />
        </div>

        <ol className="rm-list" ref={listRef}>
          <li className="rm-cap rm-start">
            <button
              type="button"
              className="rm-start-btn"
              onClick={scrollToFirstModule}
              aria-label="Start learning — jump to the first module"
            >
              🚀 START LEARNING
              <FiArrowDown size={14} aria-hidden="true" />
            </button>
          </li>
          {roadmap.modules.map((module, i) => (
            <RoadmapNode
              key={module.id}
              module={module}
              index={i}
              status={getModuleStatus(roadmap, i, progress)}
              color={techColor}
              onNavigate={handleNavigate}
            />
          ))}
          <li className={`rm-cap rm-finish ${allDone ? 'rm-finish-done' : ''}`} aria-hidden={!allDone}>
            <span className="rm-cap-pill">{allDone ? '🎉 COMPLETED!' : 'FINISH'}</span>
          </li>
        </ol>
      </div>
    </section>
  );
};

export default Roadmap;
