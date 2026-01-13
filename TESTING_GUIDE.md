# 动态功能测试指南

## 问题已修复 ✅

已修复的问题：
1. ✅ 模拟数据字段匹配（userInfo, likesCount, commentsCount）
2. ✅ 动态详情页面正确获取指定ID的动态
3. ✅ 图片循环变量名冲突修复
4. ✅ 所有页面都支持模拟数据展示

## 快速测试步骤

### 测试环境1：云开发未配置（查看模拟数据）

这种情况下，无需配置任何云服务，直接查看UI效果：

#### 1. 查看动态列表
- 打开 `pages/dynamics/dynamics` 页面
- **预期结果**：
  - 显示3条模拟动态
  - 第1条：纯文本动态
  - 第2条：大图模式（带标题、副标题）
  - 第3条：纯文本模式
  - 每条动态都有点赞数、评论数
  - 用户头像和昵称正常显示

#### 2. 查看动态详情
- 点击任意一条动态
- **预期结果**：
  - 进入动态详情页
  - 动态内容正常展示
  - 显示2条模拟评论
  - 评论者信息正常显示
  - 底部有评论输入框

#### 3. 测试评论功能（模拟）
- 在输入框输入内容
- 点击"发送"按钮
- **预期结果**：
  - 提示"评论成功（模拟）"
  - 新评论出现在列表顶部
  - 评论数+1
  - 输入框清空

#### 4. 测试发布动态（模拟）
- 点击动态页面的"+"按钮
- 选择展示方式（九宫格/大图/纯文本）
- 填写对应内容
- 点击"发布"
- **预期结果**：
  - 提示"发布成功（模拟）"
  - 自动返回上一页

### 测试环境2：云开发已配置（真实数据）

#### 前置准备

1. **上传云函数**（在微信开发者工具中）：
   ```
   右键点击以下文件夹 -> 上传并部署：云端安装依赖

   - cloudfunctions/getDynamicDetail/
   - cloudfunctions/getUserDynamics/
   - cloudfunctions/publishDynamic/
   - cloudfunctions/toggleLike/
   - cloudfunctions/getComments/
   - cloudfunctions/addComment/
   - cloudfunctions/deleteComment/
   - cloudfunctions/toggleFollow/
   - cloudfunctions/getFollowList/
   ```

2. **创建数据库集合**（在云开发控制台）：
   ```
   - user_dynamics
   - likes
   - comments
   - follows
   ```

3. **配置数据库权限**：
   - 所有集合：读权限 = 所有用户，写权限 = 仅创建者

4. **创建索引**（参考 DATABASE_SCHEMA.md）

#### 完整流程测试

##### 1. 发布动态
**测试九宫格模式：**
- 进入发布页面
- 选择"九宫格"
- 输入文字内容："这是我的第一条动态！"
- 添加1-3张图片
- （可选）添加位置
- 点击发布
- **验证**：返回动态列表，应该能看到新发布的动态

**测试大图模式：**
- 进入发布页面
- 选择"大图模式"
- 输入标题："美丽的风景"
- 输入副标题："今天拍的照片"
- 添加1张图片
- 输入描述（可选）
- 点击发布
- **验证**：新动态以大图形式展示

**测试纯文本模式：**
- 进入发布页面
- 选择"纯文本"
- 输入文字内容（可以多写一些）
- 点击发布
- **验证**：新动态仅显示文字

##### 2. 点赞功能
- 点击动态的"点赞"按钮
- **验证**：
  - 心形图标变为实心红色❤
  - 点赞数+1
  - 再次点击可取消点赞
  - 点赞数-1

##### 3. 评论功能
- 点击动态的"评论"按钮进入详情页
- 在输入框输入："很棒的分享！"
- 点击发送
- **验证**：
  - 提示"评论成功"
  - 评论出现在列表中
  - 动态的评论数+1

##### 4. 评论点赞
- 点击评论右侧的点赞按钮
- **验证**：
  - 心形变红
  - 评论点赞数+1

##### 5. 关注用户（需要额外实现UI）
```javascript
// 示例代码
request.callFunction('toggleFollow', {
  followingOpenid: '目标用户的openid',
  followingUserInfo: {
    nickName: '用户昵称',
    avatarUrl: '头像URL'
  }
});
```

##### 6. 查看关注人动态
```javascript
// 在 dynamics.js 中调用时传入参数
request.callFunction('getUserDynamics', {
  page: 1,
  pageSize: 10,
  includeFollowing: true  // 关键参数
});
```

## 常见问题排查

### 问题1：动态列表不显示
**排查步骤：**
1. 打开调试器控制台，查看是否有错误
2. 检查是否显示"暂无动态"
3. 如果显示模拟数据，说明云开发未配置或云函数调用失败
4. 检查云函数是否正确上传

### 问题2：图片不显示
**排查步骤：**
1. 检查图片URL是否有效
2. 模拟数据中的图片使用的是占位符URL，可能无法访问
3. 发布真实动态后，图片应该正常显示

### 问题3：点赞不生效
**排查步骤：**
1. 检查 toggleLike 云函数是否上传
2. 检查 likes 集合是否创建
3. 查看控制台错误信息

### 问题4：评论发布失败
**排查步骤：**
1. 检查是否有用户信息（userInfo）
2. 检查 addComment 云函数是否上传
3. 检查 comments 集合是否创建

## 数据结构验证

### 动态数据应包含：
```javascript
{
  _id: "动态ID",
  displayType: "grid9 | large | text",
  userInfo: { nickName, avatarUrl },
  content: "文本内容",
  title: "标题（large模式）",
  subtitle: "副标题（large模式）",
  images: ["图片URL数组"],
  likesCount: 0,
  commentsCount: 0,
  isLiked: false,
  createTime: "时间"
}
```

### 评论数据应包含：
```javascript
{
  _id: "评论ID",
  userInfo: { nickName, avatarUrl },
  content: "评论内容",
  likesCount: 0,
  isLiked: false,
  createTime: "时间"
}
```

## 性能建议

1. **分页加载**：每页建议10-20条
2. **图片压缩**：上传前压缩图片
3. **懒加载**：使用小程序的 lazy-load 属性
4. **缓存策略**：合理使用本地缓存

## 下一步扩展

- [ ] 用户主页
- [ ] 删除自己的动态
- [ ] 编辑动态
- [ ] 分享到微信
- [ ] 举报功能
- [ ] @提及功能
- [ ] 话题标签
- [ ] 搜索功能
