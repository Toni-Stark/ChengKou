const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { targetOpenid } = event;

  if (!targetOpenid) {
    return {
      code: -1,
      message: '参数错误',
      data: null
    };
  }

  try {
    const subscriptionRecord = await db.collection('subscriptions')
      .where({
        subscriberOpenid: wxContext.OPENID,
        targetOpenid: targetOpenid
      })
      .get();

    const isSubscribed = subscriptionRecord.data.length > 0;

    if (isSubscribed) {
      await db.collection('subscriptions')
        .doc(subscriptionRecord.data[0]._id)
        .remove();

      await db.collection('users')
        .where({ _openid: targetOpenid })
        .update({
          data: {
            'stats.followersCount': _.inc(-1)
          }
        });

      await db.collection('users')
        .where({ _openid: wxContext.OPENID })
        .update({
          data: {
            'stats.subscriptionsCount': _.inc(-1)
          }
        });

      return {
        code: 0,
        message: '取消订阅成功',
        data: {
          isSubscribed: false
        }
      };
    } else {
      await db.collection('subscriptions').add({
        data: {
          subscriberOpenid: wxContext.OPENID,
          targetOpenid: targetOpenid,
          createTime: db.serverDate()
        }
      });

      await db.collection('users')
        .where({ _openid: targetOpenid })
        .update({
          data: {
            'stats.followersCount': _.inc(1)
          }
        });

      await db.collection('users')
        .where({ _openid: wxContext.OPENID })
        .update({
          data: {
            'stats.subscriptionsCount': _.inc(1)
          }
        });

      return {
        code: 0,
        message: '订阅成功',
        data: {
          isSubscribed: true
        }
      };
    }

  } catch (error) {
    console.error('订阅操作失败:', error);
    return {
      code: -1,
      message: '操作失败，请重试',
      data: null
    };
  }
};
