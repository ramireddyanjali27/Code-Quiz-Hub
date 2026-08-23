// ─── Studio AI Mentor ────────────────────────────────────────
// Topic-aware mentor tip plus an "Ask AI Mentor" chat. There is
// no AI backend configured in CodeQuizHub, so answers are derived
// honestly from the current topic's structured lesson content and
// clearly labelled as built-in — the studio never fakes an API.
import { useEffect, useRef, useState } from 'react';
import { FiSend, FiX, FiZap } from 'react-icons/fi';

/** Local answer engine built ONLY from the current topic's content. */
const answerFromTopic = (topic, question) => {
  const q = question.toLowerCase();

  if (/\b(code|breakdown|walk|line)\b/.test(q) && topic.codeBreakdown?.length) {
    return topic.codeBreakdown.map((b) => `• ${b.snippet} → ${b.explain}`).join('\n');
  }
  if (/\b(example|another|show me|try)\b/.test(q)) {
    return topic.practiceHint
      ? `Try this yourself: ${topic.practiceHint}`
      : `Work through the key points again: ${topic.keyPoints.slice(0, 3).join(' · ') || topic.explanation}`;
  }
  if (/\b(why|tip|remember|important)\b/.test(q) && topic.aiTip) {
    return topic.aiTip;
  }
  if (/\b(quiz me|test me|checkpoint)\b/.test(q) && topic.checkpoint) {
    return `Quick self-check: ${topic.checkpoint.question} — think it over, then answer in the Quick Check card below.`;
  }
  if (/\b(output|result)\b/.test(q) && topic.code?.output) {
    return `Running the example prints:\n${topic.code.output}`;
  }

  const opener = topic.checkpoint
    ? `${topic.title}: ${topic.checkpoint.question.replace('?', '')}? Here is the core idea.`
    : `${topic.title}`;
  return `${opener} ${topic.explanation}${topic.aiTip ? `\n\n💡 ${topic.aiTip}` : ''}`;
};

const QUICK_QUESTIONS = (topic) => {
  const qs = ['Explain this simply', 'Walk me through the code', 'Give me another example'];
  if (topic.checkpoint) qs[2] = 'Quiz me on this';
  return qs;
};

const StudioMentor = ({ topic }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const ask = (text) => {
    const question = text.trim();
    if (!question) return;
    const answer = answerFromTopic(topic, question);
    setMessages((m) => [...m, { role: 'you', text: question }, { role: 'mentor', text: answer }]);
    setDraft('');
  };

  return (
    <div className="als-panel als-mentor">
      <div className="als-mentor-head">
        <span className="als-mentor-badge"><FiZap aria-hidden="true" /> ✦ AI Mentor</span>
        <button
          type="button"
          className="als-mentor-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close AI Mentor chat' : 'Ask AI Mentor'}
        >
          {open ? <>Close <FiX /></> : 'Ask AI Mentor'}
        </button>
      </div>

      <p className="als-mentor-tip">{topic.aiTip || topic.explanation}</p>
      {topic.practiceHint && <p className="als-mentor-hint">💡 Tip: {topic.practiceHint}</p>}

      {open && (
        <div className="als-chat">
          <div className="als-chat-note">Built-in AI Mentor · answers come from this lesson&apos;s content · works offline</div>
          <div className="als-chat-list" ref={listRef}>
            {messages.length === 0 && (
              <div className="als-chat-empty">
                Ask anything about <strong>{topic.title}</strong>…
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`als-msg ${m.role}`}>
                <span className="als-msg-avatar" aria-hidden="true">{m.role === 'you' ? 'Y' : '✦'}</span>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="als-chat-chips">
            {QUICK_QUESTIONS(topic).map((q) => (
              <button key={q} type="button" onClick={() => ask(q)}>{q}</button>
            ))}
          </div>
          <form
            className="als-chat-inputrow"
            onSubmit={(e) => { e.preventDefault(); ask(draft); }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask anything about this topic…"
              aria-label="Ask AI Mentor about this topic"
            />
            <button type="submit" className="als-btn als-btn-primary" disabled={!draft.trim()} aria-label="Send question to AI Mentor">
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudioMentor;
