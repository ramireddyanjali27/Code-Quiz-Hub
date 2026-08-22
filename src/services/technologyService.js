import api from './api';

const technologyService = {
  getAll: () => {
    return api.get('/technologies');
  },

  getById: (id) => {
    return api.get(`/technologies/${id}`);
  },

  create: (data) => {
    return api.post('/technologies', data);
  },

  update: (id, data) => {
    return api.put(`/technologies/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/technologies/${id}`);
  },
};

export default technologyService;
