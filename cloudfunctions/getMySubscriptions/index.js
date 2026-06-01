const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { page = 1, pageSize = 20 } = event;

  try {
    const skip = (page - 1) * pageSize;

    const subResult = await db.collection('subscriptions')
      .where({ subscriberOpenid: wxContext.OPENID })
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    if (subResult.data.length === 0) {
      return {
        code: 0,
        message: 'success',
        data: { list: [], hasMore: false }
      };
    }

    const targetOpenids = subResult.data.map(item => item.targetOpenid);

    const usersResult = await db.collection('users')
      .where({ _openid: _.in(targetOpenids) })
      .get();

    const userMap = {};
    usersResult.data.forEach(user => {
      userMap[user._openid] = user;
    });

    const list = targetOpenids.map(openid => ({
      _openid: openid,
      nickName: userMap[openid]?.nickName || '未知用户',
      avatarUrl: userMap[openid]?.avatarUrl || '',
      signature: userMap[openid]?.signature || ''
    })).filter(item => item.nickName !== '未知用户' || item.avatarUrl);

    return {
      code: 0,
      message: 'success',
      data: {
        list: list,
        hasMore: subResult.data.length === pageSize
      }
    };

  } catch (error) {
    console.error('获取订阅列表失败:', error);
    return {
      code: -1,
      message: '获取订阅列表失败',
      data: { list: [], hasMore: false }
    };
  }
};
