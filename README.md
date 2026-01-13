# 微信小程序完整框架

基于**微信原生小程序 + 微信云开发**的完整项目框架，包含官方内容展示、用户动态发布和个人信息管理三大核心功能。

## 🚀 快速开始

**想立即运行小程序？** 查看 [快速启动指南](QUICK_START.md) - 5分钟让小程序运行起来！

**遇到问题无法运行？** 查看 [问题诊断文档](TROUBLESHOOTING.md) - 常见问题和解决方案。

## 项目简介

本项目是一个功能完整的微信小程序框架，包含以下核心功能：

- **首页** - 官方更新的卡片式内容展示，支持分类筛选、下拉刷新、上拉加载
- **动态页** - 用户动态发布与浏览，支持图片上传、位置分享、点赞评论
- **我的页面** - 用户个人信息管理，数据统计展示

## 技术栈

- 微信小程序原生开发
- 微信云开发（云函数、云数据库、云存储）
- Less 预处理器（CSS变量、Mixins、嵌套）
- npm 包管理
- 组件化开发

## 项目结构

```
D:\Project\M/
├── cloudfunctions/              # 云函数目录
│   ├── login/                   # 用户登录云函数
│   ├── getOfficialContent/      # 获取官方内容
│   └── getUserDynamics/         # 获取用户动态
│
├── miniprogram/                 # 小程序目录
│   ├── pages/                   # 页面目录
│   │   ├── index/               # 首页 - 官方内容
│   │   ├── dynamics/            # 动态页 - 用户动态
│   │   ├── mine/                # 我的页面
│   │   ├── login/               # 登录授权页
│   │   ├── publish/             # 发布动态页（待开发）
│   │   └── detail/              # 内容详情页（待开发）
│   │
│   ├── components/              # 组件目录
│   │   ├── content-card/        # 内容卡片组件
│   │   ├── dynamic-item/        # 动态列表项组件
│   │   └── user-avatar/         # 用户头像组件
│   │
│   ├── utils/                   # 工具函数目录
│   │   ├── util.js              # 通用工具函数
│   │   ├── request.js           # 云函数请求封装
│   │   └── auth.js              # 授权相关函数
│   │
│   ├── styles/                  # 全局样式目录
│   │   ├── variables.less       # 样式变量（Less）
│   │   ├── mixins.less          # 样式混入（Less）
│   │   ├── common.less          # 公共样式（Less）
│   │   ├── variables.wxss       # 编译后的变量
│   │   └── common.wxss          # 编译后的公共样式
│   │
│   ├── images/                  # 图片资源目录（需自行添加）
│   │   ├── tabbar/              # 底部导航图标
│   │   └── placeholder/         # 占位图
│   │
│   ├── app.js                   # 小程序入口文件
│   ├── app.json                 # 小程序全局配置
│   ├── app.wxss                 # 小程序全局样式
│   └── sitemap.json             # 微信索引配置
│
├── project.config.json          # 项目配置文件
└── README.md                    # 项目说明文档
```

## 已创建的文件清单

### 配置文件（5个）
- `project.config.json` - 项目配置
- `miniprogram/app.json` - 全局配置
- `miniprogram/sitemap.json` - 索引配置
- `miniprogram/app.js` - 入口逻辑
- `miniprogram/app.wxss` - 全局样式

### 工具函数（5个）
- `miniprogram/utils/util.js` - 通用工具
- `miniprogram/utils/request.js` - 请求封装
- `miniprogram/utils/auth.js` - 授权工具
- `miniprogram/styles/common.wxss` - 公共样式
- `miniprogram/styles/variables.wxss` - 样式变量

### 页面文件（16个）
- `miniprogram/pages/login/*` (4个文件) - 登录页
- `miniprogram/pages/index/*` (4个文件) - 首页
- `miniprogram/pages/dynamics/*` (4个文件) - 动态页
- `miniprogram/pages/mine/*` (4个文件) - 我的页面

### 组件文件（12个）
- `miniprogram/components/content-card/*` (4个文件) - 内容卡片
- `miniprogram/components/dynamic-item/*` (4个文件) - 动态列表项
- `miniprogram/components/user-avatar/*` (4个文件) - 用户头像

### 云函数（9个）
- `cloudfunctions/login/*` (3个文件) - 登录云函数
- `cloudfunctions/getOfficialContent/*` (3个文件) - 获取官方内容
- `cloudfunctions/getUserDynamics/*` (3个文件) - 获取用户动态

**已创建文件总数：47个**

## 📚 文档导航

- [QUICK_START.md](QUICK_START.md) - 5分钟快速启动指南
- [LESS_GUIDE.md](LESS_GUIDE.md) - Less 样式开发指南
- [WXSS_FIX.md](WXSS_FIX.md) - WXSS 编译错误修复说明
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 问题诊断和修复
- [CHANGELOG.md](CHANGELOG.md) - 版本更新日志
- [README.md](README.md) - 完整项目文档（本文档）

## 快速开始

### 1. 环境准备

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 注册小程序账号，获取AppID
3. 开通云开发环境
4. 安装 Node.js（用于 npm 包管理）

### 2. 安装依赖

在项目的 `miniprogram` 目录下运行：

```bash
cd miniprogram
npm install
```

然后在微信开发者工具中：
1. 点击菜单栏"工具" -> "构建 npm"
2. 等待构建完成

### 3. 配置项目

#### 3.1 配置AppID

编辑 `project.config.json`，修改appid：

```json
{
  "appid": "你的小程序AppID"
}
```

#### 3.2 配置云开发环境

编辑 `miniprogram/app.js`，修改云环境ID：

```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的云环境ID
  traceUser: true
});
```

### 4. Less 样式开发

项目已集成 Less 预处理器。详细使用说明请查看 [LESS_GUIDE.md](LESS_GUIDE.md)

**快速上手：**

1. 所有样式文件使用 `.less` 扩展名
2. 微信开发者工具会自动编译 Less 为 WXSS
3. 使用变量和 Mixins 来保持样式一致性

```less
@import "../../styles/variables.less";

.my-component {
  color: @primary-color;
  padding: @space-lg;
  .center-flex();
}
```

### 5. 创建云数据库集合

在微信开发者工具的**云开发控制台 → 数据库**中创建以下集合：

#### 5.1 users（用户信息集合）

权限设置：
```json
{
  "read": true,
  "write": "doc._openid == auth.openid"
}
```

索引设置：
- `_openid` (唯一索引)
- `registerTime` (降序)

#### 5.2 official_content（官方内容集合）

权限设置：
```json
{
  "read": true,
  "write": false
}
```

索引设置：
- `publishTime` (降序)
- `priority` (降序)
- `status`

#### 5.3 user_dynamics（用户动态集合）

权限设置：
```json
{
  "read": "doc.isPrivate == false || doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

索引设置：
- `createTime` (降序)
- `_openid`
- `status`

### 6. 上传云函数

在微信开发者工具中，右键点击每个云函数目录，选择：
1. **上传并部署：云端安装依赖**（首次）
2. **上传并部署：所有文件**（后续更新）

需要上传的云函数：
- `login`
- `getOfficialContent`
- `getUserDynamics`

### 7. 准备图片资源

在 `miniprogram/images/` 目录下添加以下图片：

#### TabBar图标（必需）
- `tabbar/home.png` (首页默认图标)
- `tabbar/home-active.png` (首页选中图标)
- `tabbar/dynamics.png` (动态默认图标)
- `tabbar/dynamics-active.png` (动态选中图标)
- `tabbar/mine.png` (我的默认图标)
- `tabbar/mine-active.png` (我的选中图标)

建议尺寸：81px × 81px

#### 占位图（可选）
- `placeholder/default-avatar.png` (默认头像)
- `placeholder/no-data.png` (空数据提示图)

### 8. 添加测试数据

在云开发控制台的数据库中手动添加官方内容测试数据：

进入 `official_content` 集合，点击"添加记录"，示例数据：

```json
{
  "title": "欢迎使用小程序",
  "content": "这是一条官方公告内容，用于测试卡片式展示效果。",
  "images": [],
  "type": "announcement",
  "views": 100,
  "likes": 10,
  "status": "published",
  "priority": 10,
  "publishTime": "2026-01-04T00:00:00.000Z"
}
```

### 9. 编译运行

1. 在微信开发者工具中打开项目目录 `D:\Project\M`
2. 点击"编译"按钮
3. 选择"登录"页面进行测试

## 功能说明

### 首页（官方内容）

- **类型筛选**：全部/公告/新闻/活动
- **卡片展示**：标题、内容、图片、浏览数、点赞数
- **下拉刷新**：刷新最新内容
- **上拉加载**：加载更多内容
- **点赞分享**：支持点赞和分享功能
- **详情查看**：点击卡片查看完整内容（待开发）

### 动态页（用户动态）

- **动态列表**：展示所有公开用户动态
- **用户信息**：头像、昵称、发布时间
- **内容展示**：文字、图片（九宫格）、位置
- **互动功能**：点赞、评论、分享
- **发布动态**：右下角"+"按钮（待开发）
- **下拉刷新**：刷新最新动态
- **上拉加载**：加载更多动态

### 我的页面（个人中心）

- **用户信息**：头像、昵称、个性签名
- **数据统计**：动态数、粉丝数、关注数、获赞数
- **编辑资料**：修改个人信息（待开发）
- **功能菜单**：我的动态、我的点赞、设置（待开发）
- **退出登录**：清除登录状态

### 登录页

- **微信授权**：获取用户信息并登录
- **自动登录**：已登录用户自动跳转首页
- **用户协议**：显示用户协议和隐私政策提示

## 云函数说明

### login（登录）

**功能**：处理用户登录，创建或更新用户信息

**输入参数**：
```javascript
{
  userInfo: {
    nickName: "昵称",
    avatarUrl: "头像URL",
    gender: 0,
    province: "省份",
    city: "城市"
  }
}
```

**返回数据**：
```javascript
{
  code: 0,
  message: "登录成功",
  data: {
    openid: "用户openid",
    userInfo: { /* 用户信息 */ }
  }
}
```

### getOfficialContent（获取官方内容）

**功能**：分页获取官方发布的内容

**输入参数**：
```javascript
{
  page: 1,
  pageSize: 10,
  type: "all"  // all/announcement/news/activity
}
```

**返回数据**：
```javascript
{
  code: 0,
  message: "success",
  data: {
    list: [/* 内容列表 */],
    total: 100,
    hasMore: true
  }
}
```

### getUserDynamics（获取用户动态）

**功能**：分页获取用户动态列表

**输入参数**：
```javascript
{
  page: 1,
  pageSize: 10,
  userId: "用户openid（可选）"
}
```

**返回数据**：
```javascript
{
  code: 0,
  message: "success",
  data: {
    list: [/* 动态列表 */],
    total: 100,
    hasMore: true
  }
}
```

## 待开发功能

以下功能的页面和云函数代码框架已规划，需要继续开发：

### 页面功能
- [ ] **发布动态页**（publish）- 发布新动态
- [ ] **内容详情页**（detail）- 查看内容详情和评论
- [ ] **编辑资料功能** - 修改个人信息
- [ ] **我的动态列表** - 查看自己的动态
- [ ] **我的点赞列表** - 查看点赞的内容
- [ ] **设置页面** - 应用设置

### 云函数
- [ ] **publishDynamic** - 发布动态
- [ ] **updateUserInfo** - 更新用户信息
- [ ] **deleteDynamic** - 删除动态

### 高级功能
- [ ] 点赞功能完善（点赞记录、取消点赞）
- [ ] 评论功能（发布、查看、删除评论）
- [ ] 图片上传（云存储集成）
- [ ] 位置选择（地图API集成）
- [ ] 内容审核（文本、图片审核）
- [ ] 消息通知
- [ ] 用户关注/粉丝系统
- [ ] 搜索功能

## 常见问题

### 1. 云函数调用失败

**问题**：提示"云函数不存在"

**解决方案**：
- 确认云函数已上传并部署成功
- 检查云函数名称是否正确
- 在云开发控制台查看云函数日志

### 2. 数据库权限错误

**问题**：提示"权限不足"

**解决方案**：
- 检查数据库集合权限设置
- 确认用户已登录（有openid）
- 查看云开发控制台的数据库权限配置

### 3. TabBar图标不显示

**问题**：底部导航图标显示异常

**解决方案**：
- 确认图片路径正确
- 检查图片文件是否存在
- 图片格式必须是PNG
- 建议图片尺寸81px × 81px

### 4. 页面加载失败

**问题**：页面无法正常加载

**解决方案**：
- 检查 `app.json` 中的页面路径配置
- 确认页面文件完整（.js, .json, .wxml, .wxss）
- 查看控制台错误日志

## 开发建议

1. **云环境管理**：建议创建开发环境和生产环境，分别用于测试和正式发布
2. **数据库设计**：根据实际需求调整数据库字段和索引
3. **图片优化**：使用云存储CDN加速，压缩图片大小
4. **错误处理**：完善各页面的错误处理和用户提示
5. **性能优化**：使用分页加载、图片懒加载等技术
6. **安全审核**：集成内容安全API，过滤违规内容

## 版本信息

- **版本**：1.0.0
- **创建日期**：2026-01-04
- **微信基础库版本**：2.19.4
- **云开发SDK版本**：2.6.3

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目地址：D:\Project\M
- 文档位置：README.md

---

**祝开发顺利！**
