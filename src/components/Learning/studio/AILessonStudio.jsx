// ─── AI Lesson Studio ────────────────────────────────────────
// Interactive, video-style learning experience built directly
// from the structured lesson content of the selected technology
// and lesson. Play/Pause auto-advances through topics with a
// narration indicator; every topic teaches its own concept with
// an animated visual, code example, simulated output, mentor tip
// and optional checkpoint. No fake video files, no placeholders.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiPlay, FiPause, FiChevronLeft, FiChevronRight,
  FiCheckCircle, FiZap, FiRotateCcw, FiEdit3, FiAward,
} from 'react-icons/fi';
import { recordActivity } from '../../../utils/gamification';
import { getTechProgress, computeProgressPercent } from '../../../utils/learningStore';
import StudioVisual from './StudioVisual';
import StudioCodePanel from './StudioCodePanel';
import StudioMentor from './StudioMentor';
import StudioTimeline from './StudioTimeline';
import './ailessonstudio.css';

const SLIDE_MS = 12000;
const CHECKPOINT_XP_KEY = 'cq-checkpoint-xp';

const readCheckpointXp = () => {
  try { return JSON.parse(localStorage.getItem(CHECKPOINT_XP_KEY)) || {}; } catch { return {}; }
};

/* ── narration indicator ── */
const NarrationBars = () => (
  <span className="als-narrbars" aria-hidden="true"><i /><i /><i /><i /></span>
);

const AILessonStudio = ({
  video,
  roadmap,
  mod,
  techMeta,
  completed = false,
  onCompleteLesson,
  onProgressChange,
  topicIndex = 0,
  onTopicIndexChange,
  goToSection,
  nextModule,
  onNextModule,
}) => {
  const topics = video.topics || [];
  const lessonKey = `${roadmap?.id}/${mod?.id}`;

  const [idx, setIdx] = useState(() => Math.min(topicIndex, Math.max(topics.length - 1, 0)));
  const idxRef = useRef(idx);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [maxReached, setMaxReached] = useState(idx);
  const [xpPops, setXpPops] = useState([]);
  const [answers, setAnswers] = useState({}); // topicId -> picked index

  const completingRef = useRef(false);

  /* ── sync external navigation (modal footer / topic list) ── */
  useEffect(() => {
    if (topicIndex !== idxRef.current) {
      idxRef.current = topicIndex;
      setIdx(topicIndex);
      setElapsed(0);
      setFinished(false);
      setMaxReached((m) => Math.max(m, topicIndex));
    }
  }, [topicIndex]);

  const goTo = useCallback((i, opts = {}) => {
    if (!topics.length) return;
    const clamped = Math.max(0, Math.min(i, topics.length - 1));
    idxRef.current = clamped;
    setIdx(clamped);
    setElapsed(0);
    setMaxReached((m) => Math.max(m, clamped));
    if (!opts.keepFinished) setFinished(false);
    onTopicIndexChange?.(clamped);
  }, [topics.length, onTopicIndexChange]);

  /* ── completion (+50 XP through the real gamification store) ── */
  const popXp = useCallback((amount) => {
    const id = Date.now() + Math.random();
    setXpPops((p) => [...p, { id, amount }]);
    setTimeout(() => setXpPops((p) => p.filter((x) => x.id !== id)), 2200);
  }, []);

  const finishLesson = useCallback(() => {
    setPlaying(false);
    setFinished(true);
    onProgressChange?.(100);
    if (!completingRef.current) {
      completingRef.current = true;
      onCompleteLesson?.();
    }
  }, [onCompleteLesson, onProgressChange]);

  const next = useCallback(() => {
    if (idxRef.current >= topics.length - 1) finishLesson();
    else goTo(idxRef.current + 1);
  }, [topics.length, goTo, finishLesson]);

  const prev = useCallback(() => goTo(Math.max(0, idxRef.current - 1)), [goTo]);

  /* ── auto-play engine ── */
  useEffect(() => {
    if (!playing || finished || !topics.length) return undefined;
    const timer = setInterval(() => {
      setElapsed((ms) => {
        const nxt = ms + 100;
        if (nxt >= SLIDE_MS) { next(); return 0; }
        return nxt;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [playing, finished, idx, topics.length, next]);

  /* ── keyboard controls (typing-safe) ── */
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ') {
        e.preventDefault();
        if (finished) return;
        setPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, finished]);

  /* ── progress reporting to the modal watchline ── */
  const slideRatio = elapsed / SLIDE_MS;
  const overallPct = finished
    ? 100
    : Math.min(100, Math.round(((idx + slideRatio) / Math.max(topics.length, 1)) * 100));

  useEffect(() => {
    onProgressChange?.(overallPct);
  }, [overallPct, onProgressChange]);

  /* ── checkpoint answering (+10 XP once per device) ── */
  const topic = topics[idx];
  const pickAnswer = (optionIdx) => {
    if (!topic?.checkpoint || answers[topic.id] !== undefined) return;
    setAnswers((a) => ({ ...a, [topic.id]: optionIdx }));
    if (optionIdx === topic.checkpoint.answer) {
      const all = readCheckpointXp();
      const list = all[lessonKey] || [];
      if (!list.includes(topic.id)) {
        localStorage.setItem(CHECKPOINT_XP_KEY, JSON.stringify({ ...all, [lessonKey]: [...list, topic.id] }));
        recordActivity('checkpoint', {
          roadmapPercent: computeProgressPercent(roadmap, getTechProgress(roadmap.id)),
        });
        popXp(10);
      }
    }
  };

  /* ── narration phase text ── */
  const narrationText = useMemo(() => {
    const r = slideRatio;
    if (!playing) return 'Paused — explore manually or press play.';
    if (r < 0.3) return 'Explaining the concept…';
    if (r < 0.6) return topic?.code ? 'Walking through the code…' : 'Highlighting the key points…';
    return topic?.code?.output ? 'Showing output & mentor tips…' : 'Sharing the mentor insight…';
  }, [slideRatio, playing, topic]);

  const replay = () => {
    setFinished(false);
    setElapsed(0);
    setMaxReached(0);
    goTo(0);
    setPlaying(true);
  };

  /* ── safe fallback if a lesson has no topics ── */
  if (!topics.length || !topic) {
    return (
      <div className="als-root">
        <div className="als-empty">
          <strong>This lesson&apos;s studio content is being prepared.</strong>
          <p>Please check back soon — meanwhile, the notes, resources and quiz below are fully available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="als-root">
      {/* ═══ SCENE (inside the cinematic stage) ═══ */}
      {!finished ? (
        <div className={`als-scene ${playing ? 'is-playing' : ''}`}>
          <header className="als-scene-top">
            <span className="als-kicker">
              <span className="als-live-dot" aria-hidden="true" /> AI LESSON STUDIO
            </span>
            <span className="als-narration" role="status" aria-live="polite">
              <NarrationBars /> {narrationText}
            </span>
            <span className="als-topiccount">TOPIC {String(idx + 1).padStart(2, '0')}/{String(topics.length).padStart(2, '0')}</span>
          </header>

          <div className="als-scene-main">
            <div className="als-copy" key={`copy-${topic.id}`}>
              <h3 className="als-title">{topic.title}</h3>
              <p className="als-explanation">{topic.explanation}</p>
              {topic.keyPoints.length > 0 && (
                <ul className="als-points" aria-label="Key points">
                  {topic.keyPoints.slice(0, 4).map((kp) => <li key={kp}>{kp}</li>)}
                </ul>
              )}
              {topic.diagram && (
                <div className="als-diagram" aria-label={`${topic.diagram.join(' contains ')}`}>
                  {topic.diagram.map((d, i) => (
                    <span key={d} className="als-diagram-node">{d}{i < topic.diagram.length - 1 ? ' ⊃' : ''}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="als-stagevisual" key={`vis-${topic.id}`} onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
              const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
              e.currentTarget.style.setProperty('--tilt-x', `${x.toFixed(1)}deg`);
              e.currentTarget.style.setProperty('--tilt-y', `${y.toFixed(1)}deg`);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty('--tilt-x', '0deg');
              e.currentTarget.style.setProperty('--tilt-y', '0deg');
            }}
            >
              <StudioVisual
                roadmapName={roadmap?.name}
                accent={techMeta?.color || roadmap?.color}
                visual={topic.visual}
              />
            </div>
          </div>

          <footer className="als-scene-progress">
            <div className="als-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallPct} aria-label="Lesson progress">
              <span style={{ width: `${overallPct}%` }} />
            </div>
            <span className="als-track-pct">{overallPct}% Complete</span>
          </footer>
        </div>
      ) : (
        /* ═══ SUMMARY CARD ═══ */
        <div className="als-summary" role="status">
          <span className="als-summary-icon" aria-hidden="true">🎉</span>
          <h3>Lesson Complete</h3>
          <p>You learned:</p>
          <ul className="als-learned">
            {topics.map((t) => <li key={t.id}><FiCheckCircle aria-hidden="true" /> {t.title}</li>)}
          </ul>
          <div className="als-summary-xp">
            <span><FiZap aria-hidden="true" /> +50 XP{completed ? ' (already earned)' : ''}</span>
            {Object.keys(answers).length > 0 && <span>· {Object.values(answers).filter((a, i) => topics[i]?.checkpoint && a === topics[i].checkpoint.answer).length} checkpoint(s) passed</span>}
          </div>
          <div className="als-summary-actions">
            <button type="button" className="als-btn als-btn-ghost" onClick={replay}>
              <FiRotateCcw /> Replay Lesson
            </button>
            {(mod?.assignment || mod?.challenge) && (
              <button type="button" className="als-btn als-btn-primary" onClick={() => goToSection?.(mod.assignment ? 'assignment' : 'challenge')}>
                <FiEdit3 /> Continue to {mod.assignment ? 'Assignment' : 'Challenge'}
              </button>
            )}
            {nextModule && (
              <button type="button" className="als-btn als-btn-green" onClick={onNextModule}>
                <FiAward /> Next Lesson <FiChevronRight />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══ TRANSPORT CONTROLS ═══ */}
      <div className="als-controls">
        <button type="button" className="als-navbtn" onClick={prev} disabled={idx === 0} aria-label="Previous topic">
          <FiChevronLeft size={16} /> Previous
        </button>
        {!finished && (
          <button
            type="button"
            className="als-playbtn"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause lesson' : 'Play lesson'}
          >
            {playing ? <FiPause size={20} /> : <FiPlay size={20} style={{ marginLeft: 3 }} />}
            <span>{playing ? 'Pause Lesson' : 'Play Lesson'}</span>
          </button>
        )}
        {finished ? (
          <button type="button" className="als-navbtn complete" onClick={replay} aria-label="Replay lesson from the start">
            <FiRotateCcw size={15} /> Replay
          </button>
        ) : (
          <button type="button" className="als-navbtn" onClick={next} aria-label={idx >= topics.length - 1 ? 'Complete lesson' : 'Next topic'}>
            {idx >= topics.length - 1 ? <>Complete Lesson <FiCheckCircle size={15} /></> : <>Next <FiChevronRight size={16} /></>}
          </button>
        )}
      </div>

      {/* floating XP chips */}
      <div className="als-xplayer" aria-live="polite">
        {xpPops.map((p) => (
          <span key={p.id} className="als-xppop"><FiZap /> +{p.amount} XP</span>
        ))}
      </div>

      {/* ═══ DOCK: code panel + mentor ═══ */}
      <div className={`als-dock ${topic.code ? '' : 'no-code'}`}>
        {topic.code && <StudioCodePanel key={topic.id} topic={topic} />}
        <StudioMentor key={topic.id} topic={topic} roadmapName={roadmap?.name} />
      </div>

      {/* ═══ QUICK CHECK ═══ */}
      {topic.checkpoint && !finished && (
        <div className="als-checkpoint">
          <h4><span className="als-dot" /> Quick Check <span className="als-checkpoint-xp">+10 XP</span></h4>
          <p>{topic.checkpoint.question}</p>
          <div className="als-options">
            {topic.checkpoint.options.map((opt, i) => {
              const picked = answers[topic.id];
              const cls = picked === undefined ? '' : i === topic.checkpoint.answer ? 'correct' : picked === i ? 'wrong' : 'dim';
              return (
                <button
                  key={opt}
                  type="button"
                  className={`als-opt ${cls}`}
                  onClick={() => pickAnswer(i)}
                  disabled={picked !== undefined}
                >
                  <span className="als-opt-letter">{String.fromCharCode(65 + i)}</span> {opt}
                </button>
              );
            })}
          </div>
          {answers[topic.id] !== undefined && (
            <div className={`als-explain ${answers[topic.id] === topic.checkpoint.answer ? 'good' : 'bad'}`} role="status">
              {answers[topic.id] === topic.checkpoint.answer ? '✓ Correct!' : 'Not quite.'} {topic.checkpoint.explain}
            </div>
          )}
        </div>
      )}

      {/* ═══ TIMELINE ═══ */}
      <StudioTimeline topics={topics} index={idx} maxReached={finished ? topics.length - 1 : maxReached} onJump={goTo} />
    </div>
  );
};

export default AILessonStudio;
