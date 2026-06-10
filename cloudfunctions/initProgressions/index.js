const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const progressions = [
  {
    stroke: 'freestyle',
    level: 'beginner',
    maxSpeed: 999,
    minSpeed: 180,
    title: '入门期（3分钟以上/100m）',
    description: '你正处于自由泳入门阶段，重点是建立正确的水感和基本动作模式。先打好基础，不急于追求速度。',
    tips: [
      '练习侧头换气：每次划臂配合一次侧头换气，避免抬头破坏身体流线型',
      '扶板打腿练习：每次训练安排10-15分钟打腿，建立稳定的下肢推进力',
      '减少划水次数：25米池将划水次数控制在20次以内，提升单次划水效率',
      '保持身体水平：收紧核心，目视池底，臀部贴近水面'
    ]
  },
  {
    stroke: 'freestyle',
    level: 'novice',
    maxSpeed: 180,
    minSpeed: 150,
    title: '初级期（2分30秒~3分钟/100m）',
    description: '你已经掌握了自由泳基本配合，现阶段需要提升划水效率和呼吸节奏的稳定性。',
    tips: [
      '练习高肘划水：入水后保持肘部高于手腕，形成有效的对水面',
      '建立双侧呼吸：每3次划臂换气一次，均衡发展左右两侧',
      '增加打腿频率：从4次打腿过渡到6次打腿，提升身体稳定性',
      '间歇训练法：50m×8组，组间休息30秒，保持稳定配速'
    ]
  },
  {
    stroke: 'freestyle',
    level: 'intermediate',
    maxSpeed: 150,
    minSpeed: 120,
    title: '中级期（2分钟~2分30秒/100m）',
    description: '你的自由泳已具备一定水平，现在需要强化核心力量和划水推进效率。',
    tips: [
      '强化核心力量训练：每周2次陆上核心训练（平板支撑、俄罗斯转体等）',
      '练习前交叉划水：一手始终在前方，体会身体转动带来的推进力',
      '蹬壁出发+水下海豚腿：每次转身后至少完成3次水下海豚腿',
      '配速练习：200m×5组，每组保持同一配速，组间休息45秒'
    ]
  },
  {
    stroke: 'freestyle',
    level: 'advanced',
    maxSpeed: 120,
    minSpeed: 90,
    title: '进阶期（1分30秒~2分钟/100m）',
    description: '你已经是一名不错的自由泳选手，现在需要优化技术细节和训练策略来实现突破。',
    tips: [
      '练习翻滚转身：每次游近池壁约2米时做前滚翻，提升转身效率',
      '跳发入水训练：学习抓台式出发，减少入水阻力',
      '优化划频与划幅：使用节拍器控制划频，找到最适合自己的节奏',
      '速度耐力训练：100m×10组，目标配速，组间休息20秒'
    ]
  },
  {
    stroke: 'freestyle',
    level: 'elite',
    maxSpeed: 90,
    minSpeed: 60,
    title: '精英期（1分钟~1分30秒/100m）',
    description: '你的自由泳水平非常出色！继续保持并挑战更高目标。',
    tips: [
      '细化出发与转身：每次出发和转身都用视频记录，分析每个细节',
      '乳酸耐受训练：75m全速×8组，组间休息1分钟',
      '比赛策略训练：模拟比赛分段配速，练习负分段游法',
      '引入力量训练：每周增加2次力量房训练，重点强化背部和肩部肌群'
    ]
  },
  {
    stroke: 'freestyle',
    level: 'master',
    maxSpeed: 60,
    minSpeed: 0,
    title: '健将级（1分钟以内/100m）',
    description: '你已经达到竞技级别！继续保持科学训练，挑战赛事目标。',
    tips: [
      '精细化技术分析：使用水下摄像分析划水轨迹和身体姿态',
      '高原训练或低氧训练：提升血液携氧能力',
      '专项力量周期化训练：按比赛周期安排力量训练强度',
      '心理训练：引入冥想和可视化训练，提升比赛心理素质'
    ]
  },
  {
    stroke: 'breaststroke',
    level: 'beginner',
    maxSpeed: 999,
    minSpeed: 180,
    title: '入门期（3分钟以上/100m）',
    description: '蛙泳入门需要先掌握"收-翻-蹬-夹"的腿部动作节奏，这是蛙泳的核心动力来源。',
    tips: [
      '陆地模仿蹬腿：在垫子上反复练习收腿、翻脚、蹬夹动作',
      '扶板蹬腿练习：双手扶浮板专注蹬腿，体会蹬夹后滑行的感觉',
      '减小蹬腿幅度：膝盖间距不超过肩宽，减少阻力面',
      '配合呼吸节奏：手臂外划时抬头吸气，前伸时低头入水'
    ]
  },
  {
    stroke: 'breaststroke',
    level: 'novice',
    maxSpeed: 180,
    minSpeed: 150,
    title: '初级期（2分30秒~3分钟/100m）',
    description: '你已经掌握了蛙泳基本配合，现需要优化手脚配合的节奏感和蹬腿效率。',
    tips: [
      '练习窄蹬腿技术：缩小蹬腿幅度，加快动作频率',
      '优化划手路线：手臂外划不超过肩宽，内划时肘部收紧',
      '一划一蹬一呼吸：保持稳定的动作循环节奏',
      '蹬夹后充分滑行：每次蹬腿后保持流线型滑行2-3秒'
    ]
  },
  {
    stroke: 'breaststroke',
    level: 'intermediate',
    maxSpeed: 180,
    minSpeed: 150,
    title: '中级期（2分钟~2分30秒/100m）',
    description: '你的蛙泳已有明显进步，可以开始尝试进阶技术。',
    tips: [
      '学习波浪式蛙泳：利用腰腹波浪动作减少阻力，提升游进效率',
      '强化蹬腿力量：每周增加蛙泳腿专项训练，使用脚蹼辅助',
      '优化身体流线型：每次动作后保持身体收紧，减少停顿',
      '变速训练：快慢交替游，强化爆发力和耐力'
    ]
  },
  {
    stroke: 'breaststroke',
    level: 'advanced',
    maxSpeed: 120,
    minSpeed: 90,
    title: '进阶期（1分30秒~2分钟/100m）',
    description: '你的蛙泳技术已经成熟，现在是时候挑战更高速度了。',
    tips: [
      '蛙泳转身技术：双手同时触壁后侧转蹬壁，缩短转身时间',
      '加大划水力量：在推水阶段加速发力，提升每次划水的推进效果',
      '速度耐力训练：50m蛙泳×8组，目标配速，组间休息30秒',
      '比赛配速策略：掌握分段配速，前50m控制节奏，后50m加速'
    ]
  },
  {
    stroke: 'breaststroke',
    level: 'elite',
    maxSpeed: 90,
    minSpeed: 60,
    title: '精英期（1分钟~1分30秒/100m）',
    description: '你已经是蛙泳高手！保持技术细腻度，持续突破。',
    tips: [
      '水下牵引训练：使用弹力带增加阻力，强化蹬腿力量',
      '长拉水技术：在转身和出发后使用一次长划臂，最大化推进',
      '每周视频技术分析：用录像回看并纠正微小技术偏差',
      '陆上爆发力训练：深蹲跳、箱跳等增强蹬壁爆发力'
    ]
  },
  {
    stroke: 'breaststroke',
    level: 'master',
    maxSpeed: 60,
    minSpeed: 0,
    title: '健将级（1分钟以内/100m）',
    description: '你已经达到蛙泳竞技级别！精益求精，追求极致。',
    tips: [
      '限制呼吸训练法：减少换气频率，提升水中效率',
      '个性化技术优化：根据身体特点微调划水和蹬腿角度',
      '高强度间歇冲刺：25m全速×12组，组间休息40秒',
      '赛事周期化训练：按目标赛事倒推制定完整训练计划'
    ]
  },
  {
    stroke: 'backstroke',
    level: 'beginner',
    maxSpeed: 999,
    minSpeed: 180,
    title: '入门期（3分钟以上/100m）',
    description: '仰泳入门的关键是克服仰卧水中的恐惧，建立身体平衡感。',
    tips: [
      '仰卧漂浮练习：在水中仰躺，腰背挺直，体会水的浮力',
      '保持头部稳定：目视天花板，下巴微收，头部不动',
      '扶板仰卧打腿：双手抱浮板在腹部，专注仰卧打腿',
      '肩部放松：双臂入水时放松肩部，避免过度紧张'
    ]
  },
  {
    stroke: 'backstroke',
    level: 'novice',
    maxSpeed: 180,
    minSpeed: 150,
    title: '初级期（2分30秒~3分钟/100m）',
    description: '你已经能在仰泳中保持平衡，现在需要建立正确的划水节奏。',
    tips: [
      '单臂仰泳练习：一侧手臂不动，另一侧专注划水轨迹',
      '身体转动练习：手臂入水时身体向同侧转动30-45度',
      '持续打腿：保持均匀有力的鞭状打腿，脚趾打出水面水花',
      '每次训练200m持续仰泳：建立动作自动化'
    ]
  },
  {
    stroke: 'backstroke',
    level: 'intermediate',
    maxSpeed: 150,
    minSpeed: 120,
    title: '中级期（2分钟~2分30秒/100m）',
    description: '你的仰泳已有不错的基础，可以尝试进阶技术和提高效率。',
    tips: [
      '水下海豚腿练习：出发和转身后在水下做海豚式打腿',
      '仰泳转身练习：利用旗标线判断距离，练习翻滚转身',
      '优化划水路线：手臂入水后做S型划水轨迹，最大化推进',
      '间歇训练：50m×6组，保持稳定配速，组间休息20秒'
    ]
  },
  {
    stroke: 'backstroke',
    level: 'advanced',
    maxSpeed: 120,
    minSpeed: 90,
    title: '进阶期（1分30秒~2分钟/100m）',
    description: '你的仰泳速度已经相当不错，继续打磨技术实现突破。',
    tips: [
      '仰泳出发技术：学习面向池壁的仰泳出发，蹬离后身体成反弓形入水',
      '提升划频：使用节拍器逐渐提高划臂频率',
      '核心旋转训练：强化身体转动幅度，利用躯干发力',
      '配速游训练：200m仰泳×4组，同一配速，组间休息45秒'
    ]
  },
  {
    stroke: 'backstroke',
    level: 'elite',
    maxSpeed: 90,
    minSpeed: 60,
    title: '精英期（1分钟~1分30秒/100m）',
    description: '你的仰泳水平非常出色！保持技术优势，挑战更高目标。',
    tips: [
      '视频分析水下划水：细抠每个技术环节',
      '强化打腿专项：每天至少400m仰泳打腿训练',
      '低氧耐受训练：减少呼吸频率的耐氧训练',
      '比赛模拟训练：按比赛距离做完整热身+比赛+放松'
    ]
  },
  {
    stroke: 'backstroke',
    level: 'master',
    maxSpeed: 60,
    minSpeed: 0,
    title: '健将级（1分钟以内/100m）',
    description: '竞技级别的仰泳选手！追求极致，挑战极限。',
    tips: [
      '水下推进最大化：每次转身后保持15米水下海豚腿',
      '个性化力量周期训练：按赛季安排力量训练',
      '高速牵引训练：使用牵引装置体验超比赛速度',
      '数据化训练管理：记录每次训练数据，科学调整计划'
    ]
  },
  {
    stroke: 'butterfly',
    level: 'beginner',
    maxSpeed: 999,
    minSpeed: 180,
    title: '入门期（3分钟以上/100m）',
    description: '蝶泳是最具挑战性的泳姿，入门阶段需要先建立海豚式波浪打腿的感觉。',
    tips: [
      '海豚打腿练习：双手放在体侧，从胸部发力带动全身波浪传导',
      '侧身海豚腿：左右两侧交替练习，增强核心控制力',
      '单臂蝶泳练习：一臂前伸一臂划水，降低难度体会节奏',
      '增强核心力量：每周3次核心训练（仰卧起坐、背起、平板支撑）'
    ]
  },
  {
    stroke: 'butterfly',
    level: 'novice',
    maxSpeed: 180,
    minSpeed: 150,
    title: '初级期（2分30秒~3分钟/100m）',
    description: '你已经开始掌握蝶泳的基本节奏，继续强化配合和体能。',
    tips: [
      '双臂同时划水练习：不配合呼吸，先练好手臂动作',
      '建立2次打腿1次划臂节奏：第1次打腿在入水时，第2次在推水时',
      '短距离重复训练：25m蝶泳×8组，逐步增加距离',
      '提升上肢力量：引体向上和俯卧撑帮助增强划水力量'
    ]
  },
  {
    stroke: 'butterfly',
    level: 'intermediate',
    maxSpeed: 150,
    minSpeed: 120,
    title: '中级期（2分钟~2分30秒/100m）',
    description: '你的蝶泳已有明显进步，可以挑战更长距离。',
    tips: [
      '完整配合练习：将海豚腿、双臂划水、呼吸三者协调配合',
      '蹬壁水下海豚腿：每次出发和转身后做水下海豚腿滑行',
      '50m连续蝶泳×6组：建立体能基础',
      '优化呼吸时机：推水阶段下巴前伸吸气，入水时低头'
    ]
  },
  {
    stroke: 'butterfly',
    level: 'advanced',
    maxSpeed: 120,
    minSpeed: 90,
    title: '进阶期（1分30秒~2分钟/100m）',
    description: '蝶泳技术日趋成熟，体能是继续突破的关键。',
    tips: [
      '50m蝶泳×10组间歇训练：组间休息30秒',
      '节奏变速训练：快慢交替游，提升爆发力和恢复能力',
      '蝶泳转身技术：双手同时触壁后迅速侧转蹬壁',
      '每周增加长距离蝶泳训练：100m连续蝶泳'
    ]
  },
  {
    stroke: 'butterfly',
    level: 'elite',
    maxSpeed: 90,
    minSpeed: 60,
    title: '精英期（1分钟~1分30秒/100m）',
    description: '你已经是一名优秀的蝶泳选手！精益求精，突破极限。',
    tips: [
      '水下蝶泳腿最大化：每次转身保持12-15米水下推进',
      '专项力量爆发训练：每周2次上肢爆发力训练',
      '比赛配速策略：200m蝶泳分段配速规划',
      '引入高原训练：提升心肺功能和血液携氧能力'
    ]
  },
  {
    stroke: 'butterfly',
    level: 'master',
    maxSpeed: 60,
    minSpeed: 0,
    title: '健将级（1分钟以内/100m）',
    description: '竞技级别的蝶泳选手！你的坚持和努力令人敬佩。',
    tips: [
      '世界级技术对标分析：研究顶级选手技术视频',
      '高强度间歇专项：50m全速×8组，组间休息1分半',
      '完整赛事周期训练：按目标赛事科学规划训练强度和恢复',
      '心理韧性与可视化训练：赛前心理准备和技术动作可视化'
    ]
  }
];

exports.main = async (event, context) => {
  try {
    let inserted = 0;
    for (const item of progressions) {
      let existing;
      try {
        existing = await db.collection('swim_progressions')
          .where({
            stroke: item.stroke,
            level: item.level
          })
          .get();
      } catch (dbErr) {
        existing = { data: [] };
      }

      if (existing.data.length === 0) {
        await db.collection('swim_progressions').add({ data: item });
        inserted++;
      }
    }

    return {
      code: 0,
      message: `初始化完成，新插入 ${inserted} 条数据`,
      data: { count: progressions.length, inserted }
    };
  } catch (error) {
    console.error('初始化进阶数据失败:', error);
    return {
      code: -1,
      message: '初始化失败',
      data: null
    };
  }
};
