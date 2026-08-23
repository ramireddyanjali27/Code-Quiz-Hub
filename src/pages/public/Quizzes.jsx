import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiClock,
  FiHelpCircle,
  FiFilter,
  FiTarget,
  FiAward,
  FiRefreshCw,
} from 'react-icons/fi';
import { DIFFICULTY_LEVELS } from '../../utils/constants';
import { QUIZZES, QUIZ_TYPES, getQuestionsForQuiz } from '../../data/quizzes';
import { getQuizStats } from '../../utils/quizStats';
import EmptyState from '../../components/Common/EmptyState';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Quizzes.css';

/* ─── Floating background tokens ─── */
const floatingTokens = [
  { text: '</>', top: '8%', left: '4%', delay: 0, dur: 14 },
  { text: '{ }', top: '22%', right: '5%', delay: 1.2, dur: 12 },
  { text: '=>', top: '45%', left: '2%', delay: 3, dur: 16 },
  { text: '[]', top: '60%', right: '3%', delay: 0.5, dur: 13 },
  { text: '();', top: '78%', left: '6%', delay: 2, dur: 15 },
  { text: '0x', top: '85%', right: '7%', delay: 4, dur: 11 },
  { text: '&&', top: '35%', left: '1%', delay: 1.8, dur: 14 },
  { text: '===', top: '70%', right: '2%', delay: 2.5, dur: 12 },
  { text: '++', top: '15%', right: '8%', delay: 3.5, dur: 13 },
  { text: '[];', top: '50%', left: '8%', delay: 0.8, dur: 15 },
];

/* ─── Quiz Card with mouse-follow 3D tilt ─── */
function QuizCard3D({ quiz, index, getDifficultyColor }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);

  // Per-user attempt history — practice identity lives here
  const stats = getQuizStats(quiz.id);
  const attempted = stats.attempts > 0;
  const questionCount = getQuestionsForQuiz(quiz.id).length;

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;

    if (shineRef.current) {
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)`;
      shineRef.current.style.opacity = '1';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = '';
    if (shineRef.current) shineRef.current.style.opacity = '0';
  }, []);

  return (
    <div
      ref={cardRef}
      className="quiz-card quiz-card-3d"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div ref={shineRef} className="card-shine" />
      <div className="quiz-card-header">
        <span className={`quiz-type-chip type-${quiz.quizType.toLowerCase().replace(/\s+/g, '-')}`}>
          <FiTarget size={11} /> {quiz.quizType}
        </span>
        <span
          className="quiz-diff-badge"
          style={{
            background: `linear-gradient(135deg, ${getDifficultyColor(quiz.difficulty)}22, ${getDifficultyColor(quiz.difficulty)}11)`,
            color: getDifficultyColor(quiz.difficulty),
            border: `1px solid ${getDifficultyColor(quiz.difficulty)}30`,
          }}
        >
          {quiz.difficulty.charAt(0) + quiz.difficulty.slice(1).toLowerCase()}
        </span>
      </div>

      <h3 className="quiz-title">{quiz.title}</h3>

      <div className="quiz-meta">
        <span><FiHelpCircle /> {questionCount} Questions</span>
        <span><FiClock /> {quiz.duration} min</span>
        {attempted && (
          <span className="quiz-attempts"><FiRefreshCw /> {stats.attempts} attempt{stats.attempts !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Best score — only after first practice */}
      {attempted && (
        <div className={`quiz-best-row ${stats.bestScore >= quiz.passingScore ? 'passed' : 'failed'}`}>
          <span>Best Score</span>
          <strong>{stats.bestScore}%{stats.bestScore >= quiz.passingScore ? ' 🏅' : ''}</strong>
        </div>
      )}

      <div className="quiz-card-footer">
        <span className="quiz-passing">Pass: {quiz.passingScore}%</span>
        <Link
          to={`/quiz/${quiz.id}`}
          className={`btn btn-sm quiz-start-btn ${attempted ? 'btn-outline' : 'btn-primary'}`}
        >
          {attempted ? 'Practice Again' : 'Start Practicing'}
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Quizzes Page ─── */
const Quizzes = () => {
  const [searchParams] = useSearchParams();

  const [selectedTech, setSelectedTech] = useState(searchParams.get('technology') || 'All');
  const [selectedDiff, setSelectedDiff] = useState(searchParams.get('difficulty') || 'All');
  // Default type filter comes from ?type= too (e.g. from dashboard weak-topic links)
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [loading] = useState(false);
  const [tick, setTick] = useState(0);
  const filterRef = useRef(null);
  const gridRef = useRef(null);

  // Derived during render — no state/effect needed
  const filteredQuizzes = useMemo(() => {
    let result = QUIZZES;
    if (selectedTech !== 'All') result = result.filter((q) => q.technology === selectedTech);
    if (selectedDiff !== 'All') result = result.filter((q) => q.difficulty === selectedDiff);
    if (selectedType !== 'All') result = result.filter((q) => q.quizType === selectedType);
    return result;
  }, [selectedTech, selectedDiff, selectedType]);

  /* Refresh cards when returning from a quiz (attempts changed) */
  useEffect(() => {
    const onFocus = () => setTick((n) => n + 1);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  /* ── Scroll-triggered entrance animations ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('quiz-card-visible');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const cards = gridRef.current?.querySelectorAll('.quiz-card-3d');
    cards?.forEach((card) => observer.observe(card));
    const filterEl = filterRef.current;
    if (filterEl) observer.observe(filterEl);

    return () => observer.disconnect();
  }, [filteredQuizzes, tick]);

  const techNames = ['All', ...new Set(QUIZZES.map((q) => q.technology))];
  const diffOptions = ['All', ...DIFFICULTY_LEVELS.map((d) => d.value)];
  const typeOptions = ['All', ...QUIZ_TYPES.map((t) => t.value)];

  const getDifficultyColor = (diff) => {
    const level = DIFFICULTY_LEVELS.find((d) => d.value === diff);
    return level ? level.color : '#6366f1';
  };

  return (
    <div className="quizzes-page">
      {/* ── Animated background ── */}
      <div className="quizzes-bg-layer" aria-hidden="true">
        <div className="quizzes-bg-orb quizzes-bg-orb--1" />
        <div className="quizzes-bg-orb quizzes-bg-orb--2" />
        <div className="quizzes-bg-orb quizzes-bg-orb--3" />
        <div className="quizzes-bg-grid" />
        {floatingTokens.map((t, i) => (
          <span
            key={i}
            className="floating-token"
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

      <div className="page-container quizzes-content">
        {/* ── Page header — PRACTICE purpose ── */}
        <div className="page-header quizzes-header">
          <span className="page-badge">🎯 Practice & Test</span>
          <h1>Practice Quizzes.<br />Sharpen Your Skills.</h1>
          <p>
            Timed questions with instant scoring and weak-topic analysis.
            Learn the theory in <Link to="/technologies" className="quizzes-inline-learn-link">Technologies</Link>, then prove it here.
          </p>
        </div>

        {/* ── Type chips ── */}
        <div className="quiz-type-chips" role="group" aria-label="Filter by quiz type">
          {typeOptions.map((type) => (
            <button
              key={type}
              className={`qt-chip ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type === 'All' ? 'All Types' : type}
            </button>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="quiz-filters quiz-filters-3d" ref={filterRef}>
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <label htmlFor="tech-filter">Technology:</label>
            <select
              id="tech-filter"
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
            >
              {techNames.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="diff-filter">Difficulty:</label>
            <select
              id="diff-filter"
              value={selectedDiff}
              onChange={(e) => setSelectedDiff(e.target.value)}
            >
              {diffOptions.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Levels' : diff.charAt(0) + diff.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-result">
            <span className="filter-count-badge">{filteredQuizzes.length}</span>{' '}
            quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} found
          </div>
        </div>

        {/* ── Quiz grid ── */}
        {loading ? (
          <LoadingSpinner text="Loading quizzes..." />
        ) : filteredQuizzes.length === 0 ? (
          <EmptyState
            icon={<FiAward size={54} />}
            title="No quizzes found"
            message="Try changing your filters — or explore learning roadmaps instead."
          />
        ) : (
          <div className="quiz-list-grid quiz-grid-3d" ref={gridRef}>
            {filteredQuizzes.map((quiz, index) => (
              <QuizCard3D key={`${quiz.id}-${tick}`} quiz={quiz} index={index} getDifficultyColor={getDifficultyColor} />
            ))}
          </div>
        )}

        {/* ── Cross-link banner back to learning ── */}
        <div className="quiz-learn-banner">
          <div>
            <strong>New to a topic?</strong>
            <p>Don't jump into tests cold — follow the roadmap in Technologies first, then come back and measure your progress here.</p>
          </div>
          <Link to="/technologies" className="btn btn-primary">Explore Learning Paths</Link>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
