// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const {
    displayType,
    content,
    title,
    subtitle,
    images,
    video,
    location
  } = event;

  // 验证必填字段
  if (!displayType) {
    return {
      code: -1,
      message: '请选择展示类型',
      data: null
    };
  }

  // 根据展示类型验证必填内容
  if (displayType === 'large') {
    if (!title || !images || images.length === 0) {
      return {
        code: -1,
        message: '大图模式需要标题和图片',
        data: null
      };
    }
  } else if (displayType === 'grid9') {
    if (!content && (!images || images.length === 0)) {
      return {
        code: -1,
        message: '请输入内容或添加图片',
        data: null
      };
    }
  } else if (displayType === 'text') {
    if (!content || !content.trim()) {
      return {
        code: -1,
        message: '请输入文本内容',
        data: null
      };
    }
  } else if (displayType === 'video') {
    if (!video) {
      return {
        code: -1,
        message: '请选择视频',
        data: null
      };
    }
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
    // 获取当前时间戳
    const now = new Date();
    const timestamp = now.getTime();

    // 构建动态数据
    const dynamicData = {
      _openid: wxContext.OPENID,
      displayType: displayType,
      content: content || '',
      title: title || '',
      subtitle: subtitle || '',
      images: images || [],
      video: video || '',
      location: location || null,
      userInfo: userInfo,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      status: 'published',
      isPrivate: false,
      createTime: timestamp,
      updateTime: timestamp
    };

    // 添加到数据库
    const result = await db.collection('user_dynamics').add({
      data: dynamicData
    });

    await db.collection('users')
      .where({ _openid: wxContext.OPENID })
      .update({
        data: {
          'stats.dynamicsCount': db.command.inc(1)
        }
      });

    return {
      code: 0,
      message: '发布成功',
      data: {
        dynamicId: result._id
      }
    };

  } catch (error) {
    console.error('发布动态失败:', error);
    return {
      code: -1,
      message: '发布失败，请重试',
      data: null
    };
  }
};
