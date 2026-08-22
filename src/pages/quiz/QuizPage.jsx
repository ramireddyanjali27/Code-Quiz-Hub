import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiArrowRight,
  FiHelpCircle,
  FiAward,
  FiRefreshCw,
} from 'react-icons/fi';
import { DIFFICULTY_LEVELS, TECHNOLOGIES } from '../../utils/constants';
import './QuizPage.css';

// ─── Sample Quiz Data ────────────────────────────────────────
const QUIZZES = [
  {
    id: 1,
    title: 'Java OOP Basics',
    technology: 'Java',
    difficulty: 'BEGINNER',
    totalQuestions: 10,
    duration: 10,
    passingScore: 60,
    description: 'Test your knowledge of Java Object-Oriented Programming concepts including classes, objects, inheritance, polymorphism, and encapsulation.',
  },
  {
    id: 2,
    title: 'JavaScript ES6+ Features',
    technology: 'JavaScript',
    difficulty: 'INTERMEDIATE',
    totalQuestions: 10,
    duration: 15,
    passingScore: 65,
    description: 'Master modern JavaScript features including arrow functions, destructuring, template literals, modules, promises, and async/await.',
  },
  {
    id: 3,
    title: 'Data Structures - Arrays & Linked Lists',
    technology: 'Data Structures',
    difficulty: 'ADVANCED',
    totalQuestions: 10,
    duration: 20,
    passingScore: 70,
    description: 'Deep dive into arrays, linked lists, their operations, time complexities, and real-world applications.',
  },
  {
    id: 4,
    title: 'Python Fundamentals',
    technology: 'Python',
    difficulty: 'BEGINNER',
    totalQuestions: 10,
    duration: 10,
    passingScore: 60,
    description: 'Learn Python basics including variables, data types, control flow, functions, and lists.',
  },
  {
    id: 5,
    title: 'Spring Boot REST APIs',
    technology: 'Spring Boot',
    difficulty: 'INTERMEDIATE',
    totalQuestions: 10,
    duration: 15,
    passingScore: 65,
    description: 'Build and test REST APIs with Spring Boot including controllers, services, repositories, and error handling.',
  },
  {
    id: 6,
    title: 'React Hooks & Components',
    technology: 'React',
    difficulty: 'INTERMEDIATE',
    totalQuestions: 10,
    duration: 15,
    passingScore: 65,
    description: 'Understand React hooks, functional components, state management, and lifecycle methods.',
  },
  {
    id: 7,
    title: 'SQL Queries & Joins',
    technology: 'SQL',
    difficulty: 'BEGINNER',
    totalQuestions: 10,
    duration: 10,
    passingScore: 60,
    description: 'Master SQL queries, joins, aggregations, and database operations.',
  },
  {
    id: 8,
    title: 'Algorithms - Sorting & Searching',
    technology: 'Algorithms',
    difficulty: 'ADVANCED',
    totalQuestions: 10,
    duration: 20,
    passingScore: 70,
    description: 'Tackle sorting algorithms, binary search, complexity analysis, and algorithm optimization.',
  },
  {
    id: 9,
    title: 'Java Collections Framework',
    technology: 'Java',
    difficulty: 'INTERMEDIATE',
    totalQuestions: 10,
    duration: 12,
    passingScore: 65,
    description: 'Explore Java collections including ArrayList, HashMap, LinkedList, HashSet, and their use cases.',
  },
];

// ─── Sample Questions per Quiz ───────────────────────────────
const QUESTIONS = {
  1: [
    { q: 'Which keyword is used to inherit a class in Java?', opts: ['implements', 'extends', 'inherits', 'super'], correct: 1, exp: 'The extends keyword is used when one class inherits another class in Java.' },
    { q: 'Which of the following is NOT a pillar of OOP?', opts: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'], correct: 2, exp: 'The four pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism. Compilation is not an OOP concept.' },
    { q: 'What is the output of: System.out.println("Hello" + 1 + 2);', opts: ['Hello3', 'Hello12', 'Hello1 2', 'Compilation error'], correct: 1, exp: 'String concatenation with + operator processes left to right. "Hello" + 1 = "Hello1", then "Hello1" + 2 = "Hello12".' },
    { q: 'Which access modifier allows access within the same package only?', opts: ['public', 'private', 'protected', 'default (no modifier)'], correct: 3, exp: 'Default access (no modifier) restricts access to within the same package only.' },
    { q: 'Can a Java class have multiple constructors?', opts: ['No, only one constructor is allowed', 'Yes, through constructor overloading', 'Only if specified in main()', 'Only in abstract classes'], correct: 1, exp: 'Java supports constructor overloading, allowing multiple constructors with different parameter lists.' },
    { q: 'What does the `new` keyword do in Java?', opts: ['Creates a reference', 'Allocates memory and creates an object', 'Starts a thread', 'Imports a package'], correct: 1, exp: 'The new keyword allocates memory for a new object and returns a reference to it.' },
    { q: 'Which method is the entry point of a Java application?', opts: ['start()', 'init()', 'main()', 'run()'], correct: 2, exp: 'The main() method is the entry point of any Java application. It has the signature: public static void main(String[] args).' },
    { q: 'What is the default value of an int variable in Java?', opts: ['null', '0', '1', 'undefined'], correct: 1, exp: 'Instance variables of type int in Java are initialized to 0 by default.' },
    { q: 'Which keyword is used to prevent a class from being inherited?', opts: ['static', 'final', 'abstract', 'volatile'], correct: 1, exp: 'The final keyword when applied to a class prevents it from being subclassed (inherited).' },
    { q: 'What is method overriding?', opts: ['Defining multiple methods with same name but different params', 'Providing a specific implementation of a method in a subclass', 'Calling a method from parent class', 'Declaring a method as abstract'], correct: 1, exp: 'Method overriding occurs when a subclass provides a specific implementation of a method already defined in its parent class.' },
  ],
  2: [
    { q: 'What is the output of: console.log(typeof null);', opts: ['null', 'undefined', 'object', 'boolean'], correct: 2, exp: 'This is a well-known JavaScript quirk. typeof null returns "object" due to a legacy bug in the language.' },
    { q: 'Which ES6 feature allows destructuring an object?', opts: ['Spread operator', 'Destructuring assignment', 'Rest parameters', 'Template literals'], correct: 1, exp: 'Destructuring assignment syntax allows unpacking values from arrays or properties from objects into distinct variables.' },
    { q: 'What does `...` (spread operator) do?', opts: ['Deletes an object', 'Spreads elements from an iterable', 'Creates a loop', 'Defines a class'], correct: 1, exp: 'The spread operator expands an iterable (array, string, object) into individual elements.' },
    { q: 'What is the output of: const x = () => {}; console.log(typeof x);', opts: ['function', 'object', 'undefined', 'arrow'], correct: 0, exp: 'Arrow functions are still functions in JavaScript, so typeof returns "function".' },
    { q: 'Which method converts a JSON string to a JavaScript object?', opts: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.toObject()'], correct: 1, exp: 'JSON.parse() converts a JSON string into a JavaScript object. JSON.stringify() does the opposite.' },
    { q: 'What is the output of: let [a, , b] = [1, 2, 3]; console.log(a, b);', opts: ['1 2', '1 3', '2 3', 'undefined 3'], correct: 1, exp: 'Array destructuring skips the second element (2), so a=1 and b=3.' },
    { q: 'What does async/await do in JavaScript?', opts: ['Creates threads', 'Makes asynchronous code look synchronous', 'Increases speed', 'Prevents errors'], correct: 1, exp: 'async/await is syntactic sugar over Promises that makes asynchronous code readable as synchronous code.' },
    { q: 'Which symbol is used for template literals?', opts: ['Single quotes', 'Double quotes', 'Backticks (`)', 'Parentheses'], correct: 2, exp: 'Template literals use backticks (`) and support embedded expressions with ${expression}.' },
    { q: 'What is a closure in JavaScript?', opts: ['A way to close the browser', 'A function that has access to outer scope variables', 'A method to end a loop', 'A type of loop'], correct: 1, exp: 'A closure is a function that retains access to variables from its outer (enclosing) function scope even after the outer function has returned.' },
    { q: 'What does Promise.all() do?', opts: ['Resolves first promise', 'Resolves when ALL promises resolve', 'Rejects all promises', 'Creates a new promise'], correct: 1, exp: 'Promise.all() takes an iterable of promises and returns a single promise that resolves when all input promises resolve.' },
  ],
  3: [
    { q: 'What is the time complexity of accessing an element in an array by index?', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correct: 2, exp: 'Arrays provide constant time O(1) access to any element by index due to contiguous memory allocation.' },
    { q: 'Which data structure uses LIFO (Last In First Out)?', opts: ['Queue', 'Stack', 'Linked List', 'Binary Tree'], correct: 1, exp: 'A Stack follows LIFO principle where the last element added is the first one to be removed.' },
    { q: 'What is the time complexity of searching in a sorted array using binary search?', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correct: 1, exp: 'Binary search halves the search space each step, giving O(log n) time complexity.' },
    { q: 'In a singly linked list, what is the space complexity to store n elements?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, exp: 'Each element requires a node with data and a pointer, so n elements need O(n) space.' },
    { q: 'What is the main advantage of a linked list over an array?', opts: ['Faster access by index', 'Less memory usage', 'Efficient insertion/deletion at any position', 'Better cache performance'], correct: 2, exp: 'Linked lists allow O(1) insertion/deletion at any position (given a reference), while arrays require shifting elements.' },
    { q: 'What is a circular linked list?', opts: ['A list that loops infinitely', 'Last node points to the first node', 'A doubly linked list', 'A sorted linked list'], correct: 1, exp: 'In a circular linked list, the last node\'s next pointer points back to the first node, forming a circle.' },
    { q: 'What is the time complexity of inserting at the beginning of a dynamic array?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, exp: 'Inserting at the beginning of an array requires shifting all existing elements, resulting in O(n) time.' },
    { q: 'Which type of linked list allows traversal in both directions?', opts: ['Singly linked list', 'Circular linked list', 'Doubly linked list', 'Skip list'], correct: 2, exp: 'A doubly linked list has each node pointing to both the next and previous nodes, enabling bidirectional traversal.' },
    { q: 'What is amortized analysis for dynamic array resizing?', opts: ['Worst case always', 'Average case over operations', 'Best case only', 'Worst case for single operation'], correct: 1, exp: 'Amortized analysis considers the average performance over a sequence of operations, accounting for occasional expensive resize operations.' },
    { q: 'In an ArrayList, what happens when it reaches capacity?', opts: ['It crashes', 'It creates a new larger array and copies elements', 'It removes old elements', 'It switches to a linked list'], correct: 1, exp: 'When an ArrayList reaches capacity, it creates a new array (typically 1.5x or 2x the size) and copies all elements.' },
  ],
  4: [
    { q: 'What is the output of: print(type(5))', opts: ['<class \'int\'>', '<class \'float\'>', 'int', 'integer'], correct: 0, exp: 'In Python, type(5) returns <class \'int\'> because 5 is an integer.' },
    { q: 'Which keyword is used to define a function in Python?', opts: ['function', 'func', 'def', 'define'], correct: 2, exp: 'Python uses the "def" keyword to define functions.' },
    { q: 'What is the output of: print(3 ** 2)', opts: ['6', '9', '5', '1'], correct: 1, exp: 'The ** operator is the exponentiation operator in Python. 3 ** 2 = 3² = 9.' },
    { q: 'Which of the following is a mutable data type in Python?', opts: ['tuple', 'string', 'list', 'frozenset'], correct: 2, exp: 'Lists are mutable in Python - you can modify their elements after creation. Tuples, strings, and frozensets are immutable.' },
    { q: 'What does `len([1, 2, 3, 4])` return?', opts: ['3', '4', '5', '10'], correct: 1, exp: 'The len() function returns the number of elements in a list. [1,2,3,4] has 4 elements.' },
    { q: 'How do you start a comment in Python?', opts: ['//', '#', '/*', '--'], correct: 1, exp: 'Python uses the # symbol for single-line comments.' },
    { q: 'What is the output of: print("Hello" * 3)', opts: ['HelloHelloHello', 'Hello 3', 'HelloHello', 'Error'], correct: 0, exp: 'In Python, multiplying a string by an integer repeats the string that many times.' },
    { q: 'Which method adds an element to the end of a list?', opts: ['add()', 'insert()', 'append()', 'push()'], correct: 2, exp: 'The append() method adds a single element to the end of a Python list.' },
    { q: 'What is the output of: print(bool(""))', opts: ['True', 'False', '""', 'Error'], correct: 1, exp: 'An empty string is falsy in Python, so bool("") returns False.' },
    { q: 'What is the correct file extension for Python files?', opts: ['.python', '.py', '.pt', '.pyt'], correct: 1, exp: 'Python files use the .py extension.' },
  ],
  5: [
    { q: 'Which annotation marks a class as a REST controller in Spring Boot?', opts: ['@RestController', '@Controller', '@Service', '@Component'], correct: 0, exp: '@RestController combines @Controller and @ResponseBody, making it ideal for REST APIs.' },
    { q: 'Which annotation is used to handle HTTP GET requests?', opts: ['@PostMapping', '@GetMapping', '@RequestMapping', '@PutMapping'], correct: 1, exp: '@GetMapping is a shortcut for @RequestMapping(method = RequestMethod.GET).' },
    { q: 'What does @Autowired do in Spring?', opts: ['Creates a new bean', 'Automatically injects dependencies', 'Defines a REST endpoint', 'Handles exceptions'], correct: 1, exp: '@Autowired enables automatic dependency injection by the Spring container.' },
    { q: 'Which dependency is needed for Spring Web?', opts: ['spring-boot-starter-data-jpa', 'spring-boot-starter-web', 'spring-boot-starter-security', 'spring-boot-starter-test'], correct: 1, exp: 'spring-boot-starter-web provides embedded Tomcat, Spring MVC, and REST support.' },
    { q: 'What is the purpose of @Entity in JPA?', opts: ['Creates a REST endpoint', 'Maps a class to a database table', 'Defines a service', 'Handles exceptions'], correct: 1, exp: '@Entity marks a class as a JPA entity, mapping it to a database table.' },
    { q: 'Which HTTP status code means "Resource Not Found"?', opts: ['200', '301', '404', '500'], correct: 2, exp: 'HTTP 404 indicates that the requested resource was not found on the server.' },
    { q: 'What is the default port for Spring Boot?', opts: ['8080', '3000', '80', '5000'], correct: 0, exp: 'Spring Boot defaults to port 8080 for the embedded Tomcat server.' },
    { q: 'Which annotation is used for method-level validation?', opts: ['@Valid', '@Validated', '@NotNull', '@NotEmpty'], correct: 1, exp: '@Validated enables method-level validation constraints in Spring.' },
    { q: 'What does @ResponseBody do?', opts: ['Sends response as JSON/XML', 'Returns HTML view', 'Redirects to URL', 'Sets headers'], correct: 0, exp: '@ResponseBody serializes the return value into the HTTP response body (typically JSON).' },
    { q: 'Which annotation marks a class as a Spring repository?', opts: ['@Repository', '@Service', '@Controller', '@Component'], correct: 0, exp: '@Repository is a Spring stereotype for data access components and enables exception translation.' },
  ],
  6: [
    { q: 'What hook is used for state in functional components?', opts: ['useEffect', 'useState', 'useContext', 'useReducer'], correct: 1, exp: 'useState is the primary hook for adding state to functional components.' },
    { q: 'When does useEffect run by default?', opts: ['Only once', 'Before every render', 'After every render', 'Never'], correct: 2, exp: 'By default, useEffect runs after every render (both initial and updates).' },
    { q: 'What is the Virtual DOM in React?', opts: ['A copy of the real DOM', 'A lightweight copy of the DOM for diffing', 'A browser API', 'A CSS framework'], correct: 1, exp: 'React\'s Virtual DOM is a lightweight representation that allows efficient diffing and batched updates to the real DOM.' },
    { q: 'What does the key prop do in a list?', opts: ['Styles the element', 'Helps React identify changed items', 'Sets the ID', 'Defines the order'], correct: 1, exp: 'Keys help React identify which items have changed, been added, or removed, enabling efficient re-rendering.' },
    { q: 'What is the correct way to update state based on previous state?', opts: ['setState(newState)', 'setState(prev => prev + 1)', 'this.state = newState', 'forceUpdate()'], correct: 1, exp: 'Using a callback function ensures you work with the most up-to-date state value.' },
    { q: 'Which hook is used for side effects?', opts: ['useState', 'useEffect', 'useMemo', 'useCallback'], correct: 1, exp: 'useEffect is designed for side effects like API calls, subscriptions, and DOM manipulation.' },
    { q: 'What is prop drilling?', opts: ['Passing props through multiple components', 'Using a drill to create props', 'A debugging technique', 'A testing method'], correct: 0, exp: 'Prop drilling is when you pass props through many layers of components to reach a deeply nested child.' },
    { q: 'What does useRef return?', opts: ['A state variable', 'A mutable ref object', 'A DOM element only', 'A promise'], correct: 1, exp: 'useRef returns a mutable object with a .current property that persists across renders without causing re-renders.' },
    { q: 'When should you use useMemo?', opts: ['Always', 'To cache expensive computations', 'To replace useState', 'For DOM manipulation'], correct: 1, exp: 'useMemo memoizes expensive calculations so they only recompute when dependencies change.' },
    { q: 'What is a controlled component in React?', opts: ['A component with useEffect', 'A component whose value is controlled by React state', 'A component with memo', 'A class component'], correct: 1, exp: 'In controlled components, form element values are driven by React state, giving you full control over the input.' },
  ],
  7: [
    { q: 'Which SQL keyword is used to retrieve data?', opts: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], correct: 1, exp: 'SELECT is the SQL keyword used to query and retrieve data from database tables.' },
    { q: 'What does the WHERE clause do?', opts: ['Sorts results', 'Filters rows based on conditions', 'Groups results', 'Joins tables'], correct: 1, exp: 'WHERE filters rows that meet specified conditions before any grouping or ordering.' },
    { q: 'Which JOIN returns all rows from both tables?', opts: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'], correct: 2, exp: 'FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match.' },
    { q: 'What does GROUP BY do?', opts: ['Sorts the results', 'Groups rows sharing a value for aggregation', 'Filters groups', 'Creates a new table'], correct: 1, exp: 'GROUP BY groups rows with the same values in specified columns, typically used with aggregate functions.' },
    { q: 'Which aggregate function counts the number of rows?', opts: ['SUM()', 'COUNT()', 'AVG()', 'TOTAL()'], correct: 1, exp: 'COUNT() returns the number of rows that match the specified criteria.' },
    { q: 'What is the difference between DELETE and TRUNCATE?', opts: ['No difference', 'DELETE is DML, TRUNCATE is DDL; TRUNCATE is faster', 'DELETE is faster', 'TRUNCATE can have WHERE clause'], correct: 1, exp: 'DELETE is a DML operation (logged, can rollback, supports WHERE), while TRUNCATE is DDL (faster, resets auto-increment).' },
    { q: 'Which clause is used to sort results?', opts: ['ORDER BY', 'SORT BY', 'GROUP BY', 'ARRANGE BY'], correct: 0, exp: 'ORDER BY sorts the result set by one or more columns in ascending or descending order.' },
    { q: 'What does DISTINCT do in SQL?', opts: ['Deletes duplicates', 'Returns only unique values', 'Sorts the data', 'Counts rows'], correct: 1, exp: 'DISTINCT eliminates duplicate rows from the result set, returning only unique values.' },
    { q: 'Which operator is used for pattern matching in SQL?', opts: ['==', 'LIKE', 'MATCH', 'CONTAINS'], correct: 1, exp: 'LIKE is used with wildcards (% and _) for pattern matching in SQL WHERE clauses.' },
    { q: 'What is a subquery?', opts: ['A query with two tables', 'A query nested inside another query', 'A query without JOIN', 'A query with GROUP BY'], correct: 1, exp: 'A subquery (inner query) is nested inside an outer query and executes first, providing results to the outer query.' },
  ],
  8: [
    { q: 'What is the time complexity of Bubble Sort?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 2, exp: 'Bubble Sort has O(n²) time complexity in both average and worst cases due to nested loops.' },
    { q: 'Which sorting algorithm is fastest in practice for large datasets?', opts: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'], correct: 2, exp: 'Quick Sort has O(n log n) average time complexity and excellent cache performance, making it fast in practice.' },
    { q: 'What is the worst-case time complexity of Quick Sort?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 2, exp: 'Quick Sort\'s worst case is O(n²) when the pivot selection is poor (e.g., already sorted array).' },
    { q: 'Which sorting algorithm is stable?', opts: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], correct: 2, exp: 'Merge Sort preserves the relative order of equal elements, making it a stable sorting algorithm.' },
    { q: 'What is binary search?', opts: ['Searching in a binary tree', 'Searching by dividing search space in half', 'Searching two arrays', 'Searching with two pointers'], correct: 1, exp: 'Binary search repeatedly divides the search interval in half, requiring O(log n) time on sorted data.' },
    { q: 'What prerequisite must binary search have on the data?', opts: ['No prerequisite', 'Data must be sorted', 'Data must be unique', 'Data must be a tree'], correct: 1, exp: 'Binary search requires the data to be sorted because it eliminates half the remaining elements based on comparison.' },
    { q: 'What is the time complexity of Merge Sort?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'], correct: 1, exp: 'Merge Sort consistently runs in O(n log n) in all cases due to its divide-and-conquer approach.' },
    { q: 'Which sorting algorithm works by building a sorted portion one element at a time?', opts: ['Merge Sort', 'Quick Sort', 'Insertion Sort', 'Heap Sort'], correct: 2, exp: 'Insertion Sort builds the sorted array by inserting each element into its correct position.' },
    { q: 'What data structure is used in Heap Sort?', opts: ['Stack', 'Queue', 'Binary Heap', 'Hash Table'], correct: 2, exp: 'Heap Sort uses a binary heap data structure to sort elements efficiently.' },
    { q: 'What is the space complexity of Merge Sort?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, exp: 'Merge Sort requires O(n) extra space for the temporary arrays used during the merge step.' },
  ],
  9: [
    { q: 'Which collection maintains insertion order?', opts: ['HashSet', 'TreeSet', 'LinkedHashSet', 'PriorityQueue'], correct: 2, exp: 'LinkedHashSet maintains the insertion order of elements using a linked list backing the hash table.' },
    { q: 'What is the time complexity of HashMap get() in the average case?', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correct: 2, exp: 'HashMap provides O(1) average time for get() operations through hash-based indexing.' },
    { q: 'Which interface does ArrayList implement?', opts: ['Set', 'Map', 'List', 'Queue'], correct: 2, exp: 'ArrayList implements the List interface, providing ordered, index-based access to elements.' },
    { q: 'What happens if you add a duplicate to a HashSet?', opts: ['Throws exception', 'Replaces the element', 'Ignores the duplicate', 'Returns false'], correct: 2, exp: 'HashSet ignores duplicate elements because sets only contain unique values. add() returns false for duplicates.' },
    { q: 'Which collection is best for FIFO operations?', opts: ['Stack', 'LinkedList (as Queue)', 'TreeMap', 'HashSet'], correct: 1, exp: 'LinkedList implements the Queue interface and provides efficient FIFO operations with O(1) add/remove at ends.' },
    { q: 'What is the difference between HashMap and TreeMap?', opts: ['No difference', 'HashMap is unordered, TreeMap is sorted', 'HashMap is faster', 'TreeMap allows null keys'], correct: 1, exp: 'HashMap provides O(1) access but is unordered; TreeMap uses a red-black tree and keeps keys sorted with O(log n) access.' },
    { q: 'Which collection is thread-safe by default?', opts: ['ArrayList', 'HashMap', 'Vector', 'LinkedList'], correct: 2, exp: 'Vector is synchronized (thread-safe) by default, unlike ArrayList and HashMap.' },
    { q: 'What is an Iterator used for?', opts: ['Creating collections', 'Traversing collections', 'Sorting collections', 'Searching collections'], correct: 1, exp: 'An Iterator provides a way to traverse elements in a collection one at a time without exposing its internal structure.' },
    { q: 'Which map allows null keys?', opts: ['TreeMap', 'Hashtable', 'HashMap', 'ConcurrentHashMap'], correct: 2, exp: 'HashMap allows one null key and multiple null values. TreeMap, Hashtable, and ConcurrentHashMap do not allow null keys.' },
    { q: 'What is the initial capacity of an ArrayList?', opts: ['0', '10', '16', '20'], correct: 1, exp: 'ArrayList has a default initial capacity of 10 elements. It grows by 50% when capacity is reached.' },
  ],
};

// ─── Helper ──────────────────────────────────────────────────
const getTechIcon = (techName) => {
  const tech = TECHNOLOGIES.find((t) => t.name === techName);
  return tech ? tech.icon : '📝';
};

const getDiffColor = (diff) => {
  const level = DIFFICULTY_LEVELS.find((d) => d.value === diff);
  return level ? level.color : '#6366f1';
};

// ─── Floating background tokens for start phase ──────────────
const FLOAT_TOKENS = [
  { text: '{ }', top: '8%', left: '5%', delay: 0, dur: 14 },
  { text: '</>', top: '15%', right: '6%', delay: 1.2, dur: 12 },
  { text: '()', top: '70%', left: '3%', delay: 2.5, dur: 15 },
  { text: '[]', top: '80%', right: '5%', delay: 0.8, dur: 13 },
  { text: '++;', top: '40%', left: '2%', delay: 3.5, dur: 16 },
  { text: '===', top: '55%', right: '3%', delay: 1.8, dur: 14 },
];

// ─── QuizPage Component ──────────────────────────────────────
const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const quizId = parseInt(id, 10);
  const quiz = QUIZZES.find((q) => q.id === quizId);
  const questions = QUESTIONS[quizId] || [];

  // States: 'start' | 'playing' | 'result'
  const [phase, setPhase] = useState('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [reviewing, setReviewing] = useState(false);

  // 3D tilt ref for start card
  const startCardRef = useRef(null);

  // Initialize timer
  useEffect(() => {
    if (phase === 'playing' && quiz) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [phase, quiz]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft === 0]);

  // ── Mouse tilt handler for start card ──
  const handleStartCardMouseMove = useCallback((e) => {
    const card = startCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }, []);

  const handleStartCardMouseLeave = useCallback(() => {
    const card = startCardRef.current;
    if (card) card.style.transform = '';
  }, []);

  const handleStart = () => {
    setPhase('playing');
    setCurrentQ(0);
    setAnswers({});
    setReviewing(false);
  };

  const handleSelectAnswer = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleSubmit = useCallback(() => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((q, i) => {
      if (answers[i] === undefined) skipped++;
      else if (answers[i] === q.correct) correct++;
      else wrong++;
    });

    const totalMarks = questions.length;
    const score = correct;
    const percentage = Math.round((correct / totalMarks) * 100);
    const passed = percentage >= quiz.passingScore;
    const totalTime = quiz.duration * 60;
    const timeTaken = totalTime - timeLeft;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;

    setResult({
      score,
      totalMarks,
      percentage,
      correct,
      wrong,
      skipped,
      passed,
      timeTaken: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    });
    setPhase('result');
  }, [answers, questions, quiz, timeLeft]);

  const handleRetry = () => {
    setPhase('start');
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setReviewing(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Quiz Not Found ──────────────────────────────────────
  if (!quiz) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-not-found">
            <h2>Quiz Not Found</h2>
            <p>The quiz you're looking for doesn't exist.</p>
            <Link to="/quizzes" className="btn btn-primary">Back to Quizzes</Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Start Phase (ENHANCED 3D) ──────────────────────────
  if (phase === 'start') {
    return (
      <div className="quiz-page quiz-page-start">
        {/* 3D Background */}
        <div className="qs-bg" aria-hidden="true">
          <div className="qs-orb qs-orb-1" />
          <div className="qs-orb qs-orb-2" />
          <div className="qs-orb qs-orb-3" />
          <div className="qs-grid-pattern" />
          {FLOAT_TOKENS.map((t, i) => (
            <span
              key={i}
              className="qs-float-token"
              style={{
                top: t.top, left: t.left, right: t.right,
                animationDelay: `${t.delay}s`,
                animationDuration: `${t.dur}s`,
              }}
            >
              {t.text}
            </span>
          ))}
        </div>

        <div className="quiz-container">
          <div
            ref={startCardRef}
            className="quiz-start-card qs-card-3d"
            onMouseMove={handleStartCardMouseMove}
            onMouseLeave={handleStartCardMouseLeave}
          >
            <div className="qs-card-shine" />

            <div className="quiz-start-header qs-header-enhanced">
              <div className="qs-icon-3d-wrap">
                <div className="qs-icon-3d">
                  {getTechIcon(quiz.technology)}
                </div>
                <div className="qs-icon-ring" />
              </div>
              <div>
                <h1 className="qs-title">{quiz.title}</h1>
                <span className="quiz-start-tech">{quiz.technology}</span>
              </div>
            </div>

            <span
              className="quiz-start-diff qs-diff-3d"
              style={{
                background: `linear-gradient(135deg, ${getDiffColor(quiz.difficulty)}22, ${getDiffColor(quiz.difficulty)}11)`,
                color: getDiffColor(quiz.difficulty),
                border: `1px solid ${getDiffColor(quiz.difficulty)}30`,
              }}
            >
              {quiz.difficulty.charAt(0) + quiz.difficulty.slice(1).toLowerCase()}
            </span>

            <div className="quiz-start-stats qs-stats-row">
              <div className="qs-stat-pill">
                <div className="qs-stat-icon"><FiHelpCircle /></div>
                <div>
                  <div className="qs-stat-val">{quiz.totalQuestions}</div>
                  <div className="qs-stat-lbl">Questions</div>
                </div>
              </div>
              <div className="qs-stat-pill">
                <div className="qs-stat-icon"><FiClock /></div>
                <div>
                  <div className="qs-stat-val">{quiz.duration}</div>
                  <div className="qs-stat-lbl">Minutes</div>
                </div>
              </div>
              <div className="qs-stat-pill">
                <div className="qs-stat-icon"><FiAward /></div>
                <div>
                  <div className="qs-stat-val">{quiz.passingScore}%</div>
                  <div className="qs-stat-lbl">Pass</div>
                </div>
              </div>
            </div>

            <p className="quiz-start-desc qs-desc">{quiz.description}</p>

            <div className="quiz-start-rules qs-rules-3d">
              <h3>📋 Quiz Rules</h3>
              <ul className="qs-rules-list">
                <li className="qs-rule-item" style={{ animationDelay: '0.1s' }}>
                  <span className="qs-check">✓</span>
                  {quiz.totalQuestions} questions with one correct answer each
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.2s' }}>
                  <span className="qs-check">✓</span>
                  {quiz.duration} minute time limit
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.3s' }}>
                  <span className="qs-check">✓</span>
                  Passing score: {quiz.passingScore}%
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.4s' }}>
                  <span className="qs-check">✓</span>
                  Quiz automatically submits when time expires
                </li>
                <li className="qs-rule-item" style={{ animationDelay: '0.5s' }}>
                  <span className="qs-check">✓</span>
                  You can review your answers before submitting
                </li>
              </ul>
            </div>

            <button className="btn btn-primary btn-lg btn-3d qs-start-btn" onClick={handleStart}>
              <span className="qs-btn-shine" />
              ▶ Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Result Phase ────────────────────────────────────────
  if (phase === 'result' && result) {
    if (reviewing) {
      return (
        <div className="quiz-page">
          <div className="quiz-container">
            <div className="review-header">
              <h2>Answer Review — {quiz.title}</h2>
              <button className="btn btn-ghost" onClick={() => setReviewing(false)}>
                ← Back to Result
              </button>
            </div>
            <div className="review-questions">
              {questions.map((q, i) => {
                const userAnswer = answers[i];
                const isCorrect = userAnswer === q.correct;
                const isSkipped = userAnswer === undefined;
                return (
                  <div key={i} className={`review-question-card ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-q-header">
                      <span className="review-q-num">Question {i + 1}</span>
                      <span className={`review-status ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}`}>
                        {isSkipped ? '⊘ Skipped' : isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <p className="review-q-text">{q.q}</p>
                    <div className="review-options">
                      {q.opts.map((opt, j) => {
                        let cls = 'review-option';
                        if (j === q.correct) cls += ' correct';
                        if (j === userAnswer && j !== q.correct) cls += ' incorrect';
                        if (j === userAnswer) cls += ' selected';
                        return (
                          <div key={j} className={cls}>
                            {j === q.correct && <FiCheckCircle className="opt-icon" />}
                            {j === userAnswer && j !== q.correct && <FiXCircle className="opt-icon" />}
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    <div className="review-explanation">
                      <strong>Explanation:</strong> {q.exp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-result-card">
            <div className="result-header">
              <h1>Quiz Completed!</h1>
            </div>

            <div className={`result-circle ${result.passed ? 'passed' : 'failed'}`}>
              <span className="result-score">{result.percentage}%</span>
              <span className="result-fraction">{result.score} / {result.totalMarks}</span>
            </div>

            <div className={`result-badge ${result.passed ? 'passed' : 'failed'}`}>
              {result.passed ? '✓ PASSED' : '✗ FAILED'}
            </div>

            <div className="result-stats">
              <div className="result-stat">
                <span className="stat-val correct-color">{result.correct}</span>
                <span className="stat-lbl">Correct</span>
              </div>
              <div className="result-stat">
                <span className="stat-val wrong-color">{result.wrong}</span>
                <span className="stat-lbl">Wrong</span>
              </div>
              <div className="result-stat">
                <span className="stat-val skip-color">{result.skipped}</span>
                <span className="stat-lbl">Skipped</span>
              </div>
              <div className="result-stat">
                <span className="stat-val time-color">{result.timeTaken}</span>
                <span className="stat-lbl">Time Taken</span>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary btn-3d" onClick={() => setReviewing(true)}>
                Review Answers
              </button>
              <button className="btn btn-outline btn-3d" onClick={handleRetry}>
                <FiRefreshCw /> Retry Quiz
              </button>
              <Link to="/quizzes" className="btn btn-ghost">
                Back to Quizzes
              </Link>
              <Link to="/home" className="btn btn-ghost">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Playing Phase ───────────────────────────────────────
  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isLowTime = timeLeft <= 60;

  return (
    <div className="quiz-page">
      <div className="quiz-container quiz-playing">
        {/* Top bar */}
        <div className="quiz-topbar">
          <div className="quiz-topbar-left">
            <h2 className="quiz-playing-title">{quiz.title}</h2>
            <span className="quiz-topbar-tech">{getTechIcon(quiz.technology)} {quiz.technology}</span>
          </div>
          <div className={`quiz-timer ${isLowTime ? 'low-time' : ''}`}>
            <FiClock />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="quiz-question-card">
          <div className="quiz-q-header">
            <span className="quiz-q-num">Question {currentQ + 1} of {questions.length}</span>
            <span className="quiz-q-answered">{answeredCount} answered</span>
          </div>
          <p className="quiz-q-text">{q.q}</p>

          <div className="quiz-options">
            {q.opts.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${answers[currentQ] === i ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(currentQ, i)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            className="btn btn-ghost"
            onClick={handlePrev}
            disabled={currentQ === 0}
          >
            <FiArrowLeft /> Previous
          </button>
          {currentQ < questions.length - 1 ? (
            <button className="btn btn-primary btn-3d" onClick={handleNext}>
              Next <FiArrowRight />
            </button>
          ) : (
            <button className="btn btn-primary btn-3d" onClick={handleSubmit}>
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="quiz-navigator">
          <h4>Question Navigator</h4>
          <div className="quiz-nav-grid">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`quiz-nav-btn ${i === currentQ ? 'current' : ''} ${answers[i] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQ(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
