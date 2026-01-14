# 微信订阅消息配置指南

本文档详细介绍如何配置微信小程序的订阅消息功能，实现报名信息推送。

## 📖 什么是订阅消息

订阅消息是微信小程序官方提供的消息推送功能，用户授权后可以收到推送通知。

**特点：**
- ✅ 官方渠道，可靠稳定
- ✅ 直接推送到微信服务通知
- ✅ 无需第三方服务
- ✅ 免费使用
- ⚠️ 需要用户主动授权
- ⚠️ 一次订阅一次推送（一次性订阅消息）

---

## 🚀 完整配置流程（7步）

### 步骤1：登录微信公众平台

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 使用小程序管理员账号扫码登录
3. 进入你的小程序管理后台

### 步骤2：申请订阅消息模板

1. 左侧菜单 → **功能** → **订阅消息**
2. 点击 **公共模板库**
3. 搜索并选择合适的模板

#### 推荐模板一：报名成功通知（发给用户）

**模板搜索关键词：** "报名成功通知" 或 "课程报名"

**模板内容参考：**
```
{{thing1.DATA}} 课程名称
{{name2.DATA}} 姓名
{{phone_number3.DATA}} 手机号
{{date4.DATA}} 报名时间
{{thing5.DATA}} 温馨提示
```

**字段说明：**
- `thing1`: 课程名称（thing类型，最多20个字）
- `name2`: 报名人姓名（name类型，最多10个字）
- `phone_number3`: 联系电话（phone_number类型）
- `date4`: 报名时间（date类型）
- `thing5`: 温馨提示（thing类型，最多20个字）

#### 推荐模板二：新报名提醒（发给管理员）

**模板搜索关键词：** "新订单提醒" 或 "报名提醒"

**模板内容参考：**
```
{{thing1.DATA}} 课程名称
{{name2.DATA}} 报名人
{{phone_number3.DATA}} 联系电话
{{thing4.DATA}} 备注信息
{{date5.DATA}} 报名时间
```

### 步骤3：获取模板ID

1. 在 **我的模板** 中查看已添加的模板
2. 复制模板ID（格式类似：`abcdefghijklmnopqrstuvwxyz123456`）
3. 准备好两个模板ID：
   - 用户模板ID（发给报名用户）
   - 管理员模板ID（发给开发者）

### 步骤4：获取管理员的 OpenID

管理员需要订阅消息才能收到通知，需要先获取管理员的 OpenID。

**方法一：通过小程序获取（推荐）**

1. 创建一个临时测试页面或在现有页面添加按钮
2. 添加以下代码：

```javascript
// 获取当前用户的 openid
wx.cloud.callFunction({
  name: 'login'
}).then(res => {
  console.log('管理员 OpenID:', res.result.data.openid)
  // 复制这个 openid 用于配置
  wx.showModal({
    title: '管理员 OpenID',
    content: res.result.data.openid,
    showCancel: false
  })
})
```

3. 使用管理员微信扫码打开小程序
4. 点击按钮获取 OpenID
5. 复制这个 OpenID

**方法二：通过云开发控制台**

1. 微信开发者工具 → 云开发控制台
2. 数据库 → users 集合
3. 找到管理员的用户记录
4. 复制 `_openid` 字段的值

### 步骤5：配置云函数

打开 `cloudfunctions/sendSubscribeMessage/index.js`，找到配置区域（第12-27行）：

```javascript
const TEMPLATE_CONFIG = {
  // 用户报名成功通知模板ID（发给用户）
  userTemplate: '粘贴步骤3获取的用户模板ID',

  // 新报名提醒模板ID（发给开发者/管理员）
  adminTemplate: '粘贴步骤3获取的管理员模板ID',

  // 管理员的 openid 列表
  adminOpenIds: [
    '粘贴步骤4获取的管理员OpenID',
    // 可以添加多个管理员
  ],

  // 点击消息跳转的页面
  page: 'pages/featured-detail/featured-detail'
};
```

**注意事项：**
- 确保字段名称与你申请的模板字段匹配
- 如果模板字段不同，需要修改 `sendUserNotification` 和 `sendAdminNotification` 函数中的字段映射

### 步骤6：配置前端页面

打开 `miniprogram/pages/featured-detail/featured-detail.js`，找到第24行：

```javascript
subscribeTemplateId: '粘贴用户模板ID'
```

替换为你在步骤3获取的用户模板ID。

### 步骤7：上传云函数

在微信开发者工具中：

1. 右键点击 `cloudfunctions/sendSubscribeMessage` 文件夹
2. 选择 **上传并部署：云端安装依赖**
3. 等待上传完成
4. 同样上传 `submitRegistration` 云函数

---

## 🎯 管理员订阅消息授权

**重要：** 管理员需要先订阅消息才能收到通知！

### 方式一：创建管理员订阅页面（推荐）

创建一个专门的管理员设置页面：

```javascript
// pages/admin-subscribe/admin-subscribe.js
Page({
  onSubscribe() {
    wx.requestSubscribeMessage({
      tmplIds: ['管理员模板ID'],
      success: (res) => {
        if (res['管理员模板ID'] === 'accept') {
          wx.showToast({ title: '订阅成功', icon: 'success' })
        } else {
          wx.showToast({ title: '您拒绝了订阅', icon: 'none' })
        }
      }
    })
  }
})
```

```xml
<!-- pages/admin-subscribe/admin-subscribe.wxml -->
<view class="container">
  <button bindtap="onSubscribe">订阅报名通知</button>
</view>
```

### 方式二：在设置页面添加

在小程序的设置页面中添加"订阅报名通知"选项。

---

## 🧪 测试流程

### 1. 测试用户订阅和通知

1. 在小程序中打开报名页面
2. 填写报名信息并点击"提交报名"
3. 会弹出订阅授权弹窗，点击"允许"
4. 提交成功后，检查微信服务通知是否收到消息

### 2. 测试管理员通知

1. 确保管理员已经订阅了消息（参考上面的管理员订阅流程）
2. 让其他用户提交报名
3. 管理员应该会收到新报名提醒

### 3. 查看日志

在微信开发者工具中：
1. 云开发控制台 → 云函数
2. 选择 `sendSubscribeMessage` 函数
3. 查看运行日志，确认消息是否发送成功

---

## 📱 订阅消息效果

### 用户收到的通知

```
报名成功通知

课程名称：游泳培训课程
姓名：张三
手机号：13800138000
报名时间：2026-01-13 14:30
温馨提示：我们将尽快与您联系
```

### 管理员收到的通知

```
新报名提醒

课程名称：游泳培训课程
报名人：张三
联系电话：13800138000
备注信息：周末班
报名时间：2026-01-13 14:30
```

点击消息会跳转到小程序对应页面。

---

## ❓ 常见问题

### Q1: 订阅消息发送失败怎么办？

**检查清单：**
- ✅ 模板ID是否正确配置
- ✅ 用户是否已授权订阅
- ✅ 管理员是否已订阅消息
- ✅ OpenID是否正确
- ✅ 云函数是否上传成功
- ✅ 字段映射是否与模板匹配

**查看错误信息：**
```
云开发控制台 → 云函数 → sendSubscribeMessage → 日志
```

常见错误码：
- `43101`: 用户拒绝接收消息
- `43104`: 订阅关系已过期（需要重新订阅）
- `47003`: 模板参数不合法
- `40037`: 模板ID不正确

### Q2: 用户不想订阅消息怎么办？

没关系！即使用户拒绝订阅或跳过授权，报名仍会成功提交。订阅消息只是额外的通知功能。

### Q3: 可以给多个管理员发送通知吗？

可以！在配置文件中添加多个管理员的 OpenID：

```javascript
adminOpenIds: [
  'openid_1',
  'openid_2',
  'openid_3'
]
```

每个管理员都需要先订阅消息。

### Q4: 订阅消息可以发送多次吗？

一次性订阅消息只能发送一次。如果需要持续接收通知：
- 管理员可以定期重新订阅
- 或者使用长期订阅消息（需要特定类目，如政务、医疗等）

### Q5: 可以同时使用订阅消息和企业微信通知吗？

可以！在 `submitRegistration/index.js` 中取消注释第73-92行的代码，同时启用两种通知方式。

### Q6: 如何修改消息内容？

编辑 `sendSubscribeMessage/index.js` 中的 `sendUserNotification` 和 `sendAdminNotification` 函数，修改 `data` 对象中的字段值。

**注意：** 字段名称和类型必须与模板匹配，否则会发送失败。

### Q7: 模板字段与我申请的不一致怎么办？

需要修改云函数中的字段映射。例如，如果你的模板使用 `phrase1` 而不是 `thing1`：

```javascript
data: {
  phrase1: { value: contentTitle.slice(0, 20) },  // 修改字段名
  // ... 其他字段
}
```

---

## 🔧 字段类型说明

微信订阅消息支持以下字段类型：

| 类型 | 说明 | 字符限制 | 示例 |
|------|------|---------|------|
| `thing` | 事物 | 最多20个字 | 课程名称、备注信息 |
| `name` | 姓名 | 最多10个字 | 张三 |
| `phone_number` | 电话号码 | 标准手机号 | 13800138000 |
| `date` | 日期时间 | 标准格式 | 2026-01-13 14:30 |
| `amount` | 金额 | 数字+元 | 1980元 |
| `character_string` | 字符串 | 最多32个字 | 订单号等 |
| `time` | 时间 | HH:mm 格式 | 14:30 |

**重要：** 超出字符限制会导致发送失败，务必使用 `.slice()` 截取字符串。

---

## 🎓 进阶功能

### 自定义跳转页面

修改配置中的 `page` 参数：

```javascript
page: 'pages/order-detail/order-detail?id=' + orderId
```

### 不同场景使用不同模板

可以在 `submitRegistration` 中根据课程类型选择不同模板：

```javascript
const templateId = contentId === 'swimming'
  ? 'swimming_template_id'
  : 'default_template_id';
```

### 订阅失败时的降级方案

如果订阅消息发送失败，可以自动切换到其他通知方式（企业微信、邮件等）。

---

## 📊 数据统计

可以在云数据库中添加统计字段，记录订阅和推送情况：

```javascript
// 保存订阅统计
db.collection('subscribe_stats').add({
  data: {
    openid: openid,
    templateId: templateId,
    subscribeTime: db.serverDate(),
    sendResult: 'success' // success | failed
  }
})
```

---

## 🔗 相关文档

- [微信小程序订阅消息官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)
- [订阅消息 API 文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html)
- [云函数调用 API](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/open/subscribeMessage/subscribeMessage.send.html)

---

## ✅ 配置检查清单

部署前请确认：

- [ ] 在微信公众平台申请了订阅消息模板
- [ ] 获取了用户模板ID和管理员模板ID
- [ ] 获取了管理员的 OpenID
- [ ] 配置了 `sendSubscribeMessage/index.js` 中的模板ID
- [ ] 配置了管理员 OpenID 列表
- [ ] 配置了 `featured-detail.js` 中的模板ID
- [ ] 上传了 `sendSubscribeMessage` 云函数
- [ ] 上传了 `submitRegistration` 云函数
- [ ] 管理员已经订阅了消息
- [ ] 测试用户订阅和接收消息
- [ ] 测试管理员接收通知

---

配置完成后，你的小程序就可以使用微信订阅消息推送报名通知了！🎉
