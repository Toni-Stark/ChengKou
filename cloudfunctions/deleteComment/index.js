// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { commentId, dynamicId } = event;

  if (!commentId || !dynamicId) {
    return {
      code: -1,
      message: '参数错误',
      data: null
    };
  }

  try {
    // 查询评论是否存在，且是当前用户的评论
    const comment = await db.collection('comments')
      .doc(commentId)
      .get();

    if (!comment.data) {
      return {
        code: -1,
        message: '评论不存在',
        data: null
      };
    }

    if (comment.data._openid !== wxContext.OPENID) {
      return {
        code: -1,
        message: '无权删除此评论',
        data: null
      };
    }

    // 删除评论
    await db.collection('comments')
      .doc(commentId)
      .remove();

    // 更新动态的评论数
    await db.collection('user_dynamics')
      .doc(dynamicId)
      .update({
        data: {
          commentsCount: _.inc(-1)
        }
      });

    return {
      code: 0,
      message: '删除成功',
      data: null
    };

  } catch (error) {
    console.error('删除评论失败:', error);
    return {
      code: -1,
      message: '删除失败，请重试',
      data: null
    };
  }
};
