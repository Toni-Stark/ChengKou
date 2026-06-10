const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const competitions = [
  {
    name: '2026城市游泳公开赛·北京站',
    date: '2026-07-15',
    location: '北京国家游泳中心',
    status: 'upcoming',
    registrants: [
      { name: '张明', phone: '138****1234' },
      { name: '李娜', phone: '159****5678' }
    ]
  },
  {
    name: '2026全国成人游泳锦标赛',
    date: '2026-08-20',
    location: '上海东方体育中心',
    status: 'upcoming',
    registrants: [
      { name: '王磊', phone: '136****9012' },
      { name: '陈静', phone: '152****3456' },
      { name: '刘洋', phone: '185****7890' }
    ]
  },
  {
    name: '2026春季游泳大师赛',
    date: '2026-04-10',
    location: '广州天河体育中心',
    status: 'ended',
    topThree: [
      { rank: 1, name: '赵勇', time: '00:58:32' },
      { rank: 2, name: '李强', time: '01:02:15' },
      { rank: 3, name: '王浩', time: '01:05:40' }
    ]
  },
  {
    name: '2026青年游泳邀请赛',
    date: '2026-05-18',
    location: '深圳湾体育中心',
    status: 'ended',
    topThree: [
      { rank: 1, name: '陈伟', time: '00:55:20' },
      { rank: 2, name: '张磊', time: '00:58:45' },
      { rank: 3, name: '李鹏', time: '01:01:10' }
    ]
  }
];

exports.main = async (event, context) => {
  try {
    let total = 0;
    try {
      const existing = await db.collection('swim_competitions').count();
      total = existing.total;
    } catch (countErr) {
      total = 0;
    }

    let inserted = 0;
    for (const item of competitions) {
      const dup = await db.collection('swim_competitions')
        .where({ name: item.name, date: item.date })
        .get();
      if (dup.data.length === 0) {
        await db.collection('swim_competitions').add({ data: item });
        inserted++;
      } else {
        total++;
      }
    }

    return {
      code: 0,
      message: inserted > 0 ? `初始化完成，插入 ${inserted} 条赛事` : `已有 ${total} 条赛事，跳过初始化`,
      data: { inserted, existed: total }
    };
  } catch (error) {
    console.error('初始化赛事数据失败:', error);
    return {
      code: -1,
      message: '初始化失败: ' + error.message,
      data: null
    };
  }
};
