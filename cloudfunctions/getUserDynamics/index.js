// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { page = 1, pageSize = 10, userId, includeFollowing = false } = event;

  try {
    const _ = db.command;
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    let where = {
      status: 'published',
      isPrivate: false
    };

    // 如果指定了userId，则只查询该用户的动态
    if (userId) {
      where._openid = userId;
    } else if (includeFollowing) {
      // 查询自己和关注的人的动态
      // 首先获取我关注的人的列表
      const followingResult = await db.collection('follows')
        .where({
          _openid: wxContext.OPENID
        })
        .get();

      const followingOpenids = followingResult.data.map(item => item.followingOpenid);
      followingOpenids.push(wxContext.OPENID); // 加上自己

      // 查询这些人的动态
      where._openid = _.in(followingOpenids);
    }
    // 默认查询所有用户的动态（不添加 _openid 条件）

    // 查询总数
    const countResult = await db.collection('user_dynamics')
      .where(where)
      .count();

    const total = countResult.total;

    // 查询列表
    const listResult = await db.collection('user_dynamics')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    // 查询当前用户对这些动态的点赞状态
    const dynamicIds = listResult.data.map(item => item._id);
    let userLikes = [];

    if (dynamicIds.length > 0 && wxContext.OPENID) {
      const likesResult = await db.collection('likes')
        .where({
          _openid: wxContext.OPENID,
          targetType: 'dynamic',
          targetId: _.in(dynamicIds)
        })
        .get();

      userLikes = likesResult.data.map(item => item.targetId);
    }

    // 统计每个动态的点赞数和评论数
    const likesCountPromises = dynamicIds.map(id =>
      db.collection('likes')
        .where({ targetType: 'dynamic', targetId: id })
        .count()
    );

    const commentsCountPromises = dynamicIds.map(id =>
      db.collection('comments')
        .where({ dynamicId: id })
        .count()
    );

    const likesCountResults = await Promise.all(likesCountPromises);
    const commentsCountResults = await Promise.all(commentsCountPromises);

    // 标记用户已点赞的动态，并添加统计数据
    const dynamicsWithLikeStatus = listResult.data.map((dynamic, index) => ({
      ...dynamic,
      isLiked: userLikes.includes(dynamic._id),
      likesCount: likesCountResults[index].total,
      commentsCount: commentsCountResults[index].total
    }));

    return {
      code: 0,
      message: 'success',
      data: {
        list: dynamicsWithLikeStatus,
        total: total,
        page: page,
        pageSize: pageSize,
        hasMore: skip + pageSize < total
      }
    };

  } catch (error) {
    console.error('获取用户动态失败:', error);
    return {
      code: -1,
      message: '获取动态失败，请重试',
      data: null
    };
  }
};
