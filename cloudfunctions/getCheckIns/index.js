const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

function pad(n) {
  return String(n).padStart(2, '0');
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { year, month } = event;

  if (!year || !month) {
    return { code: -1, message: '参数错误', data: null };
  }

  try {
    // 字符串查询（新格式）
    const startStr = `${year}-${pad(month)}-01`;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const endStr = `${nextYear}-${pad(nextMonth)}-01`;

    // Date 查询（兼容旧数据）
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const [strResult, dateResult] = await Promise.all([
      db.collection('check_ins')
        .where({
          _openid: wxContext.OPENID,
          date: _.gte(startStr).and(_.lt(endStr))
        })
        .get(),
      db.collection('check_ins')
        .where({
          _openid: wxContext.OPENID,
          date: _.gte(startDate).and(_.lt(endDate))
        })
        .get()
    ]);

    const seen = new Set();
    const records = {};

    function addRecord(item) {
      if (seen.has(item._id)) return;
      seen.add(item._id);
      let day;
      if (typeof item.date === 'string') {
        day = parseInt(item.date.split('-')[2], 10);
      } else {
        day = new Date(item.date).getDate();
      }
      records[day] = {
        _id: item._id,
        distance: item.distance || 0,
        duration: item.duration || 0,
        stroke: item.stroke || '',
        createTime: item.createTime
      };
    }

    dateResult.data.forEach(addRecord);
    strResult.data.forEach(addRecord);

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
