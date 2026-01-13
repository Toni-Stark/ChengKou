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

  try {
    // 查询用户是否已存在
    const userResult = await db.collection('users')
      .where({
        _openid: openid
      })
      .get();

    if (userResult.data.length === 0) {
      // 用户不存在，返回未注册标记
      return {
        code: 0,
        message: '用户未注册',
        data: {
          openid: openid,
          userInfo: null,
          isRegistered: false
        }
      };
    }

    // 用户已存在，更新最后登录时间
    const now = db.serverDate();
    await db.collection('users')
      .where({
        _openid: openid
      })
      .update({
        data: {
          lastLoginTime: now,
          updateTime: now
        }
      });

    // 查询用户完整信息（包含统计数据）
    const userInfo = userResult.data[0];

    // 统计用户的动态数
    const dynamicsCount = await db.collection('user_dynamics')
      .where({
        _openid: openid,
        status: 'published'
      })
      .count();

    // 统计用户的粉丝数
    const followersCount = await db.collection('follows')
      .where({
        followingOpenid: openid
      })
      .count();

    // 统计用户的关注数
    const followingCount = await db.collection('follows')
      .where({
        _openid: openid
      })
      .count();

    // 统计用户获得的总点赞数
    const dynamicIds = await db.collection('user_dynamics')
      .where({
        _openid: openid,
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
      message: '静默登录成功',
      data: {
        openid: openid,
        userInfo: fullUserInfo,
        isRegistered: true
      }
    };

  } catch (error) {
    console.error('静默登录失败:', error);
    return {
      code: -1,
      message: '静默登录失败',
      data: null
    };
  }
};
