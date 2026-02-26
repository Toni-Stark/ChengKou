const { initDatabase, saveDatabase } = require('../config/database');
const researchData = require('../models/researchData');

async function initData() {
  console.log('开始初始化数据库数据...');

  // 初始化数据库
  const db = await initDatabase();

  // 清空现有数据
  const tables = [
    'research_areas', 'ai_applications', 'ai_explainability', 'research_tools',
    'popular_tags', 'ai_mindmap_nodes', 'aerospace_links', 'aerospace_nodes',
    'aerospace_details', 'ds_disciplines', 'ds_courses', 'ds_skills', 'ds_papers',
    'ds_paper_categories', 'cm_core_modules', 'cm_core_methods', 'cm_papers',
    'cm_software', 'cm_frontiers', 'cm_learning_path'
  ];

  tables.forEach(table => {
    db.run(`DELETE FROM ${table}`);
  });

  console.log('已清空现有数据');

  // 1. 研究领域
  researchData.researchAreas.forEach(area => {
    db.run(
      `INSERT INTO research_areas (id, icon, title, description, tags, detail_page)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [area.id, area.icon, area.title, area.description, JSON.stringify(area.tags), area.detailPage]
    );
  });
  console.log('研究领域数据导入完成');

  // 2. AI应用
  researchData.aiApplications.forEach(app => {
    db.run(
      `INSERT INTO ai_applications (id, title, description) VALUES (?, ?, ?)`,
      [app.id, app.title, app.description]
    );
  });
  console.log('AI应用数据导入完成');

  // 3. AI可解释性方法
  researchData.researchMethods.aiExplainability.forEach(item => {
    db.run(
      `INSERT INTO ai_explainability (title, description) VALUES (?, ?)`,
      [item.title, item.description]
    );
  });
  console.log('AI可解释性方法导入完成');

  // 4. 研究工具
  researchData.researchMethods.researchTools.forEach(tool => {
    db.run(
      `INSERT INTO research_tools (title, description) VALUES (?, ?)`,
      [tool.title, tool.description]
    );
  });
  console.log('研究工具数据导入完成');

  // 5. 热门标签
  researchData.popularTags.forEach(tag => {
    db.run(`INSERT INTO popular_tags (tag_name) VALUES (?)`, [tag]);
  });
  console.log('热门标签数据导入完成');

  // 6. AI思维导图
  function insertMindmapRecursive(node, parentId = null, order = 0) {
    db.run(
      `INSERT INTO ai_mindmap_nodes (id, parent_id, title, default_open, node_order)
       VALUES (?, ?, ?, ?, ?)`,
      [node.id, parentId, node.title, node.defaultOpen ? 1 : 0, order]
    );

    if (node.children) {
      node.children.forEach((child, index) => {
        insertMindmapRecursive(child, node.id, index);
      });
    }
  }

  insertMindmapRecursive(researchData.aiMindMapData);
  console.log('AI思维导图数据导入完成');

  // 7. 航天工程图谱节点
  researchData.aerospaceGraphData.nodes.forEach(node => {
    db.run(
      `INSERT INTO aerospace_nodes (id, name, category, symbol_size) VALUES (?, ?, ?, ?)`,
      [node.id, node.name, node.category, node.symbolSize]
    );
  });
  console.log('航天节点数据导入完成');

  // 8. 航天工程图谱连接
  researchData.aerospaceGraphData.links.forEach(link => {
    db.run(
      `INSERT INTO aerospace_links (source, target, value) VALUES (?, ?, ?)`,
      [link.source, link.target, link.value]
    );
  });
  console.log('航天连接数据导入完成');

  // 9. 航天详情数据
  Object.keys(researchData.aerospaceDetailData).forEach(nodeId => {
    const detail = researchData.aerospaceDetailData[nodeId];
    if (detail.items && detail.items.length > 0) {
      db.run(
        `INSERT INTO aerospace_details (node_id, title, subtitle, points) VALUES (?, ?, ?, ?)`,
        [parseInt(nodeId), detail.title, detail.items[0].subtitle, JSON.stringify(detail.items[0].points)]
      );
    }
  });
  console.log('航天详情数据导入完成');

  // 10. 数据科学学科
  researchData.dataScienceData.disciplines.forEach(disc => {
    db.run(
      `INSERT INTO ds_disciplines (title, items) VALUES (?, ?)`,
      [disc.title, JSON.stringify(disc.items)]
    );
  });
  console.log('数据科学学科导入完成');

  // 11. 数据科学课程
  researchData.dataScienceData.courses.forEach(course => {
    db.run(
      `INSERT INTO ds_courses (title, items) VALUES (?, ?)`,
      [course.title, JSON.stringify(course.items)]
    );
  });
  console.log('数据科学课程导入完成');

  // 12. 数据科学技能
  researchData.dataScienceData.skills.forEach(skill => {
    db.run(
      `INSERT INTO ds_skills (title, items) VALUES (?, ?)`,
      [skill.title, JSON.stringify(skill.items)]
    );
  });
  console.log('数据科学技能导入完成');

  // 13. 数据科学论文分类
  researchData.dataScienceData.paperCategories.forEach(cat => {
    db.run(
      `INSERT INTO ds_paper_categories (id, name) VALUES (?, ?)`,
      [cat.id, cat.name]
    );
  });
  console.log('数据科学论文分类导入完成');

  // 14. 数据科学论文
  researchData.dataScienceData.papers.forEach(paper => {
    db.run(
      `INSERT INTO ds_papers (category, title, author, year, journal, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [paper.category, paper.title, paper.author, paper.year, paper.journal, paper.description]
    );
  });
  console.log('数据科学论文导入完成');

  // 15. 计算力学核心模块
  researchData.computationalMechanicsData.coreModules.forEach(module => {
    db.run(
      `INSERT INTO cm_core_modules (title, icon, items) VALUES (?, ?, ?)`,
      [module.title, module.icon, JSON.stringify(module.items)]
    );
  });
  console.log('计算力学核心模块导入完成');

  // 16. 计算力学核心方法
  researchData.computationalMechanicsData.coreMethods.forEach(method => {
    db.run(
      `INSERT INTO cm_core_methods (title, items) VALUES (?, ?)`,
      [method.title, JSON.stringify(method.items)]
    );
  });
  console.log('计算力学核心方法导入完成');

  // 17. 计算力学论文
  researchData.computationalMechanicsData.papers.forEach(paper => {
    db.run(
      `INSERT INTO cm_papers (title, author, year, description) VALUES (?, ?, ?, ?)`,
      [paper.title, paper.author, paper.year, paper.description]
    );
  });
  console.log('计算力学论文导入完成');

  // 18. 计算力学软件
  researchData.computationalMechanicsData.software.forEach(sw => {
    db.run(
      `INSERT INTO cm_software (title, items) VALUES (?, ?)`,
      [sw.title, JSON.stringify(sw.items)]
    );
  });
  console.log('计算力学软件导入完成');

  // 19. 计算力学前沿
  researchData.computationalMechanicsData.frontiers.forEach(frontier => {
    db.run(
      `INSERT INTO cm_frontiers (title, icon, description) VALUES (?, ?, ?)`,
      [frontier.title, frontier.icon, frontier.description]
    );
  });
  console.log('计算力学前沿导入完成');

  // 20. 计算力学学习路径
  researchData.computationalMechanicsData.learningPath.forEach((step, index) => {
    db.run(
      `INSERT INTO cm_learning_path (step_order, content) VALUES (?, ?)`,
      [index, step]
    );
  });
  console.log('计算力学学习路径导入完成');

  // 保存数据库
  saveDatabase();
  console.log('所有数据初始化完成并已保存！');
}

// 执行初始化
initData().catch(error => {
  console.error('数据初始化失败：', error);
  process.exit(1);
});
