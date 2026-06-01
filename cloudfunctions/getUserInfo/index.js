// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { userId } = event;

  // 如果没有指定userId，则查询当前用户
  const targetOpenid = userId || wxContext.OPENID;

  try {
    // 查询用户基本信息
    const userResult = await db.collection('users')
      .where({
        _openid: targetOpenid
      })
      .get();

    if (userResult.data.length === 0) {
      return {
        code: -1,
        message: '用户不存在',
        data: null
      };
    }

    const userInfo = userResult.data[0];

    // 统计用户的动态数
    const dynamicsCount = await db.collection('user_dynamics')
      .where({
        _openid: targetOpenid,
        status: 'published'
      })
      .count();

    // 统计用户的粉丝数（有多少人订阅了我）
    const followersCount = await db.collection('subscriptions')
      .where({
        targetOpenid: targetOpenid
      })
      .count();

    // 统计用户的订阅数（我订阅了多少人）
    const subscriptionsCount = await db.collection('subscriptions')
      .where({
        subscriberOpenid: targetOpenid
      })
      .count();

    const fullUserInfo = {
      ...userInfo,
      stats: {
        dynamicsCount: dynamicsCount.total,
        followersCount: followersCount.total,
        subscriptionsCount: subscriptionsCount.total
      }
    };

    return {
      code: 0,
      message: 'success',
      data: fullUserInfo
    };

  } catch (error) {
    console.error('获取用户信息失败:', error);
    return {
      code: -1,
      message: '获取用户信息失败，请重试',
      data: null
    };
  }
};
