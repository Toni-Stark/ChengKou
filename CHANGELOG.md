# 更新日志

## [1.1.0] - 2026-01-04

### 新增功能

#### Less 预处理器集成
- 集成 Less 预处理器用于优化 CSS 开发体验
- 添加 npm 包管理支持

#### 样式系统优化
- 创建 `styles/variables.less` - 统一的样式变量管理
- 创建 `styles/mixins.less` - 常用样式混入库
- 创建 `styles/common.less` - 优化的公共样式类

#### 页面和组件样式迁移
将所有页面和组件样式从 WXSS 迁移到 Less：
- `app.less` - 全局样式
- `pages/index/index.less` - 首页样式
- `pages/dynamics/dynamics.less` - 动态页样式
- `pages/mine/mine.less` - 我的页面样式
- `pages/login/login.less` - 登录页样式
- `components/content-card/content-card.less` - 内容卡片组件样式
- `components/dynamic-item/dynamic-item.less` - 动态列表项组件样式
- `components/user-avatar/user-avatar.less` - 用户头像组件样式

### 配置更新

#### 项目配置
- 更新 `project.config.json` 启用 Less 编译器插件
- 配置 `useCompilerPlugins: ["less"]`

#### npm 配置
- 初始化 `miniprogram/package.json`
- 安装 `less@^4.5.1` 依赖
- 添加开发脚本说明

### 文档更新

#### 新增文档
- `LESS_GUIDE.md` - Less 使用指南
  - 项目结构说明
  - 配置说明
  - 使用方法
  - 变量和 Mixins 参考
  - 最佳实践
  - 问题排查

- `CHANGELOG.md` - 更新日志

#### 更新文档
- 更新 `README.md`
  - 添加 Less 和 npm 到技术栈
  - 更新项目结构说明
  - 添加依赖安装步骤
  - 添加 Less 样式开发说明

#### 其他文件
- `.gitignore` - Git 忽略文件配置

### 优化改进

#### CSS 代码优化
- 使用 Less 变量替代 CSS 变量，提高兼容性
- 使用嵌套语法，提高代码可读性
- 创建可复用的 Mixins，减少代码重复
- 使用变量统一管理颜色、字体、间距等

#### 开发体验优化
- 自动编译 Less 文件为 WXSS
- 支持变量、嵌套、混入等高级功能
- 更好的代码组织和维护性

### Less 特性应用

#### 变量系统
```less
// 颜色变量
@primary-color: #07c160;
@text-color: #333333;

// 字体大小
@font-base: 14px;
@font-lg: 16px;

// 间距
@space-base: 12px;
@space-lg: 16px;
```

#### 嵌套语法
```less
.card {
  padding: @space-lg;

  &-title {
    font-size: @font-lg;
  }

  &:active {
    opacity: 0.8;
  }
}
```

#### Mixins 混入
```less
// 文本省略
.text-ellipsis-mixin(2);

// 居中对齐
.center-flex();

// 过渡动画
.transition(all, 0.3s);
```

### 文件统计

#### 新增文件
- Less 样式文件：10 个
- 配置文件：1 个 (package.json)
- 文档文件：2 个 (LESS_GUIDE.md, CHANGELOG.md)
- Git 配置：1 个 (.gitignore)

#### 更新文件
- 项目配置：1 个 (project.config.json)
- 文档：1 个 (README.md)

### 向后兼容

- 保留原有 WXSS 文件（可选择性删除）
- 小程序功能完全兼容
- 不影响现有代码逻辑

### 使用说明

1. 安装依赖
```bash
cd miniprogram
npm install
```

2. 在微信开发者工具中构建 npm
- 工具 -> 构建 npm

3. 开始使用 Less 开发
- 编辑 `.less` 文件
- 保存后自动编译为 `.wxss`
- 查看 `LESS_GUIDE.md` 了解详细用法

### 注意事项

- 不要直接编辑 `.wxss` 文件，它们会被 Less 编译覆盖
- 所有样式修改在 `.less` 文件中进行
- 使用变量和 Mixins 保持样式一致性

---

## [1.0.0] - 2026-01-04

### 初始版本

- 完整的小程序框架搭建
- 首页、动态页、我的页面、登录页
- 云函数和云数据库集成
- 组件化开发
- 基础样式系统
