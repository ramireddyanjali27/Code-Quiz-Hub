// ─── Coding Challenge ────────────────────────────────────────
// In-module coding practice: editor + Run + Submit + test cases.
// Execution is simulated via utils/codeRunner.js — swap that file
// with a real compiler API later without touching this component.
import { useEffect, useRef, useState } from 'react';
import { FiPlay, FiUploadCloud, FiCheckCircle, FiXCircle, FiCode, FiTerminal, FiCopy } from 'react-icons/fi';
import { runCode, submitCode } from '../../utils/codeRunner';
import './Learning.css';

const CodingChallenge = ({ module, isCompleted, onComplete }) => {
  const challenge = module.challenge;
  const [code, setCode] = useState(challenge?.starterCode || '');
  const [output, setOutput] = useState(null);
  const [tests, setTests] = useState([]);
  const [summary, setSummary] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passedAll, setPassedAll] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard API unavailable (permissions / http) — best effort only
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1400);
  };

  if (!challenge) return null;

  const handleRun = async () => {
    setRunning(true);
    setTests([]);
    setSummary('');
    const res = await runCode({ code, language: challenge.language, challenge });
    setOutput(res);
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput(null);
    setTests([]);
    setSummary('Evaluating…');
    const res = await submitCode({ code, language: challenge.language, challenge });
    // Reveal tests one by one for a satisfying progress feel
    res.results.forEach((r, i) => setTimeout(() => setTests((prev) => [...prev, r]), (i + 1) * 430));
    setTimeout(() => {
      setSummary(res.summary);
      setPassedAll(res.passedAll);
      setSubmitting(false);
      if (res.passedAll && !isCompleted) onComplete();
    }, (res.results.length + 1) * 430);
  };

  return (
    <div className={`cc-card ${passedAll || isCompleted ? 'cc-done' : ''}`}>
      <div className="cc-header">
        <h3><FiCode /> {challenge.title}</h3>
        <span className="cc-lang-badge">{challenge.language}</span>
      </div>

      <div className="cc-body-grid">
        {/* Instructions */}
        <div className="cc-instructions">
          <h4>Instructions</h4>
          <ul>
            {(challenge.instructions || []).map((ins, i) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>

          <div className="cc-tests-preview">
            <h4>Test Cases</h4>
            <ul className="cc-test-list">
              {(challenge.tests || []).map((t, i) => {
                const result = tests.find((x) => x.name === t.name);
                return (
                  <li key={i} className={result ? (result.passed ? 'pass' : 'fail') : ''}>
                    {result ? (
                      result.passed ? <FiCheckCircle className="cc-test-icon pass" /> : <FiXCircle className="cc-test-icon fail" />
                    ) : (
                      <span className="cc-test-dot" aria-hidden="true" />
                    )}
                    <span>{t.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Editor */}
        <div className="cc-editor-wrap">
          <div className="cc-editor-bar" aria-hidden="false">
            <span className="cc-dot cc-dot-r" />
            <span className="cc-dot cc-dot-y" />
            <span className="cc-dot cc-dot-g" />
            <span className="cc-editor-file">Main.{challenge.language === 'JavaScript' ? 'js' : challenge.language.toLowerCase()}</span>
            <button
              type="button"
              className={`cc-copy ${copied ? 'ok' : ''}`}
              onClick={handleCopy}
              aria-label={copied ? 'Copied!' : 'Copy starter code'}
            >
              {copied ? '✓ Copied' : <><FiCopy /> Copy</>}
            </button>
          </div>
          <textarea
            className="cc-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            aria-label="Code editor"
          />
          <div className="cc-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={handleRun} disabled={running || submitting}>
              <FiPlay /> {running ? 'Running…' : 'Run'}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={running || submitting}>
              <FiUploadCloud /> {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* Output / results */}
      {(output || tests.length > 0 || summary) && (
        <div className="cc-output-panel" role="status">
          <h4><FiTerminal /> Output</h4>
          {output && (
            <pre className={`cc-output ${output.ok ? '' : 'cc-output-err'}`}>
              {output.ok ? output.output : output.error}
            </pre>
          )}
          {summary && (
            <p className={`cc-summary ${passedAll ? 'ok' : submitting ? '' : 'fail'}`}>
              {summary}
            </p>
          )}
          {passedAll && !isCompleted && (
            <p className="cc-success-note">✓ Challenge completed — XP awarded!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CodingChallenge;
