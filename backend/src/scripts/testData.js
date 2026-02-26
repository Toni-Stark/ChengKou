const { getDatabase } = require('../config/database');

async function testData() {
  console.log('开始测试数据库数据...\n');

  const db = await getDatabase();

  // 测试各个表的数据
  const tables = [
    { name: 'research_areas', label: '研究领域' },
    { name: 'ai_applications', label: 'AI应用' },
    { name: 'ai_explainability', label: 'AI可解释性' },
    { name: 'research_tools', label: '研究工具' },
    { name: 'popular_tags', label: '热门标签' },
    { name: 'ai_mindmap_nodes', label: 'AI思维导图节点' },
    { name: 'aerospace_nodes', label: '航天节点' },
    { name: 'aerospace_links', label: '航天连接' },
    { name: 'aerospace_details', label: '航天详情' },
    { name: 'ds_disciplines', label: '数据科学学科' },
    { name: 'ds_courses', label: '数据科学课程' },
    { name: 'ds_skills', label: '数据科学技能' },
    { name: 'ds_papers', label: '数据科学论文' },
    { name: 'ds_paper_categories', label: '论文分类' },
    { name: 'cm_core_modules', label: '计算力学核心模块' },
    { name: 'cm_core_methods', label: '计算力学核心方法' },
    { name: 'cm_papers', label: '计算力学论文' },
    { name: 'cm_software', label: '计算力学软件' },
    { name: 'cm_frontiers', label: '计算力学前沿' },
    { name: 'cm_learning_path', label: '计算力学学习路径' }
  ];

  tables.forEach(({ name, label }) => {
    try {
      const result = db.exec(`SELECT COUNT(*) as count FROM ${name}`);
      const count = result[0] ? result[0].values[0][0] : 0;
      console.log(`✓ ${label} (${name}): ${count} 条记录`);
    } catch (error) {
      console.log(`✗ ${label} (${name}): 错误 - ${error.message}`);
    }
  });

  console.log('\n数据库测试完成！');
}

testData().catch(error => {
  console.error('测试失败：', error);
  process.exit(1);
});
