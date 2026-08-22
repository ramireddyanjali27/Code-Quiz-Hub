import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="page-container">
        <div className="dashboard-greeting">
          <h1>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p>Continue your learning journey</p>
        </div>

        <div className="stats-cards">
          {[
            { value: '24', label: 'Quizzes Taken', icon: '📝' },
            { value: '18', label: 'Passed', icon: '✅' },
            { value: '82%', label: 'Avg Score', icon: '📊' },
            { value: '350', label: 'Questions Solved', icon: '💡' },
          ].map((stat, index) => (
            <div key={index} className="dashboard-stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-placeholder">
          <h2>Dashboard content will be implemented in Phase 7</h2>
          <p>Performance analytics, topic-wise breakdown, and recommendations coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
