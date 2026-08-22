import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiHelpCircle, FiFilter } from 'react-icons/fi';
import { TECHNOLOGIES, DIFFICULTY_LEVELS } from '../../utils/constants';
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
function QuizCard3D({ quiz, index, getDifficultyColor, getTechIcon }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);

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
    if (card) {
      card.style.transform = '';
    }
    if (shineRef.current) {
      shineRef.current.style.opacity = '0';
    }
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
        <span className="quiz-tech-badge">
          <span className="quiz-tech-icon-wrap">
            {getTechIcon(quiz.technology)}
          </span>
          {quiz.technology}
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
        <span>
          <FiHelpCircle /> {quiz.totalQuestions} Questions
        </span>
        <span>
          <FiClock /> {quiz.duration} min
        </span>
      </div>
      <div className="quiz-card-footer">
        <span className="quiz-passing">Pass: {quiz.passingScore}%</span>
        <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm quiz-start-btn">
          Start Quiz
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Quizzes Page ─── */
const Quizzes = () => {
  const [quizzes] = useState([
    {
      id: 1,
      title: 'Java OOP Basics',
      technology: 'Java',
      difficulty: 'BEGINNER',
      totalQuestions: 15,
      duration: 10,
      passingScore: 60,
    },
    {
      id: 2,
      title: 'JavaScript ES6+ Features',
      technology: 'JavaScript',
      difficulty: 'INTERMEDIATE',
      totalQuestions: 20,
      duration: 15,
      passingScore: 65,
    },
    {
      id: 3,
      title: 'Data Structures - Arrays & Linked Lists',
      technology: 'Data Structures',
      difficulty: 'ADVANCED',
      totalQuestions: 25,
      duration: 20,
      passingScore: 70,
    },
    {
      id: 4,
      title: 'Python Fundamentals',
      technology: 'Python',
      difficulty: 'BEGINNER',
      totalQuestions: 15,
      duration: 10,
      passingScore: 60,
    },
    {
      id: 5,
      title: 'Spring Boot REST APIs',
      technology: 'Spring Boot',
      difficulty: 'INTERMEDIATE',
      totalQuestions: 18,
      duration: 15,
      passingScore: 65,
    },
    {
      id: 6,
      title: 'React Hooks & Components',
      technology: 'React',
      difficulty: 'INTERMEDIATE',
      totalQuestions: 20,
      duration: 15,
      passingScore: 65,
    },
    {
      id: 7,
      title: 'SQL Queries & Joins',
      technology: 'SQL',
      difficulty: 'BEGINNER',
      totalQuestions: 15,
      duration: 10,
      passingScore: 60,
    },
    {
      id: 8,
      title: 'Algorithms - Sorting & Searching',
      technology: 'Algorithms',
      difficulty: 'ADVANCED',
      totalQuestions: 20,
      duration: 20,
      passingScore: 70,
    },
    {
      id: 9,
      title: 'Java Collections Framework',
      technology: 'Java',
      difficulty: 'INTERMEDIATE',
      totalQuestions: 15,
      duration: 12,
      passingScore: 65,
    },
  ]);

  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes);
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedDiff, setSelectedDiff] = useState('All');
  const [loading] = useState(false);
  const filterRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    let result = quizzes;
    if (selectedTech !== 'All') {
      result = result.filter((q) => q.technology === selectedTech);
    }
    if (selectedDiff !== 'All') {
      result = result.filter((q) => q.difficulty === selectedDiff);
    }
    setFilteredQuizzes(result);
  }, [selectedTech, selectedDiff, quizzes]);

  /* ── Scroll-triggered entrance animations ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('quiz-card-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const cards = gridRef.current?.querySelectorAll('.quiz-card-3d');
    cards?.forEach((card) => observer.observe(card));

    const filterEl = filterRef.current;
    if (filterEl) observer.observe(filterEl);

    return () => observer.disconnect();
  }, [filteredQuizzes]);

  const techNames = ['All', ...new Set(quizzes.map((q) => q.technology))];
  const diffOptions = ['All', ...DIFFICULTY_LEVELS.map((d) => d.value)];

  const getDifficultyColor = (diff) => {
    const level = DIFFICULTY_LEVELS.find((d) => d.value === diff);
    return level ? level.color : '#6366f1';
  };

  const getTechIcon = (techName) => {
    const tech = TECHNOLOGIES.find((t) => t.name === techName);
    return tech ? tech.icon : '📝';
  };

  return (
    <div className="quizzes-page">
      {/* ── Animated 3D background ── */}
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
        {/* ── Page header ── */}
        <div className="page-header quizzes-header">
          <h1>
            Browse <span style={{color: '#0f172a', fontWeight: 700}}>Quizzes</span>
          </h1>
          <p>
            Test your knowledge with timed quizzes across multiple technologies
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="quiz-filters quiz-filters-3d" ref={filterRef}>
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <label>Technology:</label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
            >
              {techNames.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Difficulty:</label>
            <select
              value={selectedDiff}
              onChange={(e) => setSelectedDiff(e.target.value)}
            >
              {diffOptions.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All'
                    ? 'All Levels'
                    : diff.charAt(0) + diff.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-result">
            <span className="filter-count-badge">
              {filteredQuizzes.length}
            </span>{' '}
            quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} found
          </div>
        </div>

        {/* ── Quiz grid ── */}
        {loading ? (
          <LoadingSpinner text="Loading quizzes..." />
        ) : filteredQuizzes.length === 0 ? (
          <EmptyState
            title="No quizzes found"
            message="Try changing your filters to see more quizzes."
          />
        ) : (
          <div className="quiz-list-grid quiz-grid-3d" ref={gridRef}>
            {filteredQuizzes.map((quiz, index) => (
              <QuizCard3D
                key={quiz.id}
                quiz={quiz}
                index={index}
                getDifficultyColor={getDifficultyColor}
                getTechIcon={getTechIcon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
