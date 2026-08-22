import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCode, FiDatabase, FiLayers, FiTerminal, FiGlobe, FiCpu } from 'react-icons/fi';
import { TECHNOLOGIES } from '../../utils/constants';
import './Technologies.css';

/* Floating background element */
const FloatingEl = ({ char, style, className = '' }) => (
  <span className={`tech-float-el ${className}`} style={style} aria-hidden="true">
    {char}
  </span>
);

/* Scroll reveal hook */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
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
  return ref;
}

const TechCard = ({ tech, index }) => {
  const ref = useScrollReveal();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, visible: false });
  const cardRef = useRef(null);

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

  return (
    <Link
      ref={(el) => { ref.current = el; cardRef.current = el; }}
      to={`/quizzes?technology=${encodeURIComponent(tech.name)}`}
      className="tech-full-card scroll-reveal"
      style={{
        '--tech-color': tech.color,
        '--delay': `${index * 0.06}s`,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Light reflection */}
      <div
        className="tech-card-shine"
        style={{
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.35), transparent 60%)`,
          opacity: shine.visible ? 1 : 0,
        }}
      />

      {/* Gradient top glow */}
      <div className="tech-card-glow" />

      <div className="tech-card-top">
        <span className="tech-big-icon" style={{ '--icon-color': tech.color }}>
          {tech.icon}
        </span>
        <div className="tech-arrow">
          <FiArrowRight />
        </div>
      </div>
      <h3>{tech.name}</h3>
      <p className="tech-description">
        Browse quizzes and practice questions
      </p>
      <div className="tech-stats-row">
        <span className="tech-tag tag-beginner">Beginner</span>
        <span className="tech-tag tag-intermediate">Intermediate</span>
        <span className="tech-tag tag-advanced">Advanced</span>
      </div>
    </Link>
  );
};

const Technologies = () => {
  const headerRef = useScrollReveal();

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
    { icon: <FiCode />, value: '20+', label: 'Technologies' },
    { icon: <FiDatabase />, value: '10K+', label: 'Questions' },
    { icon: <FiLayers />, value: '3', label: 'Levels' },
    { icon: <FiTerminal />, value: '500+', label: 'Quizzes' },
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
        <div ref={headerRef} className="page-header scroll-reveal">
          <span className="page-badge">⚡ Explore Technologies</span>
          <h1>
            Master Your Technical Skills
          </h1>
          <p>Choose a technology to browse available <span style={{color: '#0f172a', fontWeight: 600}}>Quizzes</span> and questions</p>
        </div>

        {/* Stats bar */}
        <div className="tech-stats-bar scroll-reveal" style={{ transitionDelay: '0.15s' }}>
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
        <div className="tech-grid-full">
          {TECHNOLOGIES.map((tech, index) => (
            <TechCard key={tech.name} tech={tech} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Technologies;
