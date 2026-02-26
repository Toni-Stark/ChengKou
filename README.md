# 学术研究门户 - Academic Research Portal

前后端分离的学术研究门户网站，专注于人工智能、航天工程、数据科学领域的研究成果展示。

## 技术栈

### 前端
- **React 18** - UI框架（单页应用SPA）
- **React Router** - 路由管理
- **Vite** - 构建工具
- **Tailwind CSS** - CSS框架
- **Chart.js** - 图表可视化
- **ECharts** - 知识图谱可视化
- **Axios** - HTTP客户端

### 后端
- **Node.js** - 运行环境
- **Express** - Web框架
- **CORS** - 跨域支持
- **Helmet** - 安全中间件

## 架构说明

本项目采用**React单页应用（SPA）架构**，所有页面都是React组件，通过React Router进行路由管理。

### 页面路由
- `/` - 首页（研究领域、论文列表等）
- `/ai-detail` - 人工智能核心概念关系导图
- `/aerospace-detail` - 航天工程全生命周期知识图谱

详细架构说明请查看 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 项目结构

```
fake-job/
├── frontend/                    # React前端应用（SPA）
│   ├── src/
│   │   ├── components/         # 可复用组件
│   │   ├── pages/              # 页面级组件
│   │   │   ├── AIDetailPage.jsx
│   │   │   └── AerospaceDetailPage.jsx
│   │   ├── services/           # API服务层
│   │   ├── styles/             # 样式文件
│   │   └── App.jsx             # 路由配置
│   ├── Dockerfile              # 前端Docker配置
│   └── nginx.conf              # Nginx配置
├── backend/                    # Node.js后端API
│   ├── src/
│   │   ├── routes/             # API路由
│   │   ├── models/             # 数据模型
│   │   └── server.js           # 服务器入口
│   └── Dockerfile              # 后端Docker配置
├── docker-compose.yml          # Docker编排配置
├── ARCHITECTURE.md             # 架构详细说明
└── README.md
```

## 快速开始

### 本地开发

#### 1. 安装依赖

**后端:**
```bash
cd backend
npm install
```

**前端:**
```bash
cd frontend
npm install
```

#### 2. 配置环境变量

**后端 (backend/.env):**
```env
PORT=3001
NODE_ENV=development
```

**前端 (frontend/.env):**
```env
VITE_API_BASE_URL=/api
```

#### 3. 启动服务

**后端:**
```bash
cd backend
npm run dev
```

**前端:**
```bash
cd frontend
npm run dev
```

前端访问地址: http://localhost:3000
后端API地址: http://localhost:3001

### Docker部署

#### 1. 构建并启动所有服务

```bash
docker-compose up -d
```

#### 2. 停止服务

```bash
docker-compose down
```

#### 3. 查看日志

```bash
docker-compose logs -f
```

访问地址: http://localhost

## API接口文档

### 研究领域相关

- `GET /api/research/areas` - 获取所有研究领域
- `GET /api/research/ai-applications` - 获取AI应用案例
- `GET /api/research/methods` - 获取研究方法
- `GET /api/research/tags` - 获取热门标签

### 论文相关

- `GET /api/articles` - 获取所有论文
  - 查询参数: `category`, `year`, `tag`, `page`, `limit`
- `GET /api/articles/:id` - 获取单个论文详情

### 健康检查

- `GET /api/health` - 服务健康检查

## 部署指南

### 1. 生产环境变量配置

**后端:**
```env
PORT=3001
NODE_ENV=production
```

**前端:**
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 2. 使用Docker Compose部署

```bash
# 构建生产镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看运行状态
docker-compose ps
```

### 3. Nginx反向代理配置（可选）

如果需要在生产环境使用自定义域名，可以在主机上配置Nginx反向代理:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. 云平台部署

#### Vercel (前端)
1. 连接GitHub仓库
2. 设置构建命令: `cd frontend && npm run build`
3. 设置输出目录: `frontend/dist`
4. 配置环境变量

#### Heroku (后端)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

#### AWS/阿里云/腾讯云
使用Docker镜像部署到云服务器的容器服务。

## 开发说明

### 添加新的API接口

1. 在 `backend/src/models/` 中创建数据模型
2. 在 `backend/src/routes/` 中创建路由
3. 在 `backend/src/server.js` 中注册路由
4. 在 `frontend/src/services/api.js` 中添加API调用方法

### 添加新的React组件

1. 在 `frontend/src/components/` 中创建组件文件
2. 在需要的地方导入并使用组件
3. 使用Tailwind CSS进行样式定制

## 性能优化

- 前端使用Vite构建，支持HMR快速开发
- 生产环境使用Nginx托管静态文件
- 启用Gzip压缩减少传输大小
- 静态资源配置长期缓存
- Docker多阶段构建减少镜像大小

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系：15502354225@163.com
