# ✅ 数据库配置快速清单

> 打印此清单，逐项勾选完成

---

## 📝 准备工作

- [ ] 已开通云开发
- [ ] 已配置环境 ID（`miniprogram/app.js` 第19行）
- [ ] 云开发控制台已打开

---

## 🗄️ 创建数据库集合

在云开发控制台 → 数据库 → 点击「添加集合」

### 集合 1：user_dynamics
- [ ] 集合名称：`user_dynamics`
- [ ] 权限设置：**所有用户可读，仅创建者可写**
- [ ] 创建成功

### 集合 2：likes
- [ ] 集合名称：`likes`
- [ ] 权限设置：**所有用户可读，仅创建者可写**
- [ ] 创建成功

### 集合 3：comments
- [ ] 集合名称：`comments`
- [ ] 权限设置：**所有用户可读，仅创建者可写**
- [ ] 创建成功

### 集合 4：follows
- [ ] 集合名称：`follows`
- [ ] 权限设置：**所有用户可读，仅创建者可写**
- [ ] 创建成功

---

## 📤 部署云函数

右键文件夹 → 上传并部署：云端安装依赖

- [ ] `getUserDynamics` - 获取动态列表 ✅ **必需**
- [ ] `publishDynamic` - 发布动态 📝 **推荐**
- [ ] `toggleLike` - 点赞功能 ❤️ **推荐**
- [ ] `getComments` - 获取评论（可选）
- [ ] `addComment` - 添加评论（可选）

---

## 🧪 添加测试数据

### 方式一：通过小程序发布（推荐）

- [ ] 进入「动态」页面
- [ ] 点击右下角「+」按钮
- [ ] 发布第 1 条动态（文本类型）
- [ ] 发布第 2 条动态（大图类型，可不加图片）
- [ ] 发布第 3 条动态（九宫格类型）

### 方式二：手动添加（如果云函数未部署）

打开云开发控制台 → 数据库 → user_dynamics → 添加记录

#### 添加纯文本动态（复制粘贴）

```json
{
  "userInfo": {
    "nickName": "测试用户",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "text",
  "content": "这是一条测试动态！今天天气真不错。",
  "title": "",
  "subtitle": "",
  "images": [],
  "location": null,
  "likesCount": 0,
  "commentsCount": 0,
  "sharesCount": 0,
  "status": "published",
  "isPrivate": false,
  "createTime": "2026-01-07 15:30:00"
}
```

- [ ] 已添加测试数据 1

#### 添加大图模式动态（复制粘贴）

```json
{
  "userInfo": {
    "nickName": "游泳教练",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "large",
  "title": "自由泳技巧分享",
  "subtitle": "初学者必看",
  "content": "今天给大家分享一些自由泳的基本技巧。",
  "images": [],
  "location": {
    "name": "专业训练馆"
  },
  "likesCount": 128,
  "commentsCount": 35,
  "sharesCount": 0,
  "status": "published",
  "isPrivate": false,
  "createTime": "2026-01-07 14:30:00"
}
```

- [ ] 已添加测试数据 2

#### 添加九宫格模式动态（复制粘贴）

```json
{
  "userInfo": {
    "nickName": "运动爱好者",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "grid9",
  "content": "今天训练的成果！连续游了20个来回，突破极限💪",
  "title": "",
  "subtitle": "",
  "images": [],
  "location": {
    "name": "体育中心游泳池"
  },
  "likesCount": 66,
  "commentsCount": 18,
  "sharesCount": 0,
  "status": "published",
  "isPrivate": false,
  "createTime": "2026-01-07 13:15:00"
}
```

- [ ] 已添加测试数据 3

---

## ✅ 功能验证

### 在小程序中测试

- [ ] 点击「编译」按钮
- [ ] 进入「动态」页面
- [ ] 能看到动态列表（真实数据，不是模拟数据）
- [ ] 动态按时间倒序排列（最新的在最上面）
- [ ] 下拉刷新正常工作
- [ ] 上拉加载更多正常工作

### 测试发布功能

- [ ] 点击右下角「+」按钮
- [ ] 能打开发布页面
- [ ] 选择展示类型
- [ ] 填写内容
- [ ] 点击发布
- [ ] 发布成功并返回列表
- [ ] 在列表中能看到刚发布的动态

### 测试点赞功能（如果已部署 toggleLike）

- [ ] 点击动态的点赞图标
- [ ] 图标变为红色
- [ ] 点赞数 +1
- [ ] 再次点击取消点赞
- [ ] 图标变为灰色
- [ ] 点赞数 -1

---

## 🔍 故障排查

### 问题：控制台提示「云开发未配置」
- [ ] 检查 `app.js` 第19行环境 ID 是否正确
- [ ] 重新编译小程序

### 问题：动态列表为空
- [ ] 检查数据库中是否有数据
- [ ] 检查数据的 `status` 是否为 `"published"`
- [ ] 检查数据的 `isPrivate` 是否为 `false`
- [ ] 检查数据库权限是否设置正确

### 问题：云函数调用失败
- [ ] 检查云函数是否部署成功
- [ ] 查看云函数日志是否有错误
- [ ] 重新上传并部署云函数

### 问题：发布功能报错
- [ ] 检查 `publishDynamic` 云函数是否已部署
- [ ] 查看控制台错误日志
- [ ] 确认用户信息是否存在

---

## 📊 数据验证

在云开发控制台 → 数据库中验证：

- [ ] `user_dynamics` 集合中有至少 3 条数据
- [ ] 每条数据的 `status` 都是 `"published"`
- [ ] 每条数据的 `isPrivate` 都是 `false`
- [ ] 每条数据都有 `userInfo`、`displayType`、`createTime` 字段

---

## 🎉 完成确认

全部勾选完成后，数据库配置就完成了！

- [ ] 4 个数据库集合已创建
- [ ] 数据库权限已正确配置
- [ ] 至少部署了 `getUserDynamics` 云函数
- [ ] 数据库中有测试数据
- [ ] 小程序能正常加载动态列表
- [ ] 发布功能正常工作（如果已部署云函数）

---

## 📚 详细文档

如需更详细的说明，请查看：

- [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md) - 数据库配置详细指南
- [CLOUD_SERVICE_SETUP.md](./CLOUD_SERVICE_SETUP.md) - 云服务配置指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 完整部署清单

---

**日期：________ 完成人：________**
