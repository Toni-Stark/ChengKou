const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { distance, date } = event;

  try {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existing = await db.collection('check_ins')
      .where({
        _openid: wxContext.OPENID,
        date: _.gte(targetDate).and(_.lt(nextDay))
      })
      .get();

    if (existing.data.length > 0) {
      const record = existing.data[0];
      const updateData = {
        updateTime: db.serverDate()
      };
      if (distance !== undefined) {
        updateData.distance = Number(distance);
      }

      await db.collection('check_ins').doc(record._id).update({
        data: updateData
      });

      return {
        code: 0,
        message: '已更新',
        data: {
          _id: record._id,
          checkedIn: true,
          distance: Number(distance) || record.distance || 0,
          checkInTime: record.createTime
        }
      };
    }

    const addData = {
      _openid: wxContext.OPENID,
      date: db.serverDate(),
      createTime: db.serverDate()
    };
    if (distance !== undefined) {
      addData.distance = Number(distance);
    }

    const result = await db.collection('check_ins').add({
      data: addData
    });

    return {
      code: 0,
      message: '打卡成功',
      data: {
        _id: result._id,
        checkedIn: true,
        distance: Number(distance) || 0,
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
