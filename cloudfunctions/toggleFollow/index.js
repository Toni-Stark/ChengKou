// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { followingOpenid, followingUserInfo } = event;

  if (!followingOpenid) {
    return {
      code: -1,
      message: '参数错误',
      data: null
    };
  }

  // 不能关注自己
  if (followingOpenid === wxContext.OPENID) {
    return {
      code: -1,
      message: '不能关注自己',
      data: null
    };
  }

  try {
    // 查询是否已关注
    const followRecord = await db.collection('follows')
      .where({
        _openid: wxContext.OPENID,
        followingOpenid: followingOpenid
      })
      .get();

    const isFollowing = followRecord.data.length > 0;

    if (isFollowing) {
      // 取消关注
      await db.collection('follows')
        .doc(followRecord.data[0]._id)
        .remove();

      return {
        code: 0,
        message: '取消关注成功',
        data: {
          isFollowing: false
        }
      };
    } else {
      // 添加关注
      await db.collection('follows').add({
        data: {
          followingOpenid: followingOpenid,
          followingUserInfo: followingUserInfo || {
            nickName: '微信用户',
            avatarUrl: ''
          },
          createTime: db.serverDate()
        }
      });

      return {
        code: 0,
        message: '关注成功',
        data: {
          isFollowing: true
        }
      };
    }

  } catch (error) {
    console.error('关注操作失败:', error);
    return {
      code: -1,
      message: '操作失败，请重试',
      data: null
    };
  }
};
