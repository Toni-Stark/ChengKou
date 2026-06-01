const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await db.collection('check_ins')
      .where({
        _openid: wxContext.OPENID,
        date: db.command.gte(today).and(db.command.lt(tomorrow))
      })
      .get();

    if (existing.data.length > 0) {
      return {
        code: 0,
        message: '今日已打卡',
        data: {
          checkedIn: true,
          checkInTime: existing.data[0].createTime
        }
      };
    }

    await db.collection('check_ins').add({
      data: {
        _openid: wxContext.OPENID,
        date: db.serverDate(),
        createTime: db.serverDate()
      }
    });

    return {
      code: 0,
      message: '打卡成功',
      data: {
        checkedIn: true,
        checkInTime: new Date()
      }
    };

  } catch (error) {
    console.error('打卡失败:', error);
    return {
      code: -1,
      message: '打卡失败，请重试',
      data: null
    };
  }
};
