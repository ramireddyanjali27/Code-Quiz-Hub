// User Roles
export const ROLES = {
  USER: 'USER',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMIN: 'ADMIN',
};

// Dashboard routes by role
export const DASHBOARD_ROUTES = {
  USER: '/home',
  INSTRUCTOR: '/instructor-dashboard',
  ADMIN: '/admin-dashboard',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', color: '#10b981' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: '#f59e0b' },
  { value: 'ADVANCED', label: 'Advanced', color: '#f43f5e' },
];

// Question Types
export const QUESTION_TYPES = [
  { value: 'MCQ', label: 'Multiple Choice' },
  { value: 'OUTPUT_BASED', label: 'Output Based' },
  { value: 'CODE_ANALYSIS', label: 'Code Analysis' },
  { value: 'DEBUGGING', label: 'Debugging' },
  { value: 'CONCEPTUAL', label: 'Conceptual' },
  { value: 'TRUE_FALSE', label: 'True / False' },
];

// Sample Technologies with icons
export const TECHNOLOGIES = [
  { name: 'Java', icon: '☕', color: '#f89820' },
  { name: 'Python', icon: '🐍', color: '#3776AB' },
  { name: 'JavaScript', icon: '⚡', color: '#F7DF1E' },
  { name: 'React', icon: '⚛️', color: '#61DAFB' },
  { name: 'SQL', icon: '🗄️', color: '#336791' },
  { name: 'MySQL', icon: '🐬', color: '#4479A1' },
  { name: 'Data Structures', icon: '🧠', color: '#8B5CF6' },
  { name: 'Algorithms', icon: '🧮', color: '#EC4899' },
  { name: 'Spring Boot', icon: '🌱', color: '#6DB33F' },
  { name: 'HTML', icon: '🌐', color: '#E34F26' },
  { name: 'CSS', icon: '🎨', color: '#1572B6' },
  { name: 'C', icon: '⚙️', color: '#A8B9CC' },
  { name: 'C++', icon: '🔧', color: '#00599C' },
  { name: 'C#', icon: '🎯', color: '#68217A' },
  { name: 'Node.js', icon: '🟩', color: '#339933' },
  { name: 'Git', icon: '📋', color: '#F05032' },
  { name: 'Docker', icon: '🐳', color: '#2496ED' },
  { name: 'OOP', icon: '🏗️', color: '#FF6B35' },
  { name: 'DBMS', icon: '💾', color: '#00758F' },
  { name: 'Operating Systems', icon: '🖥️', color: '#4B2E83' },
  { name: 'Computer Networks', icon: '🌐', color: '#006D77' },
];

// Pagination defaults
export const PAGE_SIZE = 12;

// Toast positions
export const TOAST_POSITION = 'top-right';
