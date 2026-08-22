import api from './api';

const leaderboardService = {
  getOverall: (params = {}) => {
    return api.get('/leaderboard', { params });
  },

  getByTechnology: (technologyId, params = {}) => {
    return api.get(`/leaderboard/technology/${technologyId}`, { params });
  },

  getWeekly: (params = {}) => {
    return api.get('/leaderboard/weekly', { params });
  },

  getMonthly: (params = {}) => {
    return api.get('/leaderboard/monthly', { params });
  },

  getMyRank: () => {
    return api.get('/leaderboard/me');
  },
};

export default leaderboardService;
