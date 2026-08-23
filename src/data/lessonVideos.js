// ─── AI Lesson Studio Content Registry ───────────────────────
// Per-lesson interactive studio content for EVERY technology.
//
//   videoUrl === ''  →  the modal opens the AI Lesson Studio: an
//                       interactive, video-style presentation built
//                       from the structured topics below.
//   videoUrl set     →  the real video player is used instead —
//                       drop a URL in and nothing else changes.
//
// Topic shape (canonical, consumed by AILessonStudio):
//   {
//     id, title, start,
//     description,        // one-line summary
//     explanation,        // full teaching paragraph
//     keyPoints: [],      // highlighted bullet points
//     code: { language, source, output } | null,
//     codeBreakdown: [{ snippet, explain }],
//     aiTip,              // AI-Mentor insight for THIS topic
//     practiceHint,       // 💡 try-this line
//     checkpoint: { question, options[], answer(index), explain } | null,
//     visual: { type, items? },  // 3D scene variant
//   }
//
// Authored entries exist for flagship openers; every other lesson gets
// a generated entry built from its roadmap data (objectives → topics),
// so no module is ever hardcoded or left broken.

const javaBasicsVideo = {
  title: 'Java Basics',
  durationSeconds: 45 * 60,
  videoUrl: '',
  thumbnail: '',
  transcript: null,
  topics: [
    {
      id: 'what-is-java',
      title: 'What is Java?',
      start: 0,
      description:
        'Java is a high-level, object-oriented programming language designed to let developers write code once and run it anywhere a JVM exists.',
      explanation:
        'Java is a high-level, class-based, object-oriented language first released by Sun Microsystems in 1995. Its defining promise is "write once, run anywhere": source code compiles into bytecode that any JVM can execute, regardless of operating system. That portability — plus automatic memory management and a huge ecosystem — made Java the backbone of enterprise backends, Android apps and build tools.',
      keyPoints: ['Object-oriented', 'Platform independent', 'Secure', 'Robust', '"Write once, run anywhere"'],
      aiTip:
        'Think of the JVM as a translator who speaks every operating system\'s dialect. Your .class file always says the same thing; the JVM just delivers it locally.',
      practiceHint: 'List three apps on your phone that are likely powered by Java.',
      checkpoint: {
        question: 'What does JVM stand for?',
        options: ['Java Virtual Machine', 'Java Visual Machine', 'Java Variable Method', 'Java Version Manager'],
        answer: 0,
        explain: 'The Java Virtual Machine executes compiled Java bytecode on any platform.',
      },
      visual: { type: 'cube', faces: ['JAVA', '{ }', 'class', 'JVM', '01', ';'] },
    },
    {
      id: 'why-popular',
      title: 'Why Java is popular',
      start: 240,
      description:
        'Huge ecosystem, backward compatibility, massive job market and a mature toolchain make Java a safe long-term bet for enterprise and Android development.',
      explanation:
        'Java\'s popularity is no accident. Twenty-plus years of backward compatibility means decade-old systems still run on modern JDKs. Maven Central hosts millions of ready-made libraries, Spring Boot dominates enterprise services, and Android SDK development is Java-first. For learners this translates directly into internships, jobs and answers to almost any question you will ever Google.',
      keyPoints: ['Enormous library ecosystem', 'Strong backwards compatibility', 'Enterprise & Android backbone'],
      aiTip:
        'When evaluating a language for your career, count the job postings AND the libraries. Java scores high on both — that is why colleges still teach it.',
      practiceHint: 'Search Maven Central for a library related to a hobby of yours.',
      visual: { type: 'cards', items: ['Enterprise', 'Android', 'Big Data', 'Cloud'] },
    },
    {
      id: 'features',
      title: 'Java features',
      start: 480,
      description:
        'Automatic memory management, multithreading, rich standard library and strong static typing are the features learners meet first.',
      explanation:
        'Four features shape everyday Java. The garbage collector frees memory for you, so leaks are rare. Built-in multithreading lets the JVM juggle work across cores. The standard library ships collections, networking and concurrency out of the box. And static typing catches whole classes of bugs at compile time — before your program ever runs.',
      keyPoints: ['Garbage collection', 'Multithreaded', 'Rich standard library', 'Static typing'],
      aiTip:
        'Static typing feels strict at first, but it is a superpower: the compiler becomes your first code reviewer, catching typos before runtime.',
      practiceHint: 'Try assigning a String to an int variable and read the compiler error carefully.',
      visual: { type: 'cards', items: ['GC', 'Threads', 'JDK Libs', 'Types'] },
    },
    {
      id: 'jdk-jre-jvm',
      title: 'JDK vs JRE vs JVM',
      start: 720,
      description:
        'Three acronyms, three jobs: the JDK develops, the JRE runs, the JVM executes bytecode.',
      explanation:
        'The JVM executes bytecode — it is the engine. The JRE wraps the engine with the core libraries needed to actually run programs. The JDK wraps everything again with developer tools like javac and jdb. Nested inside each other: JDK ⊃ JRE ⊃ JVM. You install the JDK once and get the whole stack.',
      keyPoints: [
        'JDK = Development Kit (compiler + tools)',
        'JRE = Runtime Environment (libraries + JVM)',
        'JVM = executes .class bytecode',
        'JDK ⊃ JRE ⊃ JVM',
      ],
      diagram: ['JDK', 'JRE', 'JVM'],
      aiTip:
        'Memory hook: Developer → JDK, Runtime → JRE, Machine → JVM. The word tells you the layer.',
      practiceHint: 'Run `javac --version` — only the JDK ships the compiler.',
      checkpoint: {
        question: 'Which package do you need to WRITE Java applications?',
        options: ['JRE', 'JDK', 'Only the JVM', 'A browser plugin'],
        answer: 1,
        explain: 'The JDK contains the compiler (javac) and dev tools; the JRE can only run programs.',
      },
      visual: { type: 'cards', items: ['JDK ⊃ JRE ⊃ JVM'] },
    },
    {
      id: 'installing-java',
      title: 'Installing Java',
      start: 1080,
      description:
        'Install a JDK distribution (Temurin, Oracle JDK, Amazon Corretto…) and verify the toolchain from your terminal.',
      explanation:
        'Pick an OpenJDK distribution — Eclipse Temurin is a great default — and install version 21 (the latest LTS). When the installer finishes, open a fresh terminal and ask the toolchain who it is: `java -version` checks the runtime, `javac -version` checks the compiler. If both answer, your environment is ready.',
      keyPoints: ['Pick a JDK distribution', 'Verify with java -version & javac -version'],
      codeExample: '# Verify the installed toolchain\njava --version\njavac --version',
      codeLang: 'bash',
      code: {
        language: 'bash',
        source: '# Verify the installed toolchain\njava --version\njavac --version',
        output: 'openjdk version "21.0.2" 2024-01-16 LTS\njavac 21.0.2',
      },
      aiTip:
        'If `javac` is "not recognized", you installed the JRE by mistake or PATH is stale — reopen the terminal after installing the JDK.',
      practiceHint: 'Verify both commands now before moving on.',
      visual: { type: 'terminal' },
    },
    {
      id: 'java-home',
      title: 'Setting JAVA_HOME',
      start: 1320,
      description:
        'JAVA_HOME tells build tools where your JDK lives; add its bin folder to PATH to use javac/java everywhere.',
      explanation:
        'Build tools such as Maven and Gradle locate your JDK through the JAVA_HOME environment variable. Point it at the JDK root folder and append %JAVA_HOME%/bin (Windows) or $JAVA_HOME/bin (macOS/Linux) to PATH so java and javac work from any directory.',
      keyPoints: ['JAVA_HOME → JDK root folder', 'PATH += %JAVA_HOME%/bin'],
      codeExample: '# Windows (PowerShell)\nsetx JAVA_HOME "C:\\Program Files\\Java\\jdk-21"\n# macOS / Linux (~/.zshrc or ~/.bashrc)\nexport JAVA_HOME=$(/usr/libexec/java_home)',
      codeLang: 'bash',
      code: {
        language: 'bash',
        source: '# Windows (PowerShell)\nsetx JAVA_HOME "C:\\Program Files\\Java\\jdk-21"\n\n# macOS / Linux (~/.zshrc or ~/.bashrc)\nexport JAVA_HOME=$(/usr/libexec/java_home)',
        output: 'JAVA_HOME is now available in new terminals.',
      },
      aiTip:
        'After editing PATH, always open a NEW terminal — running shells keep the old environment variables.',
      practiceHint: 'Echo $env:JAVA_HOME (PowerShell) or echo $JAVA_HOME to confirm.',
      visual: { type: 'terminal' },
    },
    {
      id: 'first-program',
      title: 'Your First Java Program',
      start: 1560,
      description:
        'Every Java program lives inside a class. This one prints a greeting to the console.',
      explanation:
        'Java is strictly class-based: even a hello-world must live inside a class. Save this as Main.java, compile it with javac Main.java, then run java Main. The JVM loads Main, finds public static void main(String[] args) and starts executing there line by line.',
      keyPoints: ['Code lives in a class', 'main() is the entry point', 'Statements end with ;'],
      codeExample:
        'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeQuizHub!");\n    }\n}',
      codeLang: 'java',
      code: {
        language: 'java',
        source: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeQuizHub!");\n    }\n}',
        output: 'Hello, CodeQuizHub!',
      },
      codeBreakdown: [
        { snippet: 'public class Main', explain: 'Declares a public class named Main — the file must be named Main.java.' },
        { snippet: 'public static void main(String[] args)', explain: 'The JVM calls this method first when the program starts.' },
        { snippet: 'System.out.println(...)', explain: 'Prints the text to the console followed by a newline.' },
      ],
      aiTip:
        'File name must match the public class name exactly — Main.java, not main.java. Case matters everywhere in Java.',
      practiceHint: 'Change the greeting text, recompile and run again.',
      visual: { type: 'cube', faces: ['JAVA', '{ }', 'main()', '();', '01', 'class'] },
    },
    {
      id: 'compiling',
      title: 'Compiling Java Code',
      start: 2040,
      description:
        'javac translates your human-readable source into portable bytecode stored in .class files.',
      explanation:
        'Compilation is the translation step between you and the JVM. javac reads Main.java, checks types and syntax, and emits Main.class containing bytecode — a compact instruction set aimed not at your CPU but at the virtual machine. This is what makes the same compiled file runnable on Windows, macOS and Linux alike.',
      keyPoints: ['javac produces bytecode (.class)', 'Bytecode is platform independent'],
      codeExample: 'javac Main.java   # produces Main.class (bytecode)',
      codeLang: 'bash',
      code: {
        language: 'bash',
        source: 'javac Main.java   # produces Main.class (bytecode)',
        output: 'Main.class created — portable across all platforms with a JVM.',
      },
      codeBreakdown: [
        { snippet: 'javac', explain: 'The Java compiler that reads .java sources.' },
        { snippet: 'Main.class', explain: 'Compiled bytecode the JVM can execute on any platform.' },
      ],
      aiTip:
        'One common beginner stumble: running `java Main.class`. Since Java 11 you pass the SOURCE file (`java Main.java`) or the class NAME without extension (`java Main`).',
      practiceHint: 'Compile the previous slide\'s program and list the folder to spot Main.class.',
      checkpoint: {
        question: 'What does javac produce?',
        options: ['Machine-specific .exe files', 'HTML documentation', 'Portable .class bytecode', 'Zip archives'],
        answer: 2,
        explain: 'javac compiles .java source files into portable bytecode (.class).',
      },
      visual: { type: 'terminal' },
    },
    {
      id: 'running-java',
      title: 'Running Java Programs',
      start: 2280,
      description:
        'The java command loads your class into the JVM and executes its main method.',
      explanation:
        '`java Main` launches a JVM instance, loads Main.class, verifies the bytecode and invokes main(). Execution ends when main returns (or System.exit is called). Note there is no .class extension in the command — you are naming the class, not the file.',
      keyPoints: ['java Main launches the JVM', 'No .class extension needed'],
      codeExample: 'java Main\n# Output: Hello, CodeQuizHub!',
      codeLang: 'bash',
      code: {
        language: 'bash',
        source: 'java Main',
        output: 'Hello, CodeQuizHub!',
      },
      aiTip:
        'Since Java 11, `java Main.java` compiles AND runs in one step — perfect for quick experiments while learning.',
      practiceHint: 'Run your program twice in a row — nothing about the machine changed, yet the output is identical. Portability!',
      visual: { type: 'terminal' },
    },
    {
      id: 'main-method',
      title: 'Understanding main()',
      start: 2520,
      description:
        'Each word in the main signature has a precise meaning the JVM relies on.',
      explanation:
        'public means any caller — including the JVM — may invoke it. static binds the method to the class itself, so no object needs to exist first. void declares that nothing comes back. String[] args carries command-line launch arguments. Change any piece and the JVM cannot find your entry point.',
      keyPoints: ['public → callable by JVM', 'static → no object needed', 'void → returns nothing', 'String[] args → launch arguments'],
      codeExample: 'public static void main(String[] args) {\n    System.out.println("Args count: " + args.length);\n}',
      codeLang: 'java',
      code: {
        language: 'java',
        source: 'public static void main(String[] args) {\n    System.out.println("Args count: " + args.length);\n}',
        output: 'Args count: 0',
      },
      codeBreakdown: [
        { snippet: 'public static void', explain: 'Visibility, no-instance requirement and empty return type required by the JVM launcher.' },
        { snippet: 'String[] args', explain: 'Array of command-line arguments passed to the program.' },
      ],
      aiTip:
        'Try `java Main hello world` — args.length becomes 2. Command-line tools are just programs reading this array.',
      practiceHint: 'Print args[0] after passing your name as a launch argument.',
      checkpoint: {
        question: 'Where does program execution begin?',
        options: ['In any static block', 'Inside main(String[] args)', 'At the top of the file', 'In the constructor'],
        answer: 1,
        explain: 'The JVM invokes public static void main(String[] args) as the entry point.',
      },
      visual: { type: 'function', items: ['public static void main(String[] args)'] },
    },
    {
      id: 'println',
      title: 'Using System.out.println()',
      start: 2880,
      description:
        'System.out is the standard output stream; println prints with a newline while print stays on the same line.',
      explanation:
        'System.out is Java\'s handle to standard output. println() appends a line break after its argument; print() does not. You can glue values into strings with the + operator — concatenate numbers freely, because Java converts them automatically inside string concatenation.',
      keyPoints: ['print vs println', 'String concatenation with +'],
      codeExample: 'System.out.print("Hello, ");\nSystem.out.println("CodeQuizHub!");\n// → Hello, CodeQuizHub!',
      codeLang: 'java',
      code: {
        language: 'java',
        source: 'System.out.print("Hello, ");\nSystem.out.println("CodeQuizHub!");\nSystem.out.println("2 + 2 = " + (2 + 2));',
        output: 'Hello, CodeQuizHub!\n2 + 2 = 4',
      },
      aiTip:
        'Prefer printf-style formatting ("%d years%n") when mixing many numbers into text — it reads cleaner than long + chains.',
      practiceHint: 'Print your name and age using a single println with concatenation.',
      visual: { type: 'terminal' },
    },
  ],
  quiz: {
    passPercent: 75,
    questions: [
      {
        q: 'What does JVM stand for?',
        options: ['Java Virtual Machine', 'Java Visual Machine', 'Java Variable Method', 'Java Version Manager'],
        answer: 0,
        explanation: 'The Java Virtual Machine executes compiled Java bytecode on any platform.',
      },
      {
        q: 'Which package do you need to WRITE Java applications?',
        options: ['JRE', 'JDK', 'Only the JVM', 'A browser plugin'],
        answer: 1,
        explanation: 'The JDK contains the compiler (javac) and dev tools; the JRE can only run programs.',
      },
      {
        q: 'What does javac produce?',
        options: ['Machine-specific .exe files', 'HTML documentation', 'Portable .class bytecode', 'Zip archives'],
        answer: 2,
        explanation: 'javac compiles .java source files into portable bytecode (.class).',
      },
      {
        q: 'Where does program execution begin?',
        options: ['In any static block', 'Inside main(String[] args)', 'At the top of the file', 'In the constructor'],
        answer: 1,
        explanation: 'The JVM invokes public static void main(String[] args) as the entry point.',
      },
    ],
  },
  resources: [
    { label: 'Official Java Documentation', desc: 'docs.oracle.com — language & API reference', href: 'https://docs.oracle.com/en/java/' },
    { label: 'dev.java Learn Guides', desc: 'Official modern Java learning path', href: 'https://dev.java/learn/' },
    { label: 'Practice Exercises', desc: 'Apply it now in the coding challenge below', internal: 'challenge' },
  ],
};

const pythonIntroVideo = {
  title: 'Python Introduction & Setup',
  durationSeconds: 40 * 60,
  videoUrl: '',
  thumbnail: '',
  transcript: null,
  topics: [
    {
      id: 'python-overview',
      title: 'What is Python?',
      start: 0,
      description: 'A friendly high-level language powering web apps, automation, data science and AI.',
      explanation:
        'Python is a high-level, general-purpose programming language created by Guido van Rossum and released in 1991. It was designed for readability: syntax stays close to plain English, so beginners write useful programs within minutes. Python is interpreted — the interpreter runs your code directly, no compile step. Today it drives web development (Django, Flask), automation scripts, data science (pandas), machine learning (PyTorch) and much more.',
      keyPoints: ['High-level & easy to read', 'Interpreted — no compile step', 'Web · automation · data · AI', 'Huge package ecosystem (PyPI)'],
      code: {
        language: 'python',
        source: 'print("Hello, CodeQuizHub!")',
        output: 'Hello, CodeQuizHub!',
      },
      codeBreakdown: [
        { snippet: 'print(...)', explain: 'A built-in function that writes whatever you give it to the console.' },
        { snippet: '"Hello, CodeQuizHub!"', explain: 'A string literal — text wrapped in quotes is passed straight to print().' },
      ],
      aiTip:
        'Python reads almost like English because indentation replaces curly braces — fewer symbols, more focus on the idea.',
      practiceHint: 'Change the text inside print() to greet yourself, then press Run Example.',
      visual: { type: 'cube', faces: ['PY', '{ }', 'print()', '>>>', '3.x', 'def'] },
    },
    {
      id: 'installing-python',
      title: 'Installing Python',
      start: 480,
      description: 'Download the interpreter, install it and verify everything works from a terminal.',
      explanation:
        'Head to python.org/downloads and grab the latest Python 3 release. On Windows, tick "Add python.exe to PATH" during setup — it lets you run python from any terminal. macOS users can also use brew install python, Linux users their package manager. Verify by asking the interpreter its version: python --version (or python3 --version on mac/Linux).',
      keyPoints: ['Download from python.org', 'Tick "Add to PATH" on Windows', 'Verify with python --version / python3 --version'],
      code: {
        language: 'bash',
        source: '# Check your installation\npython --version\n# macOS / Linux may use:\npython3 --version',
        output: 'Python 3.12.4',
      },
      codeBreakdown: [
        { snippet: 'python --version', explain: 'Prints the installed interpreter version — proof your setup works.' },
        { snippet: 'python3', explain: 'On mac/Linux, python often points to the legacy 2.x, so use python3 explicitly.' },
      ],
      aiTip:
        'If "python is not recognized", the installer\'s Add-to-PATH box was missed — re-run the installer or add Python to PATH manually.',
      practiceHint: 'Open a terminal right now and confirm your own version number.',
      visual: { type: 'terminal' },
    },
    {
      id: 'python-repl',
      title: 'Python REPL',
      start: 1200,
      description: 'An interactive loop that reads, evaluates and prints — perfect for experiments.',
      explanation:
        'Type python in a terminal and you enter the REPL: Read, Evaluate, Print, Loop. It reads a line of Python, evaluates it, prints the result immediately and loops back for more. The >>> prompt is your scratchpad — instant feedback for testing arithmetic, functions or library behaviour without saving a file.',
      keyPoints: ['Read → Evaluate → Print → Loop', '>>> is the interactive prompt', 'Great for experiments & debugging'],
      code: {
        language: 'python',
        source: '>>> 10 + 20',
        output: '30',
      },
      codeBreakdown: [
        { snippet: '>>>', explain: 'The REPL prompt — it is waiting for your next expression.' },
        { snippet: '10 + 20', explain: 'Any expression typed here is evaluated instantly and the value is printed.' },
      ],
      aiTip:
        'The REPL remembers nothing between sessions — treat it as a calculator for trying ideas, then move proven code into a script file.',
      practiceHint: 'Compute 365 * 24 in the REPL to find the hours in a year.',
      checkpoint: {
        question: 'What does REPL stand for?',
        options: ['Read Evaluate Print Loop', 'Run Execute Program Language', 'Read Execute Python Language', 'Runtime Evaluation Programming Logic'],
        answer: 0,
        explain: 'REPL = Read, Evaluate, Print, Loop — the cycle behind Python\'s interactive shell.',
      },
      visual: { type: 'repl' },
    },
    {
      id: 'python-scripts',
      title: 'Python Scripts',
      start: 1920,
      description: 'Save code in a .py file and run it — reusable, shareable programs.',
      explanation:
        'A Python script is simply a text file of Python code ending in .py. Save the example as hello.py, then run python hello.py from the same folder. Unlike the REPL, a script runs top to bottom every time — which makes it a real program you can edit, version and share.',
      keyPoints: ['Scripts live in .py files', 'Run with python filename.py', 'Executes top-to-bottom each run'],
      code: {
        language: 'python',
        source: '# hello.py\nname = "Student"\nprint("Hello", name)',
        output: 'Hello Student',
      },
      codeBreakdown: [
        { snippet: 'name = "Student"', explain: 'Creates a variable called name holding the text Student.' },
        { snippet: 'print("Hello", name)', explain: 'print() accepts multiple values and joins them with spaces.' },
      ],
      aiTip:
        'Name scripts descriptively (greet.py beats test2.py) — future-you debugs faster when files say what they do.',
      practiceHint: 'Create hello.py yourself, change the name value, and rerun it.',
      visual: { type: 'variables', items: ['name = "Student"', 'hello.py'] },
    },
    {
      id: 'print-comments',
      title: 'print() and Comments',
      start: 2640,
      description: 'Output messages with print() and annotate code with # comments.',
      explanation:
        'print() is your window into a program — it shows values while the code runs. Anything after a # on a line is a comment: the interpreter ignores it completely, so comments are notes for humans explaining why the code exists. Good comments explain intent, not mechanics.',
      keyPoints: ['# starts a comment — ignored by Python', 'print() writes to the console', 'Comments document intent for humans'],
      code: {
        language: 'python',
        source: '# This is a comment\nprint("Welcome to CodeQuizHub")',
        output: 'Welcome to CodeQuizHub',
      },
      codeBreakdown: [
        { snippet: '# This is a comment', explain: 'Everything from # to end-of-line is skipped by the interpreter.' },
        { snippet: 'print("Welcome to CodeQuizHub")', explain: 'Sends the string to standard output.' },
      ],
      aiTip:
        'Unlike languages such as Java, Python organises blocks with indentation instead of braces — consistent spacing IS the syntax, so keep it tidy.',
      practiceHint: 'Comment out the print call and run again — notice how silence proves comments do nothing.',
      checkpoint: {
        question: 'Which symbol starts a comment in Python?',
        options: ['//', '<!--', '#', '--'],
        answer: 2,
        explain: 'Python comments start with # — everything after it on that line is ignored.',
      },
      visual: { type: 'cube', faces: ['PY', '#', 'print()', '"""', '::=', 'def'] },
    },
  ],
  quiz: {
    passPercent: 67,
    questions: [
      {
        q: 'What does the REPL give you?',
        options: ['An interactive shell for experiments', 'Faster CPU', 'Free hosting', 'Syntax highlighting only'],
        answer: 0,
        explanation: 'REPL = Read–Eval–Print Loop: type Python and see results instantly.',
      },
      {
        q: 'Which symbol starts a comment?',
        options: ['//', '<!--', '#', '--'],
        answer: 2,
        explanation: 'Python comments start with #.',
      },
      {
        q: 'How do you verify your Python install?',
        options: ['pycheck -v', 'python --version', 'verify py', 'py.run'],
        answer: 1,
        explanation: 'python --version prints the installed interpreter version.',
      },
    ],
  },
  resources: [
    { label: 'Official Python Tutorial', desc: 'docs.python.org — the canonical tutorial', href: 'https://docs.python.org/3/tutorial/' },
    { label: 'Practice Exercises', desc: 'Apply it now in the assignment below', internal: 'assignment' },
  ],
};

const LESSON_VIDEOS = {
  'java/java-basics': javaBasicsVideo,
  'python/python-intro': pythonIntroVideo,
};

/** Generic fallback so EVERY lesson gets a working studio experience. */
const buildFallbackVideo = (roadmap, mod) => {
  const objectives = mod.objectives || [];
  const total = Math.round((mod.minutes || 30) * 60);
  const visuals = [
    { type: 'cube' },
    { type: 'cards', items: objectives.slice(0, 4).map((o) => o.split(' ').slice(0, 2).join(' ')) },
    { type: 'terminal' },
  ];
  return {
    title: mod.title,
    durationSeconds: total,
    videoUrl: '',
    thumbnail: '',
    transcript: null,
    topics: objectives.map((obj, i) => ({
      id: `topic-${i}`,
      title: obj,
      start: Math.round((total / Math.max(objectives.length, 1)) * i),
      description: obj,
      explanation: objectives.length
        ? `This part of "${mod.title}" focuses on ${obj.toLowerCase()}. ${mod.summary || ''}`.trim()
        : mod.summary || '',
      keyPoints: objectives.filter((o) => o !== obj).slice(0, 3),
      code: null,
      aiTip: objectives.length
        ? `While practising "${obj.toLowerCase()}", keep sessions short: read the concept, type the example yourself, then break it on purpose to see what happens.`
        : '',
      practiceHint: '',
      checkpoint: null,
      visual: visuals[i % visuals.length],
    })),
    quiz: null,
    resources: [],
  };
};

/** Fill derived fields so the studio always has a canonical topic shape. */
const normalizeTopic = (t, i) => {
  if (!t) return null;
  const code =
    t.code ||
    (t.codeExample ? { language: t.codeLang || 'text', source: t.codeExample, output: null } : null);
  return {
    ...t,
    id: t.id || `topic-${i}`,
    description: t.description || '',
    explanation: t.explanation || t.description || '',
    keyPoints: t.keyPoints || [],
    code,
    codeBreakdown: t.codeBreakdown || [],
    aiTip: t.aiTip || '',
    practiceHint: t.practiceHint || '',
    checkpoint: t.checkpoint || null,
    diagram: t.diagram || null,
    visual: t.visual || (code ? { type: 'terminal' } : { type: 'cube' }),
  };
};

export const getLessonVideo = (roadmap, mod) => {
  const raw = LESSON_VIDEOS[`${roadmap?.id}/${mod?.id}`] || buildFallbackVideo(roadmap || {}, mod || {});
  return {
    ...raw,
    topics: (raw.topics || []).map(normalizeTopic).filter(Boolean),
  };
};

export const formatTimestamp = (totalSeconds = 0) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
};
