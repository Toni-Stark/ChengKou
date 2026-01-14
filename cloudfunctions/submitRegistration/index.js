// 云函数：提交报名信息
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { name, phone, remark, contentId, contentTitle } = event;

  try {
    // 验证必填字段
    if (!name || !phone) {
      return {
        code: -1,
        message: '姓名和手机号不能为空',
        data: null
      };
    }

    // 验证手机号格式
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      return {
        code: -1,
        message: '手机号格式不正确',
        data: null
      };
    }

    // 保存报名信息到数据库
    const result = await db.collection('registrations').add({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        remark: remark ? remark.trim() : '',
        contentId: contentId || '',
        contentTitle: contentTitle || '游泳培训课程',
        openid: wxContext.OPENID,
        status: 'pending', // pending: 待处理, contacted: 已联系, completed: 已完成
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    });

    console.log('报名信息保存成功:', result._id);

    // 调用订阅消息云函数，发送订阅消息
    try {
      await cloud.callFunction({
        name: 'sendSubscribeMessage',
        data: {
          type: 'both', // both: 同时发给用户和管理员, user: 只发给用户, admin: 只发给管理员
          data: {
            name: name.trim(),
            phone: phone.trim(),
            remark: remark ? remark.trim() : '',
            contentTitle: contentTitle || '游泳培训课程',
            time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
          }
        }
      });
      console.log('订阅消息发送成功');
    } catch (notifyError) {
      // 即使订阅消息发送失败，也不影响报名成功
      console.error('订阅消息发送失败:', notifyError);
    }

    // 可选：同时调用其他通知方式（企业微信、邮件等）
    // try {
    //   await cloud.callFunction({
    //     name: 'sendNotification',
    //     data: {
    //       type: 'registration',
    //       data: {
    //         id: result._id,
    //         name: name.trim(),
    //         phone: phone.trim(),
    //         remark: remark ? remark.trim() : '',
    //         contentTitle: contentTitle || '游泳培训课程',
    //         time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    //       }
    //     }
    //   });
    //   console.log('其他通知发送成功');
    // } catch (notifyError2) {
    //   console.error('其他通知发送失败:', notifyError2);
    // }

    return {
      code: 0,
      message: '报名成功',
      data: {
        id: result._id
      }
    };

  } catch (error) {
    console.error('报名失败:', error);
    return {
      code: -1,
      message: '报名失败，请重试',
      data: null
    };
  }
};
