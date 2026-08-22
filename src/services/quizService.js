import api from './api';

const quizService = {
  getAll: (params = {}) => {
    return api.get('/quizzes', { params });
  },

  getById: (id) => {
    return api.get(`/quizzes/${id}`);
  },

  create: (data) => {
    return api.post('/quizzes', data);
  },

  update: (id, data) => {
    return api.put(`/quizzes/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/quizzes/${id}`);
  },

  getByTechnology: (technologyId, params = {}) => {
    return api.get(`/quizzes/technology/${technologyId}`, { params });
  },

  startQuiz: (quizId) => {
    return api.post(`/quizzes/${quizId}/start`);
  },

  submitQuiz: (quizId, answers) => {
    return api.post(`/quizzes/${quizId}/submit`, { answers });
  },
};

export default quizService;
