// ─── Studio Visual ───────────────────────────────────────────
// Topic-aware CSS-3D scene for the AI Lesson Studio.
// Variants: cube (tech glyph faces), cards, terminal, repl,
// variables, function, loops. Leans gently toward the cursor
// (max ~7°) via --tilt-x / --tilt-y custom properties.
const TECH_FACES = {
  Python: ['PY', '{ }', 'print()', '>>>', '3.x', 'def'],
  Java: ['JAVA', '{ }', 'class', 'JVM', ';', 'main()'],
  JavaScript: ['JS', '{ }', 'const', '=>', 'await', '()'],
  React: ['⚛', '<App/>', 'useState', 'props', 'JSX', '{}'],
  HTML: ['HTML', '<div>', '</>', '<a>', 'lang', 'meta'],
  CSS: ['CSS', '{ }', ':hover', 'flex', 'rem', '@media'],
  SQL: ['SQL', 'SELECT', '*', 'FROM', 'JOIN', 'WHERE'],
  MySQL: ['SQL', 'INSERT', 'JOIN', 'WHERE', 'KEY', 'VIEW'],
  C: ['C', '#include', 'printf', '*ptr', 'int', ';'],
  'C++': ['C++', '{ }', 'std::', 'class', '<<', 'new'],
  'C#': ['C#', '{ }', 'class', 'var', '=>', 'async'],
  'Node.js': ['NODE', '{ }', 'require', '⬢', 'fs', 'npm'],
  Git: ['GIT', 'commit', 'push', 'HEAD', 'branch', '~'],
  Docker: ['DOCKER', 'FROM', 'RUN', 'build', 'ps', '-it'],
};
const DEFAULT_FACES = ['</>', '{ }', '();', '101', '::=', '#'];
const FACE_CLASSES = ['als-f-front', 'als-f-back', 'als-f-right', 'als-f-left', 'als-f-top', 'als-f-bottom'];

const CubeScene = ({ faces }) => (
  <div className="als-cube">
    {faces.map((f, i) => (
      <span key={`${f}-${i}`} className={`als-face ${FACE_CLASSES[i % 6]}`}>{f}</span>
    ))}
  </div>
);

const CardStack = ({ items = [] }) => (
  <div className="als-cardstack">
    {items.slice(0, 4).map((item, i) => (
      <span key={`${item}-${i}`} className={`als-vcard als-vcard-${i + 1}`}>{item}</span>
    ))}
  </div>
);

const TerminalMock = ({ lines = [] }) => (
  <div className="als-termmock">
    <div className="als-termmock-bar">
      <i /><i /><i />
      <span>terminal</span>
    </div>
    <div className="als-termmock-body">
      {(lines.length ? lines : ['$ python --version', 'Python 3.12.4']).map((l, i) => (
        <p key={i} className={l.startsWith('$') || l.startsWith('#') || l.startsWith('>>>') ? 'cmd' : ''}>{l}</p>
      ))}
    </div>
  </div>
);

const ReplMock = () => (
  <div className="als-replmock">
    <span className="als-replmock-prompt">&gt;&gt;&gt;</span>
    <span className="als-replmock-caret" />
    <span className="als-replmock-hint">type · eval · print</span>
  </div>
);

const FunctionBlock = ({ signature }) => (
  <div className="als-fnblock">
    <span className="als-fnblock-key">def</span>
    <span className="als-fnblock-name">{signature || 'hello():'}</span>
    <span className="als-fnblock-dot" /><span className="als-fnblock-dot d2" /><span className="als-fnblock-dot d3" />
  </div>
);

const LoopRings = () => (
  <div className="als-loops" aria-hidden="true">
    <span className="als-loop-ring r1" />
    <span className="als-loop-ring r2" />
    <span className="als-loop-core">for</span>
  </div>
);

const StudioVisual = ({ roadmapName = '', accent, visual }) => {
  const type = visual?.type || 'cube';
  const faces = visual?.faces || TECH_FACES[roadmapName] || DEFAULT_FACES;

  let core;
  if (type === 'cards') core = <CardStack items={visual.items} />;
  else if (type === 'terminal') core = <TerminalMock lines={visual.lines} />;
  else if (type === 'repl') core = <ReplMock />;
  else if (type === 'variables') core = <CardStack items={visual.items} />;
  else if (type === 'function') core = <FunctionBlock signature={visual.items?.[0]} />;
  else if (type === 'loops') core = <LoopRings />;
  else core = <CubeScene faces={faces} />;

  return (
    <div className="als-visual" style={{ '--accent': accent || undefined }} aria-hidden="true">
      <span className="als-orbit" />
      <span className="als-floor" />
      {core}
    </div>
  );
};

export default StudioVisual;
