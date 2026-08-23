// ─── Technology Details / Roadmap Page ───────────────────────
// /technologies/:technologyId
// Premium learning dashboard: glowing hero with interactive 3D
// tech orb, live progress panel (XP / streak / quiz stats),
// milestone card, curriculum highlights & the visual roadmap.
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPlay,
  FiLayers,
  FiClock,
  FiFileText,
  FiCode,
  FiMap,
  FiZap,
  FiTarget,
  FiTrendingUp,
  FiHelpCircle,
} from 'react-icons/fi';
import { getRoadmapById, estimateHours, ROADMAP_LEVELS } from '../../data/roadmaps';
import { QUIZZES } from '../../data/quizzes';
import { getTechProgress, computeProgressPercent } from '../../utils/learningStore';
import { getStats, getStreak, ACTIVITY_XP } from '../../utils/gamification';
import { getOverallQuizStats } from '../../utils/quizStats';
import { getModuleIcon } from '../../components/Learning/moduleIcon';
import ProgressRing from '../../components/Learning/ProgressRing';
import Roadmap from '../../components/Learning/Roadmap';
import { SkeletonRoadmap } from '../../components/Common/Skeletons';
import EmptyState from '../../components/Common/EmptyState';
import './TechnologyDetails.css';

/* Floating background code tokens (very low opacity) */
const BG_TOKENS = [
  { text: '{ }', top: '9%', left: '3%', delay: 0, dur: 16 },
  { text: '</>', top: '18%', right: '4%', delay: 1.4, dur: 14 },
  { text: '01', top: '42%', left: '1.5%', delay: 3, dur: 18 },
  { text: '( )', top: '58%', right: '2%', delay: 0.8, dur: 15 },
  { text: '=>', top: '74%', left: '4%', delay: 2.2, dur: 17 },
  { text: '101', top: '86%', right: '5%', delay: 3.6, dur: 13 },
];

/* Orbiting chips around the hero orb */
const ORBIT_CHIPS = ['</>', '{ }', '();'];

const TechDetailsSkeleton = () => (
  <div className="td-page">
    <div className="page-container">
      <div className="td-hero td-skeleton-hero" aria-label="Loading technology">
        <div className="td-icon-stage td-shimmer" />
        <div className="td-hero-info">
          <div className="td-shimmer td-sk-line-lg" />
          <div className="td-shimmer td-sk-line-md" />
        </div>
        <div className="td-shimmer td-sk-ring" />
      </div>
      <SkeletonRoadmap count={6} />
    </div>
  </div>
);

const TechnologyDetails = () => {
  const { technologyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [, bumpVersion] = useState(0); // bumps force re-read of progress store
  const orbRef = useRef(null);
  const rafRef = useRef(0);

  const roadmap = getRoadmapById(technologyId);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [technologyId]);

  // Listen for storage changes so the page reflects lesson completions live
  useEffect(() => {
    const onStorage = () => bumpVersion((n) => n + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Re-read from the stores on every render; `version` bumps force
  // a fresh read when progress changes elsewhere.
  const progress = roadmap ? getTechProgress(roadmap.id) : null;

  /* Subtle mouse parallax for the 3D orb (pointer devices only) */
  const handleHeroMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const stage = orbRef.current;
    if (!stage) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      stage.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${y * -8}deg)`;
    });
  };
  const handleHeroMouseLeave = () => {
    cancelAnimationFrame(rafRef.current);
    if (orbRef.current) orbRef.current.style.transform = '';
  };

  if (!roadmap) {
    return (
      <div className="td-page">
        <div className="page-container" style={{ paddingTop: 120 }}>
          <EmptyState
            icon={<FiMap size={56} />}
            title="Technology not found"
            message="The technology roadmap you're looking for doesn't exist."
            action="Browse Technologies"
            onAction={() => (window.location.href = '/technologies')}
          />
        </div>
      </div>
    );
  }

  if (loading || !progress) return <TechDetailsSkeleton />;

  const percent = computeProgressPercent(roadmap, progress);
  const totalModules = roadmap.modules.length;
  const lessonsDone = progress.lessons.length;
  const assignmentsDone = roadmap.modules.filter((m) => m.assignment && progress.assignments.includes(m.id)).length;
  const assignmentsTotal = roadmap.modules.filter((m) => m.assignment).length;
  const challengesDone = roadmap.modules.filter((m) => m.challenge && progress.challenges.includes(m.id)).length;
  const challengesTotal = roadmap.modules.filter((m) => m.challenge).length;
  const videosTotal = totalModules;

  // Live gamification stats (existing localStorage-backed systems)
  const gameStats = getStats();
  const streak = getStreak();
  const quizStats = getOverallQuizStats();

  // First module that still needs attention
  const nextModule =
    roadmap.modules.find(
      (m, i) =>
        !progress.lessons.includes(m.id) &&
        (i === 0 || progress.lessons.includes(roadmap.modules[i - 1].id))
    ) || roadmap.modules[0];

  const levelGroups = ROADMAP_LEVELS.map((lvl) => ({
    ...lvl,
    count: roadmap.modules.filter((m) => m.level === lvl.value).length,
  }));

  const activityCards = [
    { icon: <FiLayers />, label: 'Modules Completed', value: `${lessonsDone}/${totalModules}`, color: '#6366f1' },
    { icon: <FiPlay />, label: 'Videos Completed', value: `${Math.min(lessonsDone, videosTotal)}/${videosTotal}`, color: '#0ea5e9' },
    { icon: <FiFileText />, label: 'Assignments', value: `${assignmentsDone}/${assignmentsTotal}`, color: '#f59e0b' },
    { icon: <FiCode />, label: 'Coding Challenges', value: `${challengesDone}/${challengesTotal}`, color: '#10b981' },
  ];

  // Curriculum highlights — derived from the roadmap's own modules
  const learnCards = [
    ...roadmap.modules.filter((m) => m.assignment && m.challenge),
    ...roadmap.modules.filter((m) => m.assignment && !m.challenge),
    ...roadmap.modules,
  ]
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, 6);

  // Quick stats — computed from real project data
  const relatedQuizzes = QUIZZES.filter((q) => q.technology === roadmap.name).length;
  const quickStats = [
    { icon: <FiLayers />, label: 'Modules', value: `${totalModules}` },
    { icon: <FiPlay />, label: 'Lessons', value: `${totalModules}` },
    { icon: <FiCode />, label: 'Coding Challenges', value: `${challengesTotal}` },
    { icon: <FiHelpCircle />, label: 'Practice Quizzes', value: `${relatedQuizzes}` },
  ];

  return (
    <div className="td-page">
      {/* ── Animated futuristic background ── */}
      <div className="td-bg" aria-hidden="true">
        <span className="td-bg-orb td-bg-orb--blue" />
        <span className="td-bg-orb td-bg-orb--purple" />
        <span className="td-bg-orb td-bg-orb--cyan" />
        <span className="td-bg-grid" />
        {BG_TOKENS.map((t, i) => (
          <span
            key={i}
            className="td-bg-token"
            style={{
              top: t.top,
              left: t.left,
              right: t.right,
              animationDelay: `${t.delay}s`,
              animationDuration: `${t.dur}s`,
            }}
          >
            {t.text}
          </span>
        ))}
      </div>

      <div className="page-container td-inner">
        {/* ── Breadcrumb ── */}
        <nav className="td-breadcrumb" aria-label="Breadcrumb">
          <Link to="/technologies"><FiArrowLeft /> All Technologies</Link>
          <span aria-hidden="true">/</span>
          <span className="td-crumb-current">{roadmap.name}</span>
        </nav>

        {/* ── Hero header ── */}
        <header
          className={`td-hero ${percent > 0 ? '' : 'td-fresh'}`}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          <div className="td-orb-stage" ref={orbRef} style={{ '--tech-color': roadmap.color }} aria-hidden="true">
            <div className="td-orb-glow" />
            <div className="td-icon-core">{roadmap.icon}</div>
            <div className="td-ring td-ring-a" />
            <div className="td-ring td-ring-b" />
            {ORBIT_CHIPS.map((chip, i) => (
              <span key={chip} className={`td-orbit-chip td-orbit-${i + 1}`}>{chip}</span>
            ))}
            <span className="td-particle td-p-1" />
            <span className="td-particle td-p-2" />
            <span className="td-particle td-p-3" />
          </div>

          <div className="td-hero-info">
            <span className="td-hero-badge">
              <FiZap size={12} /> {roadmap.name.toUpperCase()} MASTER PATH
            </span>
            <h1>{roadmap.name} Development<br />Roadmap</h1>
            <p className="td-tagline">{roadmap.tagline}</p>
            <p className="td-desc">{roadmap.description}</p>

            <div className="td-hero-meters">
              <span className="td-meter-pill td-meter-percent"><FiTrendingUp /> {percent}% Completed</span>
              <span className="td-meter-pill"><FiLayers /> {lessonsDone} / {totalModules} Modules</span>
              <span className="td-meter-pill td-meter-eta"><FiClock /> Est. {estimateHours(roadmap)} hrs</span>
            </div>

            <p className="td-motto">Start your journey and become a {roadmap.name} developer.</p>

            <div className="td-level-strip">
              {levelGroups.map((g, i) => (
                <span key={g.value} className="td-level-item">
                  <span className="td-level-dot" style={{ background: g.color }} />
                  {g.label}
                  <em>({g.count})</em>
                  {i < levelGroups.length - 1 && <b aria-hidden="true">→</b>}
                </span>
              ))}
            </div>

            <div className="td-hero-actions">
              <Link
                to={`/technologies/${roadmap.id}/lesson/${nextModule?.id}`}
                className="btn btn-primary btn-lg td-cta-main"
              >
                <FiPlay /> {percent > 0 ? 'Continue Learning' : 'Start Learning'}
              </Link>
              <Link to="/quizzes" className="btn btn-outline btn-lg td-cta-secondary">
                View Quiz →
              </Link>
            </div>
          </div>

          <div className="td-progress-side">
            <ProgressRing percent={percent} size={132} stroke={11} color={roadmap.color} sublabel="learned" label={`${roadmap.name} completion`} />
            <span className="td-progress-caption">of {roadmap.name} learned</span>
            <span className="td-xp-chip" title="Total experience earned across the platform">
              <FiZap size={13} /> {gameStats.totalXp} XP
            </span>
          </div>
        </header>

        {/* ── Learning progress dashboard ── */}
        <section className="td-dashboard" aria-label="Your learning progress">
          <div className="td-panel td-progress-panel">
            <div className="td-panel-head">
              <h3>Your Learning Progress</h3>
              <span className="td-panel-big">{percent}%</span>
            </div>
            <div
              className="td-progress-track"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${roadmap.name} roadmap progress`}
            >
              <span className="td-progress-fill" style={{ width: `${percent}%`, '--tech-color': roadmap.color }} />
            </div>
            <p className="td-progress-note">{percent}% · {lessonsDone} of {totalModules} modules completed</p>

            <div className="td-mini-stats">
              <div className="td-mini-stat td-mini-streak" title="Consecutive active learning days">
                <span className="td-mini-flame" aria-hidden="true">🔥</span>
                <strong>{streak} {streak === 1 ? 'Day' : 'Days'}</strong>
                <small>Learning Streak</small>
              </div>
              <div className="td-mini-stat td-mini-xp" title="Experience points earned">
                <span className="td-mini-zap" aria-hidden="true"><FiZap /></span>
                <strong>{gameStats.totalXp} XP</strong>
                <small>XP Earned</small>
              </div>
              <div className="td-mini-stat" title="Roadmap modules completed">
                <span aria-hidden="true"><FiLayers /></span>
                <strong>{lessonsDone}/{totalModules}</strong>
                <small>Modules Completed</small>
              </div>
              <div className="td-mini-stat" title="Average score across all quizzes">
                <span aria-hidden="true"><FiTarget /></span>
                <strong>{quizStats.avgScore}%</strong>
                <small>Quiz Score</small>
              </div>
            </div>
          </div>

          {/* Next milestone */}
          <div className="td-panel td-milestone">
            <div className="td-milestone-head">
              <span className="td-milestone-target" aria-hidden="true"><FiTarget /></span>
              Next Milestone
            </div>
            <h4>Complete {nextModule?.title}</h4>
            <div className="td-milestone-meta">
              <span className="td-milestone-xp"><FiZap /> +{ACTIVITY_XP.lesson} XP</span>
              <span><FiPlay /> 1 Lesson</span>
              {nextModule?.minutes ? <span><FiClock /> {nextModule.minutes} min</span> : null}
            </div>
            <p className="td-milestone-hint">
              {streak === 0
                ? 'Complete one lesson today to start your streak.'
                : `Keep your ${streak}-day streak alive — one lesson keeps it burning.`}
            </p>
            <Link
              to={`/technologies/${roadmap.id}/lesson/${nextModule?.id}`}
              className="btn btn-primary td-milestone-btn"
            >
              Continue Learning →
            </Link>
          </div>
        </section>

        {/* ── Learning activity breakdown ── */}
        <section className="td-stats-grid" aria-label={`${roadmap.name} learning progress`}>
          {activityCards.map((c, i) => (
            <div key={i} className="td-stat-card" style={{ '--sc': c.color }}>
              <span className="td-stat-icon">{c.icon}</span>
              <span className="td-stat-value">{c.value}</span>
              <span className="td-stat-label">{c.label}</span>
            </div>
          ))}
        </section>

        {/* ── What you'll learn ── */}
        <section className="td-learn" aria-label="Curriculum highlights">
          <div className="td-section-head">
            <h2>What You&apos;ll Learn</h2>
            <p>The core skills this path builds, module by module.</p>
          </div>
          <div className="td-learn-grid">
            {learnCards.map((m) => (
              <article key={m.id} className="td-learn-card" style={{ '--tech-color': roadmap.color }}>
                <span className="td-learn-icon">{getModuleIcon(m.title)}</span>
                <h4>{m.title}</h4>
                <p>{m.summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Quick stats ── */}
        <section className="td-quick" aria-label="Path statistics">
          {quickStats.map((s) => (
            <div key={s.label} className="td-quick-card">
              <span className="td-quick-icon">{s.icon}</span>
              <strong>{s.value}</strong>
              <small>{s.label}</small>
            </div>
          ))}
        </section>

        {/* ── Visual roadmap ── */}
        <Roadmap roadmap={roadmap} progress={progress} techColor={roadmap.color} />

        {/* ── Practice cross-link (quizzes ≠ learning) ── */}
        <div className="td-practice-note">
          <div>
            <strong>Finished learning {roadmap.name}?</strong>
            <p>Head over to Quizzes to test yourself with timed practice tests and see your weak topics.</p>
          </div>
          <Link to="/quizzes" className="btn btn-outline">Practice {roadmap.name} →</Link>
        </div>
      </div>
    </div>
  );
};

export default TechnologyDetails;
