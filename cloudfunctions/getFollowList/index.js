// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { type = 'following', page = 1, pageSize = 20, userId } = event;
  // type: 'following' (我关注的人) | 'followers' (关注我的人)

  try {
    const skip = (page - 1) * pageSize;
    const targetUserId = userId || wxContext.OPENID;

    let where = {};
    if (type === 'following') {
      // 查询我关注的人
      where._openid = targetUserId;
    } else {
      // 查询关注我的人
      where.followingOpenid = targetUserId;
    }

    // 查询总数
    const countResult = await db.collection('follows')
      .where(where)
      .count();

    const total = countResult.total;

    // 查询列表
    const listResult = await db.collection('follows')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    // 如果是��询"关注我的人"，需要查询每个人的用户信息
    let resultList = listResult.data;
    if (type === 'followers') {
      // 这里可以扩展查询用户详细信息
      resultList = listResult.data.map(item => ({
        ...item,
        userInfo: {
          openid: item._openid,
          // 可以通过其他方式获取用户信息
        }
      }));
    }

    return {
      code: 0,
      message: 'success',
      data: {
        list: resultList,
        total: total,
        page: page,
        pageSize: pageSize,
        hasMore: skip + pageSize < total
      }
    };

  } catch (error) {
    console.error('获取关注列表失败:', error);
    return {
      code: -1,
      message: '获取列表失败，请重试',
      data: null
    };
  }
};
