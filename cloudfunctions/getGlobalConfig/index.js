// 云函数：获取全局配置
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 获取全局配置
 * @param {string} key - 配置键名（可选），如果不传则返回所有配置
 */
exports.main = async (event, context) => {
  const { key } = event;

  console.log('===== getGlobalConfig 云函数调用 =====');
  console.log('接收到的参数:', JSON.stringify(event));
  console.log('请求的 key:', key);

  try {
    // 如果指定了key，只返回该配置
    if (key) {
      console.log('开始查询数据库，collection: global_config, doc:', key);

      const result = await db.collection('global_config')
        .doc(key)
        .get();

      console.log('数据库查询结果:', JSON.stringify(result, null, 2));
      console.log('result.data:', result.data);
      console.log('result.data 类型:', typeof result.data);

      if (!result.data) {
        console.log('✗ 配置不存在，返回 null');
        return {
          code: 0,
          message: '配置不存在',
          data: null
        };
      }

      console.log('✓ 配置获取成功，返回数据');
      console.log('返回的 data:', JSON.stringify(result.data));

      return {
        code: 0,
        message: '获取成功',
        data: result.data
      };
    }

    // 如果没有指定key，返回所有配置
    const result = await db.collection('global_config')
      .get();

    // 转换为键值对格式，方便前端使用
    const configMap = {};
    result.data.forEach(item => {
      configMap[item.key] = item;
    });

    return {
      code: 0,
      message: '获取成功',
      data: {
        list: result.data,
        map: configMap
      }
    };

  } catch (error) {
    console.error('获取全局配置失败:', error);
    return {
      code: -1,
      message: '获取配置失败',
      data: null
    };
  }
};
