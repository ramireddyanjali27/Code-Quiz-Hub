import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiTarget, FiTrendingUp, FiZap, FiRefreshCw } from 'react-icons/fi';
import {
  ACHIEVEMENTS,
  getStats,
  getLevelInfo,
} from '../../utils/gamification';
import './Achievements.css';

/* ─── Floating background tokens ─── */
const FLOAT_TOKENS = [
  { text: '★', top: '10%', left: '4%', delay: 0, dur: 13 },
  { text: '</>', top: '20%', right: '6%', delay: 1.2, dur: 12 },
  { text: '{ }', top: '65%', left: '3%', delay: 2.4, dur: 15 },
  { text: '#', top: '75%', right: '5%', delay: 0.9, dur: 14 },
  { text: '++', top: '40%', left: '1.5%', delay: 3.2, dur: 16 },
];

const Achievements = () => {
  const [stats, setStats] = useState(getStats());
  const [flipIds, setFlipIds] = useState({});

  const levelInfo = getLevelInfo(stats.totalXp);
  const unlockedCount = stats.unlockedIds.length;
  const totalXpEarned = ACHIEVEMENTS.filter((a) =>
    stats.unlockedIds.includes(a.id)
  ).reduce((sum, a) => sum + a.xp, 0);

  const toggleFlip = (id) =>
    setFlipIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const overviewCards = [
    { icon: <FiTarget />, value: stats.quizzesCompleted, label: 'Quizzes Taken', color: '#6366f1' },
    { icon: <FiCheckCircle />, value: stats.quizzesPassed, label: 'Quizzes Passed', color: '#22c55e' },
    { icon: <FiZap />, value: stats.perfectScores, label: 'Perfect Scores', color: '#f59e0b' },
    { icon: <FiTrendingUp />, value: `${totalXpEarned}`, label: 'Badge XP Earned', color: '#ec4899' },
  ];

  return (
    <div className="ach-page">
      {/* ── 3D animated background ── */}
      <div className="ach-bg" aria-hidden="true">
        <div className="ach-orb ach-orb-1" />
        <div className="ach-orb ach-orb-2" />
        <div className="ach-orb ach-orb-3" />
        <div className="ach-grid" />
        {FLOAT_TOKENS.map((t, i) => (
          <span
            key={i}
            className="ach-token"
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

      <div className="page-container ach-content">
        {/* ── Page header ── */}
        <div className="page-header ach-header">
          <h1>
            Your <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Achievements</span>
          </h1>
          <p>Earn badges, collect XP and level up as you master new technologies.</p>
        </div>

        {/* ── Level panel with 3D medallion ── */}
        <div className="ach-level-panel">
          <div className="ach-medallion-scene" aria-hidden="true">
            <div className="ach-medallion">
              <div className="ach-medallion-face ach-medallion-front">
                <span className="ach-medallion-rank-icon">{levelInfo.rankIcon}</span>
              </div>
              <div className="ach-medallion-face ach-medallion-back">
                <span className="ach-medallion-lvl-num">{levelInfo.level}</span>
              </div>
            </div>
            <div className="ach-medallion-ring ach-ring-a" />
            <div className="ach-medallion-ring ach-ring-b" />
          </div>

          <div className="ach-level-body">
            <div className="ach-level-top">
              <h2>{levelInfo.rank}</h2>
              <span className="ach-level-chip">Level {levelInfo.level}</span>
            </div>
            <div className="ach-xp-bar-wrap">
              <div className="ach-xp-bar">
                <div
                  className="ach-xp-fill"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                >
                  <span className="ach-xp-shine" />
                </div>
              </div>
              <span className="ach-xp-text">
                {levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP to next level
              </span>
            </div>
          </div>

          <button
            className="btn btn-outline ach-refresh-btn"
            onClick={() => setStats(getStats())}
            title="Refresh stats"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* ── Overview stat cards (tilt on hover) ── */}
        <div className="ach-overview-row">
          {overviewCards.map((c, i) => (
            <div key={i} className="ach-stat-card" style={{ '--sc': c.color }}>
              <div className="asc-icon">{c.icon}</div>
              <div>
                <div className="asc-value">{c.value}</div>
                <div className="asc-label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Badge grid — 3D flip cards ── */}
        <div className="ach-progress-line">
          <span>
            🏅 {unlockedCount} of {ACHIEVEMENTS.length} badges unlocked
          </span>
        </div>

        <div className="ach-badge-grid">
          {ACHIEVEMENTS.map((a, i) => {
            const unlocked = stats.unlockedIds.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                className={`ach-badge-scene ${unlocked ? 'unlocked' : 'locked'} ${flipIds[a.id] ? 'flipped' : ''}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => toggleFlip(a.id)}
                aria-label={`${a.title} badge — ${unlocked ? 'unlocked' : 'locked'}. Click to flip.`}
              >
                <div className="ach-badge-inner">
                  {/* Front */}
                  <div className="ach-badge-front">
                    <div className="abf-glow" aria-hidden="true" />
                    <div className="abf-icon">{unlocked ? a.icon : '🔒'}</div>
                    <h3 className="abf-title">{a.title}</h3>
                    <span className="abf-xp">+{a.xp} XP</span>
                    {!unlocked && (
                      <span className="abf-lock">
                        <FiLock size={12} /> Locked
                      </span>
                    )}
                  </div>
                  {/* Back */}
                  <div className="ach-badge-back">
                    <p className="abb-desc">{a.desc}</p>
                    <span className={`abb-status ${unlocked ? 'yes' : 'no'}`}>
                      {unlocked ? (
                        <>
                          <FiCheckCircle /> Unlocked!
                        </>
                      ) : (
                        <>
                          <FiLock /> Keep quizzing to unlock
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── CTA banner ── */}
        <div className="ach-cta">
          <div className="ach-cta-left">
            <span className="ach-cta-emoji">🚀</span>
            <div>
              <h3>Want more badges?</h3>
              <p>Take another quiz and unlock your next achievement!</p>
            </div>
          </div>
          <Link to="/quizzes" className="btn btn-primary">Explore Quizzes →</Link>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
