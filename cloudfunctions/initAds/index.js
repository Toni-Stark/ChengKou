const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const ads = [
  {
    cardType: 'ad',
    title: '游泳私教一对一招生',
    description: '国家级游泳教练，10年教学经验。精通自由泳、蛙泳、仰泳、蝶泳四种泳姿教学。根据学员水平定制训练计划，从零基础到竞技提升均可。上课时间灵活，场地可就近安排。现在报名享首月8折优惠。',
    coverUrl: '',
    contactType: 'wechat',
    contactInfo: 'coach_swim_2026',
    tags: ['私教', '四种泳姿', '定制计划'],
    status: 'active',
    priority: 10,
    createTime: new Date('2026-06-01')
  },
  {
    cardType: 'competition',
    title: '2026全国成人游泳锦标赛',
    description: '全国成人游泳锦标赛将于8月20日在上海东方体育中心举行。设自由泳、蛙泳、仰泳、蝶泳各距离项目。报名费由平台全额赞助，欢迎钻石泳者及以上选手报名参赛。',
    coverUrl: '',
    contactType: 'wechat',
    contactInfo: 'swim_event_2026',
    tags: ['锦标赛', '上海', '全额赞助'],
    status: 'active',
    priority: 8,
    createTime: new Date('2026-05-15')
  },
  {
    cardType: 'ad',
    title: '暑期青少年游泳集训营',
    description: '针对6-16岁青少年开设的暑期游泳集训营。课程涵盖水感训练、四种泳姿技术、水上安全教育。小班教学，每班不超过8人，确保教学质量。结营颁发结业证书和游泳等级评定报告。',
    coverUrl: '',
    contactType: 'phone',
    contactInfo: '13800138000',
    tags: ['暑期', '青少年', '小班教学'],
    status: 'active',
    priority: 6,
    createTime: new Date('2026-06-05')
  }
];

exports.main = async (event, context) => {
  try {
    let total = 0;
    try {
      const existing = await db.collection('ads').count();
      total = existing.total;
    } catch (countErr) {
      total = 0;
    }

    let inserted = 0;
    for (const item of ads) {
      const dup = await db.collection('ads')
        .where({ title: item.title })
        .get();
      if (dup.data.length === 0) {
        await db.collection('ads').add({ data: item });
        inserted++;
      } else {
        total++;
      }
    }

    return {
      code: 0,
      message: inserted > 0 ? `初始化完成，插入 ${inserted} 条广告` : `已有 ${total} 条广告，跳过初始化`,
      data: { inserted, existed: total }
    };
  } catch (error) {
    console.error('初始化广告数据失败:', error);
    return {
      code: -1,
      message: '初始化失败: ' + error.message,
      data: null
    };
  }
};
