# sendSubscribeMessage 云函数使用说明

## 功能说明

这个云函数用于发送签到相关的订阅消息通知。

## 已配置的模板

### 1. 签到提醒（checkInReminder）
- 模板ID：`yT9aCdkuvDSlGn90pymqxjBG_oIQRU1d38p0HYpvaDE`
- 用途：提醒用户去签到
- 模板字段：
  - 活动名称（thing1）
  - 签到状态（thing7）
  - 截止时间（time5）
  - 温馨提醒（thing9）

### 2. 签到成功通知（checkInSuccess）
- 模板ID：`yT9aCdkuvDSlGn90pymqxjejejQXycZpnyyCG7ZdUKM`
- 用途：告知用户已签到打卡
- 模板字段：
  - 活动名称（thing1）
  - 累计签到天数（number6）
  - 服务地点（thing30）
  - 时间（time4）

## 调用方式

### 1. 发送签到提醒

```javascript
wx.cloud.callFunction({
  name: 'sendSubscribeMessage',
  data: {
    type: 'checkInReminder',
    data: {
      activityName: '志愿者服务活动',
      checkInStatus: '待签到',
      deadline: '2024-01-15 18:00',
      reminder: '请及时签到，过期将无法签到'
    }
  }
}).then(res => {
  console.log('发送成功', res);
}).catch(err => {
  console.error('发送失败', err);
});
```

### 2. 发送签到成功通知

```javascript
wx.cloud.callFunction({
  name: 'sendSubscribeMessage',
  data: {
    type: 'checkInSuccess',
    data: {
      activityName: '志愿者服务活动',
      totalDays: 15,
      location: '社区服务中心',
      time: '2024-01-15 14:30'
    }
  }
}).then(res => {
  console.log('发送成功', res);
}).catch(err => {
  console.error('发送失败', err);
});
```

### 3. 给指定用户发送（可选）

如果需要给指定用户发送消息，可以传入 `toUser` 参数：

```javascript
wx.cloud.callFunction({
  name: 'sendSubscribeMessage',
  data: {
    type: 'checkInSuccess',
    toUser: 'oKfEg5VJshdd31GB3OAoUyrqpJPE', // 指定用户的 openid
    data: {
      activityName: '志愿者服务活动',
      totalDays: 15,
      location: '社区服务中心',
      time: '2024-01-15 14:30'
    }
  }
});
```

如果不传 `toUser`，默认发送给调用云函数的当前用户。

## 注意事项

1. **订阅授权**：用户必须先订阅消息，否则发送会失败
2. **字段长度限制**：
   - thing 类型字段最多 20 个字符
   - number 类型需要传入数字
   - time 类型需要符合时间格式
3. **跳转页面**：点击消息默认跳转到 `pages/featured-detail/featured-detail`
4. **环境配置**：需要在微信开发者工具中上传并部署云函数

## 部署步骤

1. 在微信开发者工具中找到 `cloudfunctions/sendSubscribeMessage`
2. 右键点击 → "上传并部署：云端安装依赖"
3. 等待部署完成

## 返回值

### 成功
```javascript
{
  code: 0,
  message: '订阅消息发送完成',
  data: {
    success: true,
    result: { ... }
  }
}
```

### 失败
```javascript
{
  code: -1,
  message: '订阅消息发送失败',
  error: '错误信息'
}
```
