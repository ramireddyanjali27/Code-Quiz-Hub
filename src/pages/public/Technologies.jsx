import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiPlay,
  FiCode,
  FiLayers,
  FiMap,
  FiClock,
} from 'react-icons/fi';
import { ALL_ROADMAP_LIST as ALL_ROADMAPS, estimateHours } from '../../data/roadmaps';
import { getTechProgress, computeProgressPercent } from '../../utils/learningStore';
import { SkeletonCardGrid } from '../../components/Common/Skeletons';
import './Technologies.css';

/* Floating background element */
const FloatingEl = ({ char, style }) => (
  <span className="tech-float-el" style={style} aria-hidden="true">
    {char}
  </span>
);

/* ── Technology Card — LEARNING focused ── */
const TechCard = ({ roadmap, index }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, visible: false });
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Live learning progress (separate from quiz scores)
  const { percent, started, lastLessonId } = useMemo(() => {
    const p = getTechProgress(roadmap.id);
    return {
      percent: computeProgressPercent(roadmap, p),
      started: p.lessons.length > 0 || !!p.lastLessonId,
      lastLessonId: p.lastLessonId,
    };
  }, [roadmap]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -8, y: (x - 0.5) * 8 });
    setShine({ x: x * 100, y: y * 100, visible: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50, visible: false });
  };

  const openDetails = () => navigate(`/technologies/${roadmap.id}`);
  const continueHref = started && lastLessonId
    ? `/technologies/${roadmap.id}/lesson/${lastLessonId}`
    : `/technologies/${roadmap.id}`;

  return (
    <div
      ref={cardRef}
      className="tech-full-card"
      role="link"
      tabIndex={0}
      aria-label={`Learn ${roadmap.name} — ${percent}% complete`}
      style={{
        '--tech-color': roadmap.color,
        '--delay': `${index * 0.05}s`,
        transform: tilt.x || tilt.y
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetails();
        }
      }}
    >
      {/* Light reflection */}
      <div
        className="tech-card-shine"
        style={{
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.35), transparent 60%)`,
          opacity: shine.visible ? 1 : 0,
        }}
      />
      <div className="tech-card-glow" />

      <div className="tech-card-top">
        <span className="tech-big-icon" style={{ '--icon-color': roadmap.color }}>
          {roadmap.icon}
        </span>
        <div className="tech-arrow">
          <FiArrowRight />
        </div>
      </div>

      <h3>{roadmap.name}</h3>
      <p className="tech-description">{roadmap.description}</p>

      {/* Difficulty path */}
      <div className="tech-stats-row">
        <span className="tech-tag tag-beginner">Beginner</span>
        <span className="tech-tag tag-intermediate">Intermediate</span>
        <span className="tech-tag tag-advanced">Advanced</span>
      </div>

      {/* Module / time meta */}
      <div className="tech-meta-row">
        <span><FiLayers /> {roadmap.modules.length} Modules</span>
        <span><FiClock /> {estimateHours(roadmap)}h Est.</span>
      </div>

      {/* Learning progress */}
      <div className="tech-progress">
        <div className="tech-progress-head">
          <span>{started ? 'Learning Progress' : 'Not started'}</span>
          {started && <strong>{percent}%</strong>}
        </div>
        <div className="tech-progress-track">
          <div
            className={`tech-progress-fill ${started ? '' : 'empty'}`}
            style={{ width: `${Math.max(started ? 4 : 0, percent)}%`, '--tech-color': roadmap.color }}
          />
        </div>
      </div>

      {/* CTA */}
      {started ? (
        <Link
          to={continueHref}
          className="btn btn-primary btn-sm tech-cta-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <FiPlay size={13} /> Continue Learning
        </Link>
      ) : (
        <Link
          to={`/technologies/${roadmap.id}`}
          className="btn btn-primary btn-sm tech-cta-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Start Learning
        </Link>
      )}
    </div>
  );
};

const Technologies = () => {
  const headerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Brief skeleton phase prevents layout jumps & feels app-like
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const totals = useMemo(() => {
    const modules = ALL_ROADMAPS.reduce((n, r) => n + r.modules.length, 0);
    const hours = ALL_ROADMAPS.reduce((n, r) => n + r.modules.reduce((s, m) => s + m.minutes, 0), 0);
    return { modules, hours: Math.round(hours / 60) };
  }, []);

  const floatingElements = [
    { char: '{ }', style: { top: '8%', left: '3%', animationDuration: '14s', fontSize: '1.1rem', color: 'var(--primary)' } },
    { char: '</>', style: { top: '15%', right: '5%', animationDuration: '11s', fontSize: '1rem', color: 'var(--secondary)' } },
    { char: '=>', style: { bottom: '20%', left: '6%', animationDuration: '16s', fontSize: '0.9rem', color: 'var(--primary)' } },
    { char: '[]', style: { top: '40%', right: '3%', animationDuration: '13s', fontSize: '1rem', color: 'var(--secondary)' } },
    { char: '()', style: { bottom: '35%', right: '7%', animationDuration: '15s', fontSize: '0.9rem', color: 'var(--primary)' } },
    { char: '++;', style: { top: '55%', left: '2%', animationDuration: '12s', fontSize: '0.8rem', color: 'var(--secondary)' } },
    { char: '===', style: { top: '70%', right: '4%', animationDuration: '17s', fontSize: '0.8rem', color: 'var(--primary)' } },
    { char: '#', style: { top: '25%', left: '8%', animationDuration: '19s', fontSize: '1.2rem', color: 'var(--secondary)' } },
    { char: '::', style: { bottom: '12%', left: '10%', animationDuration: '14s', fontSize: '1rem', color: 'var(--primary)' } },
    { char: ';', style: { top: '80%', right: '9%', animationDuration: '16s', fontSize: '1.1rem', color: 'var(--secondary)' } },
  ];

  const stats = [
    { icon: <FiCode />, value: `${ALL_ROADMAPS.length}`, label: 'Technologies' },
    { icon: <FiMap />, value: `${totals.modules}`, label: 'Roadmap Modules' },
    { icon: <FiClock />, value: `${totals.hours}+`, label: 'Learning Hours' },
    { icon: <FiLayers />, value: '3+1', label: 'Levels + Project' },
  ];

  return (
    <div className="technologies-page">
      {/* Floating background elements */}
      <div className="tech-float-container" aria-hidden="true">
        {floatingElements.map((el, i) => (
          <FloatingEl key={i} char={el.char} style={el.style} />
        ))}
      </div>

      {/* Animated orbs */}
      <div className="tech-bg-orb tech-bg-orb-1" aria-hidden="true" />
      <div className="tech-bg-orb tech-bg-orb-2" aria-hidden="true" />
      <div className="tech-bg-orb tech-bg-orb-3" aria-hidden="true" />

      <div className="page-container">
        {/* Page Header */}
        <div ref={headerRef} className="page-header scroll-reveal revealed">
          <span className="page-badge">📚 Learn Technologies</span>
          <h1>Follow a Roadmap.<br />Master the Technology.</h1>
          <p>
            Guided learning paths with videos, assignments and coding practice —
            then prove your skills in <Link to="/quizzes" className="tech-inline-quiz-link">Quizzes</Link>.
          </p>
        </div>

        {/* Stats bar */}
        <div className="tech-stats-bar scroll-reveal revealed" style={{ transitionDelay: '0.15s' }}>
          {stats.map((stat, i) => (
            <div className="tech-stat-item" key={i}>
              <div className="tech-stat-icon">{stat.icon}</div>
              <div className="tech-stat-text">
                <span className="tech-stat-value">{stat.value}</span>
                <span className="tech-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Grid */}
        {loading ? (
          <SkeletonCardGrid count={6} minH={300} />
        ) : (
          <div className="tech-grid-full">
            {ALL_ROADMAPS.map((roadmap, index) => (
              <TechCard key={roadmap.id} roadmap={roadmap} index={index} />
            ))}
          </div>
        )}

        {/* Cross-link banner — quizzes have a different job */}
        <div className="tech-quiz-banner">
          <div className="tqb-left">
            <span className="tqb-icon">🎯</span>
            <div>
              <h3>Already know the basics?</h3>
              <p>Quizzes are for practising and testing what you've learned — timed questions, scores and weak-topic analysis.</p>
            </div>
          </div>
          <Link to="/quizzes" className="btn btn-outline tqb-btn">
            Practice Your Skills <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Technologies;
