const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let SQL;
let db;

const dbPath = path.join(__dirname, '../../data/academic_portal.db');

// 初始化数据库
async function initDatabase() {
  if (!SQL) {
    SQL = await initSqlJs();
  }

  // 确保data目录存在
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 尝试加载现有数据库或创建新数据库
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // 创建表结构
  createTables();

  return db;
}

// 创建数据库表结构
function createTables() {
  const tables = [
    // 研究领域表
    `CREATE TABLE IF NOT EXISTS research_areas (
      id INTEGER PRIMARY KEY,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT NOT NULL,
      detail_page TEXT
    )`,

    // AI应用表
    `CREATE TABLE IF NOT EXISTS ai_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )`,

    // 研究方法 - AI可解释性
    `CREATE TABLE IF NOT EXISTS ai_explainability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )`,

    // 研究工具
    `CREATE TABLE IF NOT EXISTS research_tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )`,

    // 热门标签
    `CREATE TABLE IF NOT EXISTS popular_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag_name TEXT NOT NULL UNIQUE
    )`,

    // AI思维导图节点
    `CREATE TABLE IF NOT EXISTS ai_mindmap_nodes (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      title TEXT NOT NULL,
      default_open INTEGER DEFAULT 0,
      node_order INTEGER DEFAULT 0
    )`,

    // 航天工程图谱节点
    `CREATE TABLE IF NOT EXISTS aerospace_nodes (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category INTEGER NOT NULL,
      symbol_size INTEGER NOT NULL
    )`,

    // 航天工程图谱连接
    `CREATE TABLE IF NOT EXISTS aerospace_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source INTEGER NOT NULL,
      target INTEGER NOT NULL,
      value INTEGER NOT NULL
    )`,

    // 航天详情数据
    `CREATE TABLE IF NOT EXISTS aerospace_details (
      node_id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      points TEXT NOT NULL
    )`,

    // 数据科学学科
    `CREATE TABLE IF NOT EXISTS ds_disciplines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      items TEXT NOT NULL
    )`,

    // 数据科学课程
    `CREATE TABLE IF NOT EXISTS ds_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      items TEXT NOT NULL
    )`,

    // 数据科学技能
    `CREATE TABLE IF NOT EXISTS ds_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      items TEXT NOT NULL
    )`,

    // 数据科学论文
    `CREATE TABLE IF NOT EXISTS ds_papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INTEGER NOT NULL,
      journal TEXT NOT NULL,
      description TEXT NOT NULL
    )`,

    // 数据科学论文分类
    `CREATE TABLE IF NOT EXISTS ds_paper_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )`,

    // 计算力学核心模块
    `CREATE TABLE IF NOT EXISTS cm_core_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      icon TEXT NOT NULL,
      items TEXT NOT NULL
    )`,

    // 计算力学核心方法
    `CREATE TABLE IF NOT EXISTS cm_core_methods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      items TEXT NOT NULL
    )`,

    // 计算力学论文
    `CREATE TABLE IF NOT EXISTS cm_papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INTEGER NOT NULL,
      description TEXT NOT NULL
    )`,

    // 计算力学软件
    `CREATE TABLE IF NOT EXISTS cm_software (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      items TEXT NOT NULL
    )`,

    // 计算力学前沿
    `CREATE TABLE IF NOT EXISTS cm_frontiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL
    )`,

    // 计算力学学习路径
    `CREATE TABLE IF NOT EXISTS cm_learning_path (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_order INTEGER NOT NULL,
      content TEXT NOT NULL
    )`
  ];

  tables.forEach(sql => {
    db.run(sql);
  });

  console.log('数据库表结构初始化完成');
}

// 保存数据库到文件
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// 获取数据库实例
async function getDatabase() {
  if (!db) {
    await initDatabase();
  }
  return db;
}

module.exports = {
  initDatabase,
  getDatabase,
  saveDatabase
};
