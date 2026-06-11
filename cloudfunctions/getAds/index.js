const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const result = await db.collection('ads')
      .where({ status: 'active' })
      .orderBy('priority', 'desc')
      .orderBy('createTime', 'desc')
      .get();

    return {
      code: 0,
      message: 'success',
      data: { list: result.data }
    };
  } catch (error) {
    console.error('获取广告失败:', error);
    return {
      code: 0,
      message: 'success',
      data: { list: [] }
    };
  }
};
