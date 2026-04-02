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

## 旅行日志部署 (lovebeyonddays.com)

旅行日志是独立的静态网站，部署在根域名 `lovebeyonddays.com` 下，与 `aerospace.lovebeyonddays.com` 互不干扰。

### Docker 部署

```bash
# 仅启动旅行日志服务
docker-compose up -d travel

# 或者启动所有服务
docker-compose up -d
```

旅行日志服务在端口 `8081` 运行。

### Nginx 反向代理配置

在服务器主 Nginx 中添加：

```nginx
# 旅行日志 - lovebeyonddays.com
server {
    listen 80;
    server_name lovebeyonddays.com www.lovebeyonddays.com;

    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 学术门户 - aerospace.lovebeyonddays.com (已有配置，保持不变)
server {
    listen 80;
    server_name aerospace.lovebeyonddays.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 更新旅行日志数据

编辑 `travel/index.html` 中的 `travelData` 数组，添加新的行程记录：

```javascript
{
  id: 11,           // 唯一 ID
  date: '2026-04-10', // 日期
  time: '09:00',      // 时间
  title: '标题',
  location: '地点名称',
  lat: 25.0,          // 纬度
  lng: 100.0,         // 经度
  description: '简短描述',
  fullText: '详细内容（支持换行）',
  images: ['图片URL1', '图片URL2'],
  video: '视频URL（可选）',
  tags: ['标签1', '标签2']
}
```

重新构建容器即可更新：
```bash
docker-compose up -d --build travel
```
