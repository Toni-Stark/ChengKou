# Docker 部署说明

## 已修复的问题

1. **后端数据库初始化**
   - 添加了 `start.sh` 启动脚本，自动检查并初始化数据库
   - 修改 Dockerfile 安装完整依赖（包含 devDependencies）

2. **移除开发环境 volumes**
   - 移除了 docker-compose.yml 中的 volumes 挂载
   - 避免本地文件覆盖容器内构建的文件

## 启动步骤

```bash
# 构建并启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 服务访问

- 前端: http://localhost
- 后端 API: http://localhost:3001
- 健康检查: http://localhost:3001/api/health

## 验证清单

- [ ] 后端容器启动成功
- [ ] 数据库自动初始化
- [ ] 前端构建成功
- [ ] Nginx 正确代理 API 请求
- [ ] 前端可以访问后端 API

## 故障排查

### 后端启动失败
```bash
# 查看后端日志
docker-compose logs backend

# 进入容器检查
docker-compose exec backend sh
ls -la /app/data/
```

### 前端构建失败
```bash
# 查看前端日志
docker-compose logs frontend

# 检查构建过程
docker-compose build frontend --no-cache
```

### API 请求失败
- 检查 nginx 配置中的 proxy_pass 地址
- 确认后端服务名称为 "backend"
- 验证网络连接: `docker-compose exec frontend ping backend`
