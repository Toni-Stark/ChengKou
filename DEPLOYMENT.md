# 部署指南

本项目已简化为纯静态数据存储，无需数据库配置。

## 项目结构

```
fake-job/
├── backend/          # 后端 API 服务
│   ├── src/
│   │   ├── models/   # 数据文件（JS格式）
│   │   ├── routes/   # API 路由
│   │   ├── services/ # 业务逻辑
│   │   └── server.js # 服务入口
│   └── package.json
└── frontend/         # 前端应用
    ├── src/
    └── package.json
```

## 后端部署

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改：

```bash
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://aerospace.lovebeyonddays.com
```

### 3. 启动服务

```bash
npm start
```

## 前端部署

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 构建生产版本

```bash
npm run build
```

### 3. 部署静态文件

将 `dist/` 目录部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## 数据管理

所有数据存储在 `backend/src/models/` 目录：
- `researchData.js` - 研究领域、方法、标签等数据
- `articlesData.js` - 论文文章数据

修改数据后重启后端服务即可生效。

## 注意事项

1. 后端服务需要持续运行（可使用 PM2）
2. 前端需要配置正确的 API 地址
3. 生产环境建议使用 Nginx 反向代理
4. 确保防火墙开放相应端口
