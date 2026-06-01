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
  const { userId, page = 1, pageSize = 10 } = event;

  // 如果没有指定userId，则查询当前用户
  const targetOpenid = userId || wxContext.OPENID;

  try {
    // 查询用户点赞的记录
    const likesResult = await db.collection('likes')
      .where({
        _openid: targetOpenid,
        targetType: 'dynamic'
      })
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    if (likesResult.data.length === 0) {
      return {
        code: 0,
        message: 'success',
        data: {
          list: [],
          hasMore: false
        }
      };
    }

    // 提取所有动态ID
    const dynamicIds = likesResult.data.map(item => item.targetId);

    // 查询动态详情
    const dynamicsResult = await db.collection('user_dynamics')
      .where({
        _id: _.in(dynamicIds),
        status: 'published'
      })
      .get();

    // 查询每个动态的作者信息
    const openids = [...new Set(dynamicsResult.data.map(item => item._openid))];
    const usersResult = await db.collection('users')
      .where({
        _openid: _.in(openids)
      })
      .get();

    // 创建用户信息映射
    const usersMap = {};
    usersResult.data.forEach(user => {
      usersMap[user._openid] = user;
    });

    // 查询当前用户对这些动态的点赞状态
    const currentUserLikes = await db.collection('likes')
      .where({
        _openid: wxContext.OPENID,
        targetType: 'dynamic',
        targetId: _.in(dynamicIds)
      })
      .get();

    const likedMap = {};
    currentUserLikes.data.forEach(like => {
      likedMap[like.targetId] = true;
    });

    // 组装数据，使用文档中存储的计数
    const dynamicsWithStats = dynamicsResult.data.map(dynamic => ({
      ...dynamic,
      author: usersMap[dynamic._openid] || {
        nickName: '未知用户',
        avatarUrl: ''
      },
      likesCount: dynamic.likesCount || 0,
      commentsCount: dynamic.commentsCount || 0,
      isLiked: likedMap[dynamic._id] || false
    }));

    // 按照点赞时间排序（根据原始likesResult的顺序）
    const sortedList = dynamicIds.map(id =>
      dynamicsWithStats.find(item => item._id === id)
    ).filter(item => item); // 过滤掉已删除的动态

    return {
      code: 0,
      message: 'success',
      data: {
        list: sortedList,
        hasMore: likesResult.data.length === pageSize
      }
    };

  } catch (error) {
    console.error('获取我的点赞失败:', error);
    return {
      code: -1,
      message: '获取我的点赞失败，请重试',
      data: {
        list: [],
        hasMore: false
      }
    };
  }
};
