# 动态功能实现说明

## 功能概述

已完成一个完整的社交动态系统，包含以下功能：

### 1. 三种展示方式

#### 九宫格模式 (grid9)
- 类似微信朋友圈的展示方式
- 支持最多9张图片
- 支持文本内容
- 图片以3x3网格布局展示
- 1-2张图片时自动调整布局

#### 大图模式 (large)
- 适合展示精美图片
- 包含标题、副标题、详细描述
- 单张大图展示（400rpx高度）
- 适合分享文章、摄影作品等

#### 纯文本模式 (text)
- 仅展示文字内容
- 适合分享想法、心情等
- 最多1000字

### 2. 交互功能

#### 点赞功能
- 支持动态点赞/取消点赞
- 支持评论点赞/取消点赞
- 实时更新点赞数量
- 点赞状态本地缓存
- 心跳动画效果

#### 评论功能
- 查看评论列表
- 发表评论
- 删除自己的评论
- 评论点赞
- 支持二级评论（回复功能）
- 评论数量实时更新

#### 关注系统
- 关注/取消关注用户
- 查看我关注的人列表
- 查看关注我的人列表
- 动态流支持查看关注人的动态

### 3. 动态流展示

支持两种模式：
- **全部动态**：查看所有公开动态
- **关注动态**：查看自己和关注人的动态

## 技术架构

### 云函数列表

| 云函数名 | 功能 | 文件位置 |
|---------|------|---------|
| `getUserDynamics` | 获取动态列表 | `cloudfunctions/getUserDynamics/` |
| `publishDynamic` | 发布动态 | `cloudfunctions/publishDynamic/` |
| `toggleLike` | 点赞/取消点赞 | `cloudfunctions/toggleLike/` |
| `getComments` | 获取评论列表 | `cloudfunctions/getComments/` |
| `addComment` | 添加评论 | `cloudfunctions/addComment/` |
| `deleteComment` | 删除评论 | `cloudfunctions/deleteComment/` |
| `toggleFollow` | 关注/取消关注 | `cloudfunctions/toggleFollow/` |
| `getFollowList` | 获取关注列表 | `cloudfunctions/getFollowList/` |

### 数据库集合

#### user_dynamics（用户动态）
```javascript
{
  _id: "动态ID",
  _openid: "用户OpenID",
  displayType: "grid9 | large | text",
  content: "文本内容",
  title: "标题（large模式）",
  subtitle: "副标题（large模式）",
  images: ["图片URL数组"],
  location: { name, latitude, longitude },
  likesCount: 0,
  commentsCount: 0,
  sharesCount: 0,
  status: "published | draft | deleted",
  isPrivate: false,
  createTime: Date,
  updateTime: Date
}
```

#### likes（点赞记录）
```javascript
{
  _id: "记录ID",
  _openid: "点赞用户OpenID",
  targetType: "dynamic | comment",
  targetId: "目标ID",
  createTime: Date
}
```

#### comments（评论）
```javascript
{
  _id: "评论ID",
  _openid: "评论用户OpenID",
  userInfo: { nickName, avatarUrl },
  dynamicId: "动态ID",
  content: "评论内容",
  replyTo: "回复的评论ID",
  replyToUser: { openid, nickName },
  likesCount: 0,
  createTime: Date
}
```

#### follows（关注关系）
```javascript
{
  _id: "记录ID",
  _openid: "关注者OpenID",
  followingOpenid: "被关注者OpenID",
  followingUserInfo: { nickName, avatarUrl },
  createTime: Date
}
```

### 页面结构

| 页面路径 | 功能 | 说明 |
|---------|------|------|
| `pages/dynamics/` | 动态列表页 | 展示动态流 |
| `pages/publish/` | 发布动态页 | 创建新动态，选择展示类型 |
| `pages/dynamic-detail/` | 动态详情页 | 查看动态详情和评论 |

### 组件

| 组件路径 | 功能 | 说明 |
|---------|------|------|
| `components/dynamic-item/` | 动态项组件 | 支持三种展示模式 |
| `components/user-avatar/` | 用户头像组件 | 展示用户头像 |

## 部署步骤

### 1. 上传云函数

在微信开发者工具中，右键点击以下云函数并上传：
- toggleLike
- getComments
- addComment
- deleteComment
- toggleFollow
- getFollowList
- publishDynamic
- getUserDynamics（已更新）

### 2. 配置数据库

在微信云开发控制台中创建以下集合：
- `user_dynamics`
- `likes`
- `comments`
- `follows`

### 3. 设置数据库权限

建议权限配置：
- **读权限**：所有用户
- **写权限**：仅创建者

### 4. 创建索引

#### likes 集合
- `_openid + targetType + targetId` 联合唯一索引
- `targetId` 索引

#### comments 集合
- `dynamicId` 索引

#### follows 集合
- `_openid + followingOpenid` 联合唯一索引
- `_openid` 索引
- `followingOpenid` 索引

## 使用方式

### 查看动态流
1. 在 dynamics 页面可以查看所有动态
2. 调用 `getUserDynamics` 时传入 `includeFollowing: true` 可查看关注人动态

```javascript
request.callFunction('getUserDynamics', {
  page: 1,
  pageSize: 10,
  includeFollowing: true  // 查看关注人动态
});
```

### 发布动态
1. 跳转到 `/pages/publish/publish` 页面
2. 选择展示类型（九宫格/大图/纯文本）
3. 根据类型填写对应内容
4. 可选择添加位置信息
5. 点击发布

### 点赞和评论
- 点赞：点击动态项的点赞按钮，会自动调用 `toggleLike` 云函数
- 评论：点击评论按钮跳转到动态详情页，可查看和发表评论

### 关注用户
```javascript
request.callFunction('toggleFollow', {
  followingOpenid: '目标用户OpenID',
  followingUserInfo: {
    nickName: '用户昵称',
    avatarUrl: '头像URL'
  }
});
```

## 注意事项

1. **图片上传**：图片会上传到云存储的 `dynamics/` 文件夹
2. **用户信息**：需要先获取用户授权并保存 userInfo 到本地存储
3. **分页加载**：建议每页加载10-20条数据
4. **权限控制**：评论和动态只有创建者可以删除
5. **位置权限**：选择位置需要用户授权位置权限

## 扩展功能建议

以下功能可以根据需求扩展：
1. 动态编辑功能
2. @提及用户
3. 话题标签
4. 动态分享到微信好友
5. 举报功能
6. 屏蔽用户
7. 草稿保存
8. 动态置顶
9. 热门动态排序
10. 搜索功能
