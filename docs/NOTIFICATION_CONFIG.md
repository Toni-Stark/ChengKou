# 报名通知配置指南

当用户提交报名信息后，系统会将报名信息发送通知到您的微信。本文档介绍如何配置通知功能。

## 配置文件位置

`cloudfunctions/sendNotification/index.js` 文件中的 `NOTIFICATION_CONFIG` 配置对象。

---

## 支持的通知方式

### 1. 企业微信机器人（推荐）⭐

**优点：** 配置简单，实时推送，免费，稳定

**配置步骤：**

1. 在企业微信中创建一个群聊
2. 群设置 → 群机器人 → 添加机器人
3. 复制 Webhook 地址
4. 在配置文件中填入：

```javascript
const NOTIFICATION_CONFIG = {
  method: 'wechat_work',
  wechatWork: {
    webhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=你的KEY'
  }
};
```

**通知效果：**
- 实时推送到企业微信群
- 支持 Markdown 格式
- 显示报名人姓名、手机号、备注等信息

---

### 2. 微信公众号模板消息

**优点：** 直接推送到个人微信，官方渠道

**前置条件：**
- 需要认证的服务号（订阅号功能受限）
- 需要申请模板消息权限
- 需要知道开发者的 OpenID

**配置步骤：**

1. 在公众号后台创建模板消息，记录模板ID
2. 获取开发者的 OpenID（可以通过关注公众号后获取）
3. 在配置文件中填入：

```javascript
const NOTIFICATION_CONFIG = {
  method: 'official_account',
  officialAccount: {
    appId: '公众号AppID',
    appSecret: '公众号AppSecret',
    templateId: '模板ID',
    toUser: '开发者的OpenID'
  }
};
```

**模板消息格式参考：**
```
{{first.DATA}}
课程名称：{{keyword1.DATA}}
报名姓名：{{keyword2.DATA}}
联系电话：{{keyword3.DATA}}
报名时间：{{keyword4.DATA}}
{{remark.DATA}}
```

---

### 3. Server酱

**优点：** 配置简单，直接推送到微信

**前置条件：**
- 注册 Server酱账号：https://sct.ftqq.com/
- 微信扫码登录绑定
- 获取 SendKey

**配置步骤：**

1. 访问 https://sct.ftqq.com/ 登录
2. 复制你的 SendKey
3. 在配置文件中填入：

```javascript
const NOTIFICATION_CONFIG = {
  method: 'serverchan',
  serverChan: {
    sendKey: '你的SendKey'
  }
};
```

---

### 4. PushPlus

**优点：** 功能丰富，支持多种推送方式

**前置条件：**
- 注册 PushPlus 账号：http://www.pushplus.plus/
- 微信扫码关注公众号
- 获取 Token

**配置步骤：**

1. 访问 http://www.pushplus.plus/ 注册
2. 获取你的 Token
3. 在配置文件中填入：

```javascript
const NOTIFICATION_CONFIG = {
  method: 'pushplus',
  pushPlus: {
    token: '你的Token'
  }
};
```

---

## 快速开始（企业微信机器人示例）

### 步骤1：创建企业微信群机器人

1. 在企业微信中创建一个群聊（或使用现有群聊）
2. 点击群设置（右上角三个点）
3. 选择"群机器人" → "添加机器人"
4. 给机器人起个名字，比如"报名通知助手"
5. 复制 Webhook 地址，格式类似：
   ```
   https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

### 步骤2：配置云函数

打开 `cloudfunctions/sendNotification/index.js`，找到配置区域：

```javascript
const NOTIFICATION_CONFIG = {
  method: 'wechat_work',  // 使用企业微信
  wechatWork: {
    webhook: '粘贴你刚才复制的Webhook地址'
  }
};
```

### 步骤3：上传云函数

在微信开发者工具中：
1. 右键点击 `cloudfunctions/sendNotification` 文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待上传完成

同样上传 `submitRegistration` 云函数。

### 步骤4：创建云数据库集合

在微信开发者工具的云开发控制台：
1. 点击"数据库"
2. 点击"添加集合"
3. 集合名称输入：`registrations`
4. 权限设置：仅创建者可读写

### 步骤5：测试

在小程序中提交一次报名，查看企业微信群是否收到通知。

---

## 通知消息格式

收到的通知消息格式如下：

```
新的报名通知

课程名称：游泳培训课程
报名姓名：张三
联系电话：13800138000
备注信息：周末班
报名时间：2026-01-13 14:30:25

请及时联系用户处理报名信息
```

---

## 常见问题

### Q1: 企业微信机器人 Webhook 地址在哪里找？
A: 企业微信群 → 群设置 → 群机器人 → 添加机器人 → 复制 Webhook 地址

### Q2: 我可以同时配置多个通知方式吗？
A: 目前只支持一种通知方式。如需多种方式，需要修改云函数代码，依次调用多个通知函数。

### Q3: 通知发送失败会影响报名成功吗？
A: 不会。即使通知发送失败，报名信息也会保存到云数据库。你可以在数据库中查看所有报名记录。

### Q4: 如何查看历史报名记录？
A: 在微信开发者工具 → 云开发控制台 → 数据库 → registrations 集合中查看。

### Q5: 如何临时关闭通知？
A: 将配置中的 `method` 改为 `'none'`：
```javascript
const NOTIFICATION_CONFIG = {
  method: 'none'
};
```

---

## 进阶配置

### 自定义通知内容

编辑 `cloudfunctions/sendNotification/index.js` 中对应的通知函数，修改消息模板。

例如，修改企业微信通知的内容：

```javascript
const message = {
  msgtype: 'markdown',
  markdown: {
    content: `# 🎉 新的报名通知
**课程：** ${contentTitle}
**姓名：** <font color="info">${name}</font>
**电话：** ${phone}
**备注：** ${remark || '无'}
**时间：** ${time}

<font color="warning">请及时联系用户</font>`
  }
};
```

### 添加新的通知方式

可以在 `sendNotification/index.js` 中添加新的通知函数，比如邮件通知、钉钉机器人等。

---

## 技术支持

如有问题，请查看云函数日志：
1. 微信开发者工具 → 云开发控制台
2. 云函数 → 函数列表 → sendNotification
3. 查看运行日志

---

## 数据库结构

`registrations` 集合的数据结构：

```javascript
{
  _id: "自动生成的ID",
  name: "报名人姓名",
  phone: "手机号",
  remark: "备注信息",
  contentId: "内容ID",
  contentTitle: "课程标题",
  openid: "用户OpenID",
  status: "pending", // pending: 待处理, contacted: 已联系, completed: 已完成
  createTime: "创建时间",
  updateTime: "更新时间"
}
```

可以通过修改 `status` 字段来标记报名处理状态。
