const researchData = require('../models/researchData');
const { articles } = require('../models/articlesData');

class DataService {
  // 获取所有研究领域
  async getResearchAreas() {
    return researchData.researchAreas || [];
  }

  // 获取AI应用
  async getAiApplications() {
    return researchData.aiApplications || [];
  }

  // 获取研究方法
  async getResearchMethods() {
    return researchData.researchMethods || { aiExplainability: [], researchTools: [] };
  }

  // 获取热门标签
  async getPopularTags() {
    return researchData.popularTags || [];
  }

  // 获取AI思维导图数据
  async getAiMindmap() {
    return researchData.aiMindMapData || null;
  }

  // 获取航天工程图谱数据
  async getAerospaceGraph() {
    return {
      data: researchData.aerospaceGraphData || { nodes: [], links: [] },
      detailData: researchData.aerospaceDetailData || {}
    };
  }

  // 获取数据科学知识体系数据
  async getDataScienceData() {
    return researchData.dataScienceData || {
      disciplines: [],
      courses: [],
      skills: [],
      paperCategories: [],
      papers: []
    };
  }

  // 获取计算力学知识体系数据
  async getComputationalMechanicsData() {
    return researchData.computationalMechanicsData || {
      coreModules: [],
      coreMethods: [],
      papers: [],
      software: [],
      frontiers: [],
      learningPath: []
    };
  }

  // 获取所有文章
  async getArticles() {
    return articles || [];
  }
}

module.exports = new DataService();
