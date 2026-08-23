// ─── Interactive Lesson Video Modal ──────────────────────────
// Opens from the lesson player's ▶ button. When a real videoUrl
// exists it behaves like a full premium player (seek / speed /
// volume / PiP / fullscreen / keyboard shortcuts / resume).
// Without a URL it shows an honest "Coming Soon" cinematic
// experience plus the interactive learning content: topics,
// explanations, runnable examples, notes, resources, discussion
// and an understanding check that awards the real +50 video XP.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiX, FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMonitor, FiMaximize, FiMinimize,
  FiHelpCircle, FiClock, FiZap, FiChevronLeft, FiChevronRight,
  FiCopy, FiCheck, FiFileText, FiExternalLink, FiMessageCircle,
  FiLink, FiAward, FiBookmark, FiCheckCircle, FiCode, FiEdit3,
} from 'react-icons/fi';
import { formatTimestamp } from '../../data/lessonVideos';
import {
  getVideoProgress,
  saveWatchPosition,
  isVideoComplete,
  markVideoComplete,
} from '../../utils/videoProgress';
import { getTechProgress, computeProgressPercent } from '../../utils/learningStore';
import { recordActivity } from '../../utils/gamification';
import AILessonStudio from './studio/AILessonStudio';
import './LessonVideoModal.css';

const NOTES_KEY = 'cq-lesson-notes';
const DISCUSS_KEY = 'cq-lesson-discussion';
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const PARTICLES = ['</>', '{ }', '=>', 'def', '()', '101', ';', '#'];

const ParticleField = () => (
  <div className="lvm-particles" aria-hidden="true">
    {PARTICLES.map((tkn, i) => (
      <span
        key={tkn}
        className="lvm-particle"
        style={{
          top: `${8 + ((i * 13) % 78)}%`,
          left: `${5 + ((i * 29) % 88)}%`,
          animationDelay: `${(i * 0.9).toFixed(1)}s`,
          fontSize: `${0.7 + (i % 4) * 0.16}rem`,
        }}
      >
        {tkn}
      </span>
    ))}
  </div>
);

const LessonVideoModal = ({
  roadmap,
  mod,
  techMeta,
  index,
  totalModules,
  video,
  initialTopicIndex = 0,
  onClose,
  onComplete,
  goModule,
  goToSection,
  bookmarked,
  onToggleBookmark,
}) => {
  const lessonKey = `${roadmap.id}/${mod.id}`;
  const hasVideo = Boolean(video.videoUrl);

  /* ── modal lifecycle ── */
  const [closing, setClosing] = useState(false);
  const closeBtnRef = useRef(null);
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  /* ── video element state ── */
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds || 0);
  const [isFs, setIsFs] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [studioWatched, setStudioWatched] = useState(() => (isVideoComplete(roadmap.id, mod.id) ? 100 : 0));
  const watchedRef = useRef(0);
  const [watched, setWatched] = useState(() => getVideoProgress(roadmap.id, mod.id).percent || 0);
  const lastSaveRef = useRef(0);
  const completingRef = useRef(false);
  const completedAtOpen = useRef(isVideoComplete(roadmap.id, mod.id));
  const [justCompleted, setJustCompleted] = useState(false);

  const saved = useMemo(
    () => (hasVideo ? getVideoProgress(roadmap.id, mod.id) : { seconds: 0 }),
    [hasVideo, roadmap.id, mod.id]
  );
  const [showResume, setShowResume] = useState(hasVideo && saved.seconds > 30 && !saved.completed);

  /* ── tabs / topics / quiz ── */
  const [tab, setTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview', dot: true },
    { id: 'transcript', label: 'Transcript' },
    { id: 'notes', label: 'Notes' },
    { id: 'resources', label: 'Resources' },
    { id: 'discussion', label: 'Discussion' },
  ];
  const [topicIdx, setTopicIdx] = useState(() => Math.min(initialTopicIndex, Math.max(video.topics.length - 1, 0)));
  const topic = video.topics[topicIdx] || video.topics[0];
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(0);

  const quiz = video.quiz;
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  /* ── notes (shared store with the page notes tool) ── */
  const [noteText, setNoteText] = useState(() => readJSON(NOTES_KEY, {})[lessonKey] || '');
  const [noteStatus, setNoteStatus] = useState('');
  const noteTimer = useRef(0);
  const saveNote = () => {
    const all = readJSON(NOTES_KEY, {});
    if (noteText.trim()) all[lessonKey] = noteText;
    else delete all[lessonKey];
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
    setNoteStatus('✓ Saved');
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNoteStatus(''), 2000);
  };

  /* ── discussion (local-only, honest banner) ── */
  const [comments, setComments] = useState(() => readJSON(DISCUSS_KEY, {})[lessonKey] || []);
  const [draft, setDraft] = useState('');
  const postComment = () => {
    const text = draft.trim();
    if (!text) return;
    const entry = { id: Date.now(), name: 'You', text, at: Date.now() };
    const all = readJSON(DISCUSS_KEY, {});
    all[lessonKey] = [...(all[lessonKey] || []), entry];
    localStorage.setItem(DISCUSS_KEY, JSON.stringify(all));
    setComments(all[lessonKey]);
    setDraft('');
  };

  /* ── real completion (+50 XP through gamification) ── */
  const completeFlow = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;
    const changed = markVideoComplete(roadmap.id, mod.id);
    setJustCompleted(true);
    if (changed) {
      const res = recordActivity('video', {
        roadmapPercent: computeProgressPercent(roadmap, getTechProgress(roadmap.id)),
      });
      onComplete?.(res);
    }
  }, [roadmap, mod.id, onComplete]);

  /* ── body scroll lock ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* ── initial focus ── */
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  /* ── persist watch position on unmount ── */
  useEffect(
    () => () => {
      if (hasVideo && videoRef.current && duration > 0) {
        saveWatchPosition(roadmap.id, mod.id, {
          seconds: Math.floor(videoRef.current.currentTime),
          percent: Math.round(watchedRef.current),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* ── fullscreen sync ── */
  useEffect(() => {
    const onFsChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  /* ── keyboard: Escape always; media shortcuts only with real video ── */
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (e.key === 'Escape' && !typing) {
        e.preventDefault();
        handleClose();
        return;
      }
      if (!hasVideo || typing) return;
      const v = videoRef.current;
      if (!v) return;
      if (e.key === ' ') {
        e.preventDefault();
        if (v.paused) v.play().catch(() => {});
        else v.pause();
      } else if (e.key === 'ArrowRight') {
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        v.currentTime = Math.max(0, v.currentTime - 5);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'm') {
        v.muted = !v.muted;
        setMuted(v.muted);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleClose, hasVideo]);

  /* ── media helpers ── */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else stageRef.current?.requestFullscreen?.().catch(() => {});
  };

  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch {
      /* PiP unsupported / rejected — control simply does nothing */
    }
  };

  const onLoadedMetadata = (e) => {
    setDuration(e.target.duration || video.durationSeconds);
  };

  const onTimeUpdate = (e) => {
    const v = e.target;
    setCurTime(v.currentTime);
    if (v.duration > 0) {
      const pct = (v.currentTime / v.duration) * 100;
      if (pct > watchedRef.current) {
        watchedRef.current = pct;
        setWatched(pct);
      }
      const now = Date.now();
      if (now - lastSaveRef.current > 3000) {
        lastSaveRef.current = now;
        saveWatchPosition(roadmap.id, mod.id, {
          seconds: Math.floor(v.currentTime),
          percent: Math.round(watchedRef.current),
        });
      }
      if (watchedRef.current >= 90 && !completingRef.current) {
        completeFlow();
      }
    }
  };

  const resumeFromSaved = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = saved.seconds;
    setShowResume(false);
    v.play().catch(() => {});
  };

  const startOver = () => {
    const v = videoRef.current;
    if (v) v.currentTime = 0;
    saveWatchPosition(roadmap.id, mod.id, { seconds: 0, percent: 0 });
    watchedRef.current = 0;
    setWatched(0);
    setShowResume(false);
  };

  /* ── quiz handlers ── */
  const q = quiz ? quiz.questions[qIdx] : null;
  const pickOption = (i) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((a) => [...a, i === q.answer]);
  };
  const quizNext = () => {
    if (qIdx + 1 < quiz.questions.length) {
      setQIdx(qIdx + 1);
      setPicked(null);
    } else {
      setQuizDone(true);
      const score = Math.round((answers.filter(Boolean).length / quiz.questions.length) * 100);
      if (score >= quiz.passPercent) completeFlow();
    }
  };
  const quizRetry = () => {
    setQIdx(0);
    setPicked(null);
    setAnswers([]);
    setQuizDone(false);
  };

  /* ── copy code ── */
  const copyCode = () => {
    if (!topic.codeExample) return;
    navigator.clipboard?.writeText(topic.codeExample).catch(() => {});
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const seekPct = duration > 0 ? (curTime / duration) * 100 : 0;
  const scorePct = quiz ? Math.round((answers.filter(Boolean).length / quiz.questions.length) * 100) : 0;
  const showReward = (justCompleted || completedAtOpen.current) && !quiz;

  return (
    <div className={`lvm-overlay ${closing ? 'closing' : ''}`} onMouseDown={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={`lvm-root ${closing ? 'closing' : ''}`} role="dialog" aria-modal="true" aria-label={`${mod.title} interactive lesson`}>

        {/* ══ HEADER ══ */}
        <header className="lvm-header">
          <div className="lvm-head-left">
            <span className="lvm-kicker">
              <FiPlay size={11} /> INTERACTIVE LESSON · {roadmap.name.toUpperCase()} MASTER PATH
            </span>
            <h2 className="lvm-title">{mod.title}</h2>
            <p className="lvm-subtitle">{mod.summary}</p>
            <div className="lvm-badges">
              <span className="lvm-badge tech">{techMeta?.icon || '</>'} {roadmap.name}</span>
              <span className="lvm-badge level">{mod.level}</span>
              <span className="lvm-badge"><FiClock /> {Math.round((video.durationSeconds || mod.minutes * 60) / 60)} MIN</span>
              <span className="lvm-badge">MODULE {String(index + 1).padStart(2, '0')}/{String(totalModules).padStart(2, '0')}</span>
              {!completedAtOpen.current && (
                <span className="lvm-badge xp"><FiZap /> +50 XP</span>
              )}
            </div>
          </div>
          <button
            type="button"
            className={`lvm-close ${bookmarked ? 'bookmarked' : ''}`}
            onClick={onToggleBookmark}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            title={bookmarked ? 'Bookmarked' : 'Bookmark'}
            style={{ marginRight: 8 }}
          >
            <FiBookmark style={bookmarked ? { fill: 'currentColor' } : undefined} />
          </button>
          <button ref={closeBtnRef} type="button" className="lvm-close" onClick={handleClose} aria-label="Close lesson video">
            <FiX />
          </button>
        </header>

        {/* ══ SCROLL BODY ══ */}
        <div className="lvm-body">
          <ParticleField />

          {/* ── STAGE ── */}
          <div className="lvm-stage-wrap">
            {hasVideo ? (
              <div className="lvm-stage" ref={stageRef}>
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnail || undefined}
                  onLoadedMetadata={onLoadedMetadata}
                  onTimeUpdate={onTimeUpdate}
                  onPlay={() => { setPlaying(true); setShowResume(false); }}
                  onPause={() => setPlaying(false)}
                  onClick={togglePlay}
                  playsInline
                  preload="metadata"
                />
              </div>
            ) : (
              <AILessonStudio
                video={video}
                roadmap={roadmap}
                mod={mod}
                techMeta={techMeta}
                completed={completedAtOpen.current}
                onCompleteLesson={completeFlow}
                onProgressChange={setStudioWatched}
                topicIndex={topicIdx}
                onTopicIndexChange={setTopicIdx}
                goToSection={goToSection}
                nextModule={goModule?.next || null}
                onNextModule={() => goModule?.go?.()}
              />
            )}

            {/* resume banner */}
            {hasVideo && showResume && (
              <div className="lvm-resume">
                <span>⏱ You paused at <strong>{formatTimestamp(saved.seconds)}</strong> — pick up where you left off?</span>
                <div className="lvm-resume-actions">
                  <button type="button" className="lvm-btn ghost" onClick={startOver}>Start Over</button>
                  <button type="button" className="lvm-btn" onClick={resumeFromSaved}>
                    <FiPlay /> Continue from {formatTimestamp(saved.seconds)}
                  </button>
                </div>
              </div>
            )}

            {/* controls — only meaningful with a real video */}
            {hasVideo && (
              <div className="lvm-controls" style={{ position: 'relative' }}>
                <button type="button" className="lvm-ctl lvm-ctl-play" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                  {playing ? <FiPause size={18} /> : <FiPlay size={18} style={{ marginLeft: 2 }} />}
                </button>
                <button type="button" className="lvm-ctl" onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.max(0, v.currentTime - 10); }} aria-label="Back 10 seconds">
                  <FiSkipBack />
                </button>
                <button type="button" className="lvm-ctl" onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.min(v.duration || 0, v.currentTime + 10); }} aria-label="Forward 10 seconds">
                  <FiSkipForward />
                </button>
                <span className="lvm-time">{formatTimestamp(curTime)} / {formatTimestamp(duration)}</span>
                <input
                  type="range"
                  className="lvm-seek"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={curTime}
                  style={{ '--seek': `${seekPct}%` }}
                  onChange={(e) => { const v = videoRef.current; if (v) v.currentTime = Number(e.target.value); }}
                  aria-label="Seek"
                />
                <button type="button" className="lvm-ctl" onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }} aria-label={muted ? 'Unmute' : 'Mute'}>
                  {muted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
                </button>
                <input
                  type="range"
                  className="lvm-seek lvm-vol"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  style={{ '--seek': `${(muted ? 0 : volume) * 100}%` }}
                  onChange={(e) => { const val = Number(e.target.value); const v = videoRef.current; if (v) { v.volume = val; v.muted = val === 0; setVolume(val); setMuted(val === 0); } }}
                  aria-label="Volume"
                />
                <select
                  className="lvm-speed-select"
                  value={speed}
                  onChange={(e) => { const s = Number(e.target.value); setSpeed(s); if (videoRef.current) videoRef.current.playbackRate = s; }}
                  aria-label="Playback speed"
                >
                  {SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
                </select>
                <button type="button" className="lvm-ctl" onClick={togglePip} aria-label="Picture in picture" disabled={!document.pictureInPictureEnabled}>
                  <FiMonitor />
                </button>
                <button type="button" className="lvm-ctl" onClick={toggleFullscreen} aria-label={isFs ? 'Exit fullscreen' : 'Fullscreen'}>
                  {isFs ? <FiMinimize /> : <FiMaximize />}
                </button>
                <button type="button" className="lvm-ctl" onClick={() => setHelpOpen((o) => !o)} aria-expanded={helpOpen} aria-label="Keyboard shortcuts">
                  <FiHelpCircle />
                </button>
                {helpOpen && (
                  <div className="lvm-help-pop">
                    <h5>Keyboard Shortcuts</h5>
                    <div className="lvm-help-row"><span>Play / Pause</span><span className="lvm-key">Space</span></div>
                    <div className="lvm-help-row"><span>Seek ±5s</span><span><span className="lvm-key">←</span> <span className="lvm-key">→</span></span></div>
                    <div className="lvm-help-row"><span>Mute</span><span className="lvm-key">M</span></div>
                    <div className="lvm-help-row"><span>Fullscreen</span><span className="lvm-key">F</span></div>
                    <div className="lvm-help-row"><span>Close studio</span><span className="lvm-key">Esc</span></div>
                  </div>
                )}
              </div>
            )}

            {/* watch / lesson progress line */}
            <div className="lvm-watchline">
              <span className="lvm-watchline-label">{hasVideo ? 'Watch Progress' : 'Lesson Progress'}</span>
              <div className="lvm-watchline-track">
                <span style={{ width: `${completedAtOpen.current ? 100 : Math.round(hasVideo ? watched : studioWatched)}%` }} />
              </div>
              {completedAtOpen.current || justCompleted ? (
                <span className="lvm-completed-chip"><FiCheckCircle /> Completed</span>
              ) : (
                <span className="lvm-watchline-label">{Math.round(hasVideo ? watched : studioWatched)}%</span>
              )}
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="lvm-tabs" role="tablist" aria-label="Lesson materials">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`lvm-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.dot && <span className="lvm-dot" />} {t.label}
              </button>
            ))}
          </div>

          <div className="lvm-tabpanel" role="tabpanel">
            {tab === 'overview' && (
              <div className="lvm-overview-grid">
                <div className="lvm-card">
                  <h4>About This Lesson</h4>
                  <p className="lvm-desc">{mod.summary}</p>
                  <div className="lvm-concepts">
                    {(mod.objectives || []).slice(0, 6).map((o) => <span key={o}>{o}</span>)}
                  </div>
                </div>
                <div className="lvm-card">
                  <h4>Session Details</h4>
                  <div className="lvm-meta-rows">
                    <div className="lvm-meta-row"><span>Technology</span><strong>{roadmap.name}</strong></div>
                    <div className="lvm-meta-row"><span>Difficulty</span><strong>{mod.level}</strong></div>
                    <div className="lvm-meta-row"><span>Duration</span><strong>{Math.round((video.durationSeconds || mod.minutes * 60) / 60)} min</strong></div>
                    <div className="lvm-meta-row"><span>Topics covered</span><strong>{video.topics.length}</strong></div>
                    <div className="lvm-meta-row"><span>Reward</span><strong>+50 XP</strong></div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'transcript' && (
              <div className="lvm-card">
                {video.transcript ? (
                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                    {video.transcript.map((line, i) => (
                      <li key={i} style={{ marginBottom: 8 }}>
                        <button type="button" className="lvm-topic-time" style={{ cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => { const v = videoRef.current; if (v) v.currentTime = line.start; }}>
                          [{formatTimestamp(line.start)}]
                        </button>{' '}
                        <span className="lvm-desc">{line.text}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="lvm-empty">
                    <FiFileText size={30} />
                    <strong>Transcript not available yet</strong>
                    <p>We&apos;re generating the searchable transcript{hasVideo ? '' : ' and it will publish together with the recorded video'}. Every topic below already includes its full written explanation.</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'notes' && (
              <div className="lvm-card">
                <h4>Your Notes</h4>
                <textarea
                  className="lvm-notes-area"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type while you watch — timestamps, gotchas, questions… Saved on this device."
                  aria-label="Lesson notes"
                />
                <div className="lvm-notes-foot">
                  <span className="lvm-notes-status">{noteStatus}</span>
                  <button type="button" className="lvm-btn ghost" onClick={() => { setNoteText(''); }}>Clear</button>
                  <button type="button" className="lvm-btn" onClick={saveNote}>Save Notes</button>
                </div>
              </div>
            )}

            {tab === 'resources' && (
              <div className="lvm-res-grid">
                {video.resources.length === 0 && (
                  <div className="lvm-empty" style={{ gridColumn: '1 / -1' }}>
                    <FiLink size={28} />
                    <strong>No extra resources for this lesson</strong>
                    <p>The topics above contain everything you need — curated links will appear here when relevant.</p>
                  </div>
                )}
                {video.resources.map((r) =>
                  r.href ? (
                    <a key={r.label} className="lvm-res-card" href={r.href} target="_blank" rel="noopener noreferrer">
                      <span className="lvm-res-label"><FiExternalLink /> {r.label}</span>
                      <span className="lvm-res-desc">{r.desc}</span>
                    </a>
                  ) : (
                    <button
                      key={r.label}
                      type="button"
                      className="lvm-res-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => r.internal && goToSection?.(r.internal)}
                    >
                      <span className="lvm-res-label">
                        {r.internal === 'challenge' ? <FiCode /> : <FiEdit3 />} {r.label}
                      </span>
                      <span className="lvm-res-desc">{r.desc} ↓</span>
                    </button>
                  )
                )}
              </div>
            )}

            {tab === 'discussion' && (
              <div>
                <div className="lvm-disc-note">
                  <FiMessageCircle /> Community sync is on our roadmap — for now comments are stored privately on this device.
                </div>
                <div className="lvm-disc-input-row">
                  <input
                    className="lvm-disc-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && postComment()}
                    placeholder="Ask a question or share an insight about this lesson…"
                    aria-label="Add a comment"
                  />
                  <button type="button" className="lvm-btn" onClick={postComment} disabled={!draft.trim()}>Post</button>
                </div>
                <div className="lvm-disc-list">
                  {comments.length === 0 ? (
                    <div className="lvm-empty"><FiMessageCircle size={26} /><strong>No comments yet</strong><p>Be the first to leave a note for future-you.</p></div>
                  ) : (
                    comments.slice().reverse().map((c) => (
                      <article key={c.id} className="lvm-disc-item">
                        <span className="lvm-disc-avatar" aria-hidden="true">Y</span>
                        <div>
                          <p>{c.text}</p>
                          <time dateTime={new Date(c.at).toISOString()}>{new Date(c.at).toLocaleString()}</time>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── TOPICS (real-video lessons — the AI Lesson Studio
                 renders its own topic experience when there is none) ── */}
          {hasVideo && (
          <>
          <div className="lvm-section-title">
            <h3>Lesson Topics</h3>
            <span>{video.topics.length} chapters · tap any topic for the deep dive</span>
          </div>
          <div className="lvm-topics-layout">
            <ol className="lvm-topic-list" style={{ listStyle: 'none', margin: 0, padding: 0 }} role="listbox" aria-label="Topics">
              {video.topics.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={topicIdx === i}
                    className={`lvm-topic ${topicIdx === i ? 'active' : ''}`}
                    onClick={() => setTopicIdx(i)}
                  >
                    <span className="lvm-topic-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="lvm-topic-title">{t.title}</span>
                    <span className="lvm-topic-time">{formatTimestamp(t.start)}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="lvm-card lvm-explain">
              <div className="lvm-explain-head">
                <h3>{topic.title}</h3>
                <span className="lvm-explain-tag">TOPIC {String(topicIdx + 1).padStart(2, '0')} · {formatTimestamp(topic.start)}</span>
              </div>
              {topic.description && <p className="lvm-explain-desc">{topic.description}</p>}
              {topic.keyPoints?.length > 0 && (
                <ul className="lvm-keypoints" style={{ listStyle: 'none', padding: 0, margin: '13px 0 0' }}>
                  {topic.keyPoints.map((kp) => <li key={kp}>{kp}</li>)}
                </ul>
              )}

              {topic.diagram && (
                <div className="lvm-diagram" aria-label={`${topic.diagram.join(' contains ')} diagram`}>
                  {topic.diagram.map((node, i) => (
                    <div key={node} style={{ display: 'contents' }}>
                      {i > 0 && <span className="lvm-diagram-link" aria-hidden="true" />}
                      <span className="lvm-diagram-node">
                        {node}
                        <small>{['Development Kit — compiler + tools', 'Runtime Environment — libraries + JVM', 'executes the bytecode'][i]}</small>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {topic.codeExample && (
                <figure className="lvm-code" style={{ margin: '15px 0 0' }}>
                  <figcaption className="lvm-code-bar">
                    <span className="lvm-code-lang">{topic.codeLang || 'code'}</span>
                    <button type="button" className={`lvm-copy ${copied ? 'ok' : ''}`} onClick={copyCode}>
                      {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy</>}
                    </button>
                  </figcaption>
                  <pre><code>{topic.codeExample}</code></pre>
                </figure>
              )}

              {topic.codeBreakdown?.length > 0 && (
                <div className="lvm-breakdown">
                  {topic.codeBreakdown.map((b) => (
                    <details key={b.snippet}>
                      <summary><FiChevronRight size={12} /> {b.snippet}</summary>
                      <p>{b.explain}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
          </>
          )}

          {/* ── UNDERSTANDING CHECK ── */}
          <div className="lvm-section-title">
            <h3>Understanding Check</h3>
            <span>{quiz ? `Pass with ${quiz.passPercent}%+ to unlock your +50 XP` : 'Quick self-review'}</span>
          </div>

          {quiz && !quizDone && q && (
            <div className="lvm-quiz-q">
              <strong>Q{qIdx + 1}. {q.q}</strong>
              <div className="lvm-quiz-opts">
                {q.options.map((opt, i) => {
                  const isAnswer = i === q.answer;
                  const cls = picked === null ? '' : isAnswer ? 'correct' : picked === i ? 'wrong' : 'dim';
                  return (
                    <button key={opt} type="button" className={`lvm-opt ${cls}`} onClick={() => pickOption(i)} disabled={picked !== null}>
                      <span className="lvm-opt-letter">{String.fromCharCode(65 + i)}</span> {opt}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <>
                  <div className={`lvm-quiz-explain ${picked === q.answer ? 'good' : 'bad'}`}>
                    {picked === q.answer ? '🎯 Correct! ' : '💡 Not quite. '} {q.explanation}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button type="button" className="lvm-btn" onClick={quizNext}>
                      {qIdx + 1 < quiz.questions.length ? 'Next Question' : 'See Results'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {quiz && quizDone && (
            <div className={`lvm-quiz-score ${scorePct >= quiz.passPercent ? 'pass' : 'fail'}`}>
              <span>{scorePct >= quiz.passPercent ? '🎉 Excellent — you really get this!' : '📚 Almost there.'} Score: {answers.filter(Boolean).length}/{quiz.questions.length} ({scorePct}%)</span>
              {scorePct < quiz.passPercent && (
                <button type="button" className="lvm-btn" onClick={quizRetry}>Try Again</button>
              )}
            </div>
          )}

          {!quiz && !hasVideo && !completedAtOpen.current && !justCompleted && (
            <div className="lvm-card" style={{ textAlign: 'center' }}>
              <p className="lvm-desc" style={{ marginBottom: 14 }}>
                Worked through every topic above? Bank your reward — this lesson&apos;s material is officially done.
              </p>
              <button type="button" className="lvm-btn green" onClick={completeFlow}>
                <FiCheckCircle /> Mark Material Complete · +50 XP
              </button>
            </div>
          )}

          {/* ── REWARD BANNER ── */}
          {(justCompleted || (completedAtOpen.current && showReward)) && (
            <div className="lvm-reward">
              <span className="lvm-reward-icon" aria-hidden="true">🎉</span>
              <div>
                <strong>{hasVideo ? 'Lesson video complete!' : 'AI Lesson Studio session complete!'}</strong>
                <span>{justCompleted
                  ? (mod.assignment ? 'Next up: crush the assignment below to keep your streak alive.'
                    : mod.challenge ? 'Next up: take the coding challenge below.'
                      : 'You\'re all set — jump into the next module whenever you\'re ready.')
                  : 'This lesson\'s video credit was already earned.'}</span>
              </div>
              {justCompleted && <span className="lvm-xp-pill">+50 XP</span>}
              <button
                type="button"
                className="lvm-btn green"
                style={{ marginLeft: 12 }}
                onClick={() => {
                  const target = mod.assignment ? 'assignment' : mod.challenge ? 'challenge' : null;
                  if (target && goToSection) goToSection(target);
                  else handleClose();
                }}
              >
                Continue Learning <FiChevronRight />
              </button>
            </div>
          )}

          {/* ── PRACTICE CARD ── */}
          {(mod.assignment || mod.challenge) && !justCompleted && (
            <div className="lvm-challenge-card">
              <div>
                <h5><FiCode style={{ verticalAlign: '-2px', color: 'var(--lvm-purple)' }} /> Practice what you watched</h5>
                <p>{mod.assignment ? 'A hands-on assignment is waiting below the player.' : 'Your coding challenge is waiting below the player.'}</p>
              </div>
              <button type="button" className="lvm-btn ghost" onClick={() => goToSection?.(mod.assignment ? 'assignment' : 'challenge')}>
                Open Practice <FiChevronRight />
              </button>
            </div>
          )}

          {/* ── NEXT MODULE TEASER ── */}
          {goModule?.next && !justCompleted && (
            <div className="lvm-challenge-card" style={{ borderColor: 'rgba(139,92,246,0.35)' }}>
              <div>
                <h5><FiAward style={{ verticalAlign: '-2px', color: 'var(--lvm-cyan-soft)' }} /> Up next: {goModule.next.title}</h5>
                <p>{goModule.next.minutes} min · {goModule.next.level.toLowerCase()}</p>
              </div>
              <button type="button" className="lvm-btn ghost" onClick={goModule.go}>Preview Next Module <FiChevronRight /></button>
            </div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <footer className="lvm-footer">
          <button type="button" className="lvm-topic-nav" onClick={() => setTopicIdx((i) => Math.max(0, i - 1))} disabled={topicIdx === 0}>
            <FiChevronLeft /> Previous Topic
          </button>
          <span className="lvm-position">
            Topic {topicIdx + 1} of {video.topics.length} · Module {index + 1}/{totalModules}
          </span>
          <button
            type="button"
            className="lvm-topic-nav"
            onClick={() => setTopicIdx((i) => Math.min(video.topics.length - 1, i + 1))}
            disabled={topicIdx >= video.topics.length - 1}
          >
            Next Topic <FiChevronRight />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LessonVideoModal;
