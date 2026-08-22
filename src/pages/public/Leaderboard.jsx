import { useState } from 'react';
import { FiClock, FiFilter } from 'react-icons/fi';
import { TECHNOLOGIES } from '../../utils/constants';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData] = useState([
    { rank: 1, name: 'Rahul Sharma', points: 950, quizzesCompleted: 45, avgScore: 92, avatar: 'R' },
    { rank: 2, name: 'Priya Patel', points: 920, quizzesCompleted: 42, avgScore: 89, avatar: 'P' },
    { rank: 3, name: 'Anjali Reddy', points: 900, quizzesCompleted: 40, avgScore: 88, avatar: 'A' },
    { rank: 4, name: 'Kiran Kumar', points: 870, quizzesCompleted: 38, avgScore: 85, avatar: 'K' },
    { rank: 5, name: 'Sneha Gupta', points: 850, quizzesCompleted: 36, avgScore: 84, avatar: 'S' },
    { rank: 6, name: 'Amit Singh', points: 820, quizzesCompleted: 34, avgScore: 82, avatar: 'A' },
    { rank: 7, name: 'Neha Verma', points: 800, quizzesCompleted: 33, avgScore: 80, avatar: 'N' },
    { rank: 8, name: 'Vikram Rao', points: 780, quizzesCompleted: 31, avgScore: 79, avatar: 'V' },
    { rank: 9, name: 'Deepika Nair', points: 760, quizzesCompleted: 30, avgScore: 78, avatar: 'D' },
    { rank: 10, name: 'Sanjay Mehta', points: 740, quizzesCompleted: 28, avgScore: 76, avatar: 'S' },
  ]);

  const [filter, setFilter] = useState('overall');
  const [techFilter, setTechFilter] = useState('All');

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getAvatarColor = (name) => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const top3 = leaderboardData.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // silver, gold, bronze
  const podiumClass = ['silver', 'gold', 'bronze'];

  return (
    <div className="leaderboard-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🏆 Leaderboard</h1>
          <p>Top performers across the platform</p>
        </div>

        {/* Podium */}
        <div className="lb-podium">
          {podiumOrder.map((user, i) => (
            <div key={user.rank} className="lb-podium-item">
              <div className={`lb-podium-avatar ${podiumClass[i]}`}>{user.avatar}</div>
              <div className="lb-podium-name">{user.name.split(' ')[0]}</div>
              <div className="lb-podium-points">{user.points} pts</div>
              <div className={`lb-podium-bar ${podiumClass[i]}`} />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="leaderboard-filters">
          <div className="filter-tabs">
            {[
              { value: 'overall', label: 'Overall' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ].map((tab) => (
              <button
                key={tab.value}
                className={`filter-tab ${filter === tab.value ? 'active' : ''}`}
                onClick={() => setFilter(tab.value)}
              >
                <FiClock /> {tab.label}
              </button>
            ))}
          </div>
          <select
            className="tech-filter"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
          >
            <option value="All">All Technologies</option>
            {TECHNOLOGIES.slice(0, 10).map((tech) => (
              <option key={tech.name} value={tech.name}>{tech.icon} {tech.name}</option>
            ))}
          </select>
        </div>

        {/* Leaderboard Table */}
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="rank-col">Rank</th>
                <th className="user-col">User</th>
                <th>Points</th>
                <th>Quizzes</th>
                <th>Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user) => (
                <tr
                  key={user.rank}
                  className={user.rank <= 3 ? `top-${user.rank}` : ''}
                >
                  <td className="rank-col">
                    <span className={`rank-badge rank-${user.rank}`}>
                      {getRankBadge(user.rank)}
                    </span>
                  </td>
                  <td className="user-col">
                    <div className="user-info">
                      <div
                        className="user-avatar"
                        style={{ background: getAvatarColor(user.name) }}
                      >
                        {user.avatar}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <strong className="points">{user.points}</strong>
                  </td>
                  <td>{user.quizzesCompleted}</td>
                  <td>
                    <span className="score-badge">{user.avgScore}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
