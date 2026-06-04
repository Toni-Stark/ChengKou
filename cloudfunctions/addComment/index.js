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
  const { dynamicId, content, replyTo, replyToUser } = event;

  if (!dynamicId || !content || !content.trim()) {
    return {
      code: -1,
      message: '参数错误',
      data: null
    };
  }

  try {
    const userResult = await db.collection('users')
      .where({ _openid: wxContext.OPENID })
      .get();
    const dbUser = (userResult.data && userResult.data.length > 0) ? userResult.data[0] : null;

    const userInfo = {
      nickName: dbUser?.nickName || '微信用户',
      avatarUrl: dbUser?.avatarUrl || ''
    };

    const result = await db.collection('comments').add({
      data: {
        _openid: wxContext.OPENID,
        dynamicId: dynamicId,
        content: content.trim(),
        replyTo: replyTo || null,
        replyToUser: replyToUser || null,
        userInfo: userInfo,
        likesCount: 0,
        createTime: db.serverDate()
      }
    });

    // 更新动态的评论数
    await db.collection('user_dynamics')
      .doc(dynamicId)
      .update({
        data: {
          commentsCount: _.inc(1)
        }
      });

    return {
      code: 0,
      message: '评论成功',
      data: {
        commentId: result._id
      }
    };

  } catch (error) {
    console.error('添加评论失败:', error);
    return {
      code: -1,
      message: '评论失败，请重试',
      data: null
    };
  }
};
