# 首页重新设计说明

## 设计需求

按照用户要求，首页重新设计为以下三个区域：

1. **顶部区域**：等宽等高的卡片展示最新动态（完整图片）
2. **中间区域**：两个等大的Tab按钮（游泳教学视频、教练认证）
3. **底部区域**：微信和QQ联系方式展示

---

## 页面结构

### 1. 最新动态卡片（顶部）

**特点：**
- 等宽等高（1:1 比例）
- 完整展示图片
- 底部渐变遮罩显示标题和描述
- 可点击查看详情

**实现方式：**
```html
<view class="featured-card">
  <image class="featured-image" src="{{featuredDynamic.image}}" mode="aspectFill"></image>
  <view class="featured-overlay">
    <text class="featured-title">{{featuredDynamic.title}}</text>
    <text class="featured-desc">{{featuredDynamic.desc}}</text>
  </view>
</view>
```

**样式要点：**
- 使用 `padding-bottom: 100%` 实现等宽等高
- 图片使用 `position: absolute` 填充整个卡片
- 底部遮罩使用渐变背景 `linear-gradient`

---

### 2. Tab按钮区域（中间）

**特点：**
- 两个按钮等宽等高
- 左：游泳教学视频 📹
- 右：教练认证 🏊
- 点击有缩放动画和颜色变化

**实现方式：**
```html
<view class="tab-buttons">
  <view class="tab-button" bindtap="onVideoTabTap">
    <view class="tab-icon">📹</view>
    <text class="tab-text">游泳教学视频</text>
  </view>
  <view class="tab-button" bindtap="onCertificationTabTap">
    <view class="tab-icon">🏊</view>
    <text class="tab-text">教练认证</text>
  </view>
</view>
```

**交互效果：**
- 点击时缩放到 95%
- 背景色变为主题色
- 图标放大 1.2 倍
- 文字变白色

---

### 3. 联系方式区域（底部）

**特点：**
- 居中标题 "联系我们"
- 微信号可选择和复制
- QQ号可选择和复制
- 每行右侧有"复制"按钮

**实现方式：**
```html
<view class="contact-card">
  <view class="contact-title">联系我们</view>
  <view class="contact-item">
    <text class="contact-label">微信：</text>
    <text class="contact-value" selectable="true">{{contactInfo.wechat}}</text>
    <button class="copy-btn" bindtap="onCopyWechat">复制</button>
  </view>
  <view class="contact-item">
    <text class="contact-label">QQ：</text>
    <text class="contact-value" selectable="true">{{contactInfo.qq}}</text>
    <button class="copy-btn" bindtap="onCopyQQ">复制</button>
  </view>
</view>
```

**功能说明：**
- `selectable="true"` 允许长按选择文本
- 点击"复制"按钮自动复制到剪贴板
- 复制成功后显示提示

---

## 文件修改清单

### 1. `index.wxml` - 页面结构
✅ 完全重写，实现新的三段式布局
- 移除旧的筛选栏和内容列表
- 添加最新动态卡片
- 添加Tab按钮区域
- 添加联系方式区域

### 2. `index.less` - 页面样式
✅ 完全重写，适配新布局
- 等宽等高卡片样式
- Tab按钮样式和动画
- 联系方式卡片样式
- 响应式间距和阴影

### 3. `index.js` - 页面逻辑
✅ 完全重写，简化数据结构
- 移除旧的内容列表逻辑
- 添加最新动态数据
- 添加联系方式数据
- 实现Tab点击事件
- 实现复制功能

### 4. `index.json` - 页面配置
✅ 更新配置
- 移除 content-card 组件依赖
- 更改标题为"首页"
- 禁用下拉刷新

---

## 数据结构

### featuredDynamic - 最新动态
```javascript
{
  title: '2024游泳冬训班开始报名',
  desc: '专业教练团队，小班教学',
  image: '/static/tabbar/2345.png'
}
```

### contactInfo - 联系方式
```javascript
{
  wechat: 'SwimCoach2024',
  qq: '1234567890'
}
```

---

## 功能说明

### 1. 最新动态卡片
- **点击事件**：`onFeaturedCardTap()`
- **功能**：显示提示框（后续可跳转到详情页）
- **数据来源**：可从云端动态获取

### 2. 游泳教学视频Tab
- **点击事件**：`onVideoTabTap()`
- **功能**：显示提示框（后续可跳转到视频列表页）

### 3. 教练认证Tab
- **点击事件**：`onCertificationTabTap()`
- **功能**：显示提示框（后续可跳转到认证申请页）

### 4. 复制微信号
- **点击事件**：`onCopyWechat(e)`
- **功能**：复制微信号到剪贴板并提示

### 5. 复制QQ号
- **点击事件**：`onCopyQQ(e)`
- **功能**：复制QQ号到剪贴板并提示

---

## 样式特点

### 卡片阴影
- 使用 `box-shadow: @shadow-base` 和 `@shadow-sm`
- 点击时阴影变小增强交互感

### 过渡动画
- 所有交互元素都有 `transition: all 0.3s`
- 按钮点击缩放动画
- 颜色平滑过渡

### 间距设计
- 使用 Less 变量统一管理
- `@space-lg`, `@space-xl`, `@space-2xl` 等
- 保持视觉层次清晰

### 圆角设计
- 卡片使用 `@radius-lg` (12px)
- 按钮使用 `@radius-lg` (12px)
- 小按钮使用 `@radius-sm` (4px)

---

## 如何自定义

### 修改最新动态内容
编辑 `index.js` 的 `loadFeaturedDynamic()` 方法：
```javascript
const mockData = {
  title: '你的标题',
  desc: '你的描述',
  image: '你的图片路径'
};
```

### 修改联系方式
编辑 `index.js` 的 `data.contactInfo`：
```javascript
contactInfo: {
  wechat: '你的微信号',
  qq: '你的QQ号'
}
```

### 修改Tab图标
编辑 `index.wxml` 的图标 emoji：
```html
<view class="tab-icon">📹</view>  <!-- 改成你想要的 emoji -->
<view class="tab-icon">🏊</view>  <!-- 改成你想要的 emoji -->
```

### 调整卡片比例
编辑 `index.less` 的 `.featured-card`：
```less
padding-bottom: 100%;  // 1:1 正方形
padding-bottom: 75%;   // 4:3 矩形
padding-bottom: 56.25%; // 16:9 矩形
```

---

## 后续扩展建议

### 1. 最新动态
- [ ] 连接云数据库获取真实动态
- [ ] 添加动态详情页
- [ ] 支持轮播多个动态
- [ ] 添加分享功能

### 2. 教学视频
- [ ] 创建视频列表页
- [ ] 视频播放功能
- [ ] 视频分类和搜索
- [ ] 收藏和历史记录

### 3. 教练认证
- [ ] 创建认证申请表单
- [ ] 上传证书照片
- [ ] 审核流程
- [ ] 认证教练展示

### 4. 联系方式
- [ ] 添加客服二维码
- [ ] 在线客服功能
- [ ] 添加电话号码
- [ ] 添加地址信息

---

## 测试清单

- [ ] 首页正常显示三个区域
- [ ] 最新动态卡片图片正确显示
- [ ] 点击最新动态有响应
- [ ] 两个Tab按钮等宽等高
- [ ] 点击Tab有动画效果和提示
- [ ] 微信号和QQ号可以选择
- [ ] 点击复制按钮成功复制
- [ ] 复制后显示成功提示
- [ ] 页面滚动流畅
- [ ] 样式在不同屏幕尺寸下正常

---

## 视觉预览

```
┌─────────────────────────────┐
│                             │
│   ┌───────────────────┐     │
│   │                   │     │  ← 最新动态卡片
│   │    [完整图片]      │     │    (等宽等高)
│   │                   │     │
│   └─────[标题描述]─────┘     │
│                             │
│   ┌──────────┐ ┌──────────┐ │
│   │   📹    │ │   🏊    │ │  ← Tab按钮
│   │ 教学视频 │ │ 教练认证 │ │    (等宽等高)
│   └──────────┘ └──────────┘ │
│                             │
│   ┌───────────────────────┐ │
│   │    联系我们            │ │
│   │  微信：xxx  [复制]     │ │  ← 联系方式
│   │  QQ：xxx    [复制]     │ │
│   └───────────────────────┘ │
│                             │
└─────────────────────────────┘
```

---

**创建时间：** 2026-01-04
**状态：** ✅ 已完成
**版本：** v1.0
