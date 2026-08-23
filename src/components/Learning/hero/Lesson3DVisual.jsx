// ─── Lesson 3D Visual ────────────────────────────────────────
// Futuristic developer object: a floating glass cube labelled with
// code glyphs, an orbiting ring and ultra-subtle ambient code chips.
// Pure CSS 3D — the parent hero feeds --tilt-x / --tilt-y so the
// object leans gently toward the cursor (max ~7°, never the page).
import { FiCode, FiCpu, FiTerminal } from 'react-icons/fi';
import { LuBraces } from 'react-icons/lu';

const FACES = [
  { cls: 'lh-f-front', content: 'PY' },
  { cls: 'lh-f-right', content: <FiCode aria-hidden="true" /> },
  { cls: 'lh-f-back', content: '{ }' },
  { cls: 'lh-f-left', content: '>' },
  { cls: 'lh-f-top', content: '01' },
  { cls: 'lh-f-bottom', content: <FiTerminal aria-hidden="true" /> },
];

const Lesson3DVisual = ({ accent = '#06b6d4' }) => (
  <div className="lh-visual" style={{ '--accent': accent }}>
    {/* decorative floating code chips (opacity ≤ 0.18, slow drift) */}
    <span className="lh-chip lh-chip-1" aria-hidden="true"><FiCode /></span>
    <span className="lh-chip lh-chip-2" aria-hidden="true">print()</span>
    <span className="lh-chip lh-chip-3" aria-hidden="true">def</span>
    <span className="lh-chip lh-chip-4" aria-hidden="true"><LuBraces /></span>

    <div className="lh-scene" aria-hidden="true">
      <div className="lh-float">
        <div className="lh-cube">
          {FACES.map((f) => (
            <span key={f.cls} className={`lh-face ${f.cls}`}>{f.content}</span>
          ))}
        </div>
      </div>
      <span className="lh-orbit" />
      <span className="lh-floor" />
    </div>
  </div>
);

export default Lesson3DVisual;
