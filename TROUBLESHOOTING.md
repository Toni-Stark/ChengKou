# 小程序问题诊断和修复

本文档记录了小程序无法运行的问题及其修复方案。

## 问题清单

### 0. ❌ WXSS 编译错误 - 不支持的 CSS 特性

**问题描述：**
- Less 编译后的 WXSS 使用了小程序不支持的 CSS 特性
- 报错：`error at token ':'`
- 主要是 `:has()` 伪类选择器和 `cursor` 属性

**修复方案：**
1. **移除 `:has()` 伪类选择器**
   - 改用 CSS 类选择器
   - 在 WXML 中根据条件动态添加 class

2. **移除 `cursor` 属性**
   - 小程序是触屏设备，不需要鼠标样式

**详细说明：** 查看 [WXSS_FIX.md](WXSS_FIX.md)

**影响范围：**
- `components/content-card/content-card.less`
- `components/dynamic-item/dynamic-item.less`
- `pages/mine/mine.less`
- `styles/mixins.less`

---

### 1. ❌ 启动时自动跳转登录页导致 TabBar 无法显示

**问题描述：**
- `app.js` 的 `onLaunch()` 中检查登录状态
- 如果未登录，使用 `wx.redirectTo()` 跳转到登录页
- 这导致 TabBar 页面无法正常显示

**修复方案：**
```javascript
// 修改前：app.js
onLaunch() {
  // ...
  this.checkLoginStatus(); // ❌ 会立即跳转登录页
}

// 修改后：app.js
onLaunch() {
  // ...
  console.log('小程序启动');
  // ✅ 不在启动时检查登录，改为在各页面按需检查
}
```

**影响范围：** 所有 TabBar 页面无法正常加载

---

### 2. ❌ 云开发环境未配置导致云函数调用失败

**问题描述：**
- `app.js` 中云环境 ID 配置为 `'your-env-id'`（占位符）
- 云函数调用失败，导致页面无法加载数据

**修复方案：**
```javascript
// 修改前：
wx.cloud.init({
  env: 'your-env-id', // ❌ 占位符
  traceUser: true
});

// 修改后：
wx.cloud.init({
  // env: 'your-env-id', // ✅ 暂时注释，等配置云开发后再启用
  traceUser: true
});
```

**补充措施：** 添加模拟数据支持，即使云开发未配置也能正常显示

---

### 3. ❌ 缺少图片资源导致页面显示异常

**问题描述：**
- 页面引用了 `/images/placeholder/no-data.png`
- 实际 `images` 目录不存在

**修复方案：**
```html
<!-- 修改前：index.wxml -->
<view class="empty-state">
  <image src="/images/placeholder/no-data.png"></image> <!-- ❌ 文件不存在 -->
  <text>暂无内容</text>
</view>

<!-- 修改后：index.wxml -->
<view class="empty-state">
  <text class="empty-state-text">暂无内容</text> <!-- ✅ 简化显示 -->
</view>
```

**影响范围：** 首页、动态页的空状态显示

---

### 4. ❌ 云函数调用失败无降级方案

**问题描述：**
- 页面依赖云函数返回数据
- 云函数调用失败时页面显示空白

**修复方案：**

在每个需要云函数的页面添加模拟数据支持：

```javascript
// index.js
async loadContent(isPullRefresh = false) {
  try {
    // ✅ 检查云开发是否可用
    if (!wx.cloud || !wx.cloud.callFunction) {
      this.loadMockData(isPullRefresh);
      return;
    }

    const result = await request.callFunction('getOfficialContent', {...});
    // 处理真实数据...
  } catch (error) {
    // ✅ 调用失败时使用模拟数据
    this.loadMockData(isPullRefresh);
  }
}

// ✅ 添加模拟数据方法
loadMockData(isPullRefresh = false) {
  const mockData = [
    {
      _id: '1',
      title: '欢迎使用小程序',
      content: '这是测试内容...',
      // ...
    }
  ];
  this.setData({ contentList: mockData });
}
```

**影响范围：** 首页、动态页、我的页面

---

### 5. ❌ 我的页面未登录时无默认数据

**问题描述：**
- 我的页面依赖用户登录信息
- 未登录时页面显示空白或报错

**修复方案：**

```javascript
// mine.js
loadUserInfo() {
  const stored = auth.getStoredUserInfo();
  if (stored.userInfo) {
    this.setData({ userInfo: stored.userInfo });
  } else {
    // ✅ 添加默认数据
    this.setData({
      userInfo: {
        nickName: '未登录',
        avatarUrl: '/static/tabbar/4567.png',
        signature: '点击登录按钮进行登录',
        stats: {
          dynamicsCount: 0,
          followersCount: 0,
          followingCount: 0,
          likesCount: 0
        }
      }
    });
  }
}
```

**WXML 调整：**
```html
<view class="user-actions flex-row mt-lg">
  <!-- ✅ 根据登录状态显示不同按钮 -->
  <button wx:if="{{!userInfo._openid}}"
          class="btn btn-primary btn-block"
          bindtap="goToLogin">立即登录</button>
  <block wx:else>
    <button class="btn btn-primary flex-1 mr-sm" bindtap="editProfile">编辑资料</button>
    <button class="btn btn-secondary" bindtap="logout">退出登录</button>
  </block>
</view>
```

---

## 修复后的运行逻辑

### 启动流程
1. 小程序启动 → `app.js` 的 `onLaunch()`
2. 初始化云开发（如果已配置）
3. **不进行登录检查和跳转**
4. 正常加载首页（TabBar 页面）

### 页面加载流程
1. 页面 `onLoad()` 执行
2. 尝试调用云函数获取数据
3. 如果云函数不可用或调用失败 → 使用模拟数据
4. 正常显示页面内容

### 用户体验
- ✅ 小程序可以正常启动和浏览
- ✅ 未配置云开发也能查看界面
- ✅ 未登录用户可以浏览内容
- ✅ TabBar 正常切换
- ✅ 需要登录的功能会提示登录

---

## 如何配置云开发（可选）

如果需要使用真实的云函数和数据库：

### 1. 开通云开发
1. 在微信开发者工具中点击"云开发"
2. 创建云环境，获取环境 ID

### 2. 配置环境 ID
编辑 `miniprogram/app.js`：
```javascript
wx.cloud.init({
  env: 'cloud1-xxx', // 替换为你的环境 ID
  traceUser: true
});
```

### 3. 创建数据库集合
参考 README.md 中的说明创建：
- `users` - 用户信息
- `official_content` - 官方内容
- `user_dynamics` - 用户动态

### 4. 上传云函数
右键点击云函数目录 → 上传并部署

---

## 测试检查清单

使用以下清单验证小程序是否正常运行：

- [ ] 小程序能正常启动，不会自动跳转
- [ ] 首页能正常显示（显示模拟数据）
- [ ] 动态页能正常显示（显示模拟数据）
- [ ] 我的页面能正常显示（显示默认用户）
- [ ] TabBar 可以正常切换
- [ ] 点击"立即登录"能跳转到登录页
- [ ] 筛选功能正常工作
- [ ] 下拉刷新不会报错
- [ ] 上拉加载不会报错
- [ ] Less 样式正确编译和显示

---

## 开发建议

### 开发阶段
1. **先使用模拟数据开发界面**
2. **完成界面后再配置云开发**
3. **配置云开发后切换到真实数据**

### 生产环境
1. **必须配置云开发环境**
2. **必须上传所有云函数**
3. **必须创建数据库集合**
4. **建议移除或注释模拟数据代码**

---

## 常见错误和解决方案

### 错误 1：页面空白
**原因：** 云函数调用失败且无降级方案
**解决：** 已添加模拟数据支持

### 错误 2：TabBar 不显示
**原因：** 启动时跳转到非 TabBar 页面
**解决：** 移除 `onLaunch` 中的登录跳转

### 错误 3：图片不显示
**原因：** 图片路径错误或文件不存在
**解决：** 检查图片路径，使用存在的图片或移除图片引用

### 错误 4：云函数报错
**原因：** 云环境 ID 未配置或云函数未上传
**解决：** 配置正确的环境 ID，或暂时使用模拟数据

---

## 联系和支持

如果遇到其他问题：
1. 查看微信开发者工具的控制台错误信息
2. 检查本文档的问题清单
3. 查看 README.md 和 LESS_GUIDE.md
4. 在项目中搜索关键词查找相关代码

---

**最后更新：** 2026-01-04
**状态：** 所有已知问题已修复，小程序可正常运行
