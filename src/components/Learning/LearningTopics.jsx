// ─── What You'll Learn — interactive topic grid ──────────────
// Turns the lesson's objectives / video topics into premium
// hover-cards: number chip, thematic icon, description, completion
// indicator and an "Explore Topic →" affordance. Clicking a card
// opens the Interactive Lesson Studio on that topic (real data,
// real navigation — no dummy handlers).
import {
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiDownload,
  FiFileText,
  FiMessageSquare,
  FiPlay,
  FiTarget,
  FiTerminal,
} from 'react-icons/fi';
import './LearningTopics.css';

/* Thematic icon cycle — ordered to match typical lesson flow:
   concept → install → run → files → output → practice … */
const ICONS = [FiCode, FiDownload, FiTerminal, FiFileText, FiMessageSquare, FiTarget];

const pad2 = (n) => String(n).padStart(2, '0');

const LearningTopicCard = ({ topic, index, done }) => {
  const Icon = ICONS[index % ICONS.length];
  // Generated fallback videos repeat the module summary for every
  // topic — only show a description when it's actually unique.
  const desc =
    index > 0 && topic.description === (topic.prevDescription || '')
      ? ''
      : topic.description || '';

  return (
    <li className="lt-card-wrap" style={{ '--i': index }}>
      <button type="button" className={`lt-card${done ? ' is-done' : ''}`} onClick={topic.onExplore}>
        <span className="lt-icon" aria-hidden="true">
          <Icon />
        </span>

        <span className="lt-body">
          <strong className="lt-title">{topic.title}</strong>
          {desc && <span className="lt-desc">{desc}</span>}
          <span className="lt-explore" aria-hidden="true">
            Explore Topic <FiArrowRight />
          </span>
        </span>

        <span className="lt-state" aria-hidden="true">
          {done ? <FiCheckCircle /> : <FiPlay />}
        </span>

        <span className="lt-num" aria-hidden="true">{pad2(index + 1)}</span>
      </button>
    </li>
  );
};

const LearningTopicsGrid = ({ topics = [], allDone = false, onExplore }) => {
  const enriched = topics.map((t, i) => ({
    ...t,
    prevDescription: i > 0 ? topics[i - 1].description : '',
    onExplore: () => onExplore?.(t, i),
  }));

  return (
    <ul className="lt-grid">
      {enriched.map((t, i) => (
        <LearningTopicCard key={`${t.id ?? t.title}-${i}`} topic={t} index={i} done={allDone} />
      ))}
    </ul>
  );
};

export default LearningTopicsGrid;
