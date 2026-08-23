// ─── Skeleton Loaders ────────────────────────────────────────
// Prevent layout jumps while data "loads". Pure CSS shimmer,
// respects prefers-reduced-motion via global stylesheet.
import './Skeletons.css';

export const SkeletonBox = ({ w = '100%', h = 16, r = 8, style }) => (
  <div className="sk-box" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

export const SkeletonCardGrid = ({ count = 6, minH = 240 }) => (
  <div className="sk-grid" aria-label="Loading content" role="status">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="sk-card" style={{ minHeight: minH }}>
        <div className="sk-card-top">
          <SkeletonBox w={56} h={56} r={16} />
          <SkeletonBox w={90} h={14} />
        </div>
        <SkeletonBox h={20} w="70%" style={{ marginTop: 18 }} />
        <SkeletonBox h={12} w="95%" style={{ marginTop: 12 }} />
        <SkeletonBox h={12} w="80%" style={{ marginTop: 8 }} />
        <div className="sk-row">
          <SkeletonBox w={70} h={22} r={999} />
          <SkeletonBox w={70} h={22} r={999} />
        </div>
        <SkeletonBox w="100%" h={10} style={{ marginTop: 16 }} />
        <SkeletonBox w={120} h={36} r={10} style={{ marginTop: 18 }} />
      </div>
    ))}
  </div>
);

export const SkeletonRoadmap = ({ count = 5 }) => (
  <div className="sk-roadmap" aria-label="Loading roadmap" role="status">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`sk-roadmap-item ${i % 2 ? 'right' : 'left'}`}>
        <div className="sk-roadmap-node" />
        <div className="sk-roadmap-card">
          <SkeletonBox h={16} w="55%" />
          <SkeletonBox h={11} w="90%" style={{ marginTop: 10 }} />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonVideoPlayer = () => (
  <div className="sk-video" aria-label="Loading lesson" role="status">
    <div className="sk-video-screen">
      <span className="sk-play-btn" />
    </div>
    <SkeletonBox h={20} w="60%" style={{ marginTop: 16 }} />
    <SkeletonBox h={12} w="100%" style={{ marginTop: 12 }} />
    <SkeletonBox h={12} w="85%" style={{ marginTop: 8 }} />
  </div>
);
