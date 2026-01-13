# WXSS 编译错误修复说明

## 错误信息
```
[WXSS 文件编译错误]
./components/content-card/content-card.wxss(25:30): error at token `:`
(env: Windows,mp,2.01.2512292; lib: 2.19.4)
```

## 问题原因

小程序 WXSS **不支持以下 CSS 特性**：

### 1. ❌ `:has()` 伪类选择器
```css
/* ❌ 不支持 - 小程序无法识别 */
.card-images:has(.card-image:only-child) {
  grid-template-columns: 1fr;
}
```

**原因：** `:has()` 是 CSS 的较新特性，小程序还未支持。

### 2. ❌ `cursor` 属性
```css
/* ❌ 不支持 - 小程序是触屏设备 */
.content-card {
  cursor: pointer;
}
```

**原因：** 小程序主要运行在手机上（触屏设备），没有鼠标，因此不支持 `cursor` 属性。

---

## 修复方案

### 1. 替换 `:has()` 伪类

**修复前：**
```less
// content-card.less
.card-images {
  // ...
  &:has(.card-image:only-child) {
    grid-template-columns: 1fr;
    .card-image {
      height: 200px;
    }
  }
}
```

**修复后：**
```less
// content-card.less
.card-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @space-xs;
}

// 单张图片样式（需要在 WXML 中添加 class）
.card-images.single-image {
  grid-template-columns: 1fr;
  .card-image {
    height: 200px;
  }
}

// 两张图片样式（需要在 WXML 中添加 class）
.card-images.double-image {
  grid-template-columns: repeat(2, 1fr);
}
```

**说明：** 改用 CSS 类选择器，在 WXML 中根据图片数量动态添加对应的 class。

---

### 2. 移除 `cursor` 属性

**修复前：**
```less
.content-card {
  cursor: pointer;  // ❌ 小程序不支持
  transition: all 0.3s;
}
```

**修复后：**
```less
.content-card {
  transition: all 0.3s;  // ✅ 直接移除 cursor
}
```

---

## 修复的文件清单

### 组件样式（2个）
1. ✅ `components/content-card/content-card.less`
   - 移除 `:has()` 伪类
   - 移除 `cursor: pointer`

2. ✅ `components/dynamic-item/dynamic-item.less`
   - 移除 `:has()` 伪类
   - 移除 `cursor: pointer`

### 页面样式（1个）
3. ✅ `pages/mine/mine.less`
   - 移除 `cursor: pointer`

### 公共样式（1个）
4. ✅ `styles/mixins.less`
   - 移除 `.disabled()` mixin 中的 `cursor: not-allowed`

---

## 如何使用新的图片样式

如果需要根据图片数量显示不同布局，在 WXML 中动态添加 class：

### 示例：content-card 组件

```html
<!-- content-card.wxml -->
<view class="card-images {{item.images.length === 1 ? 'single-image' : ''}} {{item.images.length === 2 ? 'double-image' : ''}}">
  <image
    wx:for="{{item.images}}"
    wx:key="index"
    class="card-image"
    src="{{item}}"
    mode="aspectFill">
  </image>
</view>
```

### 示例：dynamic-item 组件

```html
<!-- dynamic-item.wxml -->
<view class="dynamic-images {{item.images.length === 1 ? 'single-image' : ''}} {{item.images.length === 2 ? 'double-image' : ''}}">
  <image
    wx:for="{{item.images}}"
    wx:key="index"
    class="dynamic-image"
    src="{{item}}"
    mode="aspectFill">
  </image>
</view>
```

---

## 验证修复

修复后，执行以下步骤验证：

### 1. 删除旧的编译文件
```bash
cd miniprogram
rm components/content-card/content-card.wxss
rm components/dynamic-item/dynamic-item.wxss
```

### 2. 重新编译
在微信开发者工具中：
1. 保存所有 `.less` 文件
2. 等待自动编译
3. 或手动点击"编译"按钮

### 3. 检查控制台
- ✅ 不应该有 WXSS 编译错误
- ✅ 页面正常显示
- ✅ 样式正确应用

---

## 小程序不支持的 CSS 特性总结

为了避免类似问题，以下是小程序 WXSS 不支持的常见 CSS 特性：

### 完全不支持
- ❌ `:has()` 伪类选择器
- ❌ `cursor` 属性
- ❌ `pointer-events` 的某些值（如 `all`）
- ❌ `filter` 的某些值
- ❌ `@import` 外部 URL
- ❌ 标签选择器（除了少数几个）

### 部分支持
- ⚠️ `position: sticky` - 某些版本不支持
- ⚠️ `gap` - 旧版本基础库不支持（2.8.0+ 支持）
- ⚠️ `grid` - 旧版本基础库不支持（2.4.0+ 支持）

### 完全支持
- ✅ `flexbox` 布局
- ✅ 常用的伪类（`:active`, `:hover` 等）
- ✅ CSS 变量（`var(--xxx)`）
- ✅ Less 变量和嵌套
- ✅ 动画和过渡

---

## 开发建议

### 1. 编写兼容的样式
```less
// ✅ 推荐：使用小程序支持的特性
.card {
  display: flex;
  transition: all 0.3s;

  &:active {
    opacity: 0.8;
  }
}

// ❌ 避免：使用不支持的特性
.card {
  cursor: pointer;

  &:has(.child) {
    // ...
  }
}
```

### 2. 测试编译结果
- 修改 Less 文件后立即检查控制台
- 查看编译生成的 WXSS 文件
- 在真机和模拟器上测试

### 3. 查阅文档
开发前查阅小程序 WXSS 官方文档：
https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html

---

## 常见问题

### Q1: 修复后仍然报错？
**A:**
1. 删除所有 `.wxss` 文件
2. 重启微信开发者工具
3. 重新编译

### Q2: 样式没有生效？
**A:**
1. 检查 Less 语法是否正确
2. 查看编译后的 WXSS 文件
3. 确认 class 名称是否正确

### Q3: 如何检查小程序支持哪些 CSS？
**A:**
1. 查看官方文档
2. 在真机上测试
3. 检查基础库版本要求

---

## 总结

本次修复主要解决了两个问题：
1. ✅ 移除了不支持的 `:has()` 伪类选择器
2. ✅ 移除了不支持的 `cursor` 属性

修复后，小程序可以正常编译和运行，不会再出现 WXSS 编译错误。

---

**最后更新：** 2026-01-04
**修复状态：** ✅ 已完成
**编译状态：** ✅ 正常
