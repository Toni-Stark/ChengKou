const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const defaultEnvPath = path.resolve(__dirname, '../.env');
const productionEnvPath = path.resolve(__dirname, '../.env.production');

require('dotenv').config({ path: defaultEnvPath });

if (process.env.NODE_ENV === 'production' && fs.existsSync(productionEnvPath)) {
  require('dotenv').config({ path: productionEnvPath, override: true });
}

const researchRoutes = require('./routes/research');
const articlesRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// 确保日志目录存在
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 创建日志流
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// CORS 配置
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // 允许没有 origin 的请求（如移动应用、Postman等）
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || !isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 压缩响应
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
}));

// 日志中间件
if (isProduction) {
  // 生产环境：记录到文件
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  // 开发环境：输出到控制台
  app.use(morgan('dev'));
}

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 信任代理（Nginx 反向代理）
if (isProduction) {
  app.set('trust proxy', 1);
}

// 路由
app.use('/api/research', researchRoutes);
app.use('/api/articles', articlesRoutes);

// 健康检查（用于监控和负载均衡）
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage()
  });
});

// 就绪检查（用于容器编排）
app.get('/api/ready', async (req, res) => {
  try {
    // 可以添加数据库连接检查
    res.json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: error.message });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.path,
    method: req.method
  });
});

// 错误处理
app.use((err, req, res, next) => {
  // 记录错误
  console.error('[错误]', {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });

  // CORS 错误特殊处理
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy: 该域名不被允许访问'
    });
  }

  // 响应错误
  res.status(err.status || 500).json({
    error: isProduction ? '服务器内部错误' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，准备关闭服务器...');
  server.close(() => {
    console.log('HTTP 服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，准备关闭服务器...');
  server.close(() => {
    console.log('HTTP 服务器已关闭');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   学术研究门户 - 后端服务           ║
╚═══════════════════════════════════════╝

  环境: ${process.env.NODE_ENV}
  端口: ${PORT}
  时间: ${new Date().toLocaleString()}
  PID: ${process.pid}

`);

  // PM2 通知就绪
  if (process.send) {
    process.send('ready');
  }
});

module.exports = app;
