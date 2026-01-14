// 云函数：发送通知
const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// ==================== 配置区域 ====================
// 请根据需要配置以下选项

const NOTIFICATION_CONFIG = {
  // 通知方式：'wechat_work' | 'official_account' | 'email' | 'serverchan' | 'pushplus' | 'none'
  method: 'wechat_work',

  // 企业微信机器人配置
  wechatWork: {
    webhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY_HERE'
  },

  // 公众号模板消息配置
  officialAccount: {
    appId: 'YOUR_APPID',
    appSecret: 'YOUR_APPSECRET',
    templateId: 'YOUR_TEMPLATE_ID',
    toUser: 'YOUR_OPENID' // 开发者的 OpenID
  },

  // Server酱配置
  serverChan: {
    sendKey: 'YOUR_SENDKEY_HERE'
  },

  // PushPlus配置
  pushPlus: {
    token: 'YOUR_TOKEN_HERE'
  }
};

// ==================== 通知发送方法 ====================

// 企业微信机器人通知
async function sendWechatWorkNotification(data) {
  const { name, phone, remark, contentTitle, time } = data;

  const message = {
    msgtype: 'markdown',
    markdown: {
      content: `# 新的报名通知
**课程名称：** ${contentTitle}
**报名姓名：** ${name}
**联系电话：** ${phone}
**备注信息：** ${remark || '无'}
**报名时间：** ${time}

> 请及时联系用户处理报名信息`
    }
  };

  try {
    const response = await axios.post(NOTIFICATION_CONFIG.wechatWork.webhook, message);
    console.log('企业微信通知发送成功:', response.data);
    return { success: true, response: response.data };
  } catch (error) {
    console.error('企业微信通知发送失败:', error);
    throw error;
  }
}

// 公众号模板消息通知
async function sendOfficialAccountNotification(data) {
  const { name, phone, remark, contentTitle, time } = data;
  const config = NOTIFICATION_CONFIG.officialAccount;

  try {
    // 1. 获取 access_token
    const tokenRes = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`
    );
    const accessToken = tokenRes.data.access_token;

    // 2. 发送模板消息
    const message = {
      touser: config.toUser,
      template_id: config.templateId,
      data: {
        first: { value: '您有新的课程报名' },
        keyword1: { value: contentTitle },
        keyword2: { value: name },
        keyword3: { value: phone },
        keyword4: { value: time },
        remark: { value: remark ? `备注：${remark}` : '请及时联系用户' }
      }
    };

    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`,
      message
    );

    console.log('公众号模板消息发送成功:', response.data);
    return { success: true, response: response.data };
  } catch (error) {
    console.error('公众号模板消息发送失败:', error);
    throw error;
  }
}

// Server酱通知
async function sendServerChanNotification(data) {
  const { name, phone, remark, contentTitle, time } = data;
  const sendKey = NOTIFICATION_CONFIG.serverChan.sendKey;

  const message = {
    title: '新的报名通知',
    desp: `**课程名称：** ${contentTitle}

**报名姓名：** ${name}

**联系电话：** ${phone}

**备注信息：** ${remark || '无'}

**报名时间：** ${time}

请及时联系用户处理报名信息`
  };

  try {
    const response = await axios.post(
      `https://sctapi.ftqq.com/${sendKey}.send`,
      message
    );
    console.log('Server酱通知发送成功:', response.data);
    return { success: true, response: response.data };
  } catch (error) {
    console.error('Server酱通知发送失败:', error);
    throw error;
  }
}

// PushPlus通知
async function sendPushPlusNotification(data) {
  const { name, phone, remark, contentTitle, time } = data;
  const token = NOTIFICATION_CONFIG.pushPlus.token;

  const message = {
    token: token,
    title: '新的报名通知',
    content: `<h3>课程名称：${contentTitle}</h3>
<p><strong>报名姓名：</strong>${name}</p>
<p><strong>联系电话：</strong>${phone}</p>
<p><strong>备注信息：</strong>${remark || '无'}</p>
<p><strong>报名时间：</strong>${time}</p>
<p>请及时联系用户处理报名信息</p>`,
    template: 'html'
  };

  try {
    const response = await axios.post('http://www.pushplus.plus/send', message);
    console.log('PushPlus通知发送成功:', response.data);
    return { success: true, response: response.data };
  } catch (error) {
    console.error('PushPlus通知发送失败:', error);
    throw error;
  }
}

// ==================== 主函数 ====================
exports.main = async (event, context) => {
  const { type, data } = event;

  // 如果配置为 none，则不发送通知
  if (NOTIFICATION_CONFIG.method === 'none') {
    console.log('通知功能已关闭');
    return {
      code: 0,
      message: '通知功能已关闭',
      data: null
    };
  }

  try {
    let result;

    switch (NOTIFICATION_CONFIG.method) {
      case 'wechat_work':
        result = await sendWechatWorkNotification(data);
        break;

      case 'official_account':
        result = await sendOfficialAccountNotification(data);
        break;

      case 'serverchan':
        result = await sendServerChanNotification(data);
        break;

      case 'pushplus':
        result = await sendPushPlusNotification(data);
        break;

      default:
        throw new Error(`未知的通知方式: ${NOTIFICATION_CONFIG.method}`);
    }

    return {
      code: 0,
      message: '通知发送成功',
      data: result
    };

  } catch (error) {
    console.error('通知发送失败:', error);
    return {
      code: -1,
      message: '通知发送失败',
      data: error.message
    };
  }
};
