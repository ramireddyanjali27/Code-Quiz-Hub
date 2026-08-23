// ─── Lesson Insights Rail ────────────────────────────────────
// Compact learning dashboard rendered beside the lesson content
// on wide screens and below it on narrower ones. Every number is
// read live from the existing localStorage stores (no fake data):
//   • roadmap %      → utils/learningStore.computeProgressPercent
//   • XP & lessons   → utils/gamification.getStats
//   • streak         → utils/gamification.getStreak
//   • achievement    → first not-yet-unlocked ACHIEVEMENTS entry
import { FiArrowRight, FiAward, FiCheckCircle, FiLock, FiClock, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ProgressRing from './ProgressRing';
import { ACHIEVEMENTS, getStats, getStreak, getLevelInfo } from '../../utils/gamification';

const resolveNextAchievement = (stats, streak, percent) => {
  const unlocked = new Set(stats.unlockedIds || []);
  const candidates = [
    { id: 'first_lesson', cur: stats.lessonsCompleted, target: 1 },
    { id: 'code_challenger', cur: stats.challengesCompleted, target: 1 },
    { id: 'roadmap_25', cur: percent, target: 25 },
    { id: 'roadmap_50', cur: percent, target: 50 },
    { id: 'streak_7', cur: streak, target: 7 },
    { id: 'roadmap_100', cur: percent, target: 100 },
  ];
  for (const c of candidates) {
    const ach = ACHIEVEMENTS.find((a) => a.id === c.id);
    if (ach && !unlocked.has(c.id)) {
      return { ...ach, current: Math.min(c.cur, c.target), target: c.target };
    }
  }
  return null;
};

const LessonInsights = ({ roadmap, percent, lessonPercent, nextMod, nextStatus, onGoNext }) => {
  const stats = getStats();
  const streak = getStreak();
  const level = getLevelInfo(stats.totalXp);
  const achievement = resolveNextAchievement(stats, streak, percent);
  const achPct = achievement ? Math.round((achievement.current / achievement.target) * 100) : 0;

  return (
    <aside className="lp-rail" aria-label="Learning insights">
      {/* ── Your Learning ── */}
      <section className="lp-card lp-learn" aria-label="Your learning stats">
        <h4 className="lp-card-title">Your Learning</h4>

        <div className="lp-learn-top">
          <ProgressRing percent={percent} size={78} stroke={8} color={roadmap.color} sublabel="ROADMAP" />
          <div className="lp-learn-level">
            <span className="lp-xp-big">{stats.totalXp.toLocaleString()} <em>XP</em></span>
            <span className="lp-rank-chip">{level.rankIcon} Lv {level.level} · {level.rank}</span>
            <div className="lp-xp-bar" role="progressbar" aria-valuenow={level.progressPercent} aria-label="Level progress">
              <span style={{ width: `${level.progressPercent}%` }} />
            </div>
            <span className="lp-xp-hint">{level.xpIntoLevel}/{level.xpForNextLevel} XP to level {level.level + 1}</span>
          </div>
        </div>

        <dl className="lp-stat-grid">
          <div className="lp-stat">
            <dt>Lesson</dt>
            <dd><span className="lp-stat-num">{lessonPercent}%</span></dd>
          </div>
          <div className="lp-stat">
            <dt>Streak</dt>
            <dd><span className="lp-stat-num flame">🔥 {streak}</span><small>{streak === 1 ? 'day' : 'days'}</small></dd>
          </div>
          <div className="lp-stat">
            <dt>Lessons done</dt>
            <dd><span className="lp-stat-num">{stats.lessonsCompleted}</span></dd>
          </div>
          <div className="lp-stat">
            <dt>Assignments</dt>
            <dd><span className="lp-stat-num">{stats.assignmentsCompleted}</span></dd>
          </div>
        </dl>

        {streak === 0 && (
          <p className="lp-streak-hint">Complete today's lesson to start your streak.</p>
        )}
      </section>

      {/* ── Up Next ── */}
      {nextMod && (
        <section className={`lp-card lp-next ${nextStatus === 'locked' ? 'is-locked' : ''}`} aria-label="Up next">
          <h4 className="lp-card-title">Up Next</h4>
          <span className="lp-next-icon">{nextStatus === 'locked' ? <FiLock /> : <FiCheckCircle />}</span>
          <strong className="lp-next-title">{nextMod.title}</strong>
          <span className="lp-next-meta"><FiClock /> {nextMod.minutes} min · {nextMod.level.toLowerCase()}</span>

          {nextStatus !== 'locked' ? (
            <button type="button" className="btn btn-primary btn-sm lp-next-btn" onClick={onGoNext}>
              Continue <FiArrowRight />
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-outline btn-sm lp-next-btn" disabled>
                <FiLock /> Locked
              </button>
              <p className="lp-next-hint">Complete this lesson to continue.</p>
            </>
          )}
        </section>
      )}

      {!nextMod && (
        <section className="lp-card lp-next is-done" aria-label="Roadmap complete">
          <h4 className="lp-card-title">Up Next</h4>
          <strong className="lp-next-title">🏆 {roadmap.name} Roadmap Completed!</strong>
          <Link className="btn btn-outline btn-sm lp-next-btn" to={`/technologies/${roadmap.id}`}>
            Back to roadmap
          </Link>
        </section>
      )}

      {/* ── Next Achievement ── */}
      <section className="lp-card lp-ach" aria-label="Next achievement">
        <h4 className="lp-card-title">Next Achievement</h4>
        {achievement ? (
          <>
            <div className="lp-ach-row">
              <span className="lp-ach-icon" aria-hidden="true">{achievement.icon}</span>
              <div>
                <strong>{achievement.title}</strong>
                <span className="lp-ach-desc">{achievement.desc}</span>
              </div>
            </div>
            <div className="lp-ach-track" aria-hidden="true">
              <span style={{ width: `${achPct}%` }} />
            </div>
            <div className="lp-ach-meta">
              <span>{achievement.current} / {achievement.target}{achievement.target > 1 ? ` (${achievement.target >= 25 ? '% complete' : ' needed'})` : ''}</span>
              <span className="lp-ach-xp"><FiZap /> +{achievement.xp} XP</span>
            </div>
          </>
        ) : (
          <div className="lp-ach-empty">
            <FiAward size={30} />
            <strong>All caught up!</strong>
            <p>You've unlocked every milestone on this path. Keep learning to stay sharp.</p>
          </div>
        )}
      </section>
    </aside>
  );
};

export default LessonInsights;
