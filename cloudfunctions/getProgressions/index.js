const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { stroke, speedPer100m } = event;

  try {
    let query = {};
    if (stroke) {
      query.stroke = stroke;
    }

    let result;
    try {
      result = await db.collection('swim_progressions')
        .where(query)
        .get();
    } catch (dbError) {
      return {
        code: 0,
        message: 'success',
        data: { current: null, next: null, all: [] }
      };
    }

    const list = result.data;

    if (speedPer100m !== undefined && speedPer100m !== null) {
      const matched = list.find(
        item => speedPer100m >= item.minSpeed && speedPer100m < item.maxSpeed
      );

      if (matched) {
        const nextLevel = list.find(item => item.minSpeed < matched.minSpeed && item.minSpeed > 0);
        return {
          code: 0,
          message: 'success',
          data: {
            current: matched,
            next: nextLevel || null,
            all: list
          }
        };
      }
    }

    return {
      code: 0,
      message: 'success',
      data: { current: null, next: null, all: list }
    };
  } catch (error) {
    console.error('获取进阶数据失败:', error);
    return {
      code: 0,
      message: 'success',
      data: { current: null, next: null, all: [] }
    };
  }
};
