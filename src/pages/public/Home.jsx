import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiTarget,
  FiZap,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiClock,
  FiChevronRight,
} from 'react-icons/fi';
import { TECHNOLOGIES } from '../../utils/constants';
import { getQuizById } from '../../data/quizzes';
import SpinWheel from '../../components/Home/SpinWheel';
import './Home.css';

/* ── Popular quizzes pulled from the shared catalog (src/data/quizzes.js) ── */
const POPULAR_QUIZZES = [1, 2, 3]
  .map((id) => {
    const q = getQuizById(id);
    if (!q) return null;
    const tech = TECHNOLOGIES.find((t) => t.name === q.technology);
    return { ...q, icon: tech?.icon || '📝', color: tech?.color || '#6366f1' };
  })
  .filter(Boolean);

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

const Home = () => {
  const stats = [
    { value: '10K+', label: 'Active Users', icon: <FiUsers />, color: '#6366f1' },
    { value: '500+', label: 'Quizzes', icon: <FiBookOpen />, color: '#22c55e' },
    { value: '10K+', label: 'Questions', icon: <FiTarget />, color: '#f59e0b' },
  ];

  const features = [
    { icon: '🎯', title: 'Choose Technology' },
    { icon: '📊', title: 'Select Difficulty' },
    { icon: '⚡', title: 'Take Quiz' },
    { icon: '📋', title: 'Review Results' },
    { icon: '🚀', title: 'Improve Your Skills' },
  ];

  const displayTechs = TECHNOLOGIES.slice(0, 6);

  const diffLabel = (d) => d.charAt(0) + d.slice(1).toLowerCase();
  const diffColor = (d) => {
    if (d === 'BEGINNER') return { bg: 'rgba(34,197,94,0.15)', fg: '#22c55e' };
    if (d === 'INTERMEDIATE') return { bg: 'rgba(245,158,11,0.15)', fg: '#f59e0b' };
    return { bg: 'rgba(239,68,68,0.15)', fg: '#ef4444' };
  };

  return (
    <div className="home">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn to <span style={{color: '#0f172a'}}>Code.</span><br />
              Practice Your <span style={{color: '#0f172a'}}>Skills.</span><br />
              Master <span style={{color: '#0f172a'}}>Technology.</span>
            </h1>
            <p className="hero-subtitle">
              Follow guided roadmaps with videos, assignments and coding
              practice — then prove your knowledge with timed technical quizzes.
            </p>
            <div className="hero-actions">
              <Link to="/technologies" className="btn btn-primary btn-lg hero-btn-primary">
                🚀 Start Learning
              </Link>
              <Link to="/quizzes" className="btn btn-outline-light btn-lg">
                🎯 Practice Quizzes
              </Link>
            </div>
          </div>

          {/* ── 3D Hero Visual ── */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-3d-stage">
              {/* Central laptop */}
              <div className="hero-laptop">
                <div className="laptop-screen">
                  <div className="code-line cl-1" />
                  <div className="code-line cl-2" />
                  <div className="code-line cl-3" />
                  <div className="code-line cl-4" />
                  <div className="code-line cl-5" />
                </div>
                <div className="laptop-base" />
              </div>

              {/* Floating tech cards — larger with icon boxes */}
              <div className="h-tech-card h-tc-1">
                <div className="htc-icon-box htc-java">☕</div>
                <span>Java</span>
              </div>
              <div className="h-tech-card h-tc-2">
                <div className="htc-icon-box htc-python">🐍</div>
                <span>Python</span>
              </div>
              <div className="h-tech-card h-tc-3">
                <div className="htc-icon-box htc-js">JS</div>
                <span>JavaScript</span>
              </div>
              <div className="h-tech-card h-tc-4">
                <div className="htc-icon-box htc-react">⚛️</div>
                <span>React</span>
              </div>
              <div className="h-tech-card h-tc-5">
                <div className="htc-icon-box htc-sql">SQL</div>
                <span>SQL</span>
              </div>

              {/* Floating shapes */}
              <div className="h-cube h-cube-1" />
              <div className="h-cube h-cube-2" />
              <div className="h-cube h-cube-3" />
              <div className="h-ring h-ring-1" />
              <div className="h-ring h-ring-2" />
              <div className="h-sphere h-sphere-1" />
              <div className="h-sphere h-sphere-2" />
              <div className="h-sphere h-sphere-3" />
              <div className="h-dot h-dot-1" />
              <div className="h-dot h-dot-2" />
              <div className="h-dot h-dot-3" />
              <div className="h-dot h-dot-4" />

              {/* Code symbol */}
              <div className="h-code-badge">&lt;/&gt;</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TWO-COLUMN MAIN ═══════════════ */}
      <section className="main-content-section">
        <div className="section-container">
          <div className="two-col-layout">
            {/* ── LEFT COLUMN: Stats + Explore Technologies ── */}
            <div className="left-column">
              {/* Stats row */}
              <Reveal>
                <div className="stats-row-home">
                  {stats.map((s, i) => (
                    <div key={i} className="stat-pill-home">
                      <div className="stat-icon-pill" style={{ color: s.color, background: s.color + '15' }}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="stat-val">{s.value}</div>
                        <div className="stat-lbl">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Explore Technologies */}
              <Reveal delay={0.1}>
                <div className="tech-panel-home">
                  <div className="panel-header">
                    <h3>Explore Technologies</h3>
                    <Link to="/technologies" className="view-all-link">View all</Link>
                  </div>
                  <div className="tech-row-home">
                    {displayTechs.map((tech) => (
                      <Link key={tech.name} to="/technologies" className="tech-pill-home" style={{ '--tc': tech.color }}>
                        <div className="tp-icon-box">{tech.icon}</div>
                        <span className="tp-name">{tech.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ── RIGHT COLUMN: Popular Quizzes ── */}
            <div className="right-column">
              <Reveal delay={0.05}>
                <div className="quiz-panel-home">
                  <div className="panel-header">
                    <h3>Popular Quizzes</h3>
                    <Link to="/quizzes" className="view-all-link">View all</Link>
                  </div>
                  <div className="quiz-cards-col">
                    {POPULAR_QUIZZES.map((quiz) => {
                      const dc = diffColor(quiz.difficulty);
                      return (
                        <div key={quiz.id} className="quiz-card-dark-home">
                          <div className="qcd-visual" style={{ background: `linear-gradient(135deg, ${quiz.color}20, ${quiz.color}08)` }}>
                            <div className="qcd-icon" style={{ color: quiz.color }}>{quiz.icon}</div>
                            <div className="qcd-ring" style={{ borderColor: quiz.color + '25' }} />
                          </div>
                          <div className="qcd-body">
                            <div className="qcd-top">
                              <span className="qcd-tech" style={{ color: quiz.color }}>{quiz.icon} {quiz.technology}</span>
                              <span className="qcd-diff" style={{ background: dc.bg, color: dc.fg }}>{diffLabel(quiz.difficulty)}</span>
                            </div>
                            <h4 className="qcd-title">{quiz.title}</h4>
                            <div className="qcd-meta">
                              <span><FiTarget size={13} /> {quiz.totalQuestions} Questions</span>
                              <span>•</span>
                              <span><FiClock size={13} /> {quiz.duration} min</span>
                            </div>
                            <div className="qcd-bottom">
                              <span className="qcd-pass">Pass: {quiz.passingScore}%</span>
                              <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm qcd-btn">Start Quiz</Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DAILY CHALLENGE — 3D SPIN WHEEL ═══════════════ */}
      <SpinWheel />

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="section how-section" id="how-it-works">
        <div className="section-container">
          <Reveal>
            <div className="section-header">
              <h2>How It Works</h2>
            </div>
          </Reveal>
          <div className="how-steps-row">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="how-step-item">
                  <div className="how-step-card">
                    <div className="how-num">{i + 1}</div>
                    <div className="how-step-icon">{f.icon}</div>
                    <span className="how-step-title">{f.title}</span>
                  </div>
                  {i < features.length - 1 && (
                    <span className="how-arrow-connector">→</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ LEADERBOARD BANNER ═══════════════ */}
      <section className="section lb-banner-section">
        <div className="section-container">
          <Reveal>
            <div className="lb-banner">
              <div className="lb-left">
                <div className="lb-trophy-wrap">
                  <div className="lb-trophy-emoji">🏆</div>
                  <div className="lb-ring-anim lb-ring-a" />
                  <div className="lb-ring-anim lb-ring-b" />
                </div>
              </div>
              <div className="lb-center">
                <h2>Compete. Learn. Grow.</h2>
                <p>Climb the leaderboard, earn achievements, and become a coding champion!</p>
                <Link to="/leaderboard" className="btn btn-outline-light lb-btn">
                  View Leaderboard <FiChevronRight />
                </Link>
              </div>
              <div className="lb-right">
                <div className="podium-wrap">
                  <div className="podium-spot podium-2">
                    <div className="podium-avatar pa-2">👤</div>
                    <div className="podium-bar pb-2" />
                    <span className="podium-rank pr-2">2</span>
                  </div>
                  <div className="podium-spot podium-1">
                    <div className="podium-avatar pa-1">👑</div>
                    <div className="podium-bar pb-1" />
                    <span className="podium-rank pr-1">1</span>
                  </div>
                  <div className="podium-spot podium-3">
                    <div className="podium-avatar pa-3">👤</div>
                    <div className="podium-bar pb-3" />
                    <span className="podium-rank pr-3">3</span>
                  </div>
                </div>
                <div className="lb-cube-float lb-cf-1" />
                <div className="lb-cube-float lb-cf-2" />
                <div className="lb-cube-float lb-cf-3" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
