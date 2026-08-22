import api from './api';

const questionService = {
  getAll: (params = {}) => {
    return api.get('/questions', { params });
  },

  getById: (id) => {
    return api.get(`/questions/${id}`);
  },

  create: (data) => {
    return api.post('/questions', data);
  },

  update: (id, data) => {
    return api.put(`/questions/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/questions/${id}`);
  },

  getByTechnology: (technologyId, params = {}) => {
    return api.get(`/questions/technology/${technologyId}`, { params });
  },

  getByTopic: (topicId, params = {}) => {
    return api.get(`/questions/topic/${topicId}`, { params });
  },
};

export default questionService;
