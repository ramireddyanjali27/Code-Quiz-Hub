import api from './api';

const achievementService = {
  getAll: () => {
    return api.get('/achievements');
  },

  getByUser: (userId) => {
    return api.get(`/achievements/user/${userId}`);
  },

  getMyAchievements: () => {
    return api.get('/achievements/my');
  },

  create: (data) => {
    return api.post('/achievements', data);
  },

  update: (id, data) => {
    return api.put(`/achievements/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/achievements/${id}`);
  },
};

export default achievementService;
