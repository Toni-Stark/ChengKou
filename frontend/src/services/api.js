import axios from 'axios';

// 获取API基础URL，优先使用环境变量
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  // 如果有环境变量配置
  if (envUrl) {
    // 在生产环境且当前页面是HTTPS时，自动将API地址也改为HTTPS
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return envUrl.replace(/^http:/, 'https:');
    }
    return envUrl;
  }

  // 如果没有环境变量，使用相对路径（会自动使用当前页面的协议和域名）
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

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
