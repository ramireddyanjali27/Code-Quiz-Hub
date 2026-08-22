import { useAuth } from '../../context/AuthContext';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="instructor-dashboard-page">
      <div className="page-container">
        <div className="dashboard-greeting">
          <h1>Instructor Dashboard 👨‍🏫</h1>
          <p>Welcome, {user?.fullName}</p>
        </div>

        <div className="instructor-stats-cards">
          {[
            { value: '120', label: 'My Questions', icon: '❓' },
            { value: '15', label: 'My Quizzes', icon: '📝' },
            { value: '850', label: 'Quiz Attempts', icon: '📊' },
            { value: '74%', label: 'Avg Score', icon: '📈' },
          ].map((stat, index) => (
            <div key={index} className="instructor-stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-placeholder">
          <h2>Instructor tools will be implemented in Phase 9</h2>
          <p>Question management, quiz creation, and topic management coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
