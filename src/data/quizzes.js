// ─── Quiz Practice Data Layer ────────────────────────────────
// Single source of truth for quizzes & questions (practice side).
// Completely separate from learning roadmaps — this is about
// TESTING knowledge: timers, scores, attempts, weak topics.

export const QUIZ_TYPES = [
  { value: 'Topic Practice', icon: '🎯', desc: 'Focused drills on one topic' },
  { value: 'Level Test', icon: '📏', desc: 'Measure your level in a technology' },
  { value: 'Mock Test', icon: '📝', desc: 'Exam-style mixed coverage' },
  { value: 'Interview Practice', icon: '💼', desc: 'Frequently asked interview questions' },
  { value: 'Timed Challenge', icon: '⚡', desc: 'Beat the clock, prove your speed' },
];

export const QUIZZES = [
  {
    id: 1,
    title: 'Java OOP Basics',
    technology: 'Java',
    difficulty: 'BEGINNER',
    quizType: 'Topic Practice',
    duration: 10,
    passingScore: 60,
    description: 'Test your knowledge of Java Object-Oriented Programming concepts including classes, objects, inheritance, polymorphism, and encapsulation.',
  },
  {
    id: 2,
    title: 'JavaScript ES6+ Features',
    technology: 'JavaScript',
    difficulty: 'INTERMEDIATE',
    quizType: 'Topic Practice',
    duration: 15,
    passingScore: 65,
    description: 'Master modern JavaScript features including arrow functions, destructuring, template literals, modules, promises, and async/await.',
  },
  {
    id: 3,
    title: 'Data Structures - Arrays & Linked Lists',
    technology: 'Data Structures',
    difficulty: 'ADVANCED',
    quizType: 'Level Test',
    duration: 20,
    passingScore: 70,
    description: 'Deep dive into arrays, linked lists, their operations, time complexities, and real-world applications.',
  },
  {
    id: 4,
    title: 'Python Fundamentals',
    technology: 'Python',
    difficulty: 'BEGINNER',
    quizType: 'Level Test',
    duration: 10,
    passingScore: 60,
    description: 'Learn Python basics including variables, data types, control flow, functions, and lists.',
  },
  {
    id: 5,
    title: 'Spring Boot REST APIs',
    technology: 'Spring Boot',
    difficulty: 'INTERMEDIATE',
    quizType: 'Interview Practice',
    duration: 15,
    passingScore: 65,
    description: 'Build and test REST APIs with Spring Boot including controllers, services, repositories, and error handling.',
  },
  {
    id: 6,
    title: 'React Hooks & Components',
    technology: 'React',
    difficulty: 'INTERMEDIATE',
    quizType: 'Topic Practice',
    duration: 15,
    passingScore: 65,
    description: 'Understand React hooks, functional components, state management, and lifecycle methods.',
  },
  {
    id: 7,
    title: 'SQL Queries & Joins',
    technology: 'SQL',
    difficulty: 'BEGINNER',
    quizType: 'Mock Test',
    duration: 10,
    passingScore: 60,
    description: 'Master SQL queries, joins, aggregations, and database operations.',
  },
  {
    id: 8,
    title: 'Algorithms - Sorting & Searching',
    technology: 'Algorithms',
    difficulty: 'ADVANCED',
    quizType: 'Timed Challenge',
    duration: 20,
    passingScore: 70,
    description: 'Tackle sorting algorithms, binary search, complexity analysis, and algorithm optimization.',
  },
  {
    id: 9,
    title: 'Java Collections Framework',
    technology: 'Java',
    difficulty: 'INTERMEDIATE',
    quizType: 'Interview Practice',
    duration: 12,
    passingScore: 65,
    description: 'Explore Java collections including ArrayList, HashMap, LinkedList, HashSet, and their use cases.',
  },
  {
    id: 10,
    title: 'HTML Fundamentals',
    technology: 'HTML',
    difficulty: 'BEGINNER',
    quizType: 'Topic Practice',
    duration: 8,
    passingScore: 60,
    description: 'Semantic HTML structure, forms, media elements and accessibility essentials.',
  },
  {
    id: 11,
    title: 'CSS Styling Essentials',
    technology: 'CSS',
    difficulty: 'BEGINNER',
    quizType: 'Timed Challenge',
    duration: 8,
    passingScore: 60,
    description: 'Selectors, box model, flexbox basics and responsive styling fundamentals.',
  },
  {
    id: 12,
    title: 'MySQL Essentials Mock Test',
    technology: 'MySQL',
    difficulty: 'INTERMEDIATE',
    quizType: 'Mock Test',
    duration: 12,
    passingScore: 65,
    description: 'MySQL data types, constraints, joins and stored procedures in an exam-style format.',
  },
];

export const QUESTIONS = {
  1: [
    { q: 'Which keyword is used to inherit a class in Java?', topic: 'Inheritance', opts: ['implements', 'extends', 'inherits', 'super'], correct: 1, exp: 'The extends keyword is used when one class inherits another class in Java.' },
    { q: 'Which of the following is NOT a pillar of OOP?', topic: 'OOP Concepts', opts: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'], correct: 2, exp: 'The four pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism. Compilation is not an OOP concept.' },
    { q: 'What is the output of: System.out.println("Hello" + 1 + 2);', topic: 'Strings', opts: ['Hello3', 'Hello12', 'Hello1 2', 'Compilation error'], correct: 1, exp: 'String concatenation with + operator processes left to right. "Hello" + 1 = "Hello1", then "Hello1" + 2 = "Hello12".' },
    { q: 'Which access modifier allows access within the same package only?', topic: 'Access Modifiers', opts: ['public', 'private', 'protected', 'default (no modifier)'], correct: 3, exp: 'Default access (no modifier) restricts access to within the same package only.' },
    { q: 'Can a Java class have multiple constructors?', topic: 'Constructors', opts: ['No, only one constructor is allowed', 'Yes, through constructor overloading', 'Only if specified in main()', 'Only in abstract classes'], correct: 1, exp: 'Java supports constructor overloading, allowing multiple constructors with different parameter lists.' },
    { q: 'What does the `new` keyword do in Java?', topic: 'Classes & Objects', opts: ['Creates a reference', 'Allocates memory and creates an object', 'Starts a thread', 'Imports a package'], correct: 1, exp: 'The new keyword allocates memory for a new object and returns a reference to it.' },
    { q: 'Which method is the entry point of a Java application?', topic: 'Methods', opts: ['start()', 'init()', 'main()', 'run()'], correct: 2, exp: 'The main() method is the entry point of any Java application. It has the signature: public static void main(String[] args).' },
    { q: 'What is the default value of an int variable in Java?', topic: 'Variables', opts: ['null', '0', '1', 'undefined'], correct: 1, exp: 'Instance variables of type int in Java are initialized to 0 by default.' },
    { q: 'Which keyword is used to prevent a class from being inherited?', topic: 'Inheritance', opts: ['static', 'final', 'abstract', 'volatile'], correct: 1, exp: 'The final keyword when applied to a class prevents it from being subclassed (inherited).' },
    { q: 'What is method overriding?', topic: 'Polymorphism', opts: ['Defining multiple methods with same name but different params', 'Providing a specific implementation of a method in a subclass', 'Calling a method from parent class', 'Declaring a method as abstract'], correct: 1, exp: 'Method overriding occurs when a subclass provides a specific implementation of a method already defined in its parent class.' },
  ],
  2: [
    { q: 'What is the output of: console.log(typeof null);', topic: 'Types', opts: ['null', 'undefined', 'object', 'boolean'], correct: 2, exp: 'This is a well-known JavaScript quirk. typeof null returns "object" due to a legacy bug in the language.' },
    { q: 'Which ES6 feature allows destructuring an object?', topic: 'Destructuring', opts: ['Spread operator', 'Destructuring assignment', 'Rest parameters', 'Template literals'], correct: 1, exp: 'Destructuring assignment syntax allows unpacking values from arrays or properties from objects into distinct variables.' },
    { q: 'What does `...` (spread operator) do?', topic: 'Destructuring', opts: ['Deletes an object', 'Spreads elements from an iterable', 'Creates a loop', 'Defines a class'], correct: 1, exp: 'The spread operator expands an iterable (array, string, object) into individual elements.' },
    { q: 'What is the output of: const x = () => {}; console.log(typeof x);', topic: 'Functions', opts: ['function', 'object', 'undefined', 'arrow'], correct: 0, exp: 'Arrow functions are still functions in JavaScript, so typeof returns "function".' },
    { q: 'Which method converts a JSON string to a JavaScript object?', topic: 'Objects', opts: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.toObject()'], correct: 1, exp: 'JSON.parse() converts a JSON string into a JavaScript object. JSON.stringify() does the opposite.' },
    { q: 'What is the output of: let [a, , b] = [1, 2, 3]; console.log(a, b);', topic: 'Destructuring', opts: ['1 2', '1 3', '2 3', 'undefined 3'], correct: 1, exp: 'Array destructuring skips the second element (2), so a=1 and b=3.' },
    { q: 'What does async/await do in JavaScript?', topic: 'Async', opts: ['Creates threads', 'Makes asynchronous code look synchronous', 'Increases speed', 'Prevents errors'], correct: 1, exp: 'async/await is syntactic sugar over Promises that makes asynchronous code readable as synchronous code.' },
    { q: 'Which symbol is used for template literals?', topic: 'Strings', opts: ['Single quotes', 'Double quotes', 'Backticks (`)', 'Parentheses'], correct: 2, exp: 'Template literals use backticks (`) and support embedded expressions with ${expression}.' },
    { q: 'What is a closure in JavaScript?', topic: 'Closures', opts: ['A way to close the browser', 'A function that has access to outer scope variables', 'A method to end a loop', 'A type of loop'], correct: 1, exp: 'A closure is a function that retains access to variables from its outer (enclosing) function scope even after the outer function has returned.' },
    { q: 'What does Promise.all() do?', topic: 'Async', opts: ['Resolves first promise', 'Resolves when ALL promises resolve', 'Rejects all promises', 'Creates a new promise'], correct: 1, exp: 'Promise.all() takes an iterable of promises and returns a single promise that resolves when all input promises resolve.' },
  ],
  3: [
    { q: 'What is the time complexity of accessing an element in an array by index?', topic: 'Arrays', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correct: 2, exp: 'Arrays provide constant time O(1) access to any element by index due to contiguous memory allocation.' },
    { q: 'Which data structure uses LIFO (Last In First Out)?', topic: 'Stacks & Queues', opts: ['Queue', 'Stack', 'Linked List', 'Binary Tree'], correct: 1, exp: 'A Stack follows LIFO principle where the last element added is the first one to be removed.' },
    { q: 'What is the time complexity of searching in a sorted array using binary search?', topic: 'Searching', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correct: 1, exp: 'Binary search halves the search space each step, giving O(log n) time complexity.' },
    { q: 'In a singly linked list, what is the space complexity to store n elements?', topic: 'Linked Lists', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, exp: 'Each element requires a node with data and a pointer, so n elements need O(n) space.' },
    { q: 'What is the main advantage of a linked list over an array?', topic: 'Linked Lists', opts: ['Faster access by index', 'Less memory usage', 'Efficient insertion/deletion at any position', 'Better cache performance'], correct: 2, exp: 'Linked lists allow O(1) insertion/deletion at any position (given a reference), while arrays require shifting elements.' },
    { q: 'What is a circular linked list?', topic: 'Linked Lists', opts: ['A list that loops infinitely', 'Last node points to the first node', 'A doubly linked list', 'A sorted linked list'], correct: 1, exp: 'In a circular linked list, the last node\'s next pointer points back to the first node, forming a circle.' },
    { q: 'What is the time complexity of inserting at the beginning of a dynamic array?', topic: 'Arrays', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, exp: 'Inserting at the beginning of an array requires shifting all existing elements, resulting in O(n) time.' },
    { q: 'Which type of linked list allows traversal in both directions?', topic: 'Linked Lists', opts: ['Singly linked list', 'Circular linked list', 'Doubly linked list', 'Skip list'], correct: 2, exp: 'A doubly linked list has each node pointing to both the next and previous nodes, enabling bidirectional traversal.' },
    { q: 'What is amortized analysis for dynamic array resizing?', topic: 'Arrays', opts: ['Worst case always', 'Average case over operations', 'Best case only', 'Worst case for single operation'], correct: 1, exp: 'Amortized analysis considers the average performance over a sequence of operations, accounting for occasional expensive resize operations.' },
    { q: 'In an ArrayList, what happens when it reaches capacity?', topic: 'Arrays', opts: ['It crashes', 'It creates a new larger array and copies elements', 'It removes old elements', 'It switches to a linked list'], correct: 1, exp: 'When an ArrayList reaches capacity, it creates a new array (typically 1.5x or 2x the size) and copies all elements.' },
  ],
  4: [
    { q: 'What is the output of: print(type(5))', topic: 'Data Types', opts: ["<class 'int'>", "<class 'float'>", 'int', 'integer'], correct: 0, exp: "In Python, type(5) returns <class 'int'> because 5 is an integer." },
    { q: 'Which keyword is used to define a function in Python?', topic: 'Functions', opts: ['function', 'func', 'def', 'define'], correct: 2, exp: 'Python uses the "def" keyword to define functions.' },
    { q: 'What is the output of: print(3 ** 2)', topic: 'Operators', opts: ['6', '9', '5', '1'], correct: 1, exp: 'The ** operator is the exponentiation operator in Python. 3 ** 2 = 3² = 9.' },
    { q: 'Which of the following is a mutable data type in Python?', topic: 'Data Types', opts: ['tuple', 'string', 'list', 'frozenset'], correct: 2, exp: 'Lists are mutable in Python - you can modify their elements after creation. Tuples, strings, and frozensets are immutable.' },
    { q: 'What does `len([1, 2, 3, 4])` return?', topic: 'Collections', opts: ['3', '4', '5', '10'], correct: 1, exp: 'The len() function returns the number of elements in a list. [1,2,3,4] has 4 elements.' },
    { q: 'How do you start a comment in Python?', topic: 'Syntax', opts: ['//', '#', '/*', '--'], correct: 1, exp: 'Python uses the # symbol for single-line comments.' },
    { q: 'What is the output of: print("Hello" * 3)', topic: 'Strings', opts: ['HelloHelloHello', 'Hello 3', 'HelloHello', 'Error'], correct: 0, exp: 'In Python, multiplying a string by an integer repeats the string that many times.' },
    { q: 'Which method adds an element to the end of a list?', topic: 'Collections', opts: ['add()', 'insert()', 'append()', 'push()'], correct: 2, exp: 'The append() method adds a single element to the end of a Python list.' },
    { q: 'What is the output of: print(bool(""))', topic: 'Data Types', opts: ['True', 'False', '""', 'Error'], correct: 1, exp: 'An empty string is falsy in Python, so bool("") returns False.' },
    { q: 'What is the correct file extension for Python files?', topic: 'Syntax', opts: ['.python', '.py', '.pt', '.pyt'], correct: 1, exp: 'Python files use the .py extension.' },
  ],
  5: [
    { q: 'Which annotation marks a class as a REST controller in Spring Boot?', topic: 'Controllers', opts: ['@RestController', '@Controller', '@Service', '@Component'], correct: 0, exp: '@RestController combines @Controller and @ResponseBody, making it ideal for REST APIs.' },
    { q: 'Which annotation is used to handle HTTP GET requests?', topic: 'Controllers', opts: ['@PostMapping', '@GetMapping', '@RequestMapping', '@PutMapping'], correct: 1, exp: '@GetMapping is a shortcut for @RequestMapping(method = RequestMethod.GET).' },
    { q: 'What does @Autowired do in Spring?', topic: 'Dependency Injection', opts: ['Creates a new bean', 'Automatically injects dependencies', 'Defines a REST endpoint', 'Handles exceptions'], correct: 1, exp: '@Autowired enables automatic dependency injection by the Spring container.' },
    { q: 'Which dependency is needed for Spring Web?', topic: 'Configuration', opts: ['spring-boot-starter-data-jpa', 'spring-boot-starter-web', 'spring-boot-starter-security', 'spring-boot-starter-test'], correct: 1, exp: 'spring-boot-starter-web provides embedded Tomcat, Spring MVC, and REST support.' },
    { q: 'What is the purpose of @Entity in JPA?', topic: 'JPA', opts: ['Creates a REST endpoint', 'Maps a class to a database table', 'Defines a service', 'Handles exceptions'], correct: 1, exp: '@Entity marks a class as a JPA entity, mapping it to a database table.' },
    { q: 'Which HTTP status code means "Resource Not Found"?', topic: 'HTTP Basics', opts: ['200', '301', '404', '500'], correct: 2, exp: 'HTTP 404 indicates that the requested resource was not found on the server.' },
    { q: 'What is the default port for Spring Boot?', topic: 'Configuration', opts: ['8080', '3000', '80', '5000'], correct: 0, exp: 'Spring Boot defaults to port 8080 for the embedded Tomcat server.' },
    { q: 'Which annotation is used for method-level validation?', topic: 'Validation', opts: ['@Valid', '@Validated', '@NotNull', '@NotEmpty'], correct: 1, exp: '@Validated enables method-level validation constraints in Spring.' },
    { q: 'What does @ResponseBody do?', topic: 'Controllers', opts: ['Sends response as JSON/XML', 'Returns HTML view', 'Redirects to URL', 'Sets headers'], correct: 0, exp: '@ResponseBody serializes the return value into the HTTP response body (typically JSON).' },
    { q: 'Which annotation marks a class as a Spring repository?', topic: 'JPA', opts: ['@Repository', '@Service', '@Controller', '@Component'], correct: 0, exp: '@Repository is a Spring stereotype for data access components and enables exception translation.' },
  ],
  6: [
    { q: 'What hook is used for state in functional components?', topic: 'useState', opts: ['useEffect', 'useState', 'useContext', 'useReducer'], correct: 1, exp: 'useState is the primary hook for adding state to functional components.' },
    { q: 'When does useEffect run by default?', topic: 'useEffect', opts: ['Only once', 'Before every render', 'After every render', 'Never'], correct: 2, exp: 'By default, useEffect runs after every render (both initial and updates).' },
    { q: 'What is the Virtual DOM in React?', topic: 'Components', opts: ['A copy of the real DOM', 'A lightweight copy of the DOM for diffing', 'A browser API', 'A CSS framework'], correct: 1, exp: "React's Virtual DOM is a lightweight representation that allows efficient diffing and batched updates to the real DOM." },
    { q: 'What does the key prop do in a list?', topic: 'Lists & Keys', opts: ['Styles the element', 'Helps React identify changed items', 'Sets the ID', 'Defines the order'], correct: 1, exp: 'Keys help React identify which items have changed, been added, or removed, enabling efficient re-rendering.' },
    { q: 'What is the correct way to update state based on previous state?', topic: 'useState', opts: ['setState(newState)', 'setState(prev => prev + 1)', 'this.state = newState', 'forceUpdate()'], correct: 1, exp: 'Using a callback function ensures you work with the most up-to-date state value.' },
    { q: 'Which hook is used for side effects?', topic: 'useEffect', opts: ['useState', 'useEffect', 'useMemo', 'useCallback'], correct: 1, exp: 'useEffect is designed for side effects like API calls, subscriptions, and DOM manipulation.' },
    { q: 'What is prop drilling?', topic: 'Props', opts: ['Passing props through multiple components', 'Using a drill to create props', 'A debugging technique', 'A testing method'], correct: 0, exp: 'Prop drilling is when you pass props through many layers of components to reach a deeply nested child.' },
    { q: 'What does useRef return?', topic: 'Hooks', opts: ['A state variable', 'A mutable ref object', 'A DOM element only', 'A promise'], correct: 1, exp: 'useRef returns a mutable object with a .current property that persists across renders without causing re-renders.' },
    { q: 'When should you use useMemo?', topic: 'Hooks', opts: ['Always', 'To cache expensive computations', 'To replace useState', 'For DOM manipulation'], correct: 1, exp: 'useMemo memoizes expensive calculations so they only recompute when dependencies change.' },
    { q: 'What is a controlled component in React?', topic: 'Forms', opts: ['A component with useEffect', 'A component whose value is controlled by React state', 'A component with memo', 'A class component'], correct: 1, exp: 'In controlled components, form element values are driven by React state, giving you full control over the input.' },
  ],
  7: [
    { q: 'Which SQL keyword is used to retrieve data?', topic: 'SELECT Queries', opts: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], correct: 1, exp: 'SELECT is the SQL keyword used to query and retrieve data from database tables.' },
    { q: 'What does the WHERE clause do?', topic: 'Filtering', opts: ['Sorts results', 'Filters rows based on conditions', 'Groups results', 'Joins tables'], correct: 1, exp: 'WHERE filters rows that meet specified conditions before any grouping or ordering.' },
    { q: 'Which JOIN returns all rows from both tables?', topic: 'Joins', opts: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'], correct: 2, exp: 'FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match.' },
    { q: 'What does GROUP BY do?', topic: 'Aggregates', opts: ['Sorts the results', 'Groups rows sharing a value for aggregation', 'Filters groups', 'Creates a new table'], correct: 1, exp: 'GROUP BY groups rows with the same values in specified columns, typically used with aggregate functions.' },
    { q: 'Which aggregate function counts the number of rows?', topic: 'Aggregates', opts: ['SUM()', 'COUNT()', 'AVG()', 'TOTAL()'], correct: 1, exp: 'COUNT() returns the number of rows that match the specified criteria.' },
    { q: 'What is the difference between DELETE and TRUNCATE?', topic: 'DML vs DDL', opts: ['No difference', 'DELETE is DML, TRUNCATE is DDL; TRUNCATE is faster', 'DELETE is faster', 'TRUNCATE can have WHERE clause'], correct: 1, exp: 'DELETE is a DML operation (logged, can rollback, supports WHERE), while TRUNCATE is DDL (faster, resets auto-increment).' },
    { q: 'Which clause is used to sort results?', topic: 'Sorting', opts: ['ORDER BY', 'SORT BY', 'GROUP BY', 'ARRANGE BY'], correct: 0, exp: 'ORDER BY sorts the result set by one or more columns in ascending or descending order.' },
    { q: 'What does DISTINCT do in SQL?', topic: 'SELECT Queries', opts: ['Deletes duplicates', 'Returns only unique values', 'Sorts the data', 'Counts rows'], correct: 1, exp: 'DISTINCT eliminates duplicate rows from the result set, returning only unique values.' },
    { q: 'Which operator is used for pattern matching in SQL?', topic: 'Filtering', opts: ['==', 'LIKE', 'MATCH', 'CONTAINS'], correct: 1, exp: 'LIKE is used with wildcards (% and _) for pattern matching in SQL WHERE clauses.' },
    { q: 'What is a subquery?', topic: 'Subqueries', opts: ['A query with two tables', 'A query nested inside another query', 'A query without JOIN', 'A query with GROUP BY'], correct: 1, exp: 'A subquery (inner query) is nested inside an outer query and executes first, providing results to the outer query.' },
  ],
  8: [
    { q: 'What is the time complexity of Bubble Sort?', topic: 'Sorting Algorithms', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 2, exp: 'Bubble Sort has O(n²) time complexity in both average and worst cases due to nested loops.' },
    { q: 'Which sorting algorithm is fastest in practice for large datasets?', topic: 'Sorting Algorithms', opts: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'], correct: 2, exp: 'Quick Sort has O(n log n) average time complexity and excellent cache performance, making it fast in practice.' },
    { q: 'What is the worst-case time complexity of Quick Sort?', topic: 'Sorting Algorithms', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 2, exp: "Quick Sort's worst case is O(n²) when the pivot selection is poor (e.g., already sorted array)." },
    { q: 'Which sorting algorithm is stable?', topic: 'Sorting Algorithms', opts: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], correct: 2, exp: 'Merge Sort preserves the relative order of equal elements, making it a stable sorting algorithm.' },
    { q: 'What is binary search?', topic: 'Searching', opts: ['Searching in a binary tree', 'Searching by dividing search space in half', 'Searching two arrays', 'Searching with two pointers'], correct: 1, exp: 'Binary search repeatedly divides the search interval in half, requiring O(log n) time on sorted data.' },
    { q: 'What prerequisite must binary search have on the data?', topic: 'Searching', opts: ['No prerequisite', 'Data must be sorted', 'Data must be unique', 'Data must be a tree'], correct: 1, exp: 'Binary search requires the data to be sorted because it eliminates half the remaining elements based on comparison.' },
    { q: 'What is the time complexity of Merge Sort?', topic: 'Sorting Algorithms', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'], correct: 1, exp: 'Merge Sort consistently runs in O(n log n) in all cases due to its divide-and-conquer approach.' },
    { q: 'Which sorting algorithm works by building a sorted portion one element at a time?', topic: 'Sorting Algorithms', opts: ['Merge Sort', 'Quick Sort', 'Insertion Sort', 'Heap Sort'], correct: 2, exp: 'Insertion Sort builds the sorted array by inserting each element into its correct position.' },
    { q: 'What data structure is used in Heap Sort?', topic: 'Heap', opts: ['Stack', 'Queue', 'Binary Heap', 'Hash Table'], correct: 2, exp: 'Heap Sort uses a binary heap data structure to sort elements efficiently.' },
    { q: 'What is the space complexity of Merge Sort?', topic: 'Sorting Algorithms', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, exp: 'Merge Sort requires O(n) extra space for the temporary arrays used during the merge step.' },
  ],
  9: [
    { q: 'Which collection maintains insertion order?', topic: 'Sets', opts: ['HashSet', 'TreeSet', 'LinkedHashSet', 'PriorityQueue'], correct: 2, exp: 'LinkedHashSet maintains the insertion order of elements using a linked list backing the hash table.' },
    { q: 'What is the time complexity of HashMap get() in the average case?', topic: 'Maps', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correct: 2, exp: 'HashMap provides O(1) average time for get() operations through hash-based indexing.' },
    { q: 'Which interface does ArrayList implement?', topic: 'Lists', opts: ['Set', 'Map', 'List', 'Queue'], correct: 2, exp: 'ArrayList implements the List interface, providing ordered, index-based access to elements.' },
    { q: 'What happens if you add a duplicate to a HashSet?', topic: 'Sets', opts: ['Throws exception', 'Replaces the element', 'Ignores the duplicate', 'Returns false'], correct: 2, exp: 'HashSet ignores duplicate elements because sets only contain unique values. add() returns false for duplicates.' },
    { q: 'Which collection is best for FIFO operations?', topic: 'Queues', opts: ['Stack', 'LinkedList (as Queue)', 'TreeMap', 'HashSet'], correct: 1, exp: 'LinkedList implements the Queue interface and provides efficient FIFO operations with O(1) add/remove at ends.' },
    { q: 'What is the difference between HashMap and TreeMap?', topic: 'Maps', opts: ['No difference', 'HashMap is unordered, TreeMap is sorted', 'HashMap is faster', 'TreeMap allows null keys'], correct: 1, exp: 'HashMap provides O(1) access but is unordered; TreeMap uses a red-black tree and keeps keys sorted with O(log n) access.' },
    { q: 'Which collection is thread-safe by default?', topic: 'Thread Safety', opts: ['ArrayList', 'HashMap', 'Vector', 'LinkedList'], correct: 2, exp: 'Vector is synchronized (thread-safe) by default, unlike ArrayList and HashMap.' },
    { q: 'What is an Iterator used for?', topic: 'Iterators', opts: ['Creating collections', 'Traversing collections', 'Sorting collections', 'Searching collections'], correct: 1, exp: 'An Iterator provides a way to traverse elements in a collection one at a time without exposing its internal structure.' },
    { q: 'Which map allows null keys?', topic: 'Maps', opts: ['TreeMap', 'Hashtable', 'HashMap', 'ConcurrentHashMap'], correct: 2, exp: 'HashMap allows one null key and multiple null values. TreeMap, Hashtable, and ConcurrentHashMap do not allow null keys.' },
    { q: 'What is the initial capacity of an ArrayList?', topic: 'Lists', opts: ['0', '10', '16', '20'], correct: 1, exp: 'ArrayList has a default initial capacity of 10 elements. It grows by 50% when capacity is reached.' },
  ],
  10: [
    { q: 'What does HTML stand for?', topic: 'HTML Basics', opts: ['HyperText Markup Language', 'HighText Machine Language', 'Hyperlink Text Management Language', 'Home Tool Markup Language'], correct: 0, exp: 'HTML stands for HyperText Markup Language — the standard markup language for web pages.' },
    { q: 'Which tag creates a hyperlink?', topic: 'Links & Media', opts: ['<link>', '<a>', '<href>', '<nav>'], correct: 1, exp: 'The <a> (anchor) tag creates hyperlinks; <link> is used in <head> for external resources.' },
    { q: 'Which element is best for standalone, self-contained content?', topic: 'Semantic HTML', opts: ['<div>', '<section>', '<article>', '<span>'], correct: 2, exp: '<article> represents independent, self-contained content like a blog post or news item.' },
    { q: 'Where does the <meta> viewport tag belong?', topic: 'Document Structure', opts: ['Inside <body>', 'Inside <head>', 'After </html>', 'Inside <title>'], correct: 1, exp: 'Meta tags must be placed inside the <head> section of the document.' },
    { q: 'Which attribute makes an image accessible?', topic: 'Accessibility', opts: ['title', 'caption', 'alt', 'aria-img'], correct: 2, exp: 'The alt attribute provides alternative text describing images for screen readers and broken images.' },
    { q: 'What is the correct way to create a checkbox?', topic: 'Forms', opts: ['<input type="check">', '<check>', '<input type="checkbox">', '<checkbox>'], correct: 2, exp: '<input type="checkbox"> renders a checkbox control in a form.' },
    { q: 'Which heading tag has the highest importance?', topic: 'HTML Basics', opts: ['<h6>', '<head>', '<h1>', '<header>'], correct: 2, exp: '<h1> defines the most important heading; headings should descend in order h1 → h6.' },
    { q: 'Which tag is used for tabular data?', topic: 'Tables', opts: ['<table>', '<tab>', '<grid>', '<rows>'], correct: 0, exp: 'The <table> element structures data in rows (<tr>) and cells (<td>/<th>).' },
  ],
  11: [
    { q: 'What does CSS stand for?', topic: 'CSS Basics', opts: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correct: 1, exp: 'CSS stands for Cascading Style Sheets — styles cascade based on specificity and source order.' },
    { q: 'Which selector has the highest specificity?', topic: 'Selectors', opts: ['.class', '#id', 'element', '*'], correct: 1, exp: 'ID selectors (#id) outrank classes, which outrank element selectors in specificity.' },
    { q: 'Which property adds space INSIDE an element border?', topic: 'Box Model', opts: ['margin', 'padding', 'gap', 'spacing'], correct: 1, exp: 'Padding is inner spacing between content and border; margin is outer spacing beyond the border.' },
    { q: 'How do you center children on both axes with flexbox?', topic: 'Flexbox', opts: ['align: center;', 'justify-content + align-items: center', 'text-align: middle', 'position: center'], correct: 1, exp: 'On a flex container, justify-content: center centers along the main axis and align-items: center along the cross axis.' },
    { q: 'Which unit scales with the root font size?', topic: 'Units', opts: ['px', 'em', 'rem', 'vh'], correct: 2, exp: 'rem units are relative to the root (html) font size, making global scaling easy and accessible.' },
    { q: 'Which media query targets screens narrower than 768px?', topic: 'Responsive Design', opts: ['@media (width > 768px)', '@media screen and (max-width: 768px)', '@query (min-width: 768px)', '@media (screen: small)'], correct: 1, exp: '@media screen and (max-width: 768px) applies styles when the viewport is 768px wide or less.' },
    { q: 'Which property changes stack order of positioned elements?', topic: 'Positioning', opts: ['stack-index', 'z-index', 'order', 'layer'], correct: 1, exp: 'z-index controls stacking order for positioned elements (with position other than static).' },
    { q: 'What display value makes an element flexible both as row and wrap?', topic: 'Flexbox', opts: ['display: block', 'display: flex; flex-wrap: wrap', 'display: grid-wrap', 'display: inline-flex-row'], correct: 1, exp: 'display: flex with flex-wrap: wrap lays out children in rows that wrap onto new lines.' },
  ],
  12: [
    { q: 'Which command shows all databases in MySQL?', topic: 'Administration', opts: ['SHOW DATABASES;', 'LIST DATABASES;', 'SELECT DATABASES;', 'DISPLAY DB;'], correct: 0, exp: 'SHOW DATABASES; lists every database the current user can see.' },
    { q: 'Which data type stores exact decimal currency values?', topic: 'Data Types', opts: ['FLOAT', 'DOUBLE', 'DECIMAL(10,2)', 'INT'], correct: 2, exp: 'DECIMAL(p,s) stores exact fixed-point numbers — ideal for money, unlike approximate FLOAT/DOUBLE.' },
    { q: 'Which constraint prevents NULL values?', topic: 'Constraints', opts: ['UNIQUE', 'NOT NULL', 'DEFAULT', 'CHECK'], correct: 1, exp: 'NOT NULL forces a column to always have a value on insert/update.' },
    { q: 'What does AUTO_INCREMENT do?', topic: 'Constraints', opts: ['Encrypts values', 'Generates sequential numeric values automatically', 'Speeds up queries', 'Creates backups'], correct: 1, exp: 'AUTO_INCREMENT generates the next number (1, 2, 3…) automatically for inserts.' },
    { q: 'Which join returns only matching rows from both tables?', topic: 'Joins', opts: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correct: 2, exp: 'INNER JOIN keeps only rows where the join condition matches in both tables.' },
    { q: 'Which function returns the current date and time?', topic: 'Functions', opts: ['TODAY()', 'NOW()', 'CURRENT()', 'DATETIME()'], correct: 1, exp: 'NOW() returns the current date and time of the MySQL server.' },
    { q: 'What does LIMIT 5 OFFSET 10 return?', topic: 'Queries', opts: ['First 5 rows', 'Rows 11–15', 'Rows 5–10', 'Last 5 rows'], correct: 1, exp: 'OFFSET skips the first 10 rows, then LIMIT returns the next 5 — i.e., rows 11 through 15.' },
    { q: 'Which storage engine supports transactions by default?', topic: 'Storage Engines', opts: ['MyISAM', 'MEMORY', 'InnoDB', 'ARCHIVE'], correct: 2, exp: 'InnoDB is the default transactional engine in modern MySQL, supporting ACID commits and rollbacks.' },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────
export const getQuizById = (id) => QUIZZES.find((q) => q.id === Number(id));

export const getQuestionsForQuiz = (quizId) => QUESTIONS[Number(quizId)] || [];

// Weak-topic analysis: per-topic accuracy for one attempt
// → [{ topic, total, correct, percent }]
export const analyseTopics = (questions, answers = {}) => {
  const map = new Map();
  questions.forEach((q, i) => {
    if (!map.has(q.topic)) map.set(q.topic, { total: 0, correct: 0 });
    const t = map.get(q.topic);
    t.total += 1;
    if (answers[i] === q.correct) t.correct += 1;
  });
  return [...map.entries()]
    .map(([topic, { total, correct }]) => ({
      topic,
      total,
      correct,
      percent: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
};

export default QUIZZES;
