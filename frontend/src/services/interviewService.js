import api from './api.js';

export const interviewService = {
  // Create a new interview session
  createInterview: async (data) => {
    const res = await api.post('/interviews', data);
    return res.data;
  },

  // Get user interviews with pagination and filters
  getInterviews: async (params = {}) => {
    const res = await api.get('/interviews', { params });
    return res.data;
  },

  // Get single interview by ID with questions
  getInterviewById: async (id) => {
    const res = await api.get(`/interviews/${id}`);
    return res.data;
  },

  // Start interview
  startInterview: async (id) => {
    const res = await api.patch(`/interviews/${id}/start`);
    return res.data;
  },

  // Complete interview
  completeInterview: async (id) => {
    const res = await api.patch(`/interviews/${id}/complete`);
    return res.data;
  },

  // Delete/cancel interview
  deleteInterview: async (id) => {
    const res = await api.delete(`/interviews/${id}`);
    return res.data;
  },

  // Generate next question
  getNextQuestion: async (interviewId) => {
    const res = await api.post(`/interviews/${interviewId}/questions/next`);
    return res.data;
  },

  // Submit answer for evaluation
  submitAnswer: async (interviewId, questionId, answerText) => {
    const res = await api.post(
      `/interviews/${interviewId}/questions/${questionId}/answer`,
      { answerText }
    );
    return res.data;
  },
};

export default interviewService;
