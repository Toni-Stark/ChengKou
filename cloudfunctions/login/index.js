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
  const openid = wxContext.OPENID;
  const { userInfo } = event;

  try {
    // 查询用户是否已存在
    const userResult = await db.collection('users')
      .where({
        _openid: openid
      })
      .get();

    const now = db.serverDate();

    if (userResult.data.length === 0) {
      // 新用户，创建用户记录
      await db.collection('users').add({
        data: {
          _openid: openid,
          nickName: userInfo.nickName || '微信用户',
          avatarUrl: userInfo.avatarUrl || '',
          gender: userInfo.gender || 0,
          province: userInfo.province || '',
          city: userInfo.city || '',
          signature: '',
          phone: '',
          email: '',
          stats: {
            dynamicsCount: 0,
            followersCount: 0,
            followingCount: 0,
            likesCount: 0
          },
          lastLoginTime: now,
          registerTime: now,
          updateTime: now
        }
      });

      console.log('新用户注册成功:', openid);
    } else {
      // 已存在用户，只更新最后登录时间
      // 不覆盖用户已自定义的昵称、头像等信息
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

      console.log('用户登录成功:', openid);
    }

    // 重新查询用户信息返回
    const finalUserResult = await db.collection('users')
      .where({
        _openid: openid
      })
      .get();

    return {
      code: 0,
      message: '登录成功',
      data: {
        openid: openid,
        userInfo: finalUserResult.data[0]
      }
    };

  } catch (error) {
    console.error('登录失败:', error);
    return {
      code: -1,
      message: '登录失败，请重试',
      data: null
    };
  }
};
