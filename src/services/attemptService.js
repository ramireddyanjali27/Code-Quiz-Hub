import api from './api';

const attemptService = {
  getById: (id) => {
    return api.get(`/attempts/${id}`);
  },

  getByUser: (userId, params = {}) => {
    return api.get(`/attempts/user/${userId}`, { params });
  },

  getMyAttempts: (params = {}) => {
    return api.get('/attempts/my', { params });
  },
};

export default attemptService;
