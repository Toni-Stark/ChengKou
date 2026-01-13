# 🚀 云服务快速联调指南

5 分钟完成云服务配置和测试！

---

## ⚡ 5步快速完成

### 1️⃣ 开通云开发（1分钟）
1. 微信开发者工具顶部 → 点击「云开发」
2. 按提示开通（免费）
3. **记录环境 ID**（格式：`cloud1-xxxxx`）

### 2️⃣ 配置环境 ID（30秒）
打开 `miniprogram/app.js`，第 19 行：
```javascript
// 修改前：
// env: 'your-env-id',

// 修改后（取消注释并填写）：
env: 'cloud1-xxxxx',  // ← 填写您的环境 ID
```

### 3️⃣ 创建数据库集合（2分钟）
云开发控制台 → 数据库 → 添加集合（权限选"所有用户可读，仅创建者可写"）：
- `user_dynamics` ✅
- `likes` ✅
- `comments` ✅
- `follows` ✅

### 4️⃣ 部署云函数（1分钟）
右键文件夹 → 上传并部署：云端安装依赖
- `cloudfunctions/getUserDynamics` ✅ **必需**
- `cloudfunctions/publishDynamic` 📝 推荐
- `cloudfunctions/toggleLike` ❤️ 推荐

### 5️⃣ 添加测试数据（30秒）
**方式一（推荐）：** 小程序 → 动态页 → 点击 + 发布测试动态

**方式二：** 云开发 → 数据库 → user_dynamics → 添加记录：
```json
{
  "userInfo": {
    "nickName": "测试用户",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "text",
  "content": "这是一条测试动态！",
  "images": [],
  "location": null,
  "likesCount": 0,
  "commentsCount": 0,
  "sharesCount": 0,
  "status": "published",
  "isPrivate": false,
  "createTime": "2026-01-07 15:00:00"
}
```

---

## ✅ 测试验证

编译 → 动态页面 → 查看是否显示真实数据

**成功标志：**
- ✅ 动态列表加载成功（不是模拟数据）
- ✅ 内容正确显示
- ✅ 按时间倒序排列
- ✅ 下拉刷新正常
- ✅ 控制台无报错

---

## 🆘 快速排查

| 问题 | 解决方案 |
|------|---------|
| "云开发未配置" | app.js 环境 ID 未填写或错误 |
| 云函数调用失败 | 检查云函数部署状态 |
| 数据库为空 | 确认已添加测试数据 |
| 只显示模拟数据 | 查看控制台错误日志 |

---

## 📚 详细文档

- 📋 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 完整部署清单
- 📖 [CLOUD_SERVICE_SETUP.md](./CLOUD_SERVICE_SETUP.md) - 详细配置说明
- 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 问题排查

---

祝您部署顺利！🎉
