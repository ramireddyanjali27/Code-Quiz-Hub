import api from './api';

const userService = {
  getAll: (params = {}) => {
    return api.get('/users', { params });
  },

  getById: (id) => {
    return api.get(`/users/${id}`);
  },

  create: (data) => {
    return api.post('/users', data);
  },

  update: (id, data) => {
    return api.put(`/users/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/users/${id}`);
  },

  activate: (id) => {
    return api.put(`/users/${id}/activate`);
  },

  deactivate: (id) => {
    return api.put(`/users/${id}/deactivate`);
  },
};

export default userService;
