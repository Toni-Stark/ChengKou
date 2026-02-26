const express = require('express');
const router = express.Router();
const { articles } = require('../models/articlesData');

// 获取所有论文
router.get('/', (req, res) => {
  const { category, year, tag, page = 1, limit = 10 } = req.query;

  let filteredArticles = [...articles];

  // 按类别筛选
  if (category) {
    filteredArticles = filteredArticles.filter(
      article => article.category === category
    );
  }

  // 按年份筛选
  if (year) {
    filteredArticles = filteredArticles.filter(
      article => article.year === parseInt(year)
    );
  }

  // 按标签筛选
  if (tag) {
    filteredArticles = filteredArticles.filter(
      article => article.tags.includes(tag)
    );
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedArticles,
    pagination: {
      total: filteredArticles.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(filteredArticles.length / limit)
    }
  });
});

// 获取单个论文详情
router.get('/:id', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.id));

  if (!article) {
    return res.status(404).json({
      success: false,
      error: '论文不存在'
    });
  }

  res.json({
    success: true,
    data: article
  });
});

module.exports = router;
