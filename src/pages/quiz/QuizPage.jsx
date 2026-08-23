import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiArrowRight,
  FiHelpCircle,
  FiAward,
  FiRefreshCw,
  FiTarget,
  FiBookOpen,
} from 'react-icons/fi';
import { DIFFICULTY_LEVELS, TECHNOLOGIES } from '../../utils/constants';
import { recordQuizResult } from '../../utils/gamification';
import { getQuizById, getQuestionsForQuiz, analyseTopics } from '../../data/quizzes';
import { slugify } from '../../data/roadmaps';
import { recordAttempt } from '../../utils/quizStats';
import Confetti from '../../components/Common/Confetti';
import './QuizPage.css';

// ─── Helper ──────────────────────────────────────────────────
const getTechIcon = (techName) => {
  const tech = TECHNOLOGIES.find((t) => t.name === techName);
  return tech ? tech.icon : '📝';
};

const getDiffColor = (diff) => {
  const level = DIFFICULTY_LEVELS.find((d) => d.value === diff);
  return level ? level.color : '#6366f1';
};

// ─── Floating background tokens for start phase ──────────────
const FLOAT_TOKENS = [
  { text: '{ }', top: '8%', left: '5%', delay: 0, dur: 14 },
  { text: '</>', top: '15%', right: '6%', delay: 1.2, dur: 12 },
  { text: '()', top: '70%', left: '3%', delay: 2.5, dur: 15 },
  { text: '[]', top: '80%', right: '5%', delay: 0.8, dur: 13 },
  { text: '++;', top: '40%', left: '2%', delay: 3.5, dur: 16 },
  { text: '===', top: '55%', right: '3%', delay: 1.8, dur: 14 },
];

// ─── QuizPage Component ──────────────────────────────────────
const QuizPage = () => {
  const { id } = useParams();

  const quizId = parseInt(id, 10);
  // Single source of truth: src/data/quizzes.js (shared with Quizzes page)
  const quiz = getQuizById(quizId);
  const questions = getQuestionsForQuiz(quizId);

  // States: 'start' | 'playing' | 'result'
  const [phase, setPhase] = useState('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [reviewing, setReviewing] = useState(false);

  // 3D tilt ref for start card
  const startCardRef = useRef(null);

  // Initialize timer
  useEffect(() => {
    if (phase === 'playing' && quiz) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [phase, quiz]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft === 0]);

  // ── Mouse tilt handler for start card ──
  const handleStartCardMouseMove = useCallback((e) => {
    const card = startCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }, []);

  const handleStartCardMouseLeave = useCallback(() => {
    const card = startCardRef.current;
    if (card) card.style.transform = '';
  }, []);

  const handleStart = () => {
    setPhase('playing');
    setCurrentQ(0);
    setAnswers({});
    setReviewing(false);
  };

  const handleSelectAnswer = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleSubmit = useCallback(() => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((q, i) => {
      if (answers[i] === undefined) skipped++;
      else if (answers[i] === q.correct) correct++;
      else wrong++;
    });

    const totalMarks = questions.length;
    const score = correct;
    const percentage = Math.round((correct / totalMarks) * 100);
    const passed = percentage >= quiz.passingScore;
    const totalTime = quiz.duration * 60;
    const timeTaken = totalTime - timeLeft;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;

    // Weak-topic analysis for THIS attempt (per-question `topic` tags)
    const topicAnalysis = analyseTopics(questions, answers);

    setResult({
      score,
      totalMarks,
      percentage,
      correct,
      wrong,
      skipped,
      passed,
      topicAnalysis,
      timeTaken: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    });

    // ── Practice stats: attempts & best score (drives Quizzes cards) ──
    recordAttempt({ id: quiz.id, title: quiz.title, technology: quiz.technology }, { percentage });

    // ── Gamification: record result, unlock achievements ──
    const { newlyUnlocked } = recordQuizResult({
      result: {
        percentage,
        passed,
        skippedCount: skipped,
        totalQuestions: questions.length,
        timeLeftRatio: quiz.duration * 60 > 0 ? timeLeft / (quiz.duration * 60) : 0,
      },
      quiz: { technology: quiz.technology, difficulty: quiz.difficulty },
    });
    newlyUnlocked.forEach((a) =>
      toast.success(`${a.icon} Achievement Unlocked: ${a.title} (+${a.xp} XP)`)
    );

    setPhase('result');
  }, [answers, questions, quiz, timeLeft]);

  const handleRetry = () => {
    setPhase('start');
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setReviewing(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Quiz Not Found ──────────────────────────────────────
  if (!quiz || questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-not-found">
            <h2>Quiz Not Found</h2>
            <p>The quiz you're looking for doesn't exist.</p>
            <Link to="/quizzes" className="btn btn-primary">Back to Quizzes</Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Start Phase ─────────────────────────────────────────
  if (phase === 'start') {
    return (
      <div className="quiz-page quiz-page-start">
        {/* Background */}
        <div className="qs-bg" aria-hidden="true">
          <div className="qs-orb qs-orb-1" />
          <div className="qs-orb qs-orb-2" />
          <div className="qs-orb qs-orb-3" />
          <div className="qs-grid-pattern" />
          {FLOAT_TOKENS.map((t, i) => (
            <span
              key={i}
              className="qs-float-token"
              style={{
                top: t.top, left: t.left, right: t.right,
                animationDelay: `${t.delay}s`,
                animationDuration: `${t.dur}s`,
              }}
            >
              {t.text}
            </span>
          ))}
        </div>

        <div className="quiz-container">
          <div
            ref={startCardRef}
            className="quiz-start-card qs-card-3d"
            onMouseMove={handleStartCardMouseMove}
            onMouseLeave={handleStartCardMouseLeave}
          >
            <div className="qs-card-shine" />

            <div className="quiz-start-header qs-header-enhanced">
              <div className="qs-icon-3d-wrap">
                <div className="qs-icon-3d">
                  {getTechIcon(quiz.technology)}
                </div>
                <div className="qs-icon-ring" />
              </div>
              <div>
                <h1 className="qs-title">{quiz.title}</h1>
                <span className="quiz-start-tech">{quiz.quizType} · {quiz.technology}</span>
              </div>
            </div>

            <span
              className="quiz-start-diff qs-diff-3d"
              style={{
                background: `linear-gradient(135deg, ${getDiffColor(quiz.difficulty)}22, ${getDiffColor(quiz.difficulty)}11)`,
                color: getDiffColor(quiz.difficulty),
                border: `1px solid ${getDiffColor(quiz.difficulty)}30`,
              }}
            >
              {quiz.difficulty.charAt(0) + quiz.difficulty.slice(1).toLowerCase()}
            </span>

            <div className="quiz-start-stats qs-stats-row">
              <div className="qs-stat-pill">
                <div className="qs-stat-icon"><FiHelpCircle /></div>
                <div>
                  <div className="qs-stat-val">{questions.length}</div>
                  <div className="qs-stat-lbl">Questions</div>
                </div>
              </div>
              <div className="qs-stat-pill">
                <div className="qs-stat-icon"><FiClock /></div>
                <div>
                  <div className="qs-stat-val">{quiz.duration}</div>
                  <div className="qs-stat-lbl">Minutes</div>
                </div>
              </div>
              <div className="qs-stat-pill">
                <div className="qs-stat-icon"><FiAward /></div>
                <div>
                  <div className="qs-stat-val">{quiz.passingScore}%</div>
                  <div className="qs-stat-lbl">Pass</div>
                </div>
              </div>
            </div>

            <p className="quiz-start-desc qs-desc">{quiz.description}</p>

            <div className="quiz-start-rules qs-rules-3d">
              <h3>📋 Quiz Rules</h3>
              <ul className="qs-rules-list">
                <li className="qs-rule-item" style={{ animationDelay: '0.1s' }}>
                  <span className="qs-check">✓</span>
                  {questions.length} questions with one correct answer each
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.2s' }}>
                  <span className="qs-check">✓</span>
                  {quiz.duration} minute time limit
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.3s' }}>
                  <span className="qs-check">✓</span>
                  Passing score: {quiz.passingScore}%
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.4s' }}>
                  <span className="qs-check">✓</span>
                  Quiz automatically submits when time expires
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.5s' }}>
                  <span className="qs-check">✓</span>
                  You can review your answers before submitting
                </li>
              </ul>
            </div>

            <button className="btn btn-primary btn-lg btn-3d qs-start-btn" onClick={handleStart}>
              <span className="qs-btn-shine" />
              ▶ Start Practicing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Result Phase ────────────────────────────────────────
  if (phase === 'result' && result) {
    if (reviewing) {
      return (
        <div className="quiz-page">
          <div className="quiz-container">
            <div className="review-header">
              <h2>Answer Review — {quiz.title}</h2>
              <button className="btn btn-ghost" onClick={() => setReviewing(false)}>
                ← Back to Result
              </button>
            </div>
            <div className="review-questions">
              {questions.map((q, i) => {
                const userAnswer = answers[i];
                const isCorrect = userAnswer === q.correct;
                const isSkipped = userAnswer === undefined;
                return (
                  <div key={i} className={`review-question-card ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-q-header">
                      <span className="review-q-num">Question {i + 1}{q.topic ? ` · ${q.topic}` : ''}</span>
                      <span className={`review-status ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}`}>
                        {isSkipped ? '⊘ Skipped' : isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <p className="review-q-text">{q.q}</p>
                    <div className="review-options">
                      {q.opts.map((opt, j) => {
                        let cls = 'review-option';
                        if (j === q.correct) cls += ' correct';
                        if (j === userAnswer && j !== q.correct) cls += ' incorrect';
                        if (j === userAnswer) cls += ' selected';
                        return (
                          <div key={j} className={cls}>
                            {j === q.correct && <FiCheckCircle className="opt-icon" />}
                            {j === userAnswer && j !== q.correct && <FiXCircle className="opt-icon" />}
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    <div className="review-explanation">
                      <strong>Explanation:</strong> {q.exp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    const weakTopics = result.topicAnalysis.filter((t) => t.percent < 60);

    return (
      <div className="quiz-page">
        {result.passed && <Confetti />}
        <div className="quiz-container">
          <div className="quiz-result-card">
            <div className="result-header">
              <h1>Practice Complete!</h1>
            </div>

            <div className={`result-circle ${result.passed ? 'passed' : 'failed'}`}>
              <span className="result-score">{result.percentage}%</span>
              <span className="result-fraction">{result.score} / {result.totalMarks}</span>
            </div>

            <div className={`result-badge ${result.passed ? 'passed' : 'failed'}`}>
              {result.passed ? '✓ PASSED' : '✗ FAILED'}
            </div>

            <div className="result-stats">
              <div className="result-stat">
                <span className="stat-val correct-color">{result.correct}</span>
                <span className="stat-lbl">Correct</span>
              </div>
              <div className="result-stat">
                <span className="stat-val wrong-color">{result.wrong}</span>
                <span className="stat-lbl">Wrong</span>
              </div>
              <div className="result-stat">
                <span className="stat-val skip-color">{result.skipped}</span>
                <span className="stat-lbl">Skipped</span>
              </div>
              <div className="result-stat">
                <span className="stat-val time-color">{result.timeTaken}</span>
                <span className="stat-lbl">Time Taken</span>
              </div>
            </div>

            {/* ── Weak-topic analysis ── */}
            <div className="topic-analysis">
              <h3><FiTarget /> Topic Performance</h3>
              <p className="topic-analysis-sub">Where you're strong — and what to revise next.</p>
              <div className="topic-bars">
                {result.topicAnalysis.map((t) => (
                  <div key={t.topic} className="topic-bar-row">
                    <div className="topic-bar-head">
                      <span className="topic-name">{t.topic}</span>
                      <span className={`topic-score ${t.percent >= 60 ? 'ok' : 'weak'}`}>
                        {t.correct}/{t.total} · {t.percent}%
                      </span>
                    </div>
                    <div className="topic-track">
                      <div
                        className={`topic-fill ${t.percent >= 60 ? '' : 'weak'}`}
                        style={{ width: `${Math.max(t.percent, 3)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {weakTopics.length > 0 && (
                <div className="weak-topics-box">
                  <strong>📚 Focus next:</strong>{' '}
                  {weakTopics.map((t, i) => (
                    <span key={t.topic}>
                      {i > 0 && ', '}
                      <em>{t.topic}</em>
                    </span>
                  ))}
                  <div className="weak-topic-actions">
                    <Link
                      to={`/technologies/${slugify(quiz.technology)}`}
                      className="btn btn-outline btn-sm"
                    >
                      <FiBookOpen /> Learn {quiz.technology}
                    </Link>
                    <button className="btn btn-primary btn-sm" onClick={handleRetry}>
                      <FiRefreshCw /> Practice Again
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="result-actions">
              <button className="btn btn-primary btn-3d" onClick={() => setReviewing(true)}>
                Review Answers
              </button>
              <button className="btn btn-outline btn-3d" onClick={handleRetry}>
                <FiRefreshCw /> Retry Quiz
              </button>
              <Link to="/quizzes" className="btn btn-ghost">
                Back to Quizzes
              </Link>
              <Link to="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Playing Phase ───────────────────────────────────────
  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isLowTime = timeLeft <= 60;

  return (
    <div className="quiz-page">
      <div className="quiz-container quiz-playing">
        {/* Top bar */}
        <div className="quiz-topbar">
          <div className="quiz-topbar-left">
            <h2 className="quiz-playing-title">{quiz.title}</h2>
            <span className="quiz-topbar-tech">{getTechIcon(quiz.technology)} {quiz.technology}</span>
          </div>
          <div className={`quiz-timer ${isLowTime ? 'low-time' : ''}`}>
            <FiClock />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="quiz-question-card">
          <div className="quiz-q-header">
            <span className="quiz-q-num">Question {currentQ + 1} of {questions.length}</span>
            <span className="quiz-q-answered">{answeredCount} answered</span>
          </div>
          <p className="quiz-q-text">{q.q}</p>

          <div className="quiz-options">
            {q.opts.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${answers[currentQ] === i ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(currentQ, i)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            className="btn btn-ghost"
            onClick={handlePrev}
            disabled={currentQ === 0}
          >
            <FiArrowLeft /> Previous
          </button>
          {currentQ < questions.length - 1 ? (
            <button className="btn btn-primary btn-3d" onClick={handleNext}>
              Next <FiArrowRight />
            </button>
          ) : (
            <button className="btn btn-primary btn-3d" onClick={handleSubmit}>
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="quiz-navigator">
          <h4>Question Navigator</h4>
          <div className="quiz-nav-grid">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`quiz-nav-btn ${i === currentQ ? 'current' : ''} ${answers[i] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQ(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
