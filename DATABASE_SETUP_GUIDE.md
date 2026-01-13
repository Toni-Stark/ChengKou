# 📊 数据库配置和操作指南

本指南将详细指导您完成云数据库的创建、配置和测试数据添加。

---

## 📌 目录

- [第一步：创建数据库集合](#第一步创建数据库集合)
- [第二步：配置数据库权限](#第二步配置数据库权限)
- [第三步：添加测试数据](#第三步添加测试数据)
- [第四步：验证数据](#第四步验证数据)
- [常见问题](#常见问题)

---

## 第一步：创建数据库集合

### 1.1 打开云开发控制台

1. 打开微信开发者工具
2. 点击顶部菜单栏的「**云开发**」按钮
3. 在云开发控制台中，点击左侧的「**数据库**」标签

### 1.2 创建 user_dynamics 集合（用户动态）

这是**最重要**的集合，用于存储所有用户发布的动态。

**操作步骤：**

1. 点击「**添加集合**」按钮
2. 集合名称输入：`user_dynamics`
3. 点击「**确定**」

**数据结构示例：**
```json
{
  "_id": "动态ID（自动生成）",
  "_openid": "用户OpenID（自动生成）",
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "用户头像URL"
  },
  "displayType": "展示类型：grid9 | large | text",
  "content": "动态文本内容",
  "title": "标题（仅large模式使用）",
  "subtitle": "副标题（仅large模式使用）",
  "images": ["图片URL数组"],
  "location": {
    "name": "位置名称",
    "latitude": 纬度,
    "longitude": 经度
  },
  "likesCount": 0,
  "commentsCount": 0,
  "sharesCount": 0,
  "status": "published",
  "isPrivate": false,
  "createTime": "2026-01-07 15:30:00",
  "updateTime": "2026-01-07 15:30:00"
}
```

### 1.3 创建 likes 集合（点赞记录）

**操作步骤：**
1. 点击「添加集合」
2. 集合名称：`likes`
3. 点击「确定」

**数据结构示例：**
```json
{
  "_id": "点赞记录ID",
  "_openid": "点赞用户OpenID",
  "targetType": "目标类型：dynamic | comment",
  "targetId": "目标ID（动态ID或评论ID）",
  "createTime": "2026-01-07 15:30:00"
}
```

### 1.4 创建 comments 集合（评论）

**操作步骤：**
1. 点击「添加集合」
2. 集合名称：`comments`
3. 点击「确定」

**数据结构示例：**
```json
{
  "_id": "评论ID",
  "_openid": "评论用户OpenID",
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "用户头像URL"
  },
  "dynamicId": "动态ID",
  "content": "评论内容",
  "replyTo": "回复的评论ID（可选）",
  "replyToUser": {
    "openid": "被回复用户OpenID",
    "nickName": "被回复用户昵称"
  },
  "likesCount": 0,
  "createTime": "2026-01-07 15:30:00"
}
```

### 1.5 创建 follows 集合（关注关系）

**操作步骤：**
1. 点击「添加集合」
2. 集合名称：`follows`
3. 点击「确定」

**数据结构示例：**
```json
{
  "_id": "关注记录ID",
  "_openid": "关注者OpenID（我）",
  "followingOpenid": "被关注者OpenID",
  "followingUserInfo": {
    "nickName": "被关注用户昵称",
    "avatarUrl": "被关注用户头像URL"
  },
  "createTime": "2026-01-07 15:30:00"
}
```

---

## 第二步：配置数据库权限

为了确保数据安全，需要为每个集合设置正确的权限。

### 2.1 配置 user_dynamics 权限

1. 在数据库页面，找到 `user_dynamics` 集合
2. 点击集合名称右侧的「⚙️ 设置」图标
3. 在「权限设置」中选择：**所有用户可读，仅创建者可写**
4. 点击「保存」

**解释：**
- **所有用户可读**：任何人都可以查看动态列表
- **仅创建者可写**：只有发布者本人可以修改或删除自己的动态

### 2.2 配置其他集合权限

对以下集合重复相同的操作：
- [ ] `likes` → 所有用户可读，仅创建者可写
- [ ] `comments` → 所有用户可读，仅创建者可写
- [ ] `follows` → 所有用户可读，仅创建者可写

---

## 第三步：添加测试数据

### 3.1 方式一：通过小程序发布（推荐）

**步骤：**
1. 在小程序中进入「动态」页面
2. 点击右下角的「+」按钮
3. 选择展示类型并填写内容
4. 点击「发布」

**优点：**
- 真实模拟用户操作
- 自动生成完整的数据结构
- 自动上传图片到云存储

### 3.2 方式二：手动添加到数据库

如果云函数还未部署，可以手动添加测试数据。

**步骤：**

#### 添加纯文本动态

1. 打开云开发控制台 → 数据库
2. 点击 `user_dynamics` 集合
3. 点击「添加记录」
4. 复制以下内容并粘贴：

```json
{
  "userInfo": {
    "nickName": "测试用户",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "text",
  "content": "这是一条测试动态！今天天气真不错，适合去游泳。",
  "title": "",
  "subtitle": "",
  "images": [],
  "location": {
    "name": "市游泳馆"
  },
  "likesCount": 0,
  "commentsCount": 0,
  "sharesCount": 0,
  "status": "published",
  "isPrivate": false,
  "createTime": "2026-01-07 15:30:00"
}
```

5. 点击「确定」

#### 添加大图模式动态

```json
{
  "userInfo": {
    "nickName": "游泳教练",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "large",
  "title": "自由泳技巧分享",
  "subtitle": "初学者必看",
  "content": "今天给大家分享一些自由泳的基本技巧。首先是呼吸节奏，建议初学者采用3-5次划手换一次气的方式，不要急于求成。",
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

#### 添加九宫格模式动态

```json
{
  "userInfo": {
    "nickName": "运动爱好者",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "grid9",
  "content": "今天训练的成果！连续游了20个来回，终于突破了自己的极限💪",
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

### 3.3 批量添加测试数据

如果需要添加多条数据，重复以上步骤，或者修改 `createTime` 和内容后添加。

**建议至少添加 5-8 条测试数据**，以便测试：
- 列表滚动
- 时间排序
- 不同展示类型的显示效果

---

## 第四步：验证数据

### 4.1 在数据库中验证

1. 打开云开发控制台 → 数据库
2. 点击 `user_dynamics` 集合
3. 确认能看到刚添加的记录
4. 检查每条记录的字段是否完整

### 4.2 在小程序中验证

1. 编译运行小程序
2. 进入「动态」页面
3. 检查以下内容：
   - [ ] 动态列表正常加载
   - [ ] 显示真实数据（不是模拟数据）
   - [ ] 按时间倒序排列（最新的在最上面）
   - [ ] 用户信息正确显示
   - [ ] 不同展示类型正确渲染

### 4.3 控制台验证

打开微信开发者工具的 Console 面板，查看日志：
- ✅ 如果看到云函数调用成功的日志，说明联调成功
- ❌ 如果看到「云开发未配置」，检查 app.js 中的环境 ID
- ❌ 如果看到数据库权限错误，检查权限设置

---

## 常见问题

### Q1：添加记录时提示「字段格式错误」

**原因：** JSON 格式不正确

**解决方案：**
1. 确保 JSON 中没有中文逗号
2. 确保字符串用双引号 `"` 包裹
3. 确保数字类型不加引号（如 `likesCount: 0` 而不是 `"0"`）
4. 使用 JSON 验证工具检查格式

### Q2：动态列表不显示刚添加的数据

**可能原因：**
1. `status` 字段不是 `"published"`
2. `isPrivate` 字段是 `true`
3. 数据库权限配置错误
4. 云函数查询条件问题

**解决方案：**
1. 检查数据的 `status` 必须是 `"published"`
2. 检查 `isPrivate` 必须是 `false`（布尔值，不是字符串）
3. 确认数据库权限设置为「所有用户可读」
4. 查看控制台日志，确认云函数返回的数据

### Q3：图片无法显示

**原因：** 手动添加数据时图片 URL 无效

**解决方案：**
1. 方式一：将 `images` 字段设为空数组 `[]`
2. 方式二：使用小程序发布功能上传真实图片
3. 方式三：使用有效的外部图片 URL（需要在小程序后台配置域名白名单）

### Q4：createTime 字段格式要求

**推荐格式：** `"2026-01-07 15:30:00"`（字符串）

**其他可选格式：**
- 时间戳：`1736236200000`（数字）
- ISO 格式：`"2026-01-07T15:30:00.000Z"`（字符串）

**注意：** 不同格式可能影响前端显示，建议统一使用第一种格式。

### Q5：点赞数、评论数如何设置？

在测试数据中，可以手动设置这些数字：
```json
{
  "likesCount": 128,      // 点赞数
  "commentsCount": 35,    // 评论数
  "sharesCount": 0        // 分享数
}
```

这只是显示用的数字，真实的点赞、评论功能需要对应的云函数支持。

### Q6：如何删除测试数据？

**方法一：在数据库中删除**
1. 云开发控制台 → 数据库 → user_dynamics
2. 勾选要删除的记录
3. 点击「删除」按钮

**方法二：在小程序中删除**
1. 在动态列表中找到自己发布的动态
2. 点击删除按钮（需要先实现删除功能）

---

## 数据库索引优化（可选）

为了提高查询性能，可以为常用字段创建索引。

### 推荐索引配置

**user_dynamics 集合：**
- `_openid` - 单字段索引（用于查询某用户的动态）
- `createTime` - 单字段索引，降序（用于按时间排序）
- `status` - 单字段索引（用于筛选发布状态）

**likes 集合：**
- `_openid + targetType + targetId` - 联合唯一索引（防止重复点赞）
- `targetId` - 单字段索引（用于查询某动态的点赞列表）

**创建索引步骤：**
1. 云开发控制台 → 数据库 → 选择集合
2. 点击「索引管理」标签
3. 点击「添加索引」
4. 选择字段和排序方式
5. 点击「确定」

**注意：** 索引会占用存储空间，建议在数据量较大时再创建。

---

## 数据备份建议

定期备份数据库数据：

1. 云开发控制台 → 数据库 → 选择集合
2. 点击「导出」按钮
3. 选择导出格式（JSON 或 CSV）
4. 下载到本地保存

---

## 下一步操作

数据库配置完成后，您可以：

1. ✅ **测试发布功能** - 在小程序中发布新动态
2. ✅ **测试点赞功能** - 部署 `toggleLike` 云函数
3. ✅ **测试评论功能** - 部署 `addComment` 和 `getComments` 云函数
4. ✅ **查看数据变化** - 在数据库中实时查看新增的数据

---

## 相关文档

- [CLOUD_SERVICE_SETUP.md](./CLOUD_SERVICE_SETUP.md) - 云服务配置指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 部署检查清单
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - 数据库结构说明

---

**祝您使用顺利！** 🎉

如有问题，请参考 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
