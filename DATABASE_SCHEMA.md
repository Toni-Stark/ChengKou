# 数据库集合设计

## 1. user_dynamics（用户动态）

```json
{
  "_id": "动态ID",
  "_openid": "用户OpenID",
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "用户头像URL"
  },
  "displayType": "展示类型: grid9(九宫格) | large(大图) | text(纯文本)",
  "content": "动态文本内容",
  "title": "标题（仅large模式使用）",
  "subtitle": "副标题（仅large模式使用）",
  "images": ["图片URL数组"],
  "location": {
    "name": "位置名称",
    "latitude": "纬度",
    "longitude": "经度"
  },
  "likesCount": 0,
  "commentsCount": 0,
  "sharesCount": 0,
  "status": "published | draft | deleted",
  "isPrivate": false,
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

## 2. likes（点赞记录）

```json
{
  "_id": "点赞记录ID",
  "_openid": "点赞用户OpenID",
  "targetType": "目标类型: dynamic | comment",
  "targetId": "目标ID（动态ID或评论ID）",
  "createTime": "创建时间"
}
```

**索引：**
- `_openid + targetType + targetId` 联合唯一索引
- `targetId` 索引（用于查询某个动态/评论的点赞列表）

## 3. comments（评论）

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
  "replyTo": "回复的评论ID（可选，用于二级评论）",
  "replyToUser": {
    "openid": "被回复用户OpenID",
    "nickName": "被回复用户昵称"
  },
  "likesCount": 0,
  "createTime": "创建时间"
}
```

**索引：**
- `dynamicId` 索引（用于查询某个动态的评论列表）

## 4. follows（关注关系）

```json
{
  "_id": "关注记录ID",
  "_openid": "关注者OpenID（我）",
  "followingOpenid": "被关注者OpenID",
  "followingUserInfo": {
    "nickName": "被关注用户昵称",
    "avatarUrl": "被关注用户头像URL"
  },
  "createTime": "创建时间"
}
```

**索引：**
- `_openid + followingOpenid` 联合唯一索引
- `_openid` 索引（用于查询我关注的人列表）
- `followingOpenid` 索引（用于查询关注我的人列表）

## 数据库权限配置

在微信云开发控制台配置以下权限：

### user_dynamics
- 读：所有用户
- 写：仅创建者

### likes
- 读：所有用户
- 写：仅创建者

### comments
- 读：所有用户
- 写：仅创建者

### follows
- 读：所有用户
- 写：仅创建者
