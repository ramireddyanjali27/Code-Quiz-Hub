// ─── Animated SVG Progress Ring ──────────────────────────────
// Lightweight (pure SVG + CSS) circular progress indicator.
import './Learning.css';

const ProgressRing = ({
  percent = 0,
  size = 92,
  stroke = 8,
  color = 'var(--primary)',
  trackColor = 'var(--border-light)',
  label,
  sublabel,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div
      className="progress-ring"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label}: ${percent}%` : `Progress: ${percent}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          style={{ stroke: trackColor }}
          fill="none"
        />
        <circle
          className="progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          style={{
            stroke: color,
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="progress-ring-center">
        <span className="progress-ring-value">{percent}%</span>
        {sublabel && <span className="progress-ring-sub">{sublabel}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
