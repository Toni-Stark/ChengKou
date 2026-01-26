# 全局配置说明

## 配置集合：global_config

此集合用于存储小程序的全局配置信息，可以通过数据库直接控制各种功能的显示/隐藏状态。

### 数据库设置步骤

#### 1. 创建集合

1. 打开微信开发者工具
2. 点击"云开发"按钮，进入云开发控制台
3. 选择"数据库"
4. 点击"+"号创建新集合
5. 输入集合名称：`global_config`
6. 点击"确定"

#### 2. 设置权限

在 `global_config` 集合的权限设置中：
- 所有用户可读：允许
- 仅创建者可写：允许

或使用自定义安全规则：
```json
{
  "read": true,
  "write": "doc._openid == auth.openid && auth.openid == 'YOUR_ADMIN_OPENID'"
}
```

#### 3. 添加初始配置数据

在 `global_config` 集合中添加一条记录：

```json
{
  "_id": "registration_form",
  "key": "registration_form",
  "name": "报名表单配置",
  "visible": true,
  "description": "控制报名页面中报名表单的显示/隐藏",
  "updateTime": "2026-01-23 00:00:00"
}
```

### 配置字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | String | 配置的唯一标识符（建议使用有意义的英文名称） |
| `key` | String | 配置键名（与 _id 保持一致） |
| `name` | String | 配置的中文名称（方便管理） |
| `visible` | Boolean | 是否显示（true=显示，false=隐藏） |
| `description` | String | 配置说明 |
| `updateTime` | String | 最后更新时间 |

### 如何控制报名卡片显示/隐藏

#### 方法1：在云开发控制台操作

1. 打开云开发控制台
2. 进入"数据库" → `global_config` 集合
3. 找到 `_id` 为 `registration_form` 的记录
4. 点击"编辑"
5. 修改 `visible` 字段：
   - 设置为 `true` → 显示报名表单
   - 设置为 `false` → 隐藏报名表单
6. 点击"确定"保存

修改后，用户刷新页面即可看到效果。

#### 方法2：使用数据库API（高级）

也可以编写管理后台，通过云函数修改配置：

```javascript
// 云函数示例
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { key, visible } = event

  // 更新配置
  await db.collection('global_config')
    .doc(key)
    .update({
      data: {
        visible: visible,
        updateTime: new Date().toISOString()
      }
    })

  return { success: true }
}
```

### 扩展配置

除了报名表单，你可以添加更多全局配置：

```json
{
  "_id": "dynamic_publish",
  "key": "dynamic_publish",
  "name": "动态发布功能",
  "visible": true,
  "description": "控制是否允许用户发布动态"
}
```

```json
{
  "_id": "comment_feature",
  "key": "comment_feature",
  "name": "评论功能",
  "visible": true,
  "description": "控制是否显示评论功能"
}
```

### 注意事项

1. 配置修改后，用户需要刷新页面才能看到最新效果
2. 建议在修改前先备份数据
3. `visible` 字段必须是布尔类型（true/false），不要使用字符串
4. 建议定期更新 `updateTime` 字段，方便追踪修改历史
