import api from './api';

const topicService = {
  getAll: () => {
    return api.get('/topics');
  },

  getByTechnology: (technologyId) => {
    return api.get(`/topics/technology/${technologyId}`);
  },

  getById: (id) => {
    return api.get(`/topics/${id}`);
  },

  create: (data) => {
    return api.post('/topics', data);
  },

  update: (id, data) => {
    return api.put(`/topics/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/topics/${id}`);
  },
};

export default topicService;
