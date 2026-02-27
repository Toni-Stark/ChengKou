#!/bin/sh

# 检查数据库是否存在，如果不存在则初始化
if [ ! -f "/app/data/academic_portal.db" ]; then
  echo "数据库不存在，开始初始化..."
  npm run init-db
  echo "数据库初始化完成"
else
  echo "数据库已存在，跳过初始化"
fi

# 启动应用
npm start
