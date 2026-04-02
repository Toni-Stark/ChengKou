# 旅行日志后台管理系统

完整的旅行日志网站，包含前台展示和后台管理功能。

## 功能特性

### 前台展示 (/)
- 左侧时间线展示旅行节点
- 右侧交互式地图显示路线和标记点
- 点击节点查看详细内容（文字、图片、视频）
- 搜索和日期筛选功能
- 支持多个旅行切换

### 后台管理 (/admin)
- **旅行管理**：创建、编辑、删除旅行日志
- **节点管理**：为每个旅行添加、编辑、删除节点记录
- 节点包含：日期时间、标题、地点、坐标、描述、详细内容、图片、视频、标签

## 技术栈

- **后端**: Node.js + Express
- **前端**: 原生 HTML/CSS/JavaScript
- **地图**: Leaflet.js
- **数据存储**: JSON 文件
- **部署**: Docker

## 快速开始

### 本地开发

1. 安装依赖
```bash
cd travel
npm install
```

2. 启动服务器
```bash
npm start
```

3. 访问
- 前台: http://localhost:3002
- 后台: http://localhost:3002/admin

### Docker 部署

```bash
# 构建并启动
docker-compose up -d --build travel

# 查看日志
docker-compose logs -f travel

# 停止服务
docker-compose down
```

服务运行在端口 `8081`（映射到容器内的 `3002`）。

## 目录结构

```
travel/
├── server/
│   └── index.js          # Express 服务器
├── public/
│   ├── index.html        # 前台页面
│   └── admin.html        # 后台管理页面
├── data/
│   └── travels.json      # 数据存储
├── package.json
└── Dockerfile
```

## API 接口

### 旅行管理
- `GET /api/trips` - 获取所有旅行
- `GET /api/trips/:id` - 获取单个旅行
- `POST /api/trips` - 创建旅行
- `PUT /api/trips/:id` - 更新旅行
- `DELETE /api/trips/:id` - 删除旅行

### 节点管理
- `POST /api/trips/:tripId/checkpoints` - 添加节点
- `PUT /api/trips/:tripId/checkpoints/:checkpointId` - 更新节点
- `DELETE /api/trips/:tripId/checkpoints/:checkpointId` - 删除节点

## 数据格式

### 旅行对象
```json
{
  "id": 1,
  "name": "旅行名称",
  "description": "旅行描述",
  "startDate": "2026-04-05",
  "endDate": "2026-04-09",
  "coverImage": "图片URL",
  "checkpoints": []
}
```

### 节点对象
```json
{
  "id": 1,
  "date": "2026-04-05",
  "time": "08:30",
  "title": "节点标题",
  "location": "地点名称",
  "lat": 29.7196,
  "lng": 106.6419,
  "description": "简短描述",
  "fullText": "详细内容",
  "images": ["图片URL1", "图片URL2"],
  "video": "视频URL",
  "tags": ["标签1", "标签2"]
}
```

## 使用说明

### 添加新旅行

1. 访问 http://localhost:3002/admin
2. 点击「新建旅行」按钮
3. 填写旅行信息（名称、描述、日期、封面图）
4. 点击「保存」

### 添加节点记录

1. 在后台管理页面点击某个旅行进入详情
2. 点击「添加节点」按钮
3. 填写节点信息：
   - 日期和时间
   - 标题和地点
   - 经纬度坐标（可通过地图工具获取）
   - 简短描述和详细内容
   - 图片 URL（每行一个）
   - 视频 URL（可选）
   - 标签（逗号分隔）
4. 点击「保存」

### 获取坐标

推荐使用以下工具获取地点坐标：
- [高德地图坐标拾取器](https://lbs.amap.com/tools/picker)
- [百度地图坐标拾取器](https://api.map.baidu.com/lbsapi/getpoint/index.html)
- Google Maps（右键点击地点查看坐标）

### 图片和视频

- 图片：使用图床服务（如 Imgur、SM.MS）或 CDN 链接
- 视频：使用视频托管服务（如 YouTube、Vimeo）的嵌入链接

## 部署到生产环境

### Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name lovebeyonddays.com www.lovebeyonddays.com;

    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 数据备份

定期备份 `data/travels.json` 文件：

```bash
# 手动备份
cp travel/data/travels.json travel/data/travels.json.backup

# 或使用 Docker volume 备份
docker run --rm -v travel_travel-data:/data -v $(pwd):/backup alpine tar czf /backup/travels-backup.tar.gz -C /data .
```

## 故障排查

### 服务无法启动
- 检查端口 3002 是否被占用
- 查看日志: `docker-compose logs travel`

### 数据未保存
- 确认 `data/travels.json` 文件有写入权限
- 检查 Docker volume 挂载是否正确

### 地图不显示
- 检查网络连接（Leaflet.js 需要从 CDN 加载）
- 确认坐标格式正确（纬度在前，经度在后）

## 许可证

MIT License
