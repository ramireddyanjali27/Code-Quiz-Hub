import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiRotateCw } from 'react-icons/fi';
import './SpinWheel.css';

/* ─── Wheel segments (mapped to quiz ids in QuizPage) ─── */
const SEGMENTS = [
  { name: 'Java', icon: '☕', color: '#f89820', quizId: 1 },
  { name: 'Python', icon: '🐍', color: '#3776AB', quizId: 4 },
  { name: 'JavaScript', icon: '⚡', color: '#eab308', quizId: 2 },
  { name: 'React', icon: '⚛️', color: '#06b6d4', quizId: 6 },
  { name: 'SQL', icon: '🗄️', color: '#336791', quizId: 7 },
  { name: 'Spring Boot', icon: '🌱', color: '#22c55e', quizId: 5 },
  { name: 'Data Structures', icon: '🧠', color: '#8b5cf6', quizId: 3 },
  { name: 'Algorithms', icon: '🧮', color: '#ec4899', quizId: 8 },
];

const SEG_ANGLE = 360 / SEGMENTS.length;
const SPIN_MS = 5000;

const buildConic = () => {
  const stops = SEGMENTS.map(
    (s, i) => `${s.color} ${i * SEG_ANGLE}deg ${(i + 1) * SEG_ANGLE}deg`
  );
  return `conic-gradient(from -${SEG_ANGLE / 2}deg, ${stops.join(', ')})`;
};

const SpinWheel = () => {
  const navigate = useNavigate();
  const wheelRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const spinTimer = useRef(null);

  const spin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);

    const idx = Math.floor(Math.random() * SEGMENTS.length);
    // Segments are centered at idx*A (gradient starts at -A/2); bring that center under the top pointer
    const targetMod = (360 - ((idx * SEG_ANGLE) % 360)) % 360;
    const turns = 4 + Math.floor(Math.random() * 3);
    const current = rotation;
    let next = current - (current % 360) + turns * 360 + targetMod;
    while (next <= current + 1080) next += 360;

    setRotation(next);
    clearTimeout(spinTimer.current);
    spinTimer.current = setTimeout(() => {
      setSpinning(false);
      setResult(SEGMENTS[idx]);
    }, SPIN_MS + 150);
  };

  return (
    <section className="spin-section" id="daily-challenge">
      {/* decorative floating shapes */}
      <div className="sw-deco sw-deco-1" aria-hidden="true" />
      <div className="sw-deco sw-deco-2" aria-hidden="true" />
      <div className="sw-deco sw-deco-3" aria-hidden="true" />

      <div className="sw-container">
        <div className="sw-header">
          <span className="sw-kicker">🎲 Daily Challenge</span>
          <h2>Spin the <span className="sw-grad-text">Code Wheel</span></h2>
          <p>Let fate pick your next coding challenge — where will the wheel land?</p>
        </div>

        <div className="sw-layout">
          {/* ── The 3D wheel ── */}
          <div className={`sw-scene ${spinning ? 'spinning' : ''}`}>
            <div className="sw-pointer" aria-hidden="true">▼</div>
            <div className="sw-wheel-tilt">
              <div
                ref={wheelRef}
                className="sw-wheel"
                style={{
                  background: buildConic(),
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.84, 0.18, 1)` : 'none',
                }}
              >
                {SEGMENTS.map((s, i) => {
                  const angle = i * SEG_ANGLE;
                  return (
                    <span
                      key={s.name}
                      className="sw-label"
                      style={{ transform: `rotate(${angle}deg) translateY(-118px)` }}
                    >
                      <span className="sw-label-icon">{s.icon}</span>
                      <span className="sw-label-name">{s.name}</span>
                    </span>
                  );
                })}
              </div>
              <div className="sw-hub">
                <span>&lt;/&gt;</span>
              </div>
              <div className="sw-rim-glow" aria-hidden="true" />
            </div>
          </div>

          {/* ── Result / info panel ── */}
          <div className="sw-panel">
            {!result && !spinning && (
              <div className="sw-idle-card">
                <span className="sw-idle-icon">🎯</span>
                <h3>Ready to test your luck?</h3>
                <p>
                  Spin the wheel and take on a random quiz challenge.
                  Great warm-up before deep practice!
                </p>
                <button className="btn btn-primary btn-lg sw-spin-btn" onClick={spin}>
                  <FiRotateCw /> Spin the Wheel
                </button>
              </div>
            )}

            {spinning && (
              <div className="sw-idle-card sw-spining-card">
                <span className="sw-idle-icon sw-bounce">🎰</span>
                <h3>Spinning…</h3>
                <p>The wheel is deciding your destiny…</p>
              </div>
            )}

            {result && !spinning && (
              <div className="sw-result-card" key={result.name}>
                <span className="sw-result-pop" style={{ '--rc': result.color }}>
                  {result.icon}
                </span>
                <span className="sw-result-kicker">Your challenge is ready!</span>
                <h3>{result.name}</h3>
                <p>A randomly picked quiz to keep your skills sharp.</p>
                <button
                  className="btn btn-primary btn-lg sw-spin-btn"
                  onClick={() => navigate(`/quiz/${result.quizId}`)}
                >
                  <FiPlay /> Start Challenge
                </button>
                <button className="sw-again-link" onClick={spin}>
                  ↻ Not happy? Spin again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpinWheel;
