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

    // 统计用户的粉丝数（有多少人关注了我）
    const followersCount = await db.collection('follows')
      .where({
        followingOpenid: targetOpenid
      })
      .count();

    // 统计用户的关注数（我关注了多少人）
    const followingCount = await db.collection('follows')
      .where({
        _openid: targetOpenid
      })
      .count();

    // 统计用户获得的总点赞数（动态被点赞的次数）
    const dynamicIds = await db.collection('user_dynamics')
      .where({
        _openid: targetOpenid,
        status: 'published'
      })
      .field({
        _id: true
      })
      .get();

    let likesCount = 0;
    if (dynamicIds.data.length > 0) {
      const ids = dynamicIds.data.map(item => item._id);
      const likesResult = await db.collection('likes')
        .where({
          targetType: 'dynamic',
          targetId: db.command.in(ids)
        })
        .count();

      likesCount = likesResult.total;
    }

    // 组装返回数据
    const fullUserInfo = {
      ...userInfo,
      stats: {
        dynamicsCount: dynamicsCount.total,
        followersCount: followersCount.total,
        followingCount: followingCount.total,
        likesCount: likesCount
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
