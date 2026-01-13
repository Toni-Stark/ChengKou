// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { nickName, signature, avatarUrl } = event;

  try {
    // 构建更新数据
    const updateData = {
      updateTime: db.serverDate()
    };

    if (nickName !== undefined) {
      updateData.nickName = nickName;
    }

    if (signature !== undefined) {
      updateData.signature = signature;
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    // 更新用户信息
    await db.collection('users')
      .where({
        _openid: openid
      })
      .update({
        data: updateData
      });

    // 查询更新后的用户信息
    const userResult = await db.collection('users')
      .where({
        _openid: openid
      })
      .get();

    if (userResult.data.length === 0) {
      return {
        code: -1,
        message: '用户不存在',
        data: null
      };
    }

    return {
      code: 0,
      message: '更新成功',
      data: userResult.data[0]
    };

  } catch (error) {
    console.error('更新用户信息失败:', error);
    return {
      code: -1,
      message: '更新失败，请重试',
      data: null
    };
  }
};
