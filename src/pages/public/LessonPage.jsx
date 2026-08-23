// ─── Lesson Page ─────────────────────────────────────────────
// /technologies/:technologyId/lesson/:lessonId
// Three-zone learning workspace:
//   LEFT   glass roadmap sidebar (drawer ≤1024px)
//   CENTER premium lesson hero • player • objectives • assignment
//          • coding challenge • sticky bottom nav
//   RIGHT  insights rail (Your Learning / Up Next / Achievement)
// Plus: focus mode, bookmark, notes, floating XP rewards — all
// backed by the real localStorage stores, nothing faked.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiFileText,
  FiBookmark,
  FiMaximize,
  FiMinimize,
  FiLock,
  FiPlayCircle,
  FiMenu,
  FiX,
  FiAward,
  FiLayers,
} from 'react-icons/fi';
import { getRoadmapById, slugify } from '../../data/roadmaps';
import { TECHNOLOGIES } from '../../utils/constants';
import {
  getTechProgress,
  getModuleStatus,
  markLessonComplete,
  setLastLesson,
  toggleAssignmentComplete,
  isAssignmentComplete,
  markChallengeComplete,
  computeProgressPercent,
} from '../../utils/learningStore';
import { recordActivity, touchStreak } from '../../utils/gamification';
import VideoLesson from '../../components/Learning/VideoLesson';
import AssignmentCard from '../../components/Learning/AssignmentCard';
import CodingChallenge from '../../components/Learning/CodingChallenge';
import LessonInsights from '../../components/Learning/LessonInsights';
import LessonVideoModal from '../../components/Learning/LessonVideoModal';
import LessonHero from '../../components/Learning/hero/LessonHero';
import LearningTopicsGrid from '../../components/Learning/LearningTopics';
import { getLessonVideo } from '../../data/lessonVideos';
import { isVideoComplete } from '../../utils/videoProgress';
import ProgressRing from '../../components/Learning/ProgressRing';
import { SkeletonVideoPlayer } from '../../components/Common/Skeletons';
import EmptyState from '../../components/Common/EmptyState';
import './LessonPage.css';

const BOOKMARKS_KEY = 'cq-bookmarks';
const NOTES_KEY = 'cq-lesson-notes';

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

/* ── Sidebar status icon ── */
const StatusIcon = ({ status }) => {
  if (status === 'completed') return <FiCheckCircle className="ls-ic done" />;
  if (status === 'in-progress') return <span className="ls-ic live" />;
  if (status === 'locked') return <FiLock className="ls-ic lock" />;
  return <FiPlayCircle className="ls-ic avail" />;
};

const LessonPage = () => {
  const { technologyId, lessonId } = useParams();
  const navigate = useNavigate();
  const roadmap = getRoadmapById(technologyId);
  const techMeta = TECHNOLOGIES.find((t) => slugify(t.name) === technologyId);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, bump] = useState(0); // forces re-read of progress store after writes
  const [focusMode, setFocusMode] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [topicIdx, setTopicIdx] = useState(0); // studio opens on this topic
  const [bookmarked, setBookmarked] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [xpPops, setXpPops] = useState([]);
  const heroRef = useRef(null);
  const navLockRef = useRef(false);

  const noteKey = `${technologyId}/${lessonId}`;
  const [noteText, setNoteText] = useState('');
  const [noteSavedAt, setNoteSavedAt] = useState(null);

  const index = roadmap?.modules.findIndex((m) => m.id === lessonId) ?? -1;
  const mod = index >= 0 ? roadmap.modules[index] : null;

  /* ── Per-route bootstrap ── */
  useEffect(() => {
    window.scrollTo(0, 0);
    setFocusMode(false);
    setNotesOpen(false);
    setNoteSavedAt(null);
    setNoteText(readJSON(NOTES_KEY, {})[noteKey] || '');
    const marks = readJSON(BOOKMARKS_KEY, []);
    setBookmarked(marks.includes(noteKey));
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteKey]);

  // Remember where the learner is for "Continue Learning"
  useEffect(() => {
    if (roadmap && mod && !loading) setLastLesson(roadmap.id, mod.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap?.id, mod?.id, loading]);

  /* ── Staggered reveal-on-scroll ── */
  useEffect(() => {
    if (loading || !mod) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = document.querySelectorAll('.lp-shell [data-rv]');
    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('rv-in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('rv-in')),
      { threshold: 0.08 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [loading, mod]);

  /* ── Exit focus with Escape ── */
  useEffect(() => {
    if (!focusMode) return undefined;
    const onKey = (e) => e.key === 'Escape' && setFocusMode(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusMode]);

  /* ── Hero 3D parallax (rAF-throttled) ── */
  const tiltFrame = useRef(0);
  const handleHeroMove = useCallback((e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (e.pointerType === 'touch' || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = requestAnimationFrame(() => {
      heroRef.current.style.setProperty('--tilt-x', `${(-py * 8).toFixed(2)}deg`);
      heroRef.current.style.setProperty('--tilt-y', `${(px * 10).toFixed(2)}deg`);
    });
  }, []);
  const handleHeroLeave = useCallback(() => {
    cancelAnimationFrame(tiltFrame.current);
    heroRef.current?.style.setProperty('--tilt-x', '0deg');
    heroRef.current?.style.setProperty('--tilt-y', '0deg');
  }, []);

  /* ── Floating XP reward ── */
  const spawnXpPop = useCallback((amount) => {
    if (!amount) return;
    const id = Date.now() + Math.random();
    setXpPops((p) => [...p, { id, amount }]);
    setTimeout(() => setXpPops((p) => p.filter((x) => x.id !== id)), 1600);
  }, []);

  /* Re-read from the store on every render — cheap localStorage read;
     `bump` forces a fresh read after completion writes. */
  const progress = roadmap ? getTechProgress(roadmap.id) : null;

  if (!roadmap || !mod || !progress) {
    return (
      <div className="lp-page">
        <div className="lp-shell" style={{ paddingTop: 120 }}>
          <EmptyState
            icon={<FiPlayCircle size={56} />}
            title="Lesson not found"
            message="This lesson doesn't exist in the roadmap."
            action="Back to Technologies"
            onAction={() => navigate('/technologies')}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="lp-page">
        <div className="lp-shell">
          <SkeletonVideoPlayer />
        </div>
      </div>
    );
  }

  const status = getModuleStatus(roadmap, index, progress);

  /* ── Locked guard ── */
  if (status === 'locked') {
    const prevDone = roadmap.modules[index - 1];
    return (
      <div className="lp-page">
        <div className="lp-shell" style={{ paddingTop: 110 }}>
          <EmptyState
            icon={<FiLock size={54} />}
            title="Module locked"
            message={`Complete "${prevDone?.title}" first — modules unlock in order so your knowledge builds properly.`}
            action={prevDone ? 'Go to Previous Module' : 'Back to Roadmap'}
            onAction={() =>
              navigate(
                prevDone
                  ? `/technologies/${roadmap.id}/lesson/${prevDone.id}`
                  : `/technologies/${roadmap.id}`
              )
            }
          />
        </div>
      </div>
    );
  }

  const percent = computeProgressPercent(roadmap, progress);
  const completed = status === 'completed';
  const prevMod = roadmap.modules[index - 1];
  const nextMod = roadmap.modules[index + 1];
  const nextStatus = nextMod ? getModuleStatus(roadmap, index + 1, progress) : null;

  /* ── "What You'll Learn" data — real topic titles & blurbs from
         the lesson video registry (falls back to objectives). ── */
  const videoMeta = getLessonVideo(roadmap, mod);
  const learnTopics = (
    videoMeta.topics?.length
      ? videoMeta.topics.map((t) => ({ id: t.id, title: t.title, description: t.description }))
      : (mod.objectives || []).map((obj, i) => ({ id: `obj-${i}`, title: obj, description: '' }))
  );

  /* Open the Interactive Lesson Studio directly on a topic */
  const openTopic = (_topic, i) => {
    setTopicIdx(i);
    setVideoOpen(true);
  };

  /* ── This-lesson completion % (lesson + its assignment/challenge) ── */
  const lessonParts = ['lesson'];
  if (mod.assignment) lessonParts.push('assignment');
  if (mod.challenge) lessonParts.push('challenge');
  const lessonDoneCount =
    (completed ? 1 : 0) +
    (mod.assignment && progress.assignments.includes(mod.id) ? 1 : 0) +
    (mod.challenge && progress.challenges.includes(mod.id) ? 1 : 0);
  const lessonPercent = Math.round((lessonDoneCount / lessonParts.length) * 100);

  /* ── Gamified completion ── */
  const celebrate = ({ newlyUnlocked, xpGained }) => {
    touchStreak();
    spawnXpPop(xpGained);
    if (xpGained) toast.success(`+${xpGained} XP earned!`, { icon: '⚡' });
    newlyUnlocked.forEach((a) =>
      toast.info(`${a.icon} Achievement unlocked: ${a.title} (+${a.xp} XP)`, { autoClose: 5000 })
    );
  };

  const handleMarkComplete = () => {
    if (completing || navLockRef.current) return;
    setCompleting(true);
    navLockRef.current = true;
    markLessonComplete(roadmap.id, mod.id);
    const fresh = getTechProgress(roadmap.id);
    const res = recordActivity('lesson', {
      roadmapPercent: computeProgressPercent(roadmap, fresh),
    });
    celebrate(res);
    bump((n) => n + 1);

    const roadmapsDone = computeProgressPercent(roadmap, fresh) === 100;
    // Brief success moment so learners see the reward, then follow
    // the exact same routing as before.
    setTimeout(() => {
      navLockRef.current = false;
      if (roadmapsDone && nextMod) {
        toast.success(`🏆 ${roadmap.name} roadmap completed!`, { autoClose: 6000 });
        navigate(`/technologies/${roadmap.id}`);
      } else if (nextMod) {
        navigate(`/technologies/${roadmap.id}/lesson/${nextMod.id}`);
      } else {
        setCompleting(false);
      }
    }, 850);
  };

  const handleAssignmentComplete = () => {
    if (!isAssignmentComplete(roadmap.id, mod.id)) {
      toggleAssignmentComplete(roadmap.id, mod.id);
      const res = recordActivity('assignment', {
        roadmapPercent: computeProgressPercent(roadmap, getTechProgress(roadmap.id)),
      });
      celebrate(res);
      bump((n) => n + 1);
    }
  };

  const handleChallengeComplete = () => {
    if (!progress.challenges.includes(mod.id)) {
      markChallengeComplete(roadmap.id, mod.id);
      const res = recordActivity('challenge', {
        roadmapPercent: computeProgressPercent(roadmap, getTechProgress(roadmap.id)),
      });
      celebrate(res);
      bump((n) => n + 1);
    }
  };

  const goLesson = (m) => {
    setSidebarOpen(false);
    navigate(`/technologies/${roadmap.id}/lesson/${m.id}`);
  };

  /* ── Bookmark ── */
  const toggleBookmark = () => {
    const marks = readJSON(BOOKMARKS_KEY, []);
    const next = marks.includes(noteKey)
      ? marks.filter((k) => k !== noteKey)
      : [...marks, noteKey];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    setBookmarked(next.includes(noteKey));
  };

  /* ── Notes ── */
  const saveNotes = () => {
    const all = readJSON(NOTES_KEY, {});
    if (noteText.trim()) all[noteKey] = noteText;
    else delete all[noteKey];
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
    setNoteSavedAt(Date.now());
    setTimeout(() => setNoteSavedAt(null), 2000);
  };
  const hasNote = Boolean(readJSON(NOTES_KEY, {})[noteKey]);

  const totalModules = roadmap.modules.length;

  const sidebar = (
    <aside className={`lp-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label={`${roadmap.name} roadmap navigation`}>
      <div className="ls-head">
        <Link to={`/technologies/${roadmap.id}`} className="ls-back">
          <FiArrowLeft /> Roadmap
        </Link>
        <button
          className="ls-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close roadmap menu"
        >
          <FiX />
        </button>
      </div>

      <div className="ls-progress">
        <ProgressRing percent={percent} size={64} stroke={7} color={roadmap.color} />
        <div>
          <strong>{percent}%</strong>
          <span>{roadmap.name} Roadmap</span>
        </div>
      </div>

      <nav className="ls-nav" aria-label="Roadmap modules">
        {roadmap.modules.map((m, i) => {
          const st = getModuleStatus(roadmap, i, progress);
          return (
            <button
              key={m.id}
              className={[
                'ls-item',
                st === 'completed' && 'is-done',
                st === 'in-progress' && 'is-live',
                i === index && 'is-current',
                st === 'locked' && 'is-locked',
              ].filter(Boolean).join(' ')}
              disabled={st === 'locked'}
              title={st === 'locked' ? 'Complete the previous lesson to unlock.' : undefined}
              onClick={() => st !== 'locked' && goLesson(m)}
            >
              <span className="ls-num">{String(i + 1).padStart(2, '0')}</span>
              <StatusIcon status={st} />
              <span className="ls-item-text">
                <span className="ls-item-title">{m.title}</span>
                <span className="ls-item-meta">{m.minutes} min · {m.level.toLowerCase()}</span>
              </span>
              {i === index && <span className="ls-now">▶ Now Learning</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className={`lp-page ${focusMode ? 'lp-focus' : ''}`}>
      {/* Futuristic ambient background */}
      <div className={`lp-bg ${focusMode ? 'dim' : ''}`} aria-hidden="true">
        <span className="lp-glow lp-glow-a" />
        <span className="lp-glow lp-glow-b" />
        <span className="lp-grid-lines" />
        <span className="lp-token lp-tok-1">print()</span>
        <span className="lp-token lp-tok-2">{'{ }'}</span>
        <span className="lp-token lp-tok-3">def</span>
        <span className="lp-token lp-tok-4">101</span>
      </div>

      {/* Mobile top bar */}
      {!focusMode && (
        <button
          className="lp-mobile-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open roadmap menu"
        >
          <FiMenu /> Roadmap
        </button>
      )}
      {sidebar}
      {sidebarOpen && (
        <div className="lp-scrim" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <div className="lp-shell">
        <div className="lp-layout">
          {/* ══════════ CENTER COLUMN ══════════ */}
          <div className="lp-center">
            {/* ── Hero header ── */}
            <LessonHero
              roadmap={roadmap}
              techMeta={techMeta}
              mod={mod}
              index={index}
              status={status}
              lessonPercent={lessonPercent}
              videoDone={isVideoComplete(roadmap.id, mod.id)}
              hasAssignment={Boolean(mod.assignment)}
              assignmentDone={progress.assignments.includes(mod.id)}
              hasChallenge={Boolean(mod.challenge)}
              challengeDone={progress.challenges.includes(mod.id)}
              completing={completing}
              completed={completed}
              onStart={() => setVideoOpen(true)}
              onWatch={() => setVideoOpen(true)}
              heroRef={heroRef}
              onMouseMove={handleHeroMove}
              onMouseLeave={handleHeroLeave}
            >
              {!completed ? (
                <button
                  className={`btn btn-primary btn-lg lp-complete-btn ${completing ? 'is-completing' : ''}`}
                  onClick={handleMarkComplete}
                >
                  {completing ? <><FiCheckCircle /> Completed!</> : <><FiCheckCircle /> Mark Complete & Continue</>}
                </button>
              ) : nextMod ? (
                <button className="btn btn-primary btn-lg lp-nav-btn lp-next-main" onClick={() => goLesson(nextMod)}>
                  Next Module <FiChevronRight />
                </button>
              ) : (
                <span className="lp-roadmap-done"><FiAward /> Roadmap Completed!</span>
              )}

              <div className="lp-tool-group">
                <button
                  type="button"
                  className={`lp-tool ${bookmarked ? 'active' : ''}`}
                  onClick={toggleBookmark}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
                  data-tip={bookmarked ? 'Bookmarked' : 'Save this lesson'}
                >
                  <FiBookmark />
                  <span>{bookmarked ? '★ Bookmarked' : '☆ Bookmark'}</span>
                </button>
                <button
                  type="button"
                  className={`lp-tool ${hasNote ? 'has-note' : ''}`}
                  onClick={() => setNotesOpen(true)}
                  aria-label="Add personal notes"
                  data-tip="Add personal notes"
                >
                  <FiFileText />
                  <span>Notes</span>
                </button>
                <button
                  type="button"
                  className="lp-tool"
                  onClick={() => setFocusMode(true)}
                  aria-label="Enter focus mode"
                  data-tip="Remove distractions"
                >
                  <FiMaximize />
                  <span>Focus Mode</span>
                </button>
              </div>
            </LessonHero>

            {/* ── Video (▶ opens the Interactive Lesson Studio) ── */}
            <section aria-label="Video lesson" data-rv>
              <VideoLesson module={mod} color={roadmap.color} onLaunch={() => setVideoOpen(true)} />
            </section>

            {/* ── Section divider ── */}
            <div className="lp-divider" data-rv aria-hidden="true">
              <i /><b /><i />
            </div>

            {/* ── What You'll Learn ── */}
            <section className="lp-section-head" aria-label="What you will learn" data-rv>
              <div className="lp-sh-row">
                <span className="lp-sh-icon" aria-hidden="true"><FiLayers /></span>
                <div>
                  <h2>What You&apos;ll Learn</h2>
                  <p>Skills unlocked in this lesson — click a card to jump into that topic.</p>
                </div>
              </div>
              <LearningTopicsGrid
                topics={learnTopics}
                allDone={completed || isVideoComplete(roadmap.id, mod.id)}
                onExplore={openTopic}
              />
            </section>

            {/* ── Assignment ── */}
            {mod.assignment && (
              <section id="lp-assignment" aria-label="Assignment" data-rv>
                <AssignmentCard
                  module={mod}
                  isCompleted={progress.assignments.includes(mod.id)}
                  onComplete={handleAssignmentComplete}
                />
              </section>
            )}

            {/* ── Coding challenge ── */}
            {mod.challenge && (
              <section id="lp-challenge" aria-label="Coding challenge" data-rv>
                <CodingChallenge
                  module={mod}
                  isCompleted={progress.challenges.includes(mod.id)}
                  onComplete={handleChallengeComplete}
                />
              </section>
            )}
          </div>

          {/* ── RIGHT: insights rail (desktop side / below content on narrow) ── */}
          <LessonInsights
            roadmap={roadmap}
            percent={percent}
            lessonPercent={lessonPercent}
            nextMod={nextMod}
            nextStatus={nextStatus}
            onGoNext={() => nextMod && goLesson(nextMod)}
          />
        </div>

        {/* ── Bottom navigation (spans both columns) ── */}
        <footer className="lp-footer-nav">
          {prevMod ? (
            <button className="btn btn-outline lp-nav-btn" onClick={() => goLesson(prevMod)}>
              <FiChevronLeft /> Previous
            </button>
          ) : <span />}

          <span className="lp-position" aria-label={`Lesson ${index + 1} of ${totalModules}`}>
            Lesson {index + 1} of {totalModules}
          </span>

          {nextMod ? (
            <span className="lp-tip" data-tip={completed ? undefined : 'Complete this lesson to continue.'}>
              <button
                className="btn btn-outline lp-nav-btn lp-next-side"
                disabled={!completed}
                onClick={() => completed && goLesson(nextMod)}
              >
                Next <FiChevronRight />
              </button>
            </span>
          ) : <span className="lp-end-cap">🏁 Finish</span>}
        </footer>
      </div>

      {/* Floating exit-focus chip */}
      {focusMode && (
        <button className="lp-exit-focus" onClick={() => setFocusMode(false)}>
          <FiMinimize /> Exit Focus Mode
        </button>
      )}

      {/* ── Interactive Lesson Video Studio ── */}
      {videoOpen && (
        <LessonVideoModal
          roadmap={roadmap}
          mod={mod}
          techMeta={techMeta}
          index={index}
          totalModules={totalModules}
          video={getLessonVideo(roadmap, mod)}
          initialTopicIndex={topicIdx}
          onClose={() => setVideoOpen(false)}
          onComplete={(res) => {
            celebrate(res);
            bump((n) => n + 1);
          }}
          goModule={nextMod ? { next: nextMod, go: () => { setVideoOpen(false); goLesson(nextMod); } } : null}
          goToSection={(name) => {
            setVideoOpen(false);
            setTimeout(() => {
              document.getElementById(`lp-${name}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
          }}
          bookmarked={bookmarked}
          onToggleBookmark={toggleBookmark}
        />
      )}

      {/* Notes modal */}
      {notesOpen && (
        <div className="lp-notes-overlay" role="dialog" aria-modal="true" aria-label="Lesson notes">
          <div className="lp-notes-panel">
            <div className="lp-notes-head">
              <h3><FiFileText /> Lesson Notes</h3>
              <button className="lp-notes-close" onClick={() => setNotesOpen(false)} aria-label="Close notes">
                <FiX />
              </button>
            </div>
            <textarea
              className="lp-notes-area"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your personal notes for this lesson… they're saved on this device."
              rows={7}
              autoFocus
            />
            <div className="lp-notes-foot">
              <span className="lp-notes-status">
                {noteSavedAt ? '✓ Saved' : noteText.trim() ? `${noteText.trim().length} chars` : ''}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => { setNoteText(''); saveNotes(); }}
              >
                Clear
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={saveNotes}>
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating +XP rewards */}
      <div className="lp-xp-layer" aria-live="polite">
        {xpPops.map((p) => (
          <span key={p.id} className="lp-xp-pop">✨ +{p.amount} XP</span>
        ))}
      </div>
    </div>
  );
};

export default LessonPage;
