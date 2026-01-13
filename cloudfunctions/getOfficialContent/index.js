// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { page = 1, pageSize = 10, type = 'all' } = event;

  try {
    // 构建查询条件
    let where = {
      status: 'published'
    };

    if (type !== 'all') {
      where.type = type;
    }

    // 计算跳过的记录数
    const skip = (page - 1) * pageSize;

    // 查询总数
    const countResult = await db.collection('official_content')
      .where(where)
      .count();

    const total = countResult.total;

    // 查询列表
    const listResult = await db.collection('official_content')
      .where(where)
      .orderBy('priority', 'desc')
      .orderBy('publishTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    return {
      code: 0,
      message: 'success',
      data: {
        list: listResult.data,
        total: total,
        page: page,
        pageSize: pageSize,
        hasMore: skip + pageSize < total
      }
    };

  } catch (error) {
    console.error('获取官方内容失败:', error);
    return {
      code: -1,
      message: '获取内容失败，请重试',
      data: null
    };
  }
};
