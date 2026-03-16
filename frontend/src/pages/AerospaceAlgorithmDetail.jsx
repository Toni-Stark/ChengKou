import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/aerospace-algorithm.css';

function AerospaceAlgorithmDetail() {
  const { topic } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const algorithmTopics = useMemo(() => ({
    '气动与推进算法': {
      title: '气动与推进算法',
      subtitle: '从流场求解到推进控制，构建航空航天动力闭环',
      metrics: ['核心对象：流场、激波、燃烧、推力', '典型方法：CFD、湍流模型、代理模型、MPC', '关键目标：精度、稳定性、效率、可控性'],
      overview: {
        description: '气动与推进算法服务于飞行器外流场设计、发动机内部流动分析和推力控制，是飞行性能、热防护和推进效率优化的直接抓手。它既要解决强非线性偏微分方程，也要在高温、高速和多物理场耦合条件下保证算法稳定性与工程可用性。',
        keyPoints: [
          '外流场算法关注升阻特性、激波结构、边界层转捩和气动热。',
          '内流场算法关注压气机、燃烧室、喷管等部件的流动与燃烧耦合。',
          '代理模型与降阶模型用于缩短设计迭代周期，支撑多轮构型搜索。',
          '推进控制算法需要兼顾推力响应、稳定裕度、故障诊断和寿命管理。'
        ]
      },
      foundations: [
        {
          title: '流场控制方程',
          text: '工程 CFD 的基础是质量、动量和能量守恒。对于可压缩流动，求解器通常围绕欧拉方程或纳维-斯托克斯方程展开，并通过有限体积法在控制体上离散。',
          formula: '∂U/∂t + ∂F(U)/∂x + ∂G(U)/∂y + ∂H(U)/∂z = S',
          example: '做翼身融合布局评估时，U 表示密度、动量和总能量守恒量，F/G/H 表示各方向通量，S 可以包含化学反应或体力项。'
        },
        {
          title: '湍流封闭与尺度建模',
          text: '直接数值模拟在工程上代价过高，因此通常采用 RANS、DES 或 LES 进行尺度建模。模型选择会直接影响分离流、尾迹和换热预测精度。',
          formula: 'νt = a1 k / max(a1 ω, SF2)',
          example: '上式可视作 k-ω SST 的典型黏性封闭表达，常用于跨声速机翼和进气道的工程分析。'
        },
        {
          title: '推进系统控制代价函数',
          text: '发动机控制常使用模型预测控制，将转速、温度、压比等状态纳入约束，在有限时间域内计算最优控制序列。',
          formula: 'J = Σ(xk - xr)TQ(xk - xr) + ΣukTRuk',
          example: '在加速工况下，xr 是目标推力轨迹，Q 用于压制超温超转风险，R 用于限制燃油调节幅度。'
        }
      ],
      workflow: [
        {
          name: '构型与边界条件定义',
          detail: '明确飞行包线、来流参数、壁面条件和推进工况，决定求解模型和精度等级。',
          output: '任务工况矩阵、边界条件表、初始几何版本'
        },
        {
          name: '网格生成与数值离散',
          detail: '针对激波区、附面层和喷流剪切层进行局部加密，并设置时间推进和离散格式。',
          output: '可计算网格、时间步策略、离散配置'
        },
        {
          name: '求解收敛与误差评估',
          detail: '监控残差、守恒误差、积分量波动和关键截面流场，对比风洞或台架数据校核模型可信度。',
          output: '收敛解、误差评估报告、敏感性结论'
        },
        {
          name: '代理模型与优化迭代',
          detail: '利用样本点训练代理模型或降阶模型，在参数空间内快速搜索高性能构型。',
          output: '优化设计点、性能包线、设计建议'
        }
      ],
      applications: [
        {
          name: '跨声速机翼减阻设计',
          description: '通过 RANS + 自适应网格计算激波位置和分离风险，对翼型弯度、厚度和后掠角进行多目标优化。',
          value: '提升升阻比、降低巡航油耗、改善操稳裕度',
          tech: 'RANS、激波捕捉、代理模型、多目标优化'
        },
        {
          name: '超燃冲压发动机流道设计',
          description: '在高马赫数条件下分析进气压缩、燃烧稳定和喷管膨胀过程，重点处理热化学非平衡与壁面热流。',
          value: '提升燃烧效率、控制总压损失、保证热结构安全',
          tech: '可压缩流、燃烧模型、热流分析、流固热耦合'
        },
        {
          name: '涡扇发动机健康控制',
          description: '基于传感器数据构建状态估计与寿命评估模型，在推力调节过程中同步约束喘振裕度和排气温度。',
          value: '增强容错能力、降低维护成本、延长关键部件寿命',
          tech: 'MPC、卡尔曼滤波、PHM、故障诊断'
        }
      ],
      frontier: {
        challenges: [
          '高超声速热化学非平衡流计算仍然面临模型不确定性和高计算代价。',
          '复杂发动机全包线控制需要在多模态切换时同时保持稳定性和快速响应。',
          'AI 代理模型在跨构型、跨工况迁移时容易出现精度塌陷。'
        ],
        directions: [
          '数据同化驱动的风洞-仿真联合修正',
          '物理约束神经网络与传统求解器混合框架',
          '面向数字孪生推进系统的在线辨识与闭环优化'
        ],
        papers: [
          '《Computational Fluid Dynamics》- John D. Anderson',
          '《Hypersonic and High Temperature Gas Dynamics》- John D. Anderson',
          '《Model Predictive Control》- Eduardo F. Camacho'
        ]
      }
    },
    '动力学与控制算法': {
      title: '动力学与控制算法',
      subtitle: '围绕轨道、姿态、导航与协同控制实现精确机动',
      metrics: ['核心对象：轨迹、姿态、状态估计、控制律', '典型方法：轨道传播、最优控制、滤波估计、编队协同', '关键目标：精度、鲁棒性、自主性、燃料效率'],
      overview: {
        description: '动力学与控制算法负责把任务目标转化为可执行的机动轨迹和姿态动作，并在不确定环境中维持稳定飞行。它贯穿发射、入轨、交会对接、在轨编队、再入与着陆等全过程，是飞行器实现自主任务的调度中枢。',
        keyPoints: [
          '轨道动力学决定飞行器在引力场中的位置演化和燃料消耗。',
          '姿态控制负责机体指向、载荷稳定和推力矢量调节。',
          '导航算法通过多源传感器融合提升状态可观测性和定位鲁棒性。',
          '集群协同控制将单体控制扩展为编队协同、碰撞规避与任务分配。'
        ]
      },
      foundations: [
        {
          title: '轨道传播与摄动建模',
          text: '轨道设计不仅要满足开普勒运动规律，还要考虑 J2 摄动、大气阻力、太阳辐射压等影响。高精度任务通常采用数值积分进行状态传播。',
          formula: 'r¨ = -μr/|r|³ + aperturb',
          example: '低轨卫星长期保持轨道时，aperturb 需要显式建模非球形引力和稀薄大气阻力，否则预报会产生明显漂移。'
        },
        {
          title: '线性二次型最优控制',
          text: 'LQR 通过求解代数 Riccati 方程获得反馈增益，适用于姿态保持、轨迹跟踪等场景，是很多更复杂控制器的基础。',
          formula: 'u = -Kx,  K = R^-1 BTP',
          example: '卫星姿态保持中，可将角速度和姿态误差组成状态向量 x，通过 K 抑制扰动和控制燃料消耗。'
        },
        {
          title: '多传感器状态估计',
          text: '导航系统通常使用扩展卡尔曼滤波或无迹卡尔曼滤波融合惯导、星敏感器、视觉和 GNSS 数据，以降低漂移并处理测量噪声。',
          formula: 'Kk = Pk- H T (H Pk- H T + R)^-1',
          example: '再入段 GNSS 信号不稳定时，可以提高惯导权重并利用气压、视觉里程计维持状态估计连续性。'
        }
      ],
      workflow: [
        {
          name: '动力学建模',
          detail: '建立轨道、姿态、执行机构和扰动力模型，明确可控量、受限量和状态可观测性。',
          output: '状态方程、约束集合、扰动模型'
        },
        {
          name: '轨迹规划与控制器设计',
          detail: '根据任务目标求解参考轨迹，并设计反馈控制律，保证轨迹跟踪精度与控制稳定性。',
          output: '参考轨迹、控制增益、约束策略'
        },
        {
          name: '仿真验证与鲁棒性分析',
          detail: '通过蒙特卡洛仿真和极端工况注入分析对模型误差、执行器饱和和通信延迟进行鲁棒性验证。',
          output: '鲁棒性报告、稳定边界、容错策略'
        },
        {
          name: '任务执行与在线修正',
          detail: '在飞行过程中结合实时估计结果更新导航解和控制指令，对异常扰动实施在线补偿。',
          output: '在线状态估计、修正指令、任务日志'
        }
      ],
      applications: [
        {
          name: '交会对接制导控制',
          description: '使用相对轨道动力学模型和最优控制器完成逼近、停泊和对接，重点保证相对速度与姿态安全。',
          value: '提升近距离机动精度，降低碰撞风险',
          tech: 'CW 方程、LQR/MPC、相对导航、约束控制'
        },
        {
          name: '再入飞行轨迹规划',
          description: '面向高超声速飞行器和返回舱，联合优化热流、过载和落点偏差，在黑障和气动不确定条件下保持轨迹可控。',
          value: '兼顾安全边界、制导精度与热防护压力',
          tech: '最优控制、伪谱法、滑模控制、状态估计'
        },
        {
          name: '无人机编队协同',
          description: '在对抗和复杂障碍环境下完成编队保持、重构和任务分工，对通信中断和局部失效保持韧性。',
          value: '提升区域覆盖效率和系统级冗余',
          tech: '一致性算法、分布式优化、避碰规划、强化学习'
        }
      ],
      frontier: {
        challenges: [
          '深空任务的状态可观测性弱，导航常依赖稀疏观测和延时通信。',
          '大柔性结构会带来刚柔耦合振动，传统刚体控制模型难以直接适用。',
          '多飞行器协同系统在通信不可靠时易出现一致性退化和局部振荡。'
        ],
        directions: [
          '基于图优化和事件相机的自主导航',
          '刚柔耦合系统的分层控制与在线辨识',
          '面向异构集群的分布式预测控制'
        ],
        papers: [
          '《Spacecraft Dynamics and Control》- Marcel J. Sidi',
          '《Orbital Mechanics for Engineering Students》- Howard D. Curtis',
          '《Optimal Control and Estimation》- Robert F. Stengel'
        ]
      }
    },
    '感知与信息处理算法': {
      title: '感知与信息处理算法',
      subtitle: '让空天系统看见目标、理解环境并稳定传回信息',
      metrics: ['核心对象：图像、信号、链路、时空数据', '典型方法：检测跟踪、遥感解译、融合估计、通信编码', '关键目标：识别率、时延、可靠性、在轨智能'],
      overview: {
        description: '感知与信息处理算法连接载荷获取、信息传输、数据理解和任务决策，是空天系统完成“采、传、算、用”闭环的关键。它既涉及视觉和遥感模型，也涉及通信编码、链路调度和边缘智能。',
        keyPoints: [
          '目标检测与跟踪算法用于复杂背景中的快速发现、关联与持续观测。',
          '遥感解译算法将光学、SAR 和高光谱数据转化为可用地物信息。',
          '通信与组网算法决定链路吞吐、抗干扰性和资源调度效率。',
          '在轨智能处理强调有限算力下的模型压缩、任务优先级和实时推理。'
        ]
      },
      foundations: [
        {
          title: '检测与跟踪损失设计',
          text: '目标检测模型通常联合优化分类、边框回归和置信度，跟踪则进一步构建时序关联与轨迹管理模块。',
          formula: 'L = Lcls + λ1 Lbox + λ2 Lobj',
          example: '在遥感小目标检测中，会提高边框损失权重并结合多尺度特征金字塔，以减少漏检。'
        },
        {
          title: '信道容量与链路设计',
          text: '通信链路需要在带宽、功率和干扰限制下评估理论上限，并据此选择调制、编码和重传策略。',
          formula: 'C = B log2(1 + S/N)',
          example: '星地高速数传中，如果姿态抖动导致信噪比下降，系统需要动态切换编码率以维持有效吞吐。'
        },
        {
          title: '遥感反演与信息融合',
          text: '多源遥感数据常结合贝叶斯估计、卡尔曼滤波或深度特征融合，将原始观测转换为地表参数、变化图和目标清单。',
          formula: 'p(x|z) ∝ p(z|x)p(x)',
          example: '灾害监测中可以把历史地物先验 p(x) 与最新卫星观测 p(z|x) 结合，得到变化区域的后验概率。'
        }
      ],
      workflow: [
        {
          name: '数据获取与预处理',
          detail: '完成载荷标定、去噪、配准、时空对齐和链路整编，为下游算法提供统一输入。',
          output: '标准化影像、信号帧、时空索引'
        },
        {
          name: '感知建模与特征提取',
          detail: '根据任务类型选择视觉模型、序列模型或信号处理方法，提取空间纹理、频域特征和时序关系。',
          output: '候选目标、特征向量、时序表示'
        },
        {
          name: '识别决策与结果融合',
          detail: '对检测、分类、跟踪和变化分析结果进行跨传感器融合，提高稳定性并减少虚警。',
          output: '目标列表、轨迹、变化图、置信度'
        },
        {
          name: '链路调度与在轨回传',
          detail: '结合星地窗口、链路状态和任务优先级进行回传调度，实现有限带宽下的高价值信息优先传输。',
          output: '回传计划、压缩数据包、任务摘要'
        }
      ],
      applications: [
        {
          name: '低空高速目标跟踪',
          description: '在复杂城市背景和遮挡条件下，对无人机、车辆或高速运动目标进行实时检测、重识别和轨迹预测。',
          value: '提升监视连续性和告警及时性',
          tech: 'YOLO/DETR、多目标跟踪、轨迹预测、边缘推理'
        },
        {
          name: '灾害遥感快速解译',
          description: '利用光学与 SAR 融合数据完成洪水、滑坡和火灾的范围识别与变化分析，并生成面向决策的专题图。',
          value: '缩短灾后评估时间，提高资源调度效率',
          tech: '变化检测、语义分割、多模态融合、知识图谱'
        },
        {
          name: '星座协同通信调度',
          description: '面向大规模卫星网络动态分配频谱、功率和链路资源，在链路抖动与干扰条件下维持稳定服务。',
          value: '提升网络吞吐与覆盖连续性',
          tech: '自适应编码调制、资源调度、路由优化、抗干扰设计'
        }
      ],
      frontier: {
        challenges: [
          '空天目标样本稀缺且分布变化快，模型容易受到域偏移影响。',
          '在轨计算资源有限，复杂模型难以直接部署到卫星或边缘节点。',
          '高动态环境下的链路切换和异构网络协同仍有较大工程复杂度。'
        ],
        directions: [
          '面向遥感和空情任务的多模态基础模型',
          '可解释的在轨智能推理与不确定性评估',
          '空天地一体化网络的联合感知通信'
        ],
        papers: [
          '《Deep Learning》- Ian Goodfellow',
          '《Remote Sensing Digital Image Analysis》- John A. Richards',
          '《Satellite Communications Systems》- Gérard Maral'
        ]
      }
    },
    '制造与优化算法': {
      title: '制造与优化算法',
      subtitle: '把性能指标转化为可制造、可验证、可量产的工程方案',
      metrics: ['核心对象：结构、工艺、缺陷、成本', '典型方法：拓扑优化、工艺优化、缺陷检测、数字孪生', '关键目标：减重、可靠性、制造性、闭环质量'],
      overview: {
        description: '制造与优化算法位于设计和生产之间，负责把性能目标转化为可落地的结构方案和工艺参数。它不仅关注结构强度和轻量化，也要嵌入制造约束、成本边界和质量监测机制，避免“算得出但造不出”。',
        keyPoints: [
          '结构优化将应力、位移、模态和寿命指标统一进设计变量求解。',
          '工艺优化控制打印路径、层厚、热输入、冷却和装配误差。',
          '缺陷检测算法结合传感器和视觉数据进行在线识别与质量追溯。',
          '数字孪生与闭环制造将设计、工艺、检测和运维数据贯通。'
        ]
      },
      foundations: [
        {
          title: '拓扑优化目标函数',
          text: '典型拓扑优化以最小柔度或最小质量为目标，在体积分数、应力和位移约束下寻找最优材料分布。',
          formula: 'min C(x) = FTu(x),  s.t. V(x)/V0 ≤ f',
          example: '设计卫星支架时，可在给定质量上限下最小化柔度，使结构在发射振动载荷下保持更高刚度。'
        },
        {
          title: '增材制造热输入控制',
          text: '打印质量与热输入密切相关，能量密度过高会导致飞溅和残余应力，过低则可能引起未熔合缺陷。',
          formula: 'E = P / (v h t)',
          example: 'P 为激光功率，v 为扫描速度，h 和 t 分别是扫描间距与层厚，常用该式做工艺窗口初筛。'
        },
        {
          title: '质量检测与判别损失',
          text: '在线缺陷检测通常把熔池图像、声发射或热像信号输入分类器或异常检测模型，对孔隙、裂纹和层间缺陷进行识别。',
          formula: 'L = -Σ yi log(p̂i)',
          example: '将热像帧序列分成正常与异常类别后，可通过交叉熵损失训练工艺异常告警模型。'
        }
      ],
      workflow: [
        {
          name: '性能目标与制造约束建模',
          detail: '明确承载路径、质量上限、装配界面、材料体系和可制造特征，对不可加工区域做前置约束。',
          output: '设计空间、约束集、制造规则'
        },
        {
          name: '结构优化与工艺联合求解',
          detail: '在拓扑优化结果基础上继续考虑铺层、支撑、扫描路径和热变形，实现设计-工艺一体化。',
          output: '结构方案、工艺参数、仿真结果'
        },
        {
          name: '试制验证与缺陷检测',
          detail: '通过试样、实件和在线监测验证关键参数，对尺寸偏差、内部缺陷和性能散差进行回归修正。',
          output: '试制报告、缺陷分布、修正模型'
        },
        {
          name: '量产闭环与寿命追踪',
          detail: '把生产数据、检测结果和服役反馈回灌到工艺模型中，形成可追溯的制造闭环。',
          output: '工艺基线、质量档案、寿命数据库'
        }
      ],
      applications: [
        {
          name: '轻量化卫星支架设计',
          description: '在满足刚度和一阶频率约束前提下，利用拓扑优化与增材制造实现复杂镂空构型，降低发射质量。',
          value: '减重明显，同时保留关键载荷传递路径',
          tech: 'SIMP、模态约束、增材制造、后处理'
        },
        {
          name: '发动机复杂流道一体成形',
          description: '通过工艺参数优化和在线监测制造复杂冷却流道零件，减少装配焊缝并提高热管理效率。',
          value: '缩短研制周期，降低零件数量和泄漏风险',
          tech: '路径规划、热输入优化、熔池监测、CT 检测'
        },
        {
          name: '复合材料结构铺层优化',
          description: '针对翼面和整流罩等大尺寸复材构件，优化铺层角度、层间顺序和加强筋布局，平衡重量、刚度和损伤容限。',
          value: '提升结构效率并改善制造一致性',
          tech: '层合板理论、遗传算法、自动铺丝、无损检测'
        }
      ],
      frontier: {
        challenges: [
          '优化结果常与真实制造约束存在偏差，需要更多设计制造一体化方法。',
          '大型复杂构件在线监测信号噪声高，缺陷识别稳定性不足。',
          '质量数据、工艺数据和服役数据尚未完全形成统一闭环。'
        ],
        directions: [
          '设计-制造-检测协同优化框架',
          '基于多模态传感的在线质量预测',
          '面向航天复杂部件的数字孪生制造系统'
        ],
        papers: [
          '《Topology Optimization: Theory, Methods, and Applications》- Martin P. Bendsøe',
          '《Additive Manufacturing Technologies》- Ian Gibson',
          '《Composite Materials for Aircraft Structures》- Alan A. Baker'
        ]
      }
    }
  }), []);

  const currentTopic = algorithmTopics[decodeURIComponent(topic)];

  if (!currentTopic) {
    return (
      <div className="aerospace-algorithm-page">
        <div className="algorithm-shell">
          <div className="algorithm-error">
            <h2>算法主题未找到</h2>
            <Link to="/aerospace-detail" className="algorithm-back-button">返回总览</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aerospace-algorithm-page">
      <div className="algorithm-shell">
        <div className="algorithm-header">
          <Link to="/aerospace-detail" className="algorithm-back-button">
            <i className="fa fa-arrow-left"></i> 返回算法总览
          </Link>
          <h1>{currentTopic.title}</h1>
          <p className="algorithm-subtitle">{currentTopic.subtitle}</p>
          <div className="algorithm-metrics">
            {currentTopic.metrics.map((metric, index) => (
              <span key={index} className="algorithm-metric-chip">{metric}</span>
            ))}
          </div>
        </div>

        <div className="algorithm-document">
          <div className="algorithm-tabs">
            <button
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              概述
            </button>
            <button
              className={activeTab === 'foundations' ? 'active' : ''}
              onClick={() => setActiveTab('foundations')}
            >
              核心模型
            </button>
            <button
              className={activeTab === 'workflow' ? 'active' : ''}
              onClick={() => setActiveTab('workflow')}
            >
              典型流程
            </button>
            <button
              className={activeTab === 'applications' ? 'active' : ''}
              onClick={() => setActiveTab('applications')}
            >
              工程应用
            </button>
            <button
              className={activeTab === 'frontier' ? 'active' : ''}
              onClick={() => setActiveTab('frontier')}
            >
              前沿挑战
            </button>
          </div>

          <div className="algorithm-tab-content">
            {activeTab === 'overview' && (
              <section>
                <p className="algorithm-description">{currentTopic.overview.description}</p>
                <h3>核心关注点</h3>
                <ul className="algorithm-bullet-list">
                  {currentTopic.overview.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </section>
            )}

            {activeTab === 'foundations' && (
              <section>
                <h3>关键模型与举例公式</h3>
                <div className="foundation-grid">
                  {currentTopic.foundations.map((item, index) => (
                    <article key={index} className="foundation-card">
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                      <div className="algorithm-formula-box">
                        <code>{item.formula}</code>
                      </div>
                      <p className="formula-example">
                        <strong>举例说明：</strong>
                        {item.example}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'workflow' && (
              <section>
                <h3>工程实现流程</h3>
                <div className="workflow-list">
                  {currentTopic.workflow.map((step, index) => (
                    <article key={index} className="workflow-card">
                      <div className="workflow-index">{index + 1}</div>
                      <div className="workflow-body">
                        <h4>{step.name}</h4>
                        <p>{step.detail}</p>
                        <div className="workflow-output">
                          <strong>阶段产出：</strong>
                          {step.output}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'applications' && (
              <section>
                <h3>典型工程场景</h3>
                <div className="application-list">
                  {currentTopic.applications.map((item, index) => (
                    <article key={index} className="application-card">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <p className="application-value">
                        <strong>工程价值：</strong>
                        {item.value}
                      </p>
                      <div className="application-tags">
                        {item.tech.split('、').map((tech, techIndex) => (
                          <span key={techIndex} className="application-tag">{tech}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'frontier' && (
              <section className="frontier-section">
                <div className="frontier-column">
                  <h3>当前挑战</h3>
                  <ul className="algorithm-bullet-list">
                    {currentTopic.frontier.challenges.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="frontier-column">
                  <h3>演进方向</h3>
                  <ul className="algorithm-bullet-list">
                    {currentTopic.frontier.directions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="frontier-reading">
                  <h3>推荐阅读</h3>
                  <ul className="reading-list">
                    {currentTopic.frontier.papers.map((paper, index) => (
                      <li key={index}>{paper}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AerospaceAlgorithmDetail;
