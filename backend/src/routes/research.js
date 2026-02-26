const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// 获取所有研究领域
router.get('/areas', async (req, res) => {
  try {
    const data = await dataService.getResearchAreas();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取研究领域失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取AI应用案例
router.get('/ai-applications', async (req, res) => {
  try {
    const data = await dataService.getAiApplications();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取AI应用失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取研究方法
router.get('/methods', async (req, res) => {
  try {
    const data = await dataService.getResearchMethods();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取研究方法失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取热门标签
router.get('/tags', async (req, res) => {
  try {
    const data = await dataService.getPopularTags();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取热门标签失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取AI思维导图数据
router.get('/ai-mindmap', async (req, res) => {
  try {
    const data = await dataService.getAiMindmap();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取AI思维导图失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取航天工程图谱数据
router.get('/aerospace-graph', async (req, res) => {
  try {
    const result = await dataService.getAerospaceGraph();
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('获取航天图谱失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取数据科学知识体系数据
router.get('/data-science-data', async (req, res) => {
  try {
    const data = await dataService.getDataScienceData();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取数据科学数据失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取计算力学知识体系数据
router.get('/computational-mechanics-data', async (req, res) => {
  try {
    const data = await dataService.getComputationalMechanicsData();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取计算力学数据失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

module.exports = router;
