# Frontend Dockerfile - Multi-stage build
FROM node:20-alpine AS builder

# 解决alpine系统缺少依赖的问题 + 切换国内npm源（核心优化）
RUN apk add --no-cache git \
    && npm config set registry https://registry.npmmirror.com \
    && npm config set fetch-retry-maxtimeout 60000 \
    && npm cache clean --force

WORKDIR /app

# 复制package文件（保留原有逻辑）
COPY package*.json ./

# 安装依赖：兼容npm ci失败场景，增加错误处理（核心优化）
RUN npm ci --no-audit --no-fund || ( \
    echo "npm ci 失败，降级为 npm install" && \
    rm -rf node_modules package-lock.json && \
    npm install --no-audit --no-fund \
)

# 复制源代码
COPY . .

# 构建应用：增加构建失败提示
RUN npm run build || ( \
    echo "构建失败，检查代码或依赖" && \
    cat npm-debug.log || true && \
    exit 1 \
)

# 生产环境 - 使用nginx
FROM nginx:alpine

# 清理nginx默认配置，避免冲突
RUN rm -rf /usr/share/nginx/html/*

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置：增加配置检查
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t || (echo "nginx配置错误" && cat /etc/nginx/conf.d/default.conf && exit 1)

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
