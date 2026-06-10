const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

function pad(n) {
  return String(n).padStart(2, '0');
}

function toDateStr(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseDate(dateStr) {
  const parts = dateStr.split('-');
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { distance, date, duration, stroke } = event;

  console.log('[checkIn] 收到调用', { distance, date, duration, stroke, openid: wxContext.OPENID });

  try {
    const targetDateStr = date || toDateStr(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
    console.log('[checkIn] 目标日期: ' + targetDateStr);

    // 先用字符串精确查
    let strResult = await db.collection('check_ins')
      .where({
        _openid: wxContext.OPENID,
        date: targetDateStr
      })
      .get();

    console.log('[checkIn] 字符串查询结果 count=' + strResult.data.length);

      if (strResult.data.length > 0) {
      const record = strResult.data[0];
      const updateData = {
        updateTime: db.serverDate()
      };
      if (distance !== undefined) updateData.distance = Number(distance);
      if (duration !== undefined) updateData.duration = Number(duration);
      if (stroke !== undefined) updateData.stroke = stroke;
      await db.collection('check_ins').doc(record._id).update({ data: updateData });
      console.log('[checkIn] 更新完成 (字符串匹配)');
      return {
        code: 0,
        message: '已更新',
        data: {
          _id: record._id,
          checkedIn: true,
          distance: distance !== undefined ? Number(distance) : record.distance,
          duration: duration !== undefined ? Number(duration) : (record.duration || 0),
          stroke: stroke !== undefined ? stroke : (record.stroke || ''),
          checkInTime: record.createTime
        }
      };
    }

    // 字符串未命中，用 Date 范围查（兼容旧数据）
    const targetDate = parseDate(targetDateStr);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const dateResult = await db.collection('check_ins')
      .where({
        _openid: wxContext.OPENID,
        date: _.gte(targetDate).and(_.lt(nextDay))
      })
      .get();

    console.log('[checkIn] Date 查询结果 count=' + dateResult.data.length);

    if (dateResult.data.length > 0) {
      const record = dateResult.data[0];
      const updateData = {
        date: targetDateStr,
        updateTime: db.serverDate()
      };
      if (distance !== undefined) updateData.distance = Number(distance);
      if (duration !== undefined) updateData.duration = Number(duration);
      if (stroke !== undefined) updateData.stroke = stroke;
      await db.collection('check_ins').doc(record._id).update({ data: updateData });
      console.log('[checkIn] 更新并迁移完成 (Date → String)');
      return {
        code: 0,
        message: '已更新',
        data: {
          _id: record._id,
          checkedIn: true,
          distance: distance !== undefined ? Number(distance) : record.distance,
          duration: duration !== undefined ? Number(duration) : (record.duration || 0),
          stroke: stroke !== undefined ? stroke : (record.stroke || ''),
          checkInTime: record.createTime
        }
      };
    }

    // 全新记录
    const addData = {
      _openid: wxContext.OPENID,
      date: targetDateStr,
      createTime: db.serverDate()
    };
    if (distance !== undefined) addData.distance = Number(distance);
    if (duration !== undefined) addData.duration = Number(duration);
    if (stroke !== undefined) addData.stroke = stroke;

    console.log('[checkIn] 新增记录');
    const result = await db.collection('check_ins').add({ data: addData });
    console.log('[checkIn] 新增完成', result._id);

    return {
      code: 0,
      message: '打卡成功',
      data: {
        _id: result._id,
        checkedIn: true,
        distance: Number(distance) || 0,
        duration: Number(duration) || 0,
        stroke: stroke || '',
        checkInTime: new Date()
      }
    };

  } catch (error) {
    console.error('[checkIn] 执行失败:', error);
    return {
      code: -1,
      message: '打卡失败，请重试',
      data: null
    };
  }
};
