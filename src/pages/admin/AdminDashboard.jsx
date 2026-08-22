import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard-page">
      <div className="page-container">
        <div className="dashboard-greeting">
          <h1>Admin Dashboard 🛡️</h1>
          <p>Welcome, {user?.fullName}</p>
        </div>

        <div className="admin-stats-cards">
          {[
            { value: '156', label: 'Total Users', icon: '👥' },
            { value: '12', label: 'Instructors', icon: '👨‍🏫' },
            { value: '21', label: 'Technologies', icon: '💻' },
            { value: '450', label: 'Questions', icon: '❓' },
            { value: '85', label: 'Quizzes', icon: '📝' },
            { value: '2.3K', label: 'Attempts', icon: '📊' },
            { value: '76%', label: 'Avg Score', icon: '📈' },
          ].map((stat, index) => (
            <div key={index} className="admin-stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-placeholder">
          <h2>Admin management sections will be implemented in Phase 9</h2>
          <p>User management, technology management, question management, and analytics coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
