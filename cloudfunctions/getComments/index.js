// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { dynamicId, page = 1, pageSize = 20 } = event;

  if (!dynamicId) {
    return {
      code: -1,
      message: '参数错误',
      data: null
    };
  }

  try {
    const skip = (page - 1) * pageSize;

    // 查询总数
    const countResult = await db.collection('comments')
      .where({
        dynamicId: dynamicId
      })
      .count();

    const total = countResult.total;

    // 查询评论列表（按时间倒序）
    const listResult = await db.collection('comments')
      .where({
        dynamicId: dynamicId
      })
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    // 查询当前用户对这些评论的点赞状态
    const commentIds = listResult.data.map(item => item._id);
    let userLikes = [];

    if (commentIds.length > 0) {
      const likesResult = await db.collection('likes')
        .where({
          _openid: wxContext.OPENID,
          targetType: 'comment',
          targetId: db.command.in(commentIds)
        })
        .get();

      userLikes = likesResult.data.map(item => item.targetId);
    }

    // 标记用户已点赞的评论
    const commentsWithLikeStatus = listResult.data.map(comment => ({
      ...comment,
      isLiked: userLikes.includes(comment._id)
    }));

    return {
      code: 0,
      message: 'success',
      data: {
        list: commentsWithLikeStatus,
        total: total,
        page: page,
        pageSize: pageSize,
        hasMore: skip + pageSize < total
      }
    };

  } catch (error) {
    console.error('获取评论失败:', error);
    return {
      code: -1,
      message: '获取评论失败，请重试',
      data: null
    };
  }
};
