// ─── Studio Code Panel ───────────────────────────────────────
// Terminal-style code editor panel with a dependency-free
// highlighter (strings / comments / numbers / keywords) and a
// simulated Run Example that reveals the lesson's expected
// output. Never executes arbitrary user code.
import { useMemo, useState } from 'react';
import { FiPlay, FiCheck, FiCopy } from 'react-icons/fi';

const KEYWORDS = {
  python: ['def', 'print', 'for', 'in', 'if', 'elif', 'else', 'while', 'return', 'import', 'from', 'class', 'True', 'False', 'None', 'and', 'or', 'not'],
  java: ['public', 'class', 'static', 'void', 'main', 'String', 'System', 'out', 'println', 'print', 'new', 'int', 'double', 'boolean', 'final', 'return', 'if', 'else', 'for', 'while'],
  javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'async', 'await', 'console', 'log', 'true', 'false', 'null'],
  bash: ['python', 'python3', 'java', 'javac', 'setx', 'export', 'echo', 'cd', '--version'],
};

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Lightweight, conservative highlighter → HTML string. */
const highlight = (source, language = 'text') => {
  const escaped = escapeHtml(source);
  const keywords = KEYWORDS[language] || [];
  return escaped
    // strings first (single/double quotes)
    .replace(/(&quot;|")(?:[^"\\]|\\.)*\1|'(?:[^'\\]|\\.)*'/g, (m) => `<i class="als-tok-str">${m}</i>`)
    // comments (# … or // …)
    .replace(/(^|\s)(#[^\n<]*|\/\/[^\n<]*)/g, (m, pre, cm) => `${pre}<i class="als-tok-com">${cm}</i>`)
    // numbers
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<i class="als-tok-num">$1</i>')
    // keywords
    .replace(new RegExp(`\\b(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g'), '<i class="als-tok-kw">$1</i>');
};

const StudioCodePanel = ({ topic }) => {
  const [runState, setRunState] = useState('idle'); // idle | running | done
  const [copied, setCopied] = useState(false);

  const html = useMemo(
    () => highlight(topic.code?.source || '', topic.code?.language),
    [topic.code?.source, topic.code?.language]
  );

  if (!topic.code) {
    return (
      <div className="als-panel als-focuscard">
        <h4><span className="als-dot" /> Focus Points</h4>
        <ul className="als-focuslist">
          {(topic.keyPoints.length ? topic.keyPoints : [topic.description]).filter(Boolean).map((kp) => (
            <li key={kp}><FiCheck aria-hidden="true" /> {kp}</li>
          ))}
        </ul>
      </div>
    );
  }

  const runExample = () => {
    if (runState === 'running') return;
    setRunState('running');
    setTimeout(() => setRunState('done'), 550);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(topic.code.source).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const langLabel = (topic.code.language || 'code').toUpperCase();

  return (
    <div className="als-panel als-codepanel">
      <div className="als-codebar">
        <span className="als-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="als-codelang">{langLabel}</span>
        <button type="button" className={`als-copy ${copied ? 'ok' : ''}`} onClick={copyCode} aria-label="Copy code example">
          {copied ? <FiCheck size={12} /> : <FiCopy size={12} />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="als-pre"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>

      <div className="als-runrow">
        <button
          type="button"
          className="als-btn als-btn-primary"
          onClick={runExample}
          disabled={runState === 'running'}
          aria-label={`Run example: ${topic.title}`}
        >
          {runState === 'done' ? <FiCheck /> : <FiPlay />} {runState === 'running' ? 'Running…' : runState === 'done' ? 'Ran Example' : 'Run Example'}
        </button>
        <span className="als-runhint">Simulated output — nothing executes on a server.</span>
      </div>

      {runState === 'done' && topic.code.output != null && (
        <div className="als-output" role="status" aria-live="polite">
          <span className="als-output-label">OUTPUT</span>
          <pre>{topic.code.output}</pre>
        </div>
      )}
      {runState === 'done' && topic.code.output == null && (
        <div className="als-output muted" role="status" aria-live="polite">
          <span className="als-output-label">OUTPUT</span>
          <pre>No console output — this example demonstrates configuration.</pre>
        </div>
      )}
    </div>
  );
};

export default StudioCodePanel;
