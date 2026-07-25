import api from './api.js';

export const analyticsService = {
  getUserAnalytics: async () => {
    const res = await api.get('/analytics');
    return res.data;
  },
};

export default analyticsService;
