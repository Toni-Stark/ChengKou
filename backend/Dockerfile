# Backend Dockerfile
FROM befyzewc.mirror.aliyuncs.com/library/node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖（包含 devDependencies 以支持数据初始化）
RUN npm ci

# 复制源代码
COPY . .

# 复制启动脚本
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["/app/start.sh"]
