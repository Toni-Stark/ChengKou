const { getDatabase } = require('../config/database');

class DataService {
  // 获取所有研究领域
  async getResearchAreas() {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM research_areas ORDER BY id');

    if (!result[0]) return [];

    return result[0].values.map(row => ({
      id: row[0],
      icon: row[1],
      title: row[2],
      description: row[3],
      tags: JSON.parse(row[4]),
      detailPage: row[5]
    }));
  }

  // 获取AI应用
  async getAiApplications() {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM ai_applications ORDER BY id');

    if (!result[0]) return [];

    return result[0].values.map(row => ({
      id: row[0],
      title: row[1],
      description: row[2]
    }));
  }

  // 获取研究方法
  async getResearchMethods() {
    const db = await getDatabase();

    const explainResult = db.exec('SELECT * FROM ai_explainability');
    const toolsResult = db.exec('SELECT * FROM research_tools');

    return {
      aiExplainability: explainResult[0] ? explainResult[0].values.map(row => ({
        title: row[1],
        description: row[2]
      })) : [],
      researchTools: toolsResult[0] ? toolsResult[0].values.map(row => ({
        title: row[1],
        description: row[2]
      })) : []
    };
  }

  // 获取热门标签
  async getPopularTags() {
    const db = await getDatabase();
    const result = db.exec('SELECT tag_name FROM popular_tags ORDER BY id');

    if (!result[0]) return [];

    return result[0].values.map(row => row[0]);
  }

  // 获取AI思维导图数据
  async getAiMindmap() {
    const db = await getDatabase();
    const result = db.exec(`
      SELECT id, parent_id, title, default_open, node_order
      FROM ai_mindmap_nodes
      ORDER BY node_order
    `);

    if (!result[0]) return null;

    const nodes = {};
    result[0].values.forEach(row => {
      nodes[row[0]] = {
        id: row[0],
        parentId: row[1],
        title: row[2],
        defaultOpen: row[3] === 1,
        order: row[4],
        children: []
      };
    });

    // 构建树结构
    let root = null;
    Object.values(nodes).forEach(node => {
      if (node.parentId === null) {
        root = node;
      } else if (nodes[node.parentId]) {
        nodes[node.parentId].children.push(node);
      }
    });

    // 转换为原始格式
    function convertNode(node) {
      const result = {
        id: node.id,
        title: node.title
      };
      if (node.defaultOpen) {
        result.defaultOpen = true;
      }
      if (node.children.length > 0) {
        result.children = node.children
          .sort((a, b) => a.order - b.order)
          .map(child => convertNode(child));
      }
      return result;
    }

    return root ? convertNode(root) : null;
  }

  // 获取航天工程图谱数据
  async getAerospaceGraph() {
    const db = await getDatabase();

    const nodesResult = db.exec('SELECT * FROM aerospace_nodes ORDER BY id');
    const linksResult = db.exec('SELECT source, target, value FROM aerospace_links');
    const detailsResult = db.exec('SELECT * FROM aerospace_details');

    const nodes = nodesResult[0] ? nodesResult[0].values.map(row => ({
      id: row[0],
      name: row[1],
      category: row[2],
      symbolSize: row[3]
    })) : [];

    const links = linksResult[0] ? linksResult[0].values.map(row => ({
      source: row[0],
      target: row[1],
      value: row[2]
    })) : [];

    const detailData = {};
    if (detailsResult[0]) {
      detailsResult[0].values.forEach(row => {
        detailData[row[0]] = {
          title: row[1],
          items: [{
            subtitle: row[2],
            points: JSON.parse(row[3])
          }]
        };
      });
    }

    return {
      data: { nodes, links },
      detailData
    };
  }

  // 获取数据科学知识体系数据
  async getDataScienceData() {
    const db = await getDatabase();

    const disciplines = db.exec('SELECT * FROM ds_disciplines');
    const courses = db.exec('SELECT * FROM ds_courses');
    const skills = db.exec('SELECT * FROM ds_skills');
    const paperCategories = db.exec('SELECT * FROM ds_paper_categories');
    const papers = db.exec('SELECT * FROM ds_papers');

    return {
      disciplines: disciplines[0] ? disciplines[0].values.map(row => ({
        title: row[1],
        items: JSON.parse(row[2])
      })) : [],
      courses: courses[0] ? courses[0].values.map(row => ({
        title: row[1],
        items: JSON.parse(row[2])
      })) : [],
      skills: skills[0] ? skills[0].values.map(row => ({
        title: row[1],
        items: JSON.parse(row[2])
      })) : [],
      paperCategories: paperCategories[0] ? paperCategories[0].values.map(row => ({
        id: row[0],
        name: row[1]
      })) : [],
      papers: papers[0] ? papers[0].values.map(row => ({
        category: row[1],
        title: row[2],
        author: row[3],
        year: row[4],
        journal: row[5],
        description: row[6]
      })) : []
    };
  }

  // 获取计算力学知识体系数据
  async getComputationalMechanicsData() {
    const db = await getDatabase();

    const coreModules = db.exec('SELECT * FROM cm_core_modules');
    const coreMethods = db.exec('SELECT * FROM cm_core_methods');
    const papers = db.exec('SELECT * FROM cm_papers');
    const software = db.exec('SELECT * FROM cm_software');
    const frontiers = db.exec('SELECT * FROM cm_frontiers');
    const learningPath = db.exec('SELECT * FROM cm_learning_path ORDER BY step_order');

    return {
      coreModules: coreModules[0] ? coreModules[0].values.map(row => ({
        title: row[1],
        icon: row[2],
        items: JSON.parse(row[3])
      })) : [],
      coreMethods: coreMethods[0] ? coreMethods[0].values.map(row => ({
        title: row[1],
        items: JSON.parse(row[2])
      })) : [],
      papers: papers[0] ? papers[0].values.map(row => ({
        title: row[1],
        author: row[2],
        year: row[3],
        description: row[4]
      })) : [],
      software: software[0] ? software[0].values.map(row => ({
        title: row[1],
        items: JSON.parse(row[2])
      })) : [],
      frontiers: frontiers[0] ? frontiers[0].values.map(row => ({
        title: row[1],
        icon: row[2],
        description: row[3]
      })) : [],
      learningPath: learningPath[0] ? learningPath[0].values.map(row => row[2]) : []
    };
  }
}

module.exports = new DataService();
