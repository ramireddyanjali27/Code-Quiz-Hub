// ─── Learning Roadmap Data Layer ─────────────────────────────
// Technology → Modules → Lessons (Videos) → Assignments →
// Coding Challenges → Project.
//
// Rich, hand-crafted roadmaps exist for flagship technologies.
// Every other technology gets a generated roadmap so no card is
// ever broken. Progress itself lives in utils/learningStore.js.

import { TECHNOLOGIES } from '../utils/constants';

export const ROADMAP_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', color: '#10b981', blurb: 'Fundamentals & core syntax' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: '#f59e0b', blurb: 'Practical concepts' },
  { value: 'ADVANCED', label: 'Advanced', color: '#f43f5e', blurb: 'Advanced concepts' },
  { value: 'PROJECT', label: 'Project', color: '#8b5cf6', blurb: 'Real-world implementation' },
];

export const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ─── Factories (keep module definitions compact) ─────────────
const asg = (title, difficulty, estimatedMinutes, tasks) => ({
  title,
  difficulty,
  estimatedMinutes,
  tasks,
});

const chal = (title, language, instructions, starterCode, sampleOutput, tests) => ({
  title,
  language,
  instructions,
  starterCode,
  sampleOutput,
  tests,
});

const mod = (id, title, level, minutes, summary, objectives, assignment = null, challenge = null) => ({
  id,
  title,
  level,
  minutes,
  summary,
  objectives,
  assignment,
  challenge,
});

// ══════════════════════════════════════════════════════════════
// JAVA ROADMAP
// ══════════════════════════════════════════════════════════════
const javaRoadmap = {
  id: 'java',
  name: 'Java',
  tagline: 'Complete Java Developer Roadmap',
  description: 'Master Java from fundamentals to advanced development — OOP, collections, multithreading and a real-world final project.',
  modules: [
    mod(
      'java-basics', 'Java Basics', 'BEGINNER', 45,
      'Install the JDK, understand how Java runs on the JVM and write your first program.',
      ['What is Java & where it runs', 'JDK vs JRE vs JVM', 'Installing the JDK & IDE', 'Compiling and running HelloWorld'],
      asg('Environment Setup', 'Beginner', 20, [
        'Install the latest JDK and verify with "java -version"',
        'Create a HelloWorld class with a main method',
        'Compile it with javac and run it with java',
        'Print your name using System.out.println',
      ]),
      chal('Hello, Java!', 'Java',
        ['Declare a main method inside a public class HelloWorld', 'Print exactly: Hello, CodeQuizHub!'],
        'public class HelloWorld {\n    public static void main(String[] args) {\n        // Print your greeting below\n        \n    }\n}',
        'Hello, CodeQuizHub!',
        [{ name: 'Program compiles without errors' }, { name: 'main method declared correctly' }, { name: 'Output matches expected greeting' }]
      )
    ),
    mod(
      'java-variables', 'Variables & Data Types', 'BEGINNER', 35,
      'Store and manipulate data using primitives, wrappers, var and type casting.',
      ['The 8 primitive types', 'Declaration & initialisation', 'Type casting (implicit/explicit)', 'var keyword and constants'],
      asg('Variable Playground', 'Beginner', 25, [
        'Declare variables of every primitive type',
        'Cast an int to a double and back',
        'Use final for a constant and try reassigning it (observe the error)',
        'Swap two numbers without a third variable',
      ])
    ),
    mod('java-operators', 'Operators', 'BEGINNER', 30,
      'Arithmetic, relational, logical and bitwise operators plus operator precedence.',
      ['Arithmetic & modulus operators', 'Relational and equality checks', 'Short-circuit && and ||', 'Ternary operator'],
      asg('Operator Drills', 'Beginner', 20, [
        'Write expressions using each arithmetic operator',
        'Predict then verify short-circuit evaluation output',
        'Build a simple even/odd checker with ternary',
      ])
    ),
    mod('java-control-statements', 'Control Statements', 'BEGINNER', 40,
      'Direct program flow with if/else, switch, while, do-while, for and enhanced-for.',
      ['if / else if / else chains', 'switch statements & expressions', 'Loops: for, while, do-while', 'break, continue & labels'],
      asg('Flow Control Practice', 'Beginner', 30, [
        'Write a grade calculator using switch',
        'Print the first 10 Fibonacci numbers with a loop',
        'Build a number-guessing game loop',
      ]),
      chal('FizzBuzz in Java', 'Java',
        ['Print numbers 1–100', 'Multiples of 3 print Fizz, of 5 print Buzz, of both print FizzBuzz'],
        'public class FizzBuzz {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 15; i++) {\n            // Your logic here\n            \n        }\n    }\n}',
        '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
        [{ name: 'Handles multiples of 3 (Fizz)' }, { name: 'Handles multiples of 5 (Buzz)' }, { name: 'Handles multiples of 15 (FizzBuzz)' }, { name: 'Prints plain numbers otherwise' }]
      )
    ),
    mod('java-methods', 'Methods', 'BEGINNER', 35,
      'Package reusable logic into methods — parameters, return types, overloading and varargs.',
      ['Defining & calling methods', 'Parameters and return values', 'Method overloading', 'Pass-by-value semantics'],
      asg('Method Library', 'Beginner', 30, [
        'Create add(), subtract(), multiply() calculator methods',
        'Overload a greet() method for 0, 1 and 2 parameters',
        'Write an isPrime(int) boolean method',
      ])
    ),
    mod('java-arrays-strings', 'Arrays & Strings', 'BEGINNER', 45,
      'Work with arrays, multidimensional data and the powerful String / StringBuilder APIs.',
      ['Declaring & iterating arrays', '2D arrays', 'String immutability & common methods', 'StringBuilder for efficient concatenation'],
      asg('Data Crunching', 'Beginner', 35, [
        'Find the max/min/average of an int array',
        'Reverse a string three ways (loop, StringBuilder, char array)',
        'Count vowels in a sentence',
      ])
    ),
    mod('java-oop', 'OOP Concepts', 'INTERMEDIATE', 50,
      'Model real-world entities with classes, objects, constructors, encapsulation and access modifiers.',
      ['Classes and Objects', 'Constructors (default & parameterised)', 'Encapsulation with getters/setters', 'Access Modifiers'],
      asg('Java OOP Assignment', 'Intermediate', 30, [
        'Create a Student class (name, age, email)',
        'Implement default + parameterised constructors',
        'Add getter and setter methods',
        'Demonstrate encapsulation by validating age',
      ]),
      chal('Student Class Challenge', 'Java',
        ['Create a Student class with name, age, email', 'Implement constructors and getters/setters', 'Display the student information'],
        'public class Student {\n    private String name;\n    private int age;\n    private String email;\n\n    // TODO: constructors\n\n    // TODO: getters & setters\n\n    public void displayInfo() {\n        // Print student details\n    }\n}',
        'Name: Alice\nAge: 22\nEmail: alice@codequizhub.dev',
        [{ name: 'Private fields encapsulated' }, { name: 'Constructors initialise all fields' }, { name: 'displayInfo prints correct format' }]
      )
    ),
    mod('java-inheritance', 'Inheritance', 'INTERMEDIATE', 40,
      'Reuse behaviour across classes using extends, super, method overriding and the Object class.',
      ['extends & class hierarchies', 'super keyword usage', 'Method overriding rules', 'Object: toString, equals, hashCode'],
      asg('Vehicle Hierarchy', 'Intermediate', 30, [
        'Build Vehicle → Car → ElectricCar hierarchy',
        'Override describe() at each level',
        'Call parent behaviour with super.describe()',
      ])
    ),
    mod('java-polymorphism', 'Polymorphism & Abstraction', 'INTERMEDIATE', 45,
      'One interface, many implementations — dynamic dispatch, abstract classes and abstract methods.',
      ['Runtime polymorphism', 'Upcasting & downcasting', 'Abstract classes & methods', 'instanceof safe casts'],
      asg('Shape Calculator', 'Intermediate', 35, [
        'Create abstract Shape with area()',
        'Extend Circle, Rectangle, Triangle',
        'Process a Shape[] polymorphically printing areas',
      ])
    ),
    mod('java-interfaces-generics', 'Interfaces & Generics', 'INTERMEDIATE', 40,
      'Design flexible APIs with interfaces, default methods and type-safe generic classes.',
      ['Interface contracts', 'Multiple interface implementation', 'default & static interface methods', 'Generic classes & bounded types'],
      asg('Payment Interface', 'Intermediate', 30, [
        'Define Payable interface with pay(double amount)',
        'Implement CreditCard and UPI payments',
        'Create a generic Box<T> container class',
      ])
    ),
    mod('java-exceptions', 'Exception Handling', 'INTERMEDIATE', 40,
      'Keep programs resilient with try/catch/finally, checked vs unchecked exceptions and custom exceptions.',
      ['try / catch / finally flow', 'Checked vs unchecked exceptions', 'throw vs throws', 'Creating custom exceptions'],
      asg('Safe Banking', 'Intermediate', 35, [
        'Create InsufficientFundsException',
        'Withdraw method that throws it on overdraft',
        'Handle it with try/catch and always-log finally',
      ])
    ),
    mod('java-collections', 'Collections Framework', 'ADVANCED', 55,
      'Choose the right structure — List, Set, Map, Queue — and master ArrayList, HashMap and iterators.',
      ['List vs Set vs Map', 'ArrayList & LinkedList internals', 'HashMap put/get mechanics', 'Iterators & Comparable'],
      asg('Inventory System', 'Advanced', 45, [
        'Manage products in a HashMap<String, Double>',
        'Sort products by price with Comparator',
        'Remove duplicates from a list using HashSet',
      ]),
      chal('Word Frequency Counter', 'Java',
        ['Count occurrences of each word in an array', 'Store results in a Map', 'Print words sorted by frequency'],
        'import java.util.*;\n\npublic class WordFrequency {\n    public static void main(String[] args) {\n        String[] words = {"java", "code", "java", "quiz", "java", "code"};\n        // Count and print frequencies\n    }\n}',
        'java: 3\ncode: 2\nquiz: 1',
        [{ name: 'Counts each distinct word' }, { name: 'Uses a Map for storage' }, { name: 'Sorted by frequency descending' }]
      )
    ),
    mod('java-multithreading', 'Multithreading', 'ADVANCED', 60,
      'Run work in parallel with threads, synchronisation, executors and concurrency utilities.',
      ['Thread lifecycle & creation', 'Runnable vs Thread vs ExecutorService', 'synchronised & race conditions', 'volatile, locks & atomic classes'],
      asg('Concurrent Counter', 'Advanced', 45, [
        'Spawn 5 threads incrementing a shared counter 1000×',
        'Observe the race condition',
        'Fix it with AtomicLong or synchronisation',
      ])
    ),
    mod('java-streams-lambdas', 'Lambda Expressions & Streams', 'ADVANCED', 45,
      'Modern functional Java — lambdas, method references and declarative Stream pipelines.',
      ['Lambda syntax & functional interfaces', 'filter / map / reduce pipelines', 'Collectors (toList, groupingBy)', 'Optional for null safety'],
      asg('Stream Analytics', 'Advanced', 40, [
        'Filter a list of names starting with "A"',
        'Map products to prices and sum them',
        'Group employees by department with groupingBy',
      ])
    ),
    mod('java-jdbc', 'JDBC & Databases', 'ADVANCED', 50,
      'Connect Java to real databases — connections, prepared statements, transactions and connection pools.',
      ['JDBC architecture & drivers', 'Connection, Statement, ResultSet', 'PreparedStatement vs SQL injection', 'Transactions & commit/rollback'],
      asg('User DAO', 'Advanced', 45, [
        'Create users table via JDBC DDL',
        'Insert records with PreparedStatement',
        'Read all rows into a List<User>',
        'Wrap multi-statement writes in a transaction',
      ])
    ),
    mod('java-final-project', 'FINAL PROJECT — Library Management System', 'PROJECT', 240,
      'Apply everything you learned: build a console-based Library Management System with persistence.',
      ['Domain modelling (Book, Member, Loan)', 'OOP design with interfaces & exceptions', 'JDBC persistence layer', 'Streams-based reporting features'],
      asg('Capstone Delivery', 'Project', 240, [
        'Model Book / Member / Loan classes',
        'Implement borrow & return workflows with custom exceptions',
        'Persist data using JDBC',
        'Add a "most borrowed books" report using Streams',
      ])
    ),
  ],
};

// ══════════════════════════════════════════════════════════════
// PYTHON ROADMAP
// ══════════════════════════════════════════════════════════════
const pythonRoadmap = {
  id: 'python',
  name: 'Python',
  tagline: 'Python Programming Masterclass Path',
  description: 'Go from zero to building real Python applications — clean syntax, OOP, decorators and API consumption.',
  modules: [
    mod('python-intro', 'Python Introduction & Setup', 'BEGINNER', 40,
      'Install Python, run the REPL and write your first script.',
      ['Why Python is everywhere', 'Installing & running python3', 'REPL vs script files', 'print() and comments'],
      asg('First Steps', 'Beginner', 20, [
        'Verify installation with python --version',
        'Write a script printing a formatted bio card',
        'Experiment in the REPL with arithmetic',
      ])
    ),
    mod('python-variables-types', 'Variables & Data Types', 'BEGINNER', 35,
      'Dynamic typing, core data types and f-string formatting.',
      ['int, float, str, bool', 'Dynamic typing & type()', 'f-strings & formatting', 'Input conversion'],
      asg('Type Explorer', 'Beginner', 25, [
        'Take user input and convert to int/float',
        'Format a report line with f-strings',
        'Check truthiness of empty vs non-empty values',
      ])
    ),
    mod('python-control-flow', 'Conditionals & Loops', 'BEGINNER', 40,
      'Branch with if/elif/else and repeat with while and for…in.',
      ['if / elif / else', 'Comparison & logical operators', 'for loops over ranges', 'while loops & break/continue'],
      asg('Loop Gym', 'Beginner', 30, [
        'Print a multiplication table with nested loops',
        'Build a menu-driven calculator loop',
        'Sum digits of a number using while',
      ]),
      chal('FizzBuzz — Python Edition', 'Python',
        ['Print 1–15', 'Fizz for multiples of 3, Buzz for 5, FizzBuzz for both'],
        '# FizzBuzz 1..15\nfor i in range(1, 16):\n    # your logic here\n    pass',
        '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
        [{ name: 'Multiples of 3 → Fizz' }, { name: 'Multiples of 5 → Buzz' }, { name: 'Multiples of 15 → FizzBuzz' }]
      )
    ),
    mod('python-functions', 'Functions', 'BEGINNER', 35,
      'def, parameters, defaults, *args/**kwargs and scope.',
      ['Defining & returning values', 'Default & keyword arguments', '*args and **kwargs', 'LEGB scoping rule'],
      asg('Utility Belt', 'Beginner', 30, [
        'Write is_palindrome(text)',
        'Create a summarise(*nums) variadic function',
        'Use a default parameter sensibly',
      ])
    ),
    mod('python-data-structures', 'Lists, Tuples, Sets & Dicts', 'BEGINNER', 45,
      'Pick the right built-in collection and use its superpowers.',
      ['List operations & slicing', 'Tuple immutability', 'Set membership & dedupe', 'Dict CRUD & iteration'],
      asg('Collection Lab', 'Beginner', 35, [
        'Dedupe a list with a set while preserving order',
        'Invert a dictionary (values → keys)',
        'Sort a list of tuples by second element',
      ])
    ),
    mod('python-oop', 'OOP in Python', 'INTERMEDIATE', 50,
      'Classes, __init__, instance vs class attributes, inheritance and dunder methods.',
      ['Class & instance attributes', '__init__ and self', 'Inheritance & super()', '__str__ / __repr__ dunders'],
      asg('BankAccount Class', 'Intermediate', 35, [
        'Model BankAccount with deposit/withdraw',
        'Raise ValueError on negative amounts',
        'Add __str__ for readable printing',
      ])
    ),
    mod('python-modules-packages', 'Modules & Packages', 'INTERMEDIATE', 35,
      'Organise code with imports, packages, virtual environments and pip.',
      ['import styles & __name__ == "__main__"', 'Standard library tour', 'pip & virtualenv basics', 'Project folder layout'],
      asg('Package Builder', 'Intermediate', 30, [
        'Split a script into a package with two modules',
        'Install and use a pip package',
        'Guard executable code under main',
      ])
    ),
    mod('python-errors-files', 'Exceptions & File Handling', 'INTERMEDIATE', 40,
      'Handle failures gracefully and persist data with files.',
      ['try / except / else / finally', 'Raising & custom exceptions', 'Reading/writing text files', 'Context managers (with)'],
      asg('Robust Reader', 'Intermediate', 30, [
        'Read a file that may not exist without crashing',
        'Parse numeric lines, skipping bad ones',
        'Write results to an output file with with',
      ])
    ),
    mod('python-decorators-generators', 'Decorators & Generators', 'ADVANCED', 45,
      'Higher-order functions, closures, @decorators and lazy generators.',
      ['Functions as first-class objects', 'Writing @decorator with functools.wraps', 'yield & generator expressions', 'Memory benefits of laziness'],
      asg('Timing Decorator', 'Advanced', 35, [
        'Build @timer that logs execution time',
        'Create a Fibonacci generator',
        'Convert a list build into a generator expression',
      ])
    ),
    mod('python-apis-json', 'APIs & JSON', 'ADVANCED', 40,
      'Talk to web services: requests, status codes, JSON serialisation and error handling.',
      ['HTTP verbs & status codes', 'requests.get workflow', 'Parsing nested JSON', 'Retries & timeouts'],
      asg('Weather CLI', 'Advanced', 40, [
        'Fetch data from a public weather API',
        'Extract nested fields safely with .get()',
        'Handle network errors with retries',
      ])
    ),
    mod('python-testing', 'Testing with pytest', 'ADVANCED', 35,
      'Write trustworthy code with automated tests.',
      ['pytest fixtures & assertions', 'Parametrised tests', 'Arrange-Act-Assert pattern', 'Running & reading test output'],
      asg('Test First', 'Advanced', 30, [
        'Write tests for is_palindrome including edge cases',
        'Parametrise over multiple inputs',
        'Make a failing test pass',
      ])
    ),
    mod('python-final-project', 'FINAL PROJECT — Expense Tracker CLI', 'PROJECT', 180,
      'Build a command-line expense tracker with JSON persistence and reporting.',
      ['Menu-driven CLI design', 'JSON file persistence', 'Monthly category reports', 'Input validation throughout'],
      asg('Capstone Delivery', 'Project', 180, [
        'Implement add/list/filter expense commands',
        'Persist expenses between runs',
        'Generate a monthly spend-by-category report',
      ])
    ),
  ],
};

// ══════════════════════════════════════════════════════════════
// JAVASCRIPT ROADMAP
// ══════════════════════════════════════════════════════════════
const javascriptRoadmap = {
  id: 'javascript',
  name: 'JavaScript',
  tagline: 'Modern JavaScript Developer Roadmap',
  description: 'From language fundamentals to async mastery and DOM apps — everything modern JS.',
  modules: [
    mod('js-fundamentals', 'JS Fundamentals & Setup', 'BEGINNER', 35,
      'How JS runs in browsers & Node, variables and the console.',
      ['Where JavaScript runs', 'let / const / var', 'console debugging', 'Script loading basics'],
      asg('Console Start', 'Beginner', 20, [
        'Log a formatted profile object',
        'Reassign let vs attempt const reassignment',
        'Use template literals for output',
      ])
    ),
    mod('js-types-operators', 'Types & Operators', 'BEGINNER', 30,
      'Dynamic types, coercion quirks and strict equality.',
      ['Primitives vs objects', '== vs === coercion traps', 'typeof null quirk', 'Truthy/falsy values'],
      asg('Coercion Detective', 'Beginner', 25, [
        'Predict outputs of 5 famous coercion snippets',
        'Fix loose-equality bugs with strict equality',
        'Explain typeof null === "object"',
      ])
    ),
    mod('js-conditionals-loops', 'Conditionals & Loops', 'BEGINNER', 35,
      'Branching and iteration, including modern for…of.',
      ['if/else & ternary', 'switch statements', 'for, while, for…of', 'break/continue'],
      asg('Loop Patterns', 'Beginner', 25, [
        'Sum even numbers 1–100',
        'Build a simple menu switch',
        'Iterate a string character by character',
      ])
    ),
    mod('js-functions', 'Functions Deep Dive', 'BEGINNER', 40,
      'Declarations, expressions, arrow functions, parameters and scope.',
      ['Function declarations vs expressions', 'Arrow functions & this', 'Default/rest parameters', 'Hoisting basics'],
      asg('Function Refactor', 'Beginner', 30, [
        'Convert 3 declarations to arrows',
        'Rest-parameter sum(...nums)',
        'Demonstrate closure counter factory',
      ])
    ),
    mod('js-arrays-objects', 'Arrays & Objects', 'BEGINNER', 45,
      'Core data shapes and their essential methods.',
      ['push/pop/map/filter/reduce', 'Spread & destructuring', 'Object literal shortcuts', 'Optional chaining'],
      asg('Data Transformation', 'Beginner', 35, [
        'Double array values with map',
        'Filter products under ₹500',
        'Reduce cart items to total price',
      ]),
      chal('Cart Total Calculator', 'JavaScript',
        ['Given an items array, compute total', 'Apply 10% discount over ₹1000'],
        'const items = [\n  { name: "Keyboard", price: 800 },\n  { name: "Mouse", price: 400 },\n  { name: "Monitor", price: 7000 },\n];\n\nfunction cartTotal(items) {\n  // sum prices, apply discount rule\n}\n\nconsole.log(cartTotal(items));',
        'Subtotal: ₹8200\nDiscount applied: -₹820\nTotal: ₹7380',
        [{ name: 'Sums all item prices' }, { name: 'Applies 10% discount above ₹1000' }, { name: 'Returns formatted total' }]
      )
    ),
    mod('js-dom', 'DOM Manipulation', 'INTERMEDIATE', 40,
      'Select, create and update page elements programmatically.',
      ['querySelector & traversal', 'textContent vs innerHTML safety', 'classList styling', 'Creating/removing nodes'],
      asg('To-Do DOM', 'Intermediate', 35, [
        'Render a tasks array into a <ul>',
        'Toggle done class on click',
        'Delete items with event delegation',
      ])
    ),
    mod('js-events', 'Events & Listeners', 'INTERMEDIATE', 35,
      'Event-driven programming — listeners, objects and delegation.',
      ['addEventListener patterns', 'event.target & bubbling', 'Delegation for dynamic UIs', 'Preventing default'],
      asg('Interactive Form', 'Intermediate', 30, [
        'Validate a form on submit without reload',
        'Live character counter for a textarea',
        'Delegate clicks on a dynamic list',
      ])
    ),
    mod('js-es6-features', 'ES6+ Features', 'INTERMEDIATE', 40,
      'The modern toolkit: destructuring, spread, modules, template literals.',
      ['Destructuring objects & arrays', 'Spread/rest', 'Template literals', 'Import/export modules'],
      asg('Modernise Legacy Code', 'Intermediate', 30, [
        'Rewrite ES5 code with destructuring',
        'Merge configs with spread',
        'Split a file into ES modules',
      ])
    ),
    mod('js-closures-scope', 'Closures & Scope', 'ADVANCED', 35,
      'Lexical environment, closures and the classic loop trap.',
      ['Lexical scope chains', 'Closure use-cases (privacy, memoise)', 'var loop trap & fixes', 'IIFEs'],
      asg('Closure Workshop', 'Advanced', 25, [
        'Create a private counter with closure',
        'Memoise an expensive function',
        'Explain & fix the setTimeout-in-loop bug',
      ])
    ),
    mod('js-promises-async', 'Promises & Async/Await', 'ADVANCED', 45,
      'Asynchronous JavaScript from callback hell to elegant await.',
      ['Promise states & chaining', 'async/await syntax', 'Promise.all / allSettled', 'Error handling strategies'],
      asg('Async Pipeline', 'Advanced', 35, [
        'Chain three promises sequentially',
        'Parallel-fetch with Promise.all',
        'Gracefully handle one failure with allSettled',
      ])
    ),
    mod('js-fetch-api', 'Fetch API & Networking', 'ADVANCED', 40,
      'Real-world HTTP from the browser — fetch, headers, JSON and errors.',
      ['fetch GET/POST basics', 'Checking response.ok', 'Async JSON rendering', 'AbortController timeouts'],
      asg('GitHub Profile Viewer', 'Advanced', 35, [
        'Fetch a GitHub user by username input',
        'Render avatar & repos count',
        'Show friendly 404 state',
      ])
    ),
    mod('js-final-project', 'FINAL PROJECT — Quiz App UI', 'PROJECT', 180,
      'A polished vanilla-JS quiz application with timer and score screen.',
      ['State-driven rendering', 'Timer with cleanup', 'Score calculation & review', 'Accessible keyboard controls'],
      asg('Capstone Delivery', 'Project', 180, [
        'Render questions from a JS array',
        'Track answers & compute score',
        'Add countdown timer per quiz',
        'Show result screen with review',
      ])
    ),
  ],
};

// ══════════════════════════════════════════════════════════════
// REACT ROADMAP
// ══════════════════════════════════════════════════════════════
const reactRoadmap = {
  id: 'react',
  name: 'React',
  tagline: 'React Frontend Developer Roadmap',
  description: 'Component thinking, hooks, routing and performance — build production React apps.',
  modules: [
    mod('react-intro', 'React Introduction & Setup', 'BEGINNER', 35,
      'Why React exists, how Vite scaffolds apps and how rendering works.',
      ['Declarative UI mindset', 'Vite project setup', 'Anatomy of App component', 'StrictMode purpose'],
      asg('Scaffold & Explore', 'Beginner', 20, [
        'Create a Vite React app',
        'Render a welcome card component',
        'Explain what StrictMode double-invokes',
      ])
    ),
    mod('react-jsx-components', 'JSX & Components', 'BEGINNER', 40,
      'JSX rules and composing reusable function components.',
      ['JSX syntax rules (one root, className)', 'Expressions in JSX', 'Props passing', 'Composition over inheritance'],
      asg('Card Gallery', 'Beginner', 30, [
        'Build a ProfileCard component taking props',
        'Compose 3 cards from an array',
        'Conditional badge rendering with &&',
      ])
    ),
    mod('react-state-events', 'State & Events', 'BEGINNER', 40,
      'useState, controlled events and immutable updates.',
      ['useState initialisation', 'Updating via setter functions', 'Functional updates', 'Immutable array/object state'],
      asg('Counter Plus', 'Beginner', 30, [
        'Counter with +1/-1/reset',
        'Step-controlled increment',
        'Todo list add/remove with immutable updates',
      ])
    ),
    mod('react-hooks-deep', 'Hooks Deep Dive', 'INTERMEDIATE', 45,
      'useEffect lifecycles, dependencies and custom hooks.',
      ['Effect dependency arrays', 'Cleanup functions', 'Fetching data in effects', 'Custom hook extraction'],
      asg('Data Fetcher', 'Intermediate', 35, [
        'Fetch and display API data on mount',
        'Add loading & error states',
        'Extract useFetch(url) custom hook',
      ])
    ),
    mod('react-forms', 'Forms & Controlled Inputs', 'INTERMEDIATE', 35,
      'Controlled components, validation and form libraries overview.',
      ['Controlled inputs', 'Handling submit & validation', 'Multiple fields with one state object', 'Libraries: RHF intro'],
      asg('Signup Form', 'Intermediate', 30, [
        'Controlled registration form',
        'Inline validation messages',
        'Disable submit until valid',
      ])
    ),
    mod('react-lists-keys', 'Lists, Keys & Conditional UI', 'INTERMEDIATE', 30,
      'Rendering collections correctly and why keys matter.',
      ['Mapping arrays to elements', 'Key reconciliation explained', 'Empty-state rendering', 'Nested conditional rendering'],
      asg('Searchable Table', 'Intermediate', 30, [
        'Render users table from data',
        'Filter with search input',
        'Show empty state when no match',
      ])
    ),
    mod('react-context', 'Context API & Prop Drilling', 'ADVANCED', 40,
      'Share state across the tree without prop drilling.',
      ['createContext & Provider', 'useContext consumer', 'Theme example', 'When NOT to use context'],
      asg('Theme Switcher', 'Advanced', 30, [
        'Create ThemeContext light/dark',
        'Consume in navbar & cards',
        'Persist choice to localStorage',
      ])
    ),
    mod('react-router-app', 'Routing with React Router', 'ADVANCED', 40,
      'Multi-page SPA navigation — routes, params and protected routes.',
      ['BrowserRouter & Routes', 'Route params (useParams)', 'NavLink active states', 'Protected route pattern'],
      asg('Mini Blog Router', 'Advanced', 35, [
        'Home + post detail routes',
        'Read :id param to load content',
        'Redirect unknown posts to not-found',
      ])
    ),
    mod('react-performance', 'Performance & Optimization', 'ADVANCED', 40,
      'memo, useMemo, useCallback and measuring renders.',
      ['Unnecessary render causes', 'React.memo & memoization hooks', 'Keys & list perf', 'React DevTools profiling'],
      asg('Profile & Fix', 'Advanced', 35, [
        'Find wasted renders with Profiler',
        'Memoise expensive derived data',
        'Stabilise callbacks with useCallback',
      ])
    ),
    mod('react-final-project', 'FINAL PROJECT — Task Manager Dashboard', 'PROJECT', 200,
      'Full React app: routing, context, filters, localStorage persistence.',
      ['Feature-first folder structure', 'Global filter state', 'Persistence with localStorage', 'Polished empty & loading states'],
      asg('Capstone Delivery', 'Project', 200, [
        'Task CRUD with categories',
        'Dashboard stats panel',
        'Persist tasks across refreshes',
        'Responsive two-pane layout',
      ])
    ),
  ],
};

// ══════════════════════════════════════════════════════════════
// SQL ROADMAP
// ══════════════════════════════════════════════════════════════
const sqlRoadmap = {
  id: 'sql',
  name: 'SQL',
  tagline: 'SQL & Relational Database Roadmap',
  description: 'Query, model and optimise relational data like a professional.',
  modules: [
    mod('sql-intro', 'Databases & SQL Introduction', 'BEGINNER', 35,
      'Relational concepts, tables, keys and your first SELECT.',
      ['Tables, rows & columns', 'Primary/foreign keys', 'SELECT & FROM', 'Sampling with LIMIT'],
      asg('First Queries', 'Beginner', 25, [
        'SELECT all columns from customers',
        'Project only name & city',
        'Limit results to 10 rows',
      ])
    ),
    mod('sql-filtering-sorting', 'Filtering & Sorting', 'BEGINNER', 35,
      'WHERE clauses, operators, LIKE patterns and ORDER BY.',
      ['WHERE with AND/OR/NOT', 'IN, BETWEEN, IS NULL', 'LIKE wildcards', 'ORDER BY multi-column'],
      asg('Query Clinic', 'Beginner', 30, [
        'Find orders above ₹5000 in 2024',
        'Pattern-match emails ending @gmail.com',
        'Sort by date desc, price asc',
      ])
    ),
    mod('sql-joins', 'Joins', 'INTERMEDIATE', 45,
      'Combine tables — INNER, LEFT, RIGHT, FULL and self joins.',
      ['INNER JOIN matching', 'LEFT JOIN & unmatched rows', 'Multi-table chains', 'Self join for hierarchies'],
      asg('Report Builder', 'Intermediate', 40, [
        'Join orders ↔ customers ↔ products',
        'Left join to find customers without orders',
        'Self join employees→managers',
      ])
    ),
    mod('sql-aggregates', 'Aggregates & Grouping', 'INTERMEDIATE', 40,
      'COUNT/SUM/AVG with GROUP BY and filtering groups with HAVING.',
      ['Aggregate functions', 'GROUP BY mechanics', 'HAVING vs WHERE', 'Grouping sets preview'],
      asg('Sales Analytics', 'Intermediate', 35, [
        'Revenue per product category',
        'Customers with >5 orders (HAVING)',
        'Monthly sales trend query',
      ])
    ),
    mod('sql-subqueries', 'Subqueries & CTEs', 'INTERMEDIATE', 40,
      'Nested queries and readable CTE pipelines.',
      ['Scalar & correlated subqueries', 'EXISTS / NOT EXISTS', 'CTEs with WITH', 'Window function teaser'],
      asg('Deep Dive Queries', 'Intermediate', 35, [
        'Products priced above average (subquery)',
        'Departments with employees (EXISTS)',
        'Rewrite a subquery as a CTE',
      ])
    ),
    mod('sql-dml-ddl', 'Modifying Data & Schema', 'ADVANCED', 40,
      'INSERT/UPDATE/DELETE plus CREATE/ALTER table design.',
      ['INSERT variants & defaults', 'Safe UPDATE/DELETE with WHERE', 'CREATE TABLE constraints', 'ALTER & migrations mindset'],
      asg('Schema Designer', 'Advanced', 40, [
        'Design students & courses schema',
        'Enforce FK constraint',
        'Bulk insert sample rows',
      ])
    ),
    mod('sql-indexes-performance', 'Indexes & Query Performance', 'ADVANCED', 45,
      'Make queries fast — indexes, plans and anti-patterns.',
      ['B-tree index intuition', 'EXPLAIN plan reading', 'Index selectivity', 'N+1 & SELECT * pitfalls'],
      asg('Speed Run', 'Advanced', 35, [
        'Benchmark query before/after index',
        'Interpret EXPLAIN output',
        'Refactor a slow LIKE \'%x%\' query',
      ])
    ),
    mod('sql-transactions', 'Transactions & Concurrency', 'ADVANCED', 40,
      'ACID guarantees, isolation levels and locking basics.',
      ['ACID properties', 'COMMIT / ROLLBACK', 'Isolation levels', 'Deadlock avoidance'],
      asg('Money Mover', 'Advanced', 30, [
        'Transfer funds atomically in a transaction',
        'Force an error mid-way and roll back',
        'Explain read phenomena per isolation level',
      ])
    ),
    mod('sql-window-functions', 'Window Functions', 'ADVANCED', 40,
      'Row-aware analytics — OVER, PARTITION BY and ranking.',
      ['ROW_NUMBER / RANK / DENSE_RANK', 'PARTITION BY groups', 'Running totals & moving averages', 'Top-N per group pattern'],
      asg('Analytics Power-Up', 'Advanced', 35, [
        'Rank employees by salary per dept',
        'Compute cumulative monthly revenue',
        "Latest order per customer (ROW_NUMBER trick)",
      ])
    ),
    mod('sql-final-project', 'FINAL PROJECT — E-commerce Schema', 'PROJECT', 160,
      'Design and populate a complete store database with analytical views.',
      ['ER modelling for shop domain', 'Normalised schema (3NF)', 'Views for dashboards', 'Seed data & integrity checks'],
      asg('Capstone Delivery', 'Project', 160, [
        'Model products/orders/customers/payments ERD',
        'Create tables with constraints',
        'Build revenue dashboard view',
        'Write 10 business questions answered in SQL',
      ])
    ),
  ],
};

// ══════════════════════════════════════════════════════════════
// GENERATED ROADMAPS — every remaining technology works too
// ══════════════════════════════════════════════════════════════

// Curated topic outlines per technology (id-safe slugs auto-derived)
const TOPIC_OUTLINES = {
  'Spring Boot': {
    tagline: 'Spring Boot Backend Developer Roadmap',
    description: 'Production-grade REST services with Spring Boot — controllers, JPA, security and testing.',
    topics: [
      ['Spring Boot Introduction', 'BEGINNER', ['Why Spring Boot', 'Auto-configuration magic', 'Spring Initializr setup', 'Project anatomy']],
      ['Dependencies & Configuration', 'BEGINNER', ['Starters explained', 'application.properties/yml', 'Profiles per environment']],
      ['REST Controllers', 'INTERMEDIATE', ['@RestController & mappings', 'Request params & bodies', 'ResponseEntity patterns']],
      ['Spring Data JPA', 'INTERMEDIATE', ['Entities & repositories', 'Query derivation', 'Pagination & sorting']],
      ['Validation & Error Handling', 'INTERMEDIATE', ['Bean Validation annotations', '@ControllerAdvice', 'Consistent error payloads']],
      ['Security Basics', 'ADVANCED', ['Spring Security filter chain', 'JWT authentication flow', 'Role-based access']],
      ['Testing REST APIs', 'ADVANCED', ['@SpringBootTest slices', 'MockMvc flows', 'Testcontainers preview']],
    ],
  },
  HTML: {
    tagline: 'HTML Essentials Learning Path',
    description: 'Structure the web with semantic, accessible HTML5 documents.',
    topics: [
      ['HTML Document Structure', 'BEGINNER', ['Doctype & head/body', 'Meta tags & viewport', 'Boilerplate anatomy']],
      ['Text & Semantic Elements', 'BEGINNER', ['Headings & paragraphs', 'article/section/nav/footer', 'Accessibility meaning']],
      ['Links, Images & Media', 'BEGINNER', ['Anchor targets & rel', 'Responsive images srcset', 'Audio/video elements']],
      ['Tables & Forms', 'INTERMEDIATE', ['Table semantics', 'Form controls & labels', 'Validation attributes']],
      ['Semantic Layout Project', 'INTERMEDIATE', ['Page landmarks', 'Skip links', 'ARIA roles basics']],
      ['SEO & Meta Foundations', 'ADVANCED', ['Title & description craft', 'Open Graph tags', 'Structured data intro']],
      ['Accessible HTML Audit', 'ADVANCED', ['Contrast & alt text', 'Keyboard navigability', 'Screen-reader testing']],
    ],
  },
  CSS: {
    tagline: 'CSS Styling Mastery Roadmap',
    description: 'From selectors to layouts and animations — style beautiful responsive sites.',
    topics: [
      ['Selectors & Specificity', 'BEGINNER', ['Element/class/id selectors', 'Combinators', 'Specificity cascade']],
      ['Box Model & Units', 'BEGINNER', ['Margin/border/padding', 'px vs % vs rem/em', 'box-sizing border-box']],
      ['Flexbox Layout', 'INTERMEDIATE', ['Main & cross axis', 'justify/align properties', 'flex-grow/shrink basis']],
      ['Grid Layout', 'INTERMEDIATE', ['Tracks & fr units', 'Template areas', 'Auto-placement']],
      ['Transitions & Animations', 'ADVANCED', ['Transition shorthand', '@keyframes', 'Transforms & 3D basics']],
      ['Responsive Design', 'ADVANCED', ['Media queries', 'Mobile-first workflow', 'Container queries preview']],
    ],
  },
  MySQL: {
    tagline: 'MySQL Database Administration & Querying Path',
    description: 'Master MySQL from CRUD to performance tuning and administration.',
    topics: [
      ['MySQL Setup & Clients', 'BEGINNER', ['Server install & service', 'Workbench & CLI clients', 'Creating databases']],
      ['CRUD Operations', 'BEGINNER', ['INSERT/UPDATE/DELETE', 'SELECT essentials', 'Safe update mode']],
      ['Data Types & Constraints', 'INTERMEDIATE', ['Numeric/string/date types', 'PK/FK/unique/not null', 'ENUM trade-offs']],
      ['Joins & Complex Queries', 'INTERMEDIATE', ['All join types', 'UNION combinations', 'Derived tables']],
      ['Stored Procedures & Triggers', 'ADVANCED', ['Procedure syntax', 'Trigger automation', 'Cursor cautions']],
      ['Backup & Performance', 'ADVANCED', ['mysqldump workflows', 'Slow query log', 'Index strategy']],
    ],
  },
  'Data Structures': {
    tagline: 'Data Structures Complete Roadmap',
    description: 'Understand how data is organised for speed — arrays to graphs with Big-O intuition.',
    topics: [
      ['Complexity & Big-O Basics', 'BEGINNER', ['Time vs space complexity', 'Common complexity classes', 'Analysing simple loops']],
      ['Arrays & Dynamic Arrays', 'BEGINNER', ['Indexing & resizing', 'Amortised analysis', 'Two-pointer patterns']],
      ['Linked Lists', 'INTERMEDIATE', ['Singly/doubly variants', 'Reversal algorithms', 'Cycle detection']],
      ['Stacks & Queues', 'INTERMEDIATE', ['LIFO/FIFO implementations', 'Balanced parentheses', 'Monotonic stack intro']],
      ['Trees & BSTs', 'ADVANCED', ['Traversals (DFS/BFS)', 'BST invariants', 'Balanced trees overview']],
      ['Heaps, Hash Tables & Graphs', 'ADVANCED', ['Heap operations', 'Hash collisions', 'Graph representations']],
    ],
  },
  Algorithms: {
    tagline: 'Algorithms Problem-Solving Roadmap',
    description: 'Sorting, searching and algorithmic thinking for interviews.',
    topics: [
      ['Algorithm Analysis Foundations', 'BEGINNER', ['Measuring efficiency', 'Best/avg/worst cases', 'Recursion fundamentals']],
      ['Sorting Algorithms', 'INTERMEDIATE', ['Bubble/selection/insertion', 'Merge sort divide-conquer', 'Quick sort partitioning']],
      ['Binary Search Family', 'INTERMEDIATE', ['Classic binary search', 'Boundary variants', 'Search on answer space']],
      ['Recursion & Backtracking', 'ADVANCED', ['Subsets/permutations', 'Pruning strategies', 'N-Queens case study']],
      ['Dynamic Programming', 'ADVANCED', ['Memoisation vs tabulation', 'Classic DP problems', 'Space optimisation']],
      ['Greedy & Graph Algorithms', 'ADVANCED', ['Greedy proofs intuition', 'BFS/DFS applications', 'Dijkstra shortest path']],
    ],
  },
  C: {
    tagline: 'C Programming Fundamentals Roadmap',
    description: 'Learn the language that powers systems — memory, pointers and low-level control.',
    topics: [
      ['C Setup & Compilation', 'BEGINNER', ['gcc toolchain', 'Compilation pipeline', 'First program deep-dive']],
      ['Variables, Types & Control Flow', 'BEGINNER', ['Core types & printf/scanf', 'if/switch/loops', 'Function basics']],
      ['Arrays & Strings', 'INTERMEDIATE', ['Array-memory relationship', 'Char arrays & \\0', 'Library functions']],
      ['Pointers & Memory', 'INTERMEDIATE', ['Address-of & dereference', 'Pointer arithmetic', 'malloc/free lifecycle']],
      ['Structs, Unions & Files', 'ADVANCED', ['Custom types', 'File I/O streams', 'Bit manipulation']],
    ],
  },
  'C++': {
    tagline: 'C++ Modern Development Roadmap',
    description: 'Systems power with modern C++ — RAII, STL and templates.',
    topics: [
      ['C++ Foundations', 'BEGINNER', ['iostream & namespaces', 'References vs pointers', 'Compilation with g++']],
      ['Classes & RAII', 'INTERMEDIATE', ['Constructors/destructors', 'Rule of three/five', 'Smart pointers']],
      ['STL Containers & Algorithms', 'INTERMEDIATE', ['vector/map/set usage', 'Iterator categories', '<algorithm> highlights']],
      ['Templates & Generics', 'ADVANCED', ['Function templates', 'Class templates', 'Concepts preview']],
      ['Concurrency & Modern Features', 'ADVANCED', ['std::thread basics', 'Move semantics', 'constexpr programming']],
    ],
  },
  'C#': {
    tagline: 'C# & .NET Application Roadmap',
    description: 'Build robust applications with C# — OOP, LINQ and async patterns.',
    topics: [
      ['C# & .NET Basics', 'BEGINNER', ['SDK & project system', 'Console I/O', 'Type fundamentals']],
      ['Classes & OOP', 'INTERMEDIATE', ['Properties & accessors', 'Interfaces & inheritance', 'Records intro']],
      ['Collections & LINQ', 'INTERMEDIATE', ['Generic collections', 'Query & method syntax', 'Deferred execution']],
      ['Async & Exception Patterns', 'ADVANCED', ['Task-based async', 'Exception filters', 'using & disposal']],
      ['Building a Web API', 'ADVANCED', ['Minimal APIs', 'Dependency injection', 'EF Core preview']],
    ],
  },
  'Node.js': {
    tagline: 'Node.js Backend Runtime Roadmap',
    description: 'Server-side JavaScript — modules, APIs, streams and npm ecosystem.',
    topics: [
      ['Node Runtime Essentials', 'BEGINNER', ['V8 + libuv event loop', 'npm & package.json', 'CommonJS vs ESM']],
      ['File & Path Operations', 'BEGINNER', ['fs sync vs async', 'path utilities', 'Streaming large files']],
      ['HTTP Servers & Express', 'INTERMEDIATE', ['http module basics', 'Express routing', 'Middleware pattern']],
      ['REST API with Validation', 'INTERMEDIATE', ['CRUD endpoints', 'Input validation', 'Error middleware']],
      ['Auth & Databases', 'ADVANCED', ['JWT sessions', 'MongoDB/Postgres drivers', 'Env config management']],
      ['Performance & Deployment', 'ADVANCED', ['Cluster mode', 'Logging & monitoring', 'Docker deployment basics']],
    ],
  },
  Git: {
    tagline: 'Git Version Control Roadmap',
    description: 'Collaborate like a pro — commits, branches, rebases and team workflows.',
    topics: [
      ['Git Fundamentals', 'BEGINNER', ['init/clone/status', 'Staging & committing', 'History inspection']],
      ['Branching & Merging', 'INTERMEDIATE', ['Branch models', 'Fast-forward vs 3-way merges', 'Resolving conflicts']],
      ['Remotes & Collaboration', 'INTERMEDIATE', ['Push/pull/fetch', 'Pull requests flow', 'Code review etiquette']],
      ['Rewriting History', 'ADVANCED', ['Rebase vs merge', 'Interactive rebase', 'Cherry-picking & revert']],
      ['Team Workflows', 'ADVANCED', ['Gitflow vs trunk-based', 'Tags & releases', 'Hooks & CI triggers']],
    ],
  },
  Docker: {
    tagline: 'Docker Containerisation Roadmap',
    description: 'Ship consistent environments — images, containers, volumes and compose.',
    topics: [
      ['Containers vs VMs', 'BEGINNER', ['Why containers win', 'Daemon/client architecture', 'Running first container']],
      ['Images & Dockerfile', 'INTERMEDIATE', ['Layer caching', 'Writing efficient Dockerfiles', 'Tagging & registries']],
      ['Volumes & Networking', 'INTERMEDIATE', ['Bind mounts vs volumes', 'Bridge networks', 'Port mapping']],
      ['Docker Compose', 'ADVANCED', ['Multi-service stacks', 'depends_on & healthchecks', 'Dev overrides']],
      ['Production Practices', 'ADVANCED', ['Image scanning', 'Multi-stage builds', 'Orchestration preview (K8s)']],
    ],
  },
  OOP: {
    tagline: 'Object-Oriented Programming Principles Path',
    description: 'Language-agnostic OOP mastery — pillars, SOLID and design thinking.',
    topics: [
      ['Classes & Objects Thinking', 'BEGINNER', ['State + behaviour model', 'Instantiation lifecycle', 'UML-lite sketching']],
      ['Encapsulation & Abstraction', 'BEGINNER', ['Information hiding', 'Interface vs implementation', 'Getter/setter discipline']],
      ['Inheritance & Composition', 'INTERMEDIATE', ['is-a vs has-a', 'Composition over inheritance', 'Diamond problem']],
      ['Polymorphism in Practice', 'INTERMEDIATE', ['Static vs dynamic dispatch', 'Substitution principle', 'Strategy pattern intro']],
      ['SOLID Principles', 'ADVANCED', ['Each principle with examples', 'Code smells detection', 'Refactoring kata']],
    ],
  },
  DBMS: {
    tagline: 'Database Management Systems Theory Path',
    description: 'Core DBMS concepts for exams and interviews — ER models to normalisation.',
    topics: [
      ['DBMS Architecture', 'BEGINNER', ['Storage hierarchy', 'Schema vs instance', 'DDL/DML/DCL overview']],
      ['ER Modelling', 'BEGINNER', ['Entities & attributes', 'Relationship cardinality', 'ER → table mapping']],
      ['Relational Algebra', 'INTERMEDIATE', ['Selection/projection/join operators', 'Set operations', 'Equivalences']],
      ['Normalisation', 'INTERMEDIATE', ['1NF → 2NF → 3NF', 'BCNF edge cases', 'Denormalisation trade-offs']],
      ['Transactions & Recovery', 'ADVANCED', ['ACID internals', 'Log-based recovery', 'Serialisability']],
    ],
  },
  'Operating Systems': {
    tagline: 'Operating Systems Concepts Roadmap',
    description: 'Processes, scheduling, memory and file systems — the OS interview kit.',
    topics: [
      ['OS Overview & Architecture', 'BEGINNER', ['Kernel vs user mode', 'System calls', 'Types of OS']],
      ['Processes & Threads', 'INTERMEDIATE', ['PCB & states', 'Threads vs processes', 'Context switching cost']],
      ['CPU Scheduling', 'INTERMEDIATE', ['FCFS/SJF/Round Robin', 'Priority & starvation', 'Metrics computation']],
      ['Memory Management', 'ADVANCED', ['Paging & segmentation', 'Virtual memory & TLB', 'Page replacement policies']],
      ['Deadlocks & Sync', 'ADVANCED', ['Coffman conditions', 'Banker\'s algorithm', 'Mutexes vs semaphores']],
    ],
  },
  'Computer Networks': {
    tagline: 'Computer Networks Fundamentals Roadmap',
    description: 'How data moves across the world — layers, protocols and troubleshooting.',
    topics: [
      ['Network Models & Topologies', 'BEGINNER', ['OSI vs TCP/IP stacks', 'Topology types', 'Packet journey visualised']],
      ['Data Link & IP Layer', 'INTERMEDIATE', ['MAC addressing', 'IPv4 addressing & subnetting', 'ARP & routing basics']],
      ['Transport Protocols', 'INTERMEDIATE', ['TCP reliability mechanics', 'UDP use cases', 'Ports & sockets']],
      ['Application Protocols', 'ADVANCED', ['DNS resolution chain', 'HTTP/HTTPS & TLS handshake', 'Email protocol tour']],
      ['Network Security & Tools', 'ADVANCED', ['Firewalls & NAT', 'Common attacks', 'Wireshark/traceroute labs']],
    ],
  },
};

const GENERIC_OUTLINE = {
  topics: [
    ['Getting Started & Tooling', 'BEGINNER', ['Environment setup', 'Core vocabulary', 'First working example']],
    ['Core Concepts I', 'BEGINNER', ['Foundational building blocks', 'Reading official docs', 'Guided mini-exercise']],
    ['Core Concepts II', 'BEGINNER', ['Everyday patterns', 'Common pitfalls', 'Practice problems']],
    ['Working Like a Pro', 'INTERMEDIATE', ['Project structure', 'Debugging techniques', 'Tooling ecosystem']],
    ['Intermediate Techniques', 'INTERMEDIATE', ['Real-world scenarios', 'Performance awareness', 'Best practices']],
    ['Ecosystem & Libraries', 'ADVANCED', ['Popular libraries/tools', 'Choosing dependencies wisely', 'Integration exercise']],
    ['Capstone Preparation', 'ADVANCED', ['Planning your project', 'Architecture sketch', 'Checklist & milestones']],
    ['FINAL PROJECT — Applied Build', 'PROJECT', ['Scope definition', 'Implementation sprints', 'Review & next steps']],
  ],
};

function generateRoadmap(tech) {
  const outline = TOPIC_OUTLINES[tech.name] || GENERIC_OUTLINE;
  const modules = outline.topics.map(([title, level, objectives], i) => {
    const minutes = level === 'PROJECT' ? 150 : 35 + ((i * 13) % 4) * 10;
    const id = `${slugify(tech.name)}-${slugify(title)}`;
    const programmable = !['OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'Git'].includes(tech.name);
    return mod(
      id,
      title,
      level,
      minutes,
      `Study ${title} through a focused video lesson, then reinforce it with the guided assignment${programmable ? ' and coding practice' : ''}.`,
      objectives,
      asg(`${title} — Guided Assignment`, level === 'ADVANCED' ? 'Advanced' : level === 'INTERMEDIATE' ? 'Intermediate' : 'Beginner', Math.max(20, Math.round(minutes * 0.75)), [
        ...objectives.map((o) => o),
      ].slice(0, 4).map((o) => `Practice: ${o}`)),
      programmable
        ? chal(`${title} — Coding Practice`, tech.name,
            [`Complete the starter ${tech.name} snippet for ${title}`, 'Match the sample output exactly'],
            `// ${title} — ${tech.name} practice\n// Implement your solution below\n`,
            '(sample output appears here after you run your solution)',
            [{ name: 'Solution compiles/runs cleanly' }, { name: 'Produces expected output' }]
          )
        : null
    );
  });
  return {
    id: slugify(tech.name),
    name: tech.name,
    icon: tech.icon,
    color: tech.color,
    generated: true,
    tagline: outline.tagline || `${tech.name} Complete Learning Roadmap`,
    description: outline.description || `A structured path to master ${tech.name}, step by step.`,
    modules,
  };
}

// ══════════════════════════════════════════════════════════════
// REGISTRY & HELPERS
// ══════════════════════════════════════════════════════════════
const CUSTOM_ROADMAPS = [javaRoadmap, pythonRoadmap, javascriptRoadmap, reactRoadmap, sqlRoadmap];

// Attach icon/color metadata to custom roadmaps
CUSTOM_ROADMAPS.forEach((r) => {
  const meta = TECHNOLOGIES.find((t) => t.name === r.name);
  r.icon = meta?.icon || '📘';
  r.color = meta?.color || '#6366f1';
  r.generated = false;
});

const ALL_ROADMAPS = TECHNOLOGIES.map((t) => {
  const custom = CUSTOM_ROADMAPS.find((r) => r.id === slugify(t.name));
  return custom || generateRoadmap(t);
});

export const getRoadmapById = (id) => ALL_ROADMAPS.find((r) => r.id === id);

export const getLevelGroups = (roadmap) =>
  ROADMAP_LEVELS.map((lvl) => ({
    ...lvl,
    modules: roadmap.modules.filter((m) => m.level === lvl.value),
  })).filter((g) => g.modules.length > 0);

export const getAdjacentModules = (roadmap, moduleId) => {
  const idx = roadmap.modules.findIndex((m) => m.id === moduleId);
  return {
    prev: idx > 0 ? roadmap.modules[idx - 1] : null,
    next: idx >= 0 && idx < roadmap.modules.length - 1 ? roadmap.modules[idx + 1] : null,
  };
};

export const formatMinutes = (m) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return mins ? `${h}h ${mins}m` : `${h}h`;
};

export const estimateHours = (roadmap) =>
  Math.round(roadmap.modules.reduce((sum, m) => sum + m.minutes, 0) / 60);

export const countByLevel = (roadmap, level) =>
  roadmap.modules.filter((m) => m.level === level).length;

export const ALL_ROADMAP_LIST = ALL_ROADMAPS;

export default ALL_ROADMAPS;
