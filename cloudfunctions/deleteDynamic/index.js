// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { dynamicId } = event;

  if (!dynamicId) {
    return {
      code: -1,
      message: '参数错误',
      data: null
    };
  }

  try {
    // 查询动态是否存在，并且是否属于当前用户
    const dynamicResult = await db.collection('user_dynamics')
      .doc(dynamicId)
      .get();

    if (!dynamicResult.data) {
      return {
        code: -1,
        message: '动态不存在',
        data: null
      };
    }

    // 检查是否是本人的动态
    if (dynamicResult.data._openid !== wxContext.OPENID) {
      return {
        code: -1,
        message: '无权删除',
        data: null
      };
    }

    // 删除动态
    await db.collection('user_dynamics')
      .doc(dynamicId)
      .remove();

    // 删除该动态的所有点赞记录
    await db.collection('likes')
      .where({
        targetType: 'dynamic',
        targetId: dynamicId
      })
      .remove();

    // 删除该动态的所有评论
    await db.collection('comments')
      .where({
        dynamicId: dynamicId
      })
      .remove();

    await db.collection('users')
      .where({ _openid: wxContext.OPENID })
      .update({
        data: {
          'stats.dynamicsCount': db.command.inc(-1)
        }
      });

    return {
      code: 0,
      message: '删除成功',
      data: null
    };

  } catch (error) {
    console.error('删除动态失败:', error);
    return {
      code: -1,
      message: '删除失败，请重试',
      data: null
    };
  }
};
