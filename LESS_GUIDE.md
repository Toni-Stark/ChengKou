# Less 使用指南

本项目已集成 Less 预处理器，用于优化 CSS 开发体验。

## 项目结构

```
miniprogram/
├── styles/
│   ├── variables.less    # 变量定义（颜色、字体、间距等）
│   ├── mixins.less        # 常用混入（Mixins）
│   └── common.less        # 公共样式类
├── pages/
│   ├── index/
│   │   └── index.less     # 首页样式
│   ├── dynamics/
│   │   └── dynamics.less  # 动态页样式
│   ├── mine/
│   │   └── mine.less      # 我的页样式
│   └── login/
│       └── login.less     # 登录页样式
├── components/
│   ├── content-card/
│   │   └── content-card.less
│   ├── dynamic-item/
│   │   └── dynamic-item.less
│   └── user-avatar/
│       └── user-avatar.less
└── app.less              # 全局样式

```

## 配置说明

### 1. 小程序开发工具配置

项目已在 `project.config.json` 中启用了 Less 编译：

```json
{
  "setting": {
    "useCompilerPlugins": ["less"]
  }
}
```

### 2. npm 配置

已在 `miniprogram/package.json` 中安装了 Less：

```json
{
  "devDependencies": {
    "less": "^4.5.1"
  }
}
```

## 如何使用

### 1. 变量使用

在 `styles/variables.less` 中定义了所有颜色、字体、间距等变量：

```less
@import "../../styles/variables.less";

.my-component {
  color: @primary-color;
  font-size: @font-lg;
  padding: @space-base;
  border-radius: @radius-base;
}
```

### 2. Mixins 使用

在 `styles/mixins.less` 中提供了常用的混入：

```less
@import "../../styles/variables.less";
@import "../../styles/mixins.less";

.my-box {
  .center-flex();              // 居中对齐
  .box-shadow(@shadow-lg);     // 添加阴影
  .transition(all, 0.3s);      // 过渡动画
  .border-radius(@radius-lg);  // 圆角
}

.my-text {
  .text-ellipsis-mixin(2);     // 2行文本省略
}
```

### 3. 嵌套使用

Less 支持样式嵌套，使代码更清晰：

```less
.card {
  padding: @space-lg;

  &-title {
    font-size: @font-lg;
    color: @text-color;
  }

  &-content {
    font-size: @font-base;
    color: @text-secondary;
  }

  &:active {
    opacity: 0.8;
  }
}
```

### 4. 公共样式类

`styles/common.less` 提供了大量公共样式类：

```html
<!-- 布局 -->
<view class="flex-between">
<view class="flex-center">

<!-- 间距 -->
<view class="p-lg mt-base">

<!-- 文本 -->
<text class="text-lg text-primary font-bold">

<!-- 背景和圆角 -->
<view class="bg-white radius-base shadow-sm">
```

## 开发流程

### 1. 初次使用

1. 在微信开发者工具中打开项目
2. 点击"工具" -> "构建 npm"
3. 等待构建完成

### 2. 开发

- 直接编辑 `.less` 文件
- 保存后微信开发者工具会自动编译为 `.wxss` 文件
- 无需手动编译

### 3. 注意事项

- ⚠️ 不要直接编辑 `.wxss` 文件，它们会被自动生成的 Less 编译结果覆盖
- ✅ 所有样式修改都在 `.less` 文件中进行
- ✅ 使用变量和 mixins 来保持样式一致性

## 常用变量参考

### 颜色

```less
@primary-color: #07c160;      // 主色
@text-color: #333333;         // 主要文本
@text-secondary: #666666;     // 次要文本
@text-placeholder: #999999;   // 占位文本
@bg-color: #f5f5f5;           // 背景色
@bg-white: #ffffff;           // 白色背景
@border-color: #e5e5e5;       // 边框色
```

### 字体大小

```less
@font-xs: 10px;
@font-sm: 12px;
@font-base: 14px;
@font-lg: 16px;
@font-xl: 18px;
@font-2xl: 20px;
@font-3xl: 24px;
```

### 间距

```less
@space-xs: 4px;
@space-sm: 8px;
@space-base: 12px;
@space-lg: 16px;
@space-xl: 20px;
@space-2xl: 24px;
@space-3xl: 32px;
```

### 圆角

```less
@radius-sm: 4px;
@radius-base: 8px;
@radius-lg: 12px;
@radius-xl: 16px;
@radius-round: 50%;
```

### 阴影

```less
@shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
@shadow-base: 0 2px 8px rgba(0, 0, 0, 0.1);
@shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);
```

## 最佳实践

1. **使用变量**：避免硬编码颜色、尺寸等值
2. **使用混入**：复用常用样式组合
3. **嵌套结构**：保持样式层级清晰
4. **命名规范**：使用 BEM 命名法（Block-Element-Modifier）
5. **模块化**：将相关样式组织在同一文件中

## 问题排查

### Less 文件没有编译

1. 检查微信开发者工具是否最新版本
2. 确认 `project.config.json` 中 `useCompilerPlugins` 包含 "less"
3. 重启微信开发者工具
4. 点击"工具" -> "构建 npm"

### 样式不生效

1. 检查 `.less` 文件中的 `@import` 路径是否正确
2. 确认变量名是否拼写正确
3. 查看开发者工具控制台是否有编译错误

### 变量未定义

确保在使用变量前导入了 `variables.less`：

```less
@import "../../styles/variables.less";
```

## 参考资源

- [Less 官方文档](https://lesscss.org/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
