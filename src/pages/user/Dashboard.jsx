// ─── User Dashboard ──────────────────────────────────────────
// Two distinct identities:
//   • LEARNING  → roadmap progress (Technologies side)
//   • PRACTICE  → quiz performance (Quizzes side)
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlay,
  FiLayers,
  FiTarget,
  FiAward,
  FiRefreshCw,
  FiTrendingUp,
  FiMap,
  FiZap,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ALL_ROADMAP_LIST as ALL_ROADMAPS } from '../../data/roadmaps';
import { getTechProgress, computeProgressPercent, getNextLesson } from '../../utils/learningStore';
import { getOverallQuizStats, getQuizStats } from '../../utils/quizStats';
import { QUIZZES } from '../../data/quizzes';
import { getStats, getLevelInfo, ACHIEVEMENTS } from '../../utils/gamification';
import { TECHNOLOGIES } from '../../utils/constants';
import ProgressRing from '../../components/Learning/ProgressRing';
import './Dashboard.css';

const getQuizIcon = (techName) => {
  const tech = TECHNOLOGIES.find((t) => t.name === techName);
  return tech ? tech.icon : '📝';
};

const Dashboard = () => {
  const { user } = useAuth();

  // ── Learning data ──
  const learning = useMemo(() => {
    const rows = [];
    let lessons = 0;
    let assignments = 0;
    let challenges = 0;

    ALL_ROADMAPS.forEach((r) => {
      const p = getTechProgress(r.id);
      const percent = computeProgressPercent(r, p);
      if (percent > 0 || p.lastLessonId) {
        const next = getNextLesson(r, p);
        rows.push({ roadmap: r, percent, next });
      }
      lessons += p.lessons.length;
      assignments += p.assignments.length;
      challenges += p.challenges.length;
    });

    rows.sort((a, b) => b.percent - a.percent);
    return {
      rows,
      lessons,
      assignments,
      challenges,
      continueRow: rows.find((x) => x.percent < 100) || null,
    };
  }, []);

  // ── Quiz practice data ──
  const practice = useMemo(() => {
    const overall = getOverallQuizStats();
    const attempted = QUIZZES.map((q) => ({ quiz: q, s: getQuizStats(q.id) }))
      .filter((x) => x.s.attempts > 0)
      .sort((a, b) => b.s.lastScore - a.s.lastScore);
    return { overall, attempted };
  }, []);

  // ── Gamification ──
  const stats = getStats();
  const level = getLevelInfo(stats.totalXp);
  let streak = { current: 0 };
  try {
    streak = JSON.parse(localStorage.getItem('cq-streak')) || streak;
  } catch {
    /* fresh visitor */
  }
  const unlocked = new Set(stats.unlockedIds);

  const firstName = user?.fullName?.split(' ')[0] || 'Learner';

  return (
    <div className="dashboard-page">
      <div className="page-container">
        {/* ── Greeting + level bar ── */}
        <div className="dashboard-greeting">
          <div>
            <h1>Welcome back, {firstName} 👋</h1>
            <p>Learn something new, then prove it.</p>
          </div>
          <div className="dash-level-card">
            <span className="dash-level-rank">{level.rankIcon} {level.rank}</span>
            <span className="dash-level-num">Lv {level.level}</span>
            <div className="dash-level-track" role="progressbar" aria-valuenow={level.progressPercent} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ width: `${level.progressPercent}%` }} />
            </div>
            <span className="dash-level-xp">{stats.totalXp} XP · {level.xpIntoLevel}/{level.xpForNextLevel}</span>
          </div>
        </div>

        {/* ── Quick stats ── */}
        <div className="dash-quick-row">
          <Link to="/technologies" className="dash-quick-card learn">
            <FiMap />
            <strong>{learning.rows.length ? `${learning.rows.filter(r=>r.percent===100).length}/${ALL_ROADMAPS.length}` : '0'}</strong>
            <span>Roadmaps done</span>
          </Link>
          <div className="dash-quick-card learn">
            <FiLayers />
            <strong>{learning.lessons}</strong>
            <span>Lessons learned</span>
          </div>
          <Link to="/quizzes" className="dash-quick-card quiz">
            <FiTarget />
            <strong>{practice.overall.quizzesCompleted}</strong>
            <span>Quiz attempts</span>
          </Link>
          <div className="dash-quick-card quiz">
            <FiTrendingUp />
            <strong>{practice.overall.avgScore}%</strong>
            <span>Avg score</span>
          </div>
          <div className={`dash-quick-card streak ${streak.current > 0 ? 'hot' : ''}`}>
            <FiZap />
            <strong>{streak.current || 0}</strong>
            <span>Day streak</span>
          </div>
        </div>

        {/* ================================================================
            SECTION A — LEARNING PROGRESS (Technologies)
           ================================================================ */}
        <section className="dash-section" aria-labelledby="dash-learning-h">
          <header className="dash-section-head learn-accent">
            <h2 id="dash-learning-h"><FiLayers /> Learning Progress</h2>
            <p>Your journey through the technology roadmaps</p>
          </header>

          {/* Continue learning hero card */}
          {learning.continueRow ? (
            <Link
              to={`/technologies/${learning.continueRow.roadmap.id}/lesson/${learning.continueRow.next?.id}`}
              className="dash-continue-card"
              style={{ '--rc': learning.continueRow.roadmap.color }}
            >
              <span className="dcc-icon">{learning.continueRow.roadmap.icon}</span>
              <div className="dcc-info">
                <span className="dcc-label">Continue Learning</span>
                <h3>{learning.continueRow.roadmap.name}</h3>
                <p>Up next: {learning.continueRow.next?.title}</p>
              </div>
              <ProgressRing percent={learning.continueRow.percent} size={62} stroke={7} color={learning.continueRow.roadmap.color} />
              <span className="dcc-go"><FiPlay /></span>
            </Link>
          ) : (
            <div className="dash-empty-hero">
              <span className="deh-icon">🗺️</span>
              <div>
                <h3>No roadmaps started yet</h3>
                <p>Pick a technology and follow its guided path — videos, assignments & coding practice included.</p>
              </div>
              <Link to="/technologies" className="btn btn-primary">Start Learning</Link>
            </div>
          )}

          {/* Started roadmaps breakdown */}
          {learning.rows.length > 0 && (
            <div className="dash-progress-list">
              {learning.rows.map(({ roadmap, percent, next }) => (
                <div key={roadmap.id} className="dash-progress-row" style={{ '--rc': roadmap.color }}>
                  <span className="dpr-icon">{roadmap.icon}</span>
                  <div className="dpr-main">
                    <div className="dpr-top">
                      <strong>{roadmap.name}</strong>
                      <em>{percent}%</em>
                    </div>
                    <div className="dpr-track"><div style={{ width: `${percent}%` }} /></div>
                    <span className="dpr-next">Next: {next?.title}</span>
                  </div>
                  <Link
                    to={`/technologies/${roadmap.id}/lesson/${next?.id}`}
                    className="btn btn-sm btn-outline"
                    aria-label={`Continue ${roadmap.name}`}
                  >
                    {percent === 100 ? 'Review' : 'Continue'}
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Assignment/challenge tallies */}
          {(learning.assignments > 0 || learning.challenges > 0) && (
            <div className="dash-mini-tallies">
              <span>📄 {learning.assignments} assignments submitted</span>
              <span>💻 {learning.challenges} coding challenges solved</span>
            </div>
          )}
        </section>

        {/* ================================================================
            SECTION B — QUIZ PERFORMANCE (Quizzes)
           ================================================================ */}
        <section className="dash-section" aria-labelledby="dash-quiz-h">
          <header className="dash-section-head quiz-accent">
            <h2 id="dash-quiz-h"><FiTarget /> Quiz Performance</h2>
            <p>Scores, attempts and progress across your practice tests</p>
          </header>

          {practice.attempted.length === 0 ? (
            <div className="dash-empty-hero alt">
              <span className="deh-icon">🎯</span>
              <div>
                <h3>No quizzes taken yet</h3>
                <p>Practice tests show what you've truly mastered — timed questions, instant scoring, weak-topic analysis.</p>
              </div>
              <Link to="/quizzes" className="btn btn-primary">Take a Quiz</Link>
            </div>
          ) : (
            <>
              <div className="dash-quiz-summary">
                <div><FiTarget /><strong>{practice.overall.quizzesCompleted}</strong><span>Attempts</span></div>
                <div><FiTrendingUp /><strong>{practice.overall.avgScore}%</strong><span>Average</span></div>
                <div><FiAward /><strong>{practice.overall.bestScore}%</strong><span>Best score</span></div>
                <div><FiLayers /><strong>{practice.overall.technologies}</strong><span>Topics tried</span></div>
              </div>

              <div className="dash-quiz-list">
                {practice.attempted.map(({ quiz, s }) => (
                  <div key={quiz.id} className="dash-quiz-row">
                    <div className="dqr-head">
                      <strong>{getQuizIcon(quiz.technology)} {quiz.title}</strong>
                      <span className={`dqr-score ${s.bestScore >= quiz.passingScore ? 'pass' : 'fail'}`}>
                        Best {s.bestScore}%
                      </span>
                    </div>
                    <div className="dqr-meta">
                      <span>{s.attempts} attempt{s.attempts !== 1 ? 's' : ''}</span>
                      <span>Last: {s.lastScore}%</span>
                      <Link to={`/quiz/${quiz.id}`} className="dqr-retake">
                        <FiRefreshCw /> Practice again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── Achievements strip ── */}
        <section className="dash-section slim" aria-labelledby="dash-ach-h">
          <header className="dash-section-head neutral">
            <h2 id="dash-ach-h"><FiAward /> Achievements</h2>
            <p>{unlocked.size} of {ACHIEVEMENTS.length} unlocked</p>
          </header>
          <div className="dash-ach-grid">
            {ACHIEVEMENTS.map((a) => {
              const has = unlocked.has(a.id);
              return (
                <div key={a.id} className={`dash-ach-chip ${has ? 'got' : ''}`} title={a.desc}>
                  <span className="dac-icon">{has ? a.icon : '🔒'}</span>
                  <span className="dac-name">{a.title}</span>
                  <span className="dac-xp">+{a.xp} XP</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
