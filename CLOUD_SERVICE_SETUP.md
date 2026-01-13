# 云服务联调指南

本指南将帮助您完成微信小程序云开发环境的配置和动态列表功能的联调测试。

## 一、准备工作

### 1. 开通微信云开发

1. 打开微信开发者工具
2. 点击顶部菜单「云开发」按钮
3. 按照提示开通云开发（免费）
4. 记录下您的**环境 ID**（格式类似：`cloud1-xxxxx`）

### 2. 配置云开发环境 ID

在 `miniprogram/app.js` 文件中，找到第 17 行，取消注释并填入您的环境 ID：

```javascript
wx.cloud.init({
  env: 'your-env-id',  // 替换为您的云开发环境 ID
  traceUser: true
});
```

## 二、创建数据库集合

在微信开发者工具的「云开发」控制台中，创建以下数据库集合：

### 1. user_dynamics（用户动态）
- 集合名称：`user_dynamics`
- 权限设置：所有用户可读，仅创建者可写

### 2. likes（点赞记录）
- 集合名称：`likes`
- 权限设置：所有用户可读，仅创建者可写

### 3. comments（评论）
- 集合名称：`comments`
- 权限设置：所有用户可读，仅创建者可写

### 4. follows（关注关系）
- 集合名称：`follows`
- 权限设置：所有用户可读，仅创建者可写

详细的数据库结构请参考 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## 三、部署云函数

### 1. 上传云函数

在微信开发者工具中，右键点击以下云函数文件夹，选择「上传并部署：云端安装依赖」：

- `cloudfunctions/getUserDynamics` - **必须部署**（获取动态列表）
- `cloudfunctions/publishDynamic` - 推荐部署（发布动态）
- `cloudfunctions/toggleLike` - 推荐部署（点赞功能）
- `cloudfunctions/getComments` - 推荐部署（评论功能）
- `cloudfunctions/addComment` - 推荐部署（添加评论）

### 2. 验证云函数部署

1. 在云开发控制台点击「云函数」
2. 确认 `getUserDynamics` 等云函数显示为「部署成功」状态

## 四、添加测试数据

为了测试动态列表功能，您需要在数据库中添加一些测试数据。

### 方式一：通过发布页面添加（推荐）

1. 确保已部署 `publishDynamic` 云函数
2. 在小程序中进入「动态」页面
3. 点击右下角的「+」按钮
4. 发布几条测试动态

### 方式二：手动在数据库中添加

在云开发控制台的「数据库」中，选择 `user_dynamics` 集合，点击「添加记录」，输入以下数据：

```json
{
  "userInfo": {
    "nickName": "测试用户",
    "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  },
  "displayType": "text",
  "content": "这是一条测试动态，用于验证动态列表功能是否正常工作。",
  "images": [],
  "location": null,
  "likesCount": 0,
  "commentsCount": 0,
  "sharesCount": 0,
  "status": "published",
  "isPrivate": false,
  "createTime": "2026-01-07 14:30:00"
}
```

您可以添加多条不同类型的动态数据进行测试。

## 五、测试动态列表功能

### 1. 启动小程序

1. 在微信开发者工具中点击「编译」
2. 切换到「动态」标签页

### 2. 验证功能

检查以下功能是否正常：

- [ ] 动态列表是否正确加载
- [ ] 动态内容是否正确显示（用户信息、文本、图片等）
- [ ] 是否按时间倒序排列（最新的在最上面）
- [ ] 下拉刷新是否正常工作
- [ ] 上拉加载更多是否正常工作
- [ ] 点击动态是否能进入详情页

### 3. 查看控制台日志

在微信开发者工具的「Console」中查看日志：

- 如果看到「云开发未配置，使用模拟数据」，说明云开发环境未配置
- 如果看到云函数调用成功的日志，说明联调成功
- 如果看到错误信息，请根据错误提示进行排查

## 六、常见问题排查

### 1. 提示「云开发未配置」

**原因：** 云开发环境 ID 未正确配置

**解决方案：**
- 检查 `app.js` 中是否已取消注释并填写正确的环境 ID
- 确保环境 ID 格式正确（例如：`cloud1-xxxxx`）

### 2. 云函数调用失败

**原因：** 云函数未部署或部署失败

**解决方案：**
- 在云开发控制台检查云函数部署状态
- 重新上传并部署云函数
- 查看云函数日志，检查是否有报错信息

### 3. 数据库查询为空

**原因：** 数据库中没有数据或权限配置错误

**解决方案：**
- 确认数据库集合中有数据且 `status` 字段为 `"published"`
- 检查数据库权限设置是否正确
- 确认 `isPrivate` 字段为 `false`

### 4. 动态列表只显示模拟数据

**原因：** 云函数调用失败，降级使用了模拟数据

**解决方案：**
- 检查控制台的错误日志
- 确认云开发环境已正确初始化
- 确认云函数已成功部署

## 七、云函数修改说明

本次联调中，我们对 `getUserDynamics` 云函数进行了以下修改：

### 修改前
- 默认只返回当前登录用户自己的动态

### 修改后
- **默认返回所有用户的已发布动态**（按时间倒序）
- 保留 `userId` 参数：传入后只返回指定用户的动态
- 保留 `includeFollowing` 参数：传入后返回当前用户关注的人的动态

这样修改后，动态列表页面将显示所有用户发布的动态，符合社交平台的使用习惯。

## 八、下一步建议

联调成功后，您可以继续完善以下功能：

1. **点赞功能** - 部署 `toggleLike` 云函数
2. **评论功能** - 部署 `getComments` 和 `addComment` 云函数
3. **关注功能** - 部署 `toggleFollow` 和 `getFollowList` 云函数
4. **删除动态** - 创建删除动态的云函数
5. **分享功能** - 实现分享到微信好友/朋友圈

## 需要帮助？

如果在联调过程中遇到问题，请查看：
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 常见问题排查
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - 数据库结构说明
- [DYNAMIC_FEATURE_GUIDE.md](./DYNAMIC_FEATURE_GUIDE.md) - 动态功能使用指南
