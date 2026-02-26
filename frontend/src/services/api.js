import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 研究领域相关API
export const researchAPI = {
  getAreas: () => api.get('/research/areas'),
  getAIApplications: () => api.get('/research/ai-applications'),
  getMethods: () => api.get('/research/methods'),
  getTags: () => api.get('/research/tags'),
  getAIMindMap: () => api.get('/research/ai-mindmap'),
  getAerospaceGraph: () => api.get('/research/aerospace-graph'),
  getDataScienceData: () => api.get('/research/data-science-data'),
  getComputationalMechanicsData: () => api.get('/research/computational-mechanics-data'),
};

// 论文相关API
export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
};

// 健康检查
export const healthCheck = () => api.get('/health');

export default api;
