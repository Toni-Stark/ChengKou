// 研究领域数据模型
const researchAreas = [
  {
    id: 1,
    icon: 'lightbulb-o',
    title: '人工智能',
    description: '深度学习、计算机视觉、自然语言处理、强化学习',
    tags: ['CNN', 'Transformer', '贝叶斯'],
    detailPage: '/ai-detail'
  },
  {
    id: 2,
    icon: 'rocket',
    title: '航天工程',
    description: '航天器设计、轨道动力学、空间环境、深空探测',
    tags: ['数值模拟', 'AI优化', '数据分析'],
    detailPage: '/aerospace-detail'
  },
  {
    id: 3,
    icon: 'bar-chart',
    title: '数据科学',
    description: '统计分析、机器学习、数据挖掘、可视化分析',
    tags: ['贝叶斯', '回归分析', '聚类'],
    detailPage: '/data-science-detail'
  },
  {
    id: 4,
    icon: 'cogs',
    title: '计算力学',
    description: '有限元分析、多物理场耦合、AI辅助工程计算',
    tags: ['FEA', 'GPU加速', '神经网络'],
    detailPage: '/computational-mechanics-detail'
  }
];

// AI应用数据
const aiApplications = [
  {
    id: 1,
    title: '轨道优化',
    description: '使用强化学习和贝叶斯优化算法，优化航天器轨道设计，降低燃料消耗，提高任务成功率'
  },
  {
    id: 2,
    title: '故障诊断',
    description: '基于CNN和LSTM的故障诊断模型，实时监测航天器状态，提前预警潜在故障'
  },
  {
    id: 3,
    title: '数据分析',
    description: '利用贝叶斯统计和深度学习，分析航天任务数据，提取有价值的科学发现'
  }
];

// 研究方法数据
const researchMethods = {
  aiExplainability: [
    {
      title: '贝叶斯概率解释',
      description: '通过后验概率分布解释模型决策依据'
    },
    {
      title: 'CNN特征可视化',
      description: '通过梯度加权类激活图展示关键特征'
    },
    {
      title: '模型蒸馏',
      description: '将复杂模型知识迁移到简单可解释模型'
    },
    {
      title: '敏感性分析',
      description: '评估输入变量对输出结果的影响程度'
    }
  ],
  researchTools: [
    {
      title: 'PyTorch/TensorFlow',
      description: '深度学习模型开发与训练框架'
    },
    {
      title: 'PyMC3/Stan',
      description: '贝叶斯统计建模与推理工具'
    },
    {
      title: 'Matplotlib/Plotly',
      description: '学术图表与模型可视化工具'
    },
    {
      title: 'FEA/Abaqus',
      description: '航天结构有限元分析工具'
    }
  ]
};

// 热门标签
const popularTags = [
  'CNN', '贝叶斯', '航天工程', '深度学习',
  '强化学习', '数据科学', '有限元分析', '故障诊断', '轨道优化'
];

// AI思维导图数据
const aiMindMapData = {
  id: 'ai-root',
  title: '人工智能',
  defaultOpen: true,
  children: [
    {
      id: 'theory',
      title: '基础理论',
      children: [
        {
          id: 'ml',
          title: '机器学习',
          children: [
            {
              id: 'dl',
              title: '深度学习',
              children: [
                {
                  id: 'dl-mechanism',
                  title: '核心机制',
                  children: [
                    { id: 'dl-m-1', title: '多层神经网络' },
                    { id: 'dl-m-2', title: '反向传播' },
                    { id: 'dl-m-3', title: '梯度下降' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'bayes',
          title: '贝叶斯',
          children: [
            {
              id: 'bayes-concept',
              title: '核心概念',
              children: [
                { id: 'bayes-c-1', title: '先验概率' },
                { id: 'bayes-c-2', title: '后验概率' },
                { id: 'bayes-c-3', title: '似然函数' }
              ]
            },
            {
              id: 'bayes-app',
              title: '应用方向',
              children: [
                { id: 'bayes-a-1', title: '不确定性估计' },
                { id: 'bayes-a-2', title: '贝叶斯神经网络' },
                { id: 'bayes-a-3', title: '概率图模型' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'model',
      title: '核心模型架构',
      children: [
        {
          id: 'cnn',
          title: 'CNN（卷积神经网络）',
          children: [
            {
              id: 'cnn-mechanism',
              title: '核心机制',
              children: [
                { id: 'cnn-m-1', title: '卷积核' },
                { id: 'cnn-m-2', title: '池化' },
                { id: 'cnn-m-3', title: '局部连接' },
                { id: 'cnn-m-4', title: '权值共享' }
              ]
            },
            {
              id: 'cnn-field',
              title: '擅长领域',
              children: [
                { id: 'cnn-f-1', title: '计算机视觉' },
                { id: 'cnn-f-2', title: '空间特征提取' }
              ]
            },
            {
              id: 'cnn-model',
              title: '代表模型',
              children: [
                { id: 'cnn-mo-1', title: 'ResNet' },
                { id: 'cnn-mo-2', title: 'VGG' },
                { id: 'cnn-mo-3', title: 'YOLO' },
                { id: 'cnn-mo-4', title: 'MobileNet' }
              ]
            }
          ]
        },
        {
          id: 'transformer',
          title: 'Transformer',
          children: [
            {
              id: 'transformer-mechanism',
              title: '核心机制',
              children: [
                { id: 'trans-m-1', title: '自注意力机制' },
                { id: 'trans-m-2', title: '多头注意力' },
                { id: 'trans-m-3', title: '位置编码' },
                { id: 'trans-m-4', title: '并行计算' }
              ]
            },
            {
              id: 'transformer-field',
              title: '擅长领域',
              children: [
                { id: 'trans-f-1', title: '自然语言处理' },
                { id: 'trans-f-2', title: '长距离依赖建模' }
              ]
            },
            {
              id: 'transformer-model',
              title: '代表模型',
              children: [
                { id: 'trans-mo-1', title: 'BERT' },
                { id: 'trans-mo-2', title: 'GPT系列' },
                { id: 'trans-mo-3', title: 'ViT（视觉Transformer）' },
                { id: 'trans-mo-4', title: 'Swin Transformer' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'application',
      title: '主要应用领域',
      children: [
        {
          id: 'cv',
          title: '计算机视觉',
          children: [
            {
              id: 'cv-task',
              title: '子任务',
              children: [
                { id: 'cv-t-1', title: '图像分类' },
                { id: 'cv-t-2', title: '目标检测' },
                { id: 'cv-t-3', title: '图像分割' },
                { id: 'cv-t-4', title: '人脸识别' },
                { id: 'cv-t-5', title: '姿态估计' },
                { id: 'cv-t-6', title: '3D重建' }
              ]
            },
            {
              id: 'cv-arch',
              title: '常用架构',
              children: [
                { id: 'cv-a-1', title: 'CNN' },
                { id: 'cv-a-2', title: 'ViT' },
                { id: 'cv-a-3', title: 'CNN+Transformer混合' }
              ]
            }
          ]
        },
        {
          id: 'nlp',
          title: '自然语言处理',
          children: [
            {
              id: 'nlp-task',
              title: '子任务',
              children: [
                { id: 'nlp-t-1', title: '机器翻译' },
                { id: 'nlp-t-2', title: '情感分析' },
                { id: 'nlp-t-3', title: '问答系统' },
                { id: 'nlp-t-4', title: '文本摘要' },
                { id: 'nlp-t-5', title: '对话生成' }
              ]
            },
            {
              id: 'nlp-arch',
              title: '常用架构',
              children: [
                { id: 'nlp-a-1', title: 'Transformer' },
                { id: 'nlp-a-2', title: '大语言模型' }
              ]
            }
          ]
        },
        {
          id: 'rl',
          title: '强化学习',
          children: [
            {
              id: 'rl-element',
              title: '核心要素',
              children: [
                { id: 'rl-e-1', title: '智能体' },
                { id: 'rl-e-2', title: '环境' },
                { id: 'rl-e-3', title: '动作' },
                { id: 'rl-e-4', title: '奖励' },
                { id: 'rl-e-5', title: '策略' }
              ]
            },
            {
              id: 'rl-tech',
              title: '常用技术',
              children: [
                { id: 'rl-t-1', title: '深度强化学习' },
                { id: 'rl-t-2', title: 'Q学习' },
                { id: 'rl-t-3', title: '策略梯度' }
              ]
            },
            {
              id: 'rl-scene',
              title: '应用场景',
              children: [
                { id: 'rl-s-1', title: '游戏AI（AlphaGo）' },
                { id: 'rl-s-2', title: '机器人控制' },
                { id: 'rl-s-3', title: '自动驾驶决策' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'trend',
      title: '未来发展趋势',
      children: [
        {
          id: 'multimodal',
          title: '大模型与多模态',
          children: [
            { id: 'multi-1', title: '文本+图像+语音+视频' },
            { id: 'multi-2', title: '跨模态理解与生成' }
          ]
        },
        {
          id: 'fusion',
          title: '架构融合',
          children: [
            { id: 'fusion-1', title: 'CNN + Transformer' },
            { id: 'fusion-2', title: '局部特征+全局建模' }
          ]
        },
        {
          id: 'trustworthy',
          title: '可信AI',
          children: [
            { id: 'trust-1', title: '贝叶斯深度学习' },
            { id: 'trust-2', title: '不确定性估计' },
            { id: 'trust-3', title: '可解释性' }
          ]
        },
        {
          id: 'world-model',
          title: '世界模型与具身智能',
          children: [
            { id: 'world-1', title: '物理世界理解' },
            { id: 'world-2', title: '机器人交互' },
            { id: 'world-3', title: '强化学习+大模型' }
          ]
        },
        {
          id: 'edge',
          title: '边缘计算与小模型',
          children: [
            { id: 'edge-1', title: '模型压缩' },
            { id: 'edge-2', title: '知识蒸馏' },
            { id: 'edge-3', title: '端侧部署' }
          ]
        }
      ]
    }
  ]
};

// 航天工程图谱数据
const aerospaceGraphData = {
  nodes: [
    // 根节点
    { id: 0, name: '航天工程全生命周期', category: 0, symbolSize: 70 },

    // 一级节点
    { id: 1, name: '任务规划', category: 1, symbolSize: 55 },
    { id: 2, name: '航天器研发', category: 2, symbolSize: 55 },
    { id: 3, name: '发射与测控', category: 3, symbolSize: 55 },
    { id: 4, name: '在轨运营', category: 4, symbolSize: 55 },
    { id: 5, name: '任务分析与优化', category: 5, symbolSize: 55 },

    // 二级节点
    { id: 11, name: '轨道设计', category: 1, symbolSize: 40 },
    { id: 12, name: '任务需求分析', category: 1, symbolSize: 40 },
    { id: 13, name: '风险评估', category: 1, symbolSize: 40 },
    { id: 21, name: '总体设计', category: 2, symbolSize: 40 },
    { id: 22, name: '分系统研发', category: 2, symbolSize: 40 },
    { id: 23, name: '地面试验', category: 2, symbolSize: 40 },
    { id: 31, name: '发射场保障', category: 3, symbolSize: 40 },
    { id: 32, name: '测控通信', category: 3, symbolSize: 40 },
    { id: 33, name: '入轨标定', category: 3, symbolSize: 40 },
    { id: 41, name: '姿态轨道控制', category: 4, symbolSize: 40 },
    { id: 42, name: '健康管理', category: 4, symbolSize: 40 },
    { id: 43, name: '载荷应用', category: 4, symbolSize: 40 },
    { id: 51, name: '数据回收分析', category: 5, symbolSize: 40 },
    { id: 52, name: '性能评估', category: 5, symbolSize: 40 },
    { id: 53, name: 'AI优化迭代', category: 5, symbolSize: 40 },

    // 三级节点
    { id: 111, name: '轨道动力学', category: 1, symbolSize: 25 },
    { id: 112, name: 'STK仿真', category: 1, symbolSize: 25 },
    { id: 221, name: '结构热控', category: 2, symbolSize: 25 },
    { id: 222, name: '电源测控', category: 2, symbolSize: 25 },
    { id: 231, name: '热真空试验', category: 2, symbolSize: 25 },
    { id: 321, name: '深空测控网', category: 3, symbolSize: 25 },
    { id: 421, name: '故障诊断', category: 4, symbolSize: 25 },
    { id: 531, name: '机器学习', category: 5, symbolSize: 25 },
    { id: 532, name: '数值模拟', category: 5, symbolSize: 25 }
  ],
  links: [
    // 根节点关联
    { source: 0, target: 1, value: 8 },
    { source: 0, target: 2, value: 8 },
    { source: 0, target: 3, value: 8 },
    { source: 0, target: 4, value: 8 },
    { source: 0, target: 5, value: 8 },

    // 一级流程内关联
    { source: 1, target: 11, value: 6 },
    { source: 1, target: 12, value: 6 },
    { source: 1, target: 13, value: 5 },
    { source: 2, target: 21, value: 6 },
    { source: 2, target: 22, value: 6 },
    { source: 2, target: 23, value: 5 },
    { source: 3, target: 31, value: 6 },
    { source: 3, target: 32, value: 6 },
    { source: 3, target: 33, value: 5 },
    { source: 4, target: 41, value: 6 },
    { source: 4, target: 42, value: 6 },
    { source: 4, target: 43, value: 5 },
    { source: 5, target: 51, value: 6 },
    { source: 5, target: 52, value: 6 },
    { source: 5, target: 53, value: 6 },

    // 三级节点关联
    { source: 11, target: 111, value: 4 },
    { source: 11, target: 112, value: 4 },
    { source: 22, target: 221, value: 4 },
    { source: 22, target: 222, value: 4 },
    { source: 23, target: 231, value: 4 },
    { source: 32, target: 321, value: 4 },
    { source: 42, target: 421, value: 4 },
    { source: 53, target: 531, value: 4 },
    { source: 53, target: 532, value: 4 },

    // 跨流程关联
    { source: 1, target: 2, value: 3 },
    { source: 2, target: 3, value: 3 },
    { source: 3, target: 4, value: 3 },
    { source: 4, target: 5, value: 3 },
    { source: 5, target: 1, value: 2 }
  ]
};

// 航天工程详情数据
const aerospaceDetailData = {
  0: {
    title: '航天工程全生命周期',
    items: [{
      subtitle: '核心逻辑',
      points: [
        '以任务目标为导向，覆盖从前期规划到后期优化的完整闭环',
        '各阶段环环相扣，数据与技术双向驱动迭代',
        '核心目标：安全、可靠、高效完成航天任务'
      ]
    }]
  },
  1: {
    title: '任务规划',
    items: [{
      subtitle: '阶段目标',
      points: [
        '明确任务目标与约束条件',
        '设计最优轨道与任务流程',
        '识别并规避潜在风险'
      ]
    }]
  },
  2: {
    title: '航天器研发',
    items: [{
      subtitle: '阶段目标',
      points: [
        '完成航天器总体方案设计与分系统研发',
        '通过地面试验验证产品性能',
        '确保满足任务需求与空间环境适应性'
      ]
    }]
  },
  3: {
    title: '发射与测控',
    items: [{
      subtitle: '阶段目标',
      points: [
        '完成航天器转运、加注、发射等流程',
        '通过测控网实现全程跟踪与控制',
        '完成入轨标定，确保进入预定轨道'
      ]
    }]
  },
  4: {
    title: '在轨运营',
    items: [{
      subtitle: '阶段目标',
      points: [
        '维持航天器姿态与轨道稳定',
        '实时监控航天器健康状态，及时处置故障',
        '完成有效载荷任务，回传应用数据'
      ]
    }]
  },
  5: {
    title: '任务分析与优化',
    items: [{
      subtitle: '阶段目标',
      points: [
        '回收并分析任务全流程数据',
        '评估航天器性能与任务完成度',
        '通过AI/数值模拟优化后续任务方案'
      ]
    }]
  },
  11: {
    title: '轨道设计',
    items: [{
      subtitle: '核心技术',
      points: [
        '基于轨道动力学设计最优轨道（LEO/GEO/SSO/深空轨道）',
        '通过STK等工具仿真验证轨道可行性'
      ]
    }]
  },
  22: {
    title: '分系统研发',
    items: [{
      subtitle: '核心技术',
      points: [
        '结构热控：保障航天器机械强度与温度稳定',
        '电源测控：提供能源与指令控制'
      ]
    }]
  },
  53: {
    title: 'AI优化迭代',
    items: [{
      subtitle: '核心技术',
      points: [
        '机器学习：挖掘数据规律，优化控制策略',
        '数值模拟：复现物理过程，替代地面试验'
      ]
    }]
  }
};

// 数据科学知识体系数据
const dataScienceData = {
  disciplines: [
    {
      title: '统计学（理论基石）',
      items: [
        '核心分支：描述统计、推断统计、贝叶斯统计、多元统计分析',
        '核心方法：参数估计、假设检验、回归分析、方差分析',
        '关联专业：统计学、应用统计学、生物统计学'
      ]
    },
    {
      title: '计算机科学（技术实现）',
      items: [
        '核心方向：数据结构、数据库、分布式计算、大数据技术',
        '核心工具：Python/R/SQL、Hadoop/Spark、TensorFlow',
        '关联专业：计算机科学、软件工程、人工智能'
      ]
    },
    {
      title: '数学（底层逻辑）',
      items: [
        '核心内容：线性代数、微积分、概率论、优化理论',
        '关联专业：数学与应用数学、信息与计算科学'
      ]
    },
    {
      title: '交叉应用学科',
      items: [
        '人工智能、数据挖掘、可视化分析',
        '领域应用：金融、医疗、工业、商业智能'
      ]
    }
  ],
  courses: [
    {
      title: '数学基础',
      items: [
        '高等数学、线性代数、概率论与数理统计',
        '离散数学、数值分析、最优化方法'
      ]
    },
    {
      title: '统计学核心',
      items: [
        '数理统计、多元统计分析、时间序列分析',
        '贝叶斯统计、非参数统计、实验设计'
      ]
    },
    {
      title: '计算机基础',
      items: [
        '数据结构与算法、数据库原理、操作系统',
        '计算机网络、分布式系统'
      ]
    },
    {
      title: '数据科学核心',
      items: [
        '机器学习、深度学习、数据挖掘',
        '大数据技术、数据可视化、自然语言处理'
      ]
    },
    {
      title: '编程与工具',
      items: [
        'Python/R编程、SQL数据库',
        'Hadoop/Spark、TensorFlow/PyTorch'
      ]
    },
    {
      title: '领域应用',
      items: [
        '商业智能与数据分析、金融数据分析',
        '医疗健康数据分析、推荐系统'
      ]
    }
  ],
  skills: [
    {
      title: '编程语言',
      items: [
        'Python（NumPy/Pandas/Scikit-learn）',
        'R语言（统计分析）',
        'SQL（数据库查询）',
        'Scala/Java（大数据）'
      ]
    },
    {
      title: '数据处理',
      items: [
        '数据清洗与预处理',
        '特征工程',
        'ETL流程设计',
        '数据质量管理'
      ]
    },
    {
      title: '统计分析',
      items: [
        '描述性统计分析',
        '假设检验',
        '回归分析（线性/逻辑）',
        'A/B测试'
      ]
    },
    {
      title: '机器学习',
      items: [
        '监督学习（分类/回归）',
        '无监督学习（聚类/降维）',
        '集成学习（随机森林/XGBoost）',
        '深度学习（CNN/RNN/Transformer）'
      ]
    },
    {
      title: '大数据技术',
      items: [
        'Hadoop生态（HDFS/MapReduce）',
        'Spark（批处理/流处理）',
        'Hive/Presto（数据仓库）',
        'Kafka（消息队列）'
      ]
    },
    {
      title: '可视化工具',
      items: [
        'Matplotlib/Seaborn（Python）',
        'ggplot2（R语言）',
        'Tableau/Power BI（商业智能）',
        'D3.js/ECharts（Web可视化）'
      ]
    }
  ],
  paperCategories: [
    { id: 'all', name: '全部' },
    { id: 'ml', name: '机器学习' },
    { id: 'stats', name: '统计学' },
    { id: 'bigdata', name: '大数据' }
  ],
  papers: [
    {
      category: 'ml',
      title: 'Random Forests',
      author: 'Leo Breiman',
      year: 2001,
      journal: 'Machine Learning',
      description: '提出随机森林算法，通过集成多个决策树提升预测性能，成为最流行的机器学习算法之一'
    },
    {
      category: 'ml',
      title: 'XGBoost: A Scalable Tree Boosting System',
      author: 'Tianqi Chen, Carlos Guestrin',
      year: 2016,
      journal: 'KDD',
      description: '提出XGBoost算法，通过梯度提升和正则化技术，在Kaggle竞赛中广泛应用'
    },
    {
      category: 'ml',
      title: 'Attention Is All You Need',
      author: 'Vaswani et al.',
      year: 2017,
      journal: 'NeurIPS',
      description: '提出Transformer架构，彻底改变了自然语言处理领域，成为GPT/BERT的基础'
    },
    {
      category: 'stats',
      title: 'Bayesian Data Analysis',
      author: 'Andrew Gelman et al.',
      year: 2013,
      journal: 'Chapman and Hall/CRC',
      description: '贝叶斯统计分析的经典教材，系统介绍贝叶斯推断方法及其应用'
    },
    {
      category: 'stats',
      title: 'The Elements of Statistical Learning',
      author: 'Hastie, Tibshirani, Friedman',
      year: 2009,
      journal: 'Springer',
      description: '统计学习的经典教材，涵盖回归、分类、聚类等核心方法'
    },
    {
      category: 'bigdata',
      title: 'MapReduce: Simplified Data Processing on Large Clusters',
      author: 'Jeffrey Dean, Sanjay Ghemawat',
      year: 2004,
      journal: 'OSDI',
      description: 'Google提出MapReduce编程模型，奠定了大数据处理的基础'
    },
    {
      category: 'bigdata',
      title: 'Resilient Distributed Datasets',
      author: 'Matei Zaharia et al.',
      year: 2012,
      journal: 'NSDI',
      description: '提出RDD抽象，成为Apache Spark的核心数据结构，大幅提升大数据处理效率'
    }
  ]
};

// 计算力学知识体系数据
const computationalMechanicsData = {
  coreModules: [
    {
      title: '物理建模（力学基础）',
      icon: 'fa-flask',
      items: [
        '弹性力学、塑性力学、断裂力学',
        '流体力学、传热学、电磁学',
        '多场耦合（热-力、流-固、电-磁-热）'
      ]
    },
    {
      title: '数学方法（数值离散）',
      icon: 'fa-superscript',
      items: [
        '有限元法（FEM）、有限差分法（FDM）',
        '边界元法（BEM）、无网格法',
        '离散元法（DEM）、光滑粒子法（SPH）'
      ]
    },
    {
      title: '计算实现（编程与算法）',
      icon: 'fa-code',
      items: [
        '稀疏矩阵求解（直接法/迭代法）',
        '并行计算（MPI/OpenMP/GPU）',
        '网格生成与自适应'
      ]
    },
    {
      title: '工程应用（CAE仿真）',
      icon: 'fa-industry',
      items: [
        '结构分析（静力/动力/疲劳）',
        '流体仿真（CFD）、热分析',
        '优化设计、拓扑优化'
      ]
    }
  ],
  coreMethods: [
    {
      title: '有限元法（FEM）',
      items: [
        '核心思想：连续体离散化为单元',
        '关键步骤：单元刚度矩阵 → 总刚度矩阵 → 求解位移',
        '应用：结构、热、流体、电磁'
      ]
    },
    {
      title: '有限差分法（FDM）',
      items: [
        '核心思想：微分方程差分化',
        '优势：简单直观，适合规则网格',
        '应用：流体力学、传热'
      ]
    },
    {
      title: '边界元法（BEM）',
      items: [
        '核心思想：只离散边界',
        '优势：降维、无限域问题',
        '应用：声学、断裂力学'
      ]
    },
    {
      title: '无网格法',
      items: [
        '核心思想：节点近似，无需网格',
        '优势：大变形、裂纹扩展',
        '应用：冲击、爆炸、断裂'
      ]
    },
    {
      title: '离散元法（DEM）',
      items: [
        '核心思想：颗粒接触力学',
        '应用：颗粒流、岩土、粉体'
      ]
    },
    {
      title: '光滑粒子法（SPH）',
      items: [
        '核心思想：拉格朗日粒子',
        '应用：流体大变形、爆炸'
      ]
    }
  ],
  papers: [
    {
      title: 'The Finite Element Method: Its Basis and Fundamentals',
      author: 'O.C. Zienkiewicz, R.L. Taylor',
      year: 2005,
      description: '有限元法经典教材，系统介绍FEM理论与实现'
    },
    {
      title: 'Computational Fluid Dynamics: The Basics with Applications',
      author: 'John D. Anderson',
      year: 1995,
      description: 'CFD入门经典，涵盖有限差分、有限体积法'
    },
    {
      title: 'Nonlinear Finite Element Analysis of Solids and Structures',
      author: 'M.A. Crisfield',
      year: 1991,
      description: '非线性有限元分析权威著作，涵盖材料、几何非线性'
    },
    {
      title: 'Physics-Informed Neural Networks',
      author: 'Raissi et al.',
      year: 2019,
      description: '提出PINN方法，将物理方程嵌入神经网络，开创AI+力学新范式'
    }
  ],
  software: [
    {
      title: '商业软件',
      items: [
        'ANSYS（结构/流体/电磁全能）',
        'Abaqus（非线性结构分析）',
        'COMSOL（多物理场耦合）',
        'LS-DYNA（显式动力学/碰撞）',
        'FLUENT（CFD流体仿真）'
      ]
    },
    {
      title: '开源软件',
      items: [
        'FEniCS（Python有限元库）',
        'OpenFOAM（开源CFD）',
        'deal.II（C++有限元库）',
        'MOOSE（多物理场框架）',
        'SU2（CFD优化设计）'
      ]
    }
  ],
  frontiers: [
    {
      title: 'AI辅助仿真',
      icon: 'fa-lightbulb-o',
      description: '神经网络代理模型、PINN、数据驱动建模'
    },
    {
      title: '数字孪生',
      icon: 'fa-clone',
      description: '实时仿真、状态监测、预测性维护'
    },
    {
      title: '拓扑优化',
      icon: 'fa-cube',
      description: '结构轻量化、增材制造设计'
    },
    {
      title: '多尺度仿真',
      icon: 'fa-search',
      description: '原子-连续体耦合、微观-宏观桥接'
    },
    {
      title: '不确定性量化',
      icon: 'fa-line-chart',
      description: '概率分析、可靠性设计、敏感性分析'
    },
    {
      title: '增材制造仿真',
      icon: 'fa-print',
      description: '热力-力-相变耦合、残余应力、变形预测'
    },
    {
      title: '智能网格',
      icon: 'fa-map-o',
      description: '自适应网格、机器学习网格优化'
    },
    {
      title: '生物力学仿真',
      icon: 'fa-heartbeat',
      description: '软组织、骨骼、血流、植入物交互'
    }
  ],
  learningPath: [
    '基础：弹性力学 + 流体力学 + 数值分析',
    '核心：有限元法（理论 + 编程实现）',
    '进阶：非线性力学、计算流体、多场耦合',
    '实践：开源代码（FEniCS、OpenFOAM）+ 商业软件二次开发'
  ]
};

module.exports = {
  researchAreas,
  aiApplications,
  researchMethods,
  popularTags,
  aiMindMapData,
  aerospaceGraphData,
  aerospaceDetailData,
  dataScienceData,
  computationalMechanicsData
};
