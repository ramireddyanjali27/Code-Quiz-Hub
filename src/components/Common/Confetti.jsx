import { useMemo } from 'react';
import './Confetti.css';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e'];

/* A one-shot celebratory overlay of tumbling, 3D-rotating confetti pieces */
const Confetti = ({ pieces = 90 }) => {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.4 + Math.random() * 2,
        size: 7 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        drift: (Math.random() - 0.5) * 220,
        spinX: 360 + Math.random() * 720,
        spinZ: Math.random() > 0.5 ? 540 : -540,
      })),
    [pieces]
  );

  return (
    <div className="confetti-layer" aria-hidden="true">
      {items.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--spin-x': `${p.spinX}deg`,
            '--spin-z': `${p.spinZ}deg`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
