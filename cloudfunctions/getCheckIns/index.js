const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { year, month } = event;

  if (!year || !month) {
    return { code: -1, message: '参数错误', data: null };
  }

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await db.collection('check_ins')
      .where({
        _openid: wxContext.OPENID,
        date: _.gte(startDate).and(_.lt(endDate))
      })
      .get();

    const records = {};
    result.data.forEach(item => {
      const d = new Date(item.date);
      const day = d.getDate();
      records[day] = {
        _id: item._id,
        distance: item.distance || 0,
        createTime: item.createTime
      };
    });

    return {
      code: 0,
      message: 'success',
      data: { records }
    };

  } catch (error) {
    console.error('获取打卡记录失败:', error);
    return {
      code: -1,
      message: '获取失败',
      data: { records: {} }
    };
  }
};
