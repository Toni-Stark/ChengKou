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
  const { targetType, targetId } = event; // targetType: 'dynamic' | 'comment'

  if (!targetType || !targetId) {
    return {
      code: -1,
      message: '参数错误',
      data: null
    };
  }

  try {
    // 查询是否已点赞
    const likeRecord = await db.collection('likes')
      .where({
        _openid: wxContext.OPENID,
        targetType: targetType,
        targetId: targetId
      })
      .get();

    const isLiked = likeRecord.data.length > 0;

    if (isLiked) {
      // 取消点赞
      await db.collection('likes')
        .doc(likeRecord.data[0]._id)
        .remove();

      // 更新点赞数（减1）
      const collectionName = targetType === 'dynamic' ? 'user_dynamics' : 'comments';
      await db.collection(collectionName)
        .doc(targetId)
        .update({
          data: {
            likesCount: _.inc(-1)
          }
        });

      return {
        code: 0,
        message: '取消点赞成功',
        data: {
          isLiked: false
        }
      };
    } else {
      // 添加点赞
      await db.collection('likes').add({
        data: {
          _openid: wxContext.OPENID,
          targetType: targetType,
          targetId: targetId,
          createTime: db.serverDate()
        }
      });

      // 更新点赞数（加1）
      const collectionName = targetType === 'dynamic' ? 'user_dynamics' : 'comments';
      await db.collection(collectionName)
        .doc(targetId)
        .update({
          data: {
            likesCount: _.inc(1)
          }
        });

      return {
        code: 0,
        message: '点赞成功',
        data: {
          isLiked: true
        }
      };
    }

  } catch (error) {
    console.error('点赞操作失败:', error);
    return {
      code: -1,
      message: '操作失败，请重试',
      data: null
    };
  }
};
