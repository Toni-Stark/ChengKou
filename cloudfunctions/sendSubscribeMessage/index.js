// 云函数：发送订阅消息（签到相关）
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// ==================== 配置区域 ====================
// 在微信公众平台申请订阅消息模板后，填入模板ID

const TEMPLATE_CONFIG = {
  // 签到提醒模板ID（提醒用户去签到）
  checkInReminder: 'yT9aCdkuvDSlGn90pymqxjBG_oIQRU1d38p0HYpvaDE',

  // 签到成功通知模板ID（告知用户已签到打卡）
  checkInSuccess: 'yT9aCdkuvDSlGn90pymqxjejejQXycZpnyyCG7ZdUKM',

  // 点击消息跳转的页面
  page: 'pages/featured-detail/featured-detail'
};

// ==================== 发送订阅消息函数 ====================

/**
 * 发送签到提醒
 * @param {string} openid - 用户的 openid
 * @param {object} data - 签到数据
 * @param {string} data.activityName - 活动名称
 * @param {string} data.checkInStatus - 签到状态
 * @param {string} data.deadline - 截止时间
 * @param {string} data.reminder - 温馨提醒
 */
async function sendCheckInReminder(openid, data) {
  const { activityName, checkInStatus, deadline, reminder } = data;

  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: openid,
      page: TEMPLATE_CONFIG.page,
      data: {
        thing1: {
          value: activityName.slice(0, 20) // 活动名称，最多20个字符
        },
        thing7: {
          value: checkInStatus.slice(0, 20) // 签到状态，最多20个字符
        },
        time5: {
          value: deadline // 截止时间
        },
        thing9: {
          value: reminder.slice(0, 20) // 温馨提醒，最多20个字符
        }
      },
      templateId: TEMPLATE_CONFIG.checkInReminder,
      miniprogramState: 'formal' // 正式版：formal, 开发版：developer, 体验版：trial
    });

    console.log('签到提醒发送成功:', result);
    return { success: true, result };
  } catch (error) {
    console.error('签到提醒发送失败:', error);
    return { success: false, error: error.errMsg || error.message };
  }
}

/**
 * 发送签到成功通知
 * @param {string} openid - 用户的 openid
 * @param {object} data - 签到数据
 * @param {string} data.activityName - 活动名称
 * @param {number} data.totalDays - 累计签到天数
 * @param {string} data.location - 服务地点
 * @param {string} data.time - 时间
 */
async function sendCheckInSuccess(openid, data) {
  const { activityName, totalDays, location, time } = data;

  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: openid,
      page: TEMPLATE_CONFIG.page,
      data: {
        thing1: {
          value: activityName.slice(0, 20) // 活动名称，最多20个字符
        },
        number6: {
          value: totalDays.toString() // 累计签到天数（数字）
        },
        thing30: {
          value: location.slice(0, 20) // 服务地点，最多20个字符
        },
        time4: {
          value: time // 时间
        }
      },
      templateId: TEMPLATE_CONFIG.checkInSuccess,
      miniprogramState: 'formal'
    });

    console.log('签到成功通知发送成功:', result);
    return { success: true, result };
  } catch (error) {
    console.error('签到成功通知发送失败:', error);
    return { success: false, error: error.errMsg || error.message };
  }
}

// ==================== 主函数 ====================
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { type, data, toUser } = event;

  try {
    let result = {};

    // 确定接收消息的用户 openid
    // 如果指定了 toUser，则发送给指定用户；否则发送给调用者
    const targetOpenid = toUser || wxContext.OPENID;

    switch (type) {
      case 'checkInReminder':
        // 发送签到提醒
        result = await sendCheckInReminder(targetOpenid, data);
        break;

      case 'checkInSuccess':
        // 发送签到成功通知
        result = await sendCheckInSuccess(targetOpenid, data);
        break;

      default:
        throw new Error(`未知的消息类型: ${type}。支持的类型：checkInReminder, checkInSuccess`);
    }

    return {
      code: 0,
      message: '订阅消息发送完成',
      data: result
    };

  } catch (error) {
    console.error('订阅消息发送失败:', error);
    return {
      code: -1,
      message: '订阅消息发送失败',
      error: error.errMsg || error.message
    };
  }
};
