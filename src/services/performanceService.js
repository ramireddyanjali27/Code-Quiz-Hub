import api from './api';

const performanceService = {
  getUserPerformance: (userId) => {
    return api.get(`/performance/user/${userId}`);
  },

  getUserPerformanceByTechnology: (userId, technologyId) => {
    return api.get(`/performance/user/${userId}/technology/${technologyId}`);
  },

  getMyPerformance: () => {
    return api.get('/performance/my');
  },

  getTopicPerformance: (userId) => {
    return api.get(`/performance/user/${userId}/topics`);
  },
};

export default performanceService;
