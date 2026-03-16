import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/aerospace-algorithm-model.css';

function AerospaceAlgorithmModelDetail() {
  const { topic, model } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const modelDetails = useMemo(() => ({
    '气动与推进算法': {
      'CFD核心求解': {
        title: 'CFD核心求解',
        subtitle: '用守恒方程和离散求解器重建飞行器周围流场',
        overview: {
          description: 'CFD 核心求解是气动设计的基础，它把连续介质控制方程离散到计算网格上，通过通量重构、时间推进和收敛控制获得压力、速度、温度和热流等结果。',
          points: [
            '核心任务是稳定求解可压缩流动的质量、动量和能量守恒方程。',
            '对翼型、机翼、进气道、喷管等部位的流场预测依赖网格质量和通量格式。',
            '工程上通常在精度、收敛速度和计算成本之间做权衡。'
          ]
        },
        formulas: [
          {
            title: '守恒型控制方程',
            formula: '∂U/∂t + ∇·F(U) = S',
            explanation: 'U 表示守恒变量，F(U) 表示数值通量，S 表示源项。有限体积法以控制体积分形式保持守恒性。'
          },
          {
            title: 'CFL 稳定条件',
            formula: 'Δt ≤ CFL · Δx / (|u| + a)',
            explanation: '时间步长受局部速度和声速影响，显式求解器尤其依赖 CFL 条件来控制稳定性。'
          }
        ],
        workflow: [
          '建立几何与边界条件，定义来流马赫数、攻角、壁面条件和监测量。',
          '生成边界层加密网格，设置离散格式、时间推进和收敛准则。',
          '监控残差、升阻力、压力分布和热流密度，并与风洞结果交叉校核。'
        ],
        cases: [
          '跨声速机翼优化中，CFD 用于判断激波位置、附面层分离和升阻比变化。',
          '再入飞行器热防护设计中，CFD 用于估算鼻锥和前缘区域的局部热流峰值。'
        ],
        evaluation: [
          '收敛性：残差是否下降并稳定到目标量级。',
          '一致性：不同网格密度下气动力积分量是否收敛。',
          '可信度：与实验或高保真仿真结果的偏差是否可接受。'
        ]
      },
      '湍流模型': {
        title: '湍流模型',
        subtitle: '以可承受代价近似复杂涡结构和能量耗散过程',
        overview: {
          description: '湍流模型通过封闭雷诺平均方程或解析部分尺度结构，使工程流动模拟能够在合理计算资源下完成。不同模型对分离流、尾迹和换热问题的适配程度差异很大。',
          points: [
            'RANS 适合大多数稳态工程设计，成本低但细节能力有限。',
            'LES 更能刻画非定常大尺度结构，但计算开销显著增加。',
            '模型选型直接影响升阻特性和热环境预测结果。'
          ]
        },
        formulas: [
          {
            title: '雷诺应力假设',
            formula: '-u′iu′j = νt(∂Ui/∂xj + ∂Uj/∂xi) - 2kδij/3',
            explanation: '通过等效湍黏性 νt 把未知雷诺应力与平均速度梯度联系起来，是多数两方程模型的基础。'
          },
          {
            title: 'k-ω SST 核心封闭',
            formula: 'νt = a1 k / max(a1 ω, SF2)',
            explanation: 'SST 通过混合函数结合 k-ε 与 k-ω 的优势，常用于附面层分离和压力梯度较强的外流场。'
          }
        ],
        workflow: [
          '根据问题类型选定 RANS、DES 或 LES，并明确边界层分辨率要求。',
          '设置壁面函数或低雷诺数处理方式，保证 y+ 范围与模型前提一致。',
          '对分离点、再附点、尾迹速度亏损和壁面热流进行敏感性分析。'
        ],
        cases: [
          '进气道流动中，湍流模型直接影响激波-边界层干扰位置和总压恢复。',
          '发动机叶栅分析中，湍流模型用于评估叶尖泄漏和端壁损失。'
        ],
        evaluation: [
          '对关键流动特征的位置预测是否稳定。',
          '对网格和近壁处理方法是否过度敏感。',
          '能否兼顾流动分离、尾迹和换热预测。'
        ]
      },
      'AI气动代理': {
        title: 'AI气动代理',
        subtitle: '用数据驱动近似高成本流场仿真与优化循环',
        overview: {
          description: 'AI 气动代理模型通过学习几何参数、工况参数和气动结果之间的映射，以显著降低 CFD 迭代成本，常用于快速筛选构型与多目标优化。',
          points: [
            '代理模型通常以样本库为基础，可近似升阻力、压强分布或热流场。',
            '在样本密度不足或跨构型外推时，模型精度容易下降。',
            '物理约束和主动采样是提升可用性的关键。'
          ]
        },
        formulas: [
          {
            title: '代理建模目标',
            formula: 'ŷ = fθ(x),  min Σ||y - fθ(x)||²',
            explanation: 'x 可以是几何参数和工况，y 可以是气动力系数或表面压力；通过参数 θ 拟合样本映射。'
          },
          {
            title: 'PINNs 物理约束损失',
            formula: 'L = Ldata + λ Lphysics',
            explanation: '在训练数据误差之外增加方程残差约束，减少模型出现物理不一致解的概率。'
          }
        ],
        workflow: [
          '从 CFD 或风洞样本中构建训练集，覆盖主要构型和工况空间。',
          '训练代理模型并在独立验证集上检查插值误差与外推风险。',
          '把代理模型嵌入优化器，在高价值区域补充新样本形成主动学习闭环。'
        ],
        cases: [
          '翼型参数优化中，可用代理模型快速估算升阻比和失速趋势。',
          '高超声速头锥设计中，可用代理模型预筛热流较低的几何方案。'
        ],
        evaluation: [
          '预测误差在关键设计区间是否可控。',
          '对新工况和新构型是否具备稳定泛化能力。',
          '能否有效缩短总体设计迭代时间。'
        ]
      },
      '发动机控制': {
        title: '发动机控制',
        subtitle: '在推力、效率和安全边界之间做动态平衡',
        overview: {
          description: '发动机控制算法围绕转速、燃油、压比、温度和喘振裕度等变量设计闭环策略，使推进系统在加速、巡航、减速和异常工况下保持稳定运行。',
          points: [
            '控制器要跟踪推力指令，同时避免超温、超转和失稳。',
            '模型预测控制适合处理多变量耦合和约束问题。',
            '健康管理与故障诊断通常与控制器并行运行。'
          ]
        },
        formulas: [
          {
            title: 'MPC 目标函数',
            formula: 'J = Σ(xk - xr)TQ(xk - xr) + ΣukTRuk',
            explanation: 'Q 用于惩罚状态偏差，R 用于约束控制输入变化；通过优化控制序列实现多约束协调。'
          },
          {
            title: '状态空间模型',
            formula: 'xk+1 = Axk + Buk',
            explanation: '线性化状态空间模型常作为控制器在线预测的基础，描述发动机工作点附近动态。'
          }
        ],
        workflow: [
          '建立压气机、燃烧室和涡轮的动态模型，并识别关键约束量。',
          '设计控制器并进行全工况仿真，验证推力响应和安全边界。',
          '结合健康管理模块实现异常工况降级控制与故障预警。'
        ],
        cases: [
          '涡扇发动机加速过程中，用 MPC 平衡转速响应与排气温度约束。',
          '组合循环发动机模态切换时，需要平滑过渡不同推进模式下的控制律。'
        ],
        evaluation: [
          '推力跟踪时间和超调量。',
          '喘振裕度与温度安全边界是否被可靠维持。',
          '面对传感器偏差和执行器故障时的容错能力。'
        ]
      }
    },
    '动力学与控制算法': {
      '轨道力学': {
        title: '轨道力学',
        subtitle: '描述航天器在引力场中的位置与速度演化',
        overview: {
          description: '轨道力学算法用于轨道设计、轨道预报、变轨规划和交会计算，是空间任务时间线和燃料预算的基础。',
          points: [
            '基础模型从二体问题出发，再逐步加入摄动项。',
            '变轨设计通常同时考虑时间窗、燃料和终端轨道精度。',
            '深空任务中多体引力和长期误差积累更关键。'
          ]
        },
        formulas: [
          {
            title: '二体运动方程',
            formula: 'r¨ = -μr/|r|³',
            explanation: '这是开普勒轨道的连续动力学基础，适用于理想中心引力问题。'
          },
          {
            title: '轨道几何关系',
            formula: 'r = a(1 - e²)/(1 + e cosθ)',
            explanation: '用半长轴 a、偏心率 e 和真近点角 θ 描述椭圆轨道上的瞬时位置。'
          }
        ],
        workflow: [
          '根据任务目标设定初始轨道、目标轨道和时间约束。',
          '选取传播模型，考虑 J2、大气阻力和第三体引力等摄动。',
          '进行变轨求解和误差分析，形成轨控策略与燃料预算。'
        ],
        cases: [
          '低轨卫星轨道维持依赖轨道预报与定期小脉冲修正。',
          '深空转移轨道设计中常用引力辅助降低燃料消耗。'
        ],
        evaluation: [
          '轨道预报误差是否满足任务窗口要求。',
          '变轨燃料消耗是否达到设计上限。',
          '长期传播对摄动模型是否敏感。'
        ]
      },
      '姿态控制': {
        title: '姿态控制',
        subtitle: '让飞行器或航天器保持所需指向与稳定性',
        overview: {
          description: '姿态控制算法负责约束滚转、俯仰和偏航运动，使飞行器实现稳定指向、载荷对准、天线对地和推进姿态管理。',
          points: [
            '执行机构通常包括反作用轮、控制力矩陀螺和推力器。',
            '控制律需兼顾扰动抑制、能量消耗和执行器饱和。',
            '柔性附件会显著提高控制难度。'
          ]
        },
        formulas: [
          {
            title: '欧拉刚体方程',
            formula: 'Iω̇ + ω × (Iω) = M',
            explanation: '描述刚体在力矩 M 作用下的角速度演化，是姿态控制设计的基础。'
          },
          {
            title: 'PID 控制律',
            formula: 'u(t) = Kpe(t) + Ki∫e(t)dt + Kd de(t)/dt',
            explanation: 'PID 在工程中仍广泛使用，适合快速构建基础姿态保持器。'
          }
        ],
        workflow: [
          '建立姿态运动学与动力学模型，明确执行器配置和扰动类型。',
          '设计反馈控制律并进行大角度机动和稳态保持仿真。',
          '评估控制精度、抖振、能耗和执行器饱和风险。'
        ],
        cases: [
          '卫星对地观测任务依赖高稳定度姿态保持确保载荷成像质量。',
          '火箭返回段姿态控制需要配合推力矢量和气动舵面实现稳定着陆。'
        ],
        evaluation: [
          '姿态误差和角速度误差是否满足任务要求。',
          '是否出现执行器饱和或控制抖振。',
          '面对外扰和参数偏差的鲁棒性。'
        ]
      },
      '制导与导航': {
        title: '制导与导航',
        subtitle: '把当前位置估计与目标轨迹规划闭合成可执行指令',
        overview: {
          description: '制导决定“往哪走”，导航决定“现在在哪”，两者共同支撑飞行器从当前位置收敛到目标轨迹或目标点。',
          points: [
            '导航通常融合惯导、GNSS、视觉、星敏感器等多源信息。',
            '制导则根据约束条件生成加速度、姿态或路径参考。',
            '高超声速和深空环境会削弱通信和观测条件。'
          ]
        },
        formulas: [
          {
            title: '卡尔曼更新',
            formula: 'x̂k = x̂k- + Kk(zk - Hx̂k-)',
            explanation: '利用测量残差修正预测状态，是多传感器导航融合的核心步骤。'
          },
          {
            title: '比例导引律',
            formula: 'ac = N Vc λ̇',
            explanation: '导引指令与视线角变化率 λ̇ 成比例，是拦截与终端制导中的经典方法。'
          }
        ],
        workflow: [
          '建立测量模型并完成传感器误差标定。',
          '实时融合导航信息，得到位置、速度和姿态状态估计。',
          '根据目标约束生成制导指令，闭环修正轨迹偏差。'
        ],
        cases: [
          '返回舱再入时需在导航不完全可靠的情况下保持落点控制。',
          '深空探测任务需要借助星图和脉冲星等弱信号实现自主导航。'
        ],
        evaluation: [
          '状态估计误差是否持续受控。',
          '制导指令是否兼顾轨迹精度与控制代价。',
          '对失锁、遮挡和噪声突变的容忍能力。'
        ]
      },
      '集群控制': {
        title: '集群控制',
        subtitle: '让多个飞行体在共享任务下形成协同系统',
        overview: {
          description: '集群控制关注多机系统中的一致性保持、任务分配、避碰重构和信息交互，使多个智能体能够作为整体完成侦察、覆盖和协同打击等任务。',
          points: [
            '分布式控制能降低单点故障风险。',
            '通信延迟和拓扑变化是集群控制的典型难点。',
            '异构平台协同需要统一任务层与执行层接口。'
          ]
        },
        formulas: [
          {
            title: '一致性控制',
            formula: 'ui = -Σ aij(xi - xj)',
            explanation: '智能体通过与邻居状态差构造控制输入，实现位置或速度一致。'
          },
          {
            title: '图拉普拉斯模型',
            formula: 'ẋ = -Lx',
            explanation: '图拉普拉斯矩阵 L 描述通信拓扑，连通性决定一致性收敛速度与可达性。'
          }
        ],
        workflow: [
          '定义编队形态、通信拓扑和任务分配规则。',
          '设计分布式控制和避碰机制，应对链路变化和节点失效。',
          '通过仿真和实飞验证编队稳定性、重构能力和任务完成率。'
        ],
        cases: [
          '无人机编队搜索通过分布式协同扩大覆盖范围。',
          '卫星编队观测通过相对轨道控制保持基线几何关系。'
        ],
        evaluation: [
          '一致性误差与编队保持误差。',
          '通信中断时的退化性能。',
          '在动态障碍环境下的避碰成功率。'
        ]
      }
    },
    '感知与信息处理算法': {
      '目标检测与跟踪': {
        title: '目标检测与跟踪',
        subtitle: '从复杂背景中发现目标并维持连续轨迹',
        overview: {
          description: '目标检测与跟踪算法将图像或视频中的候选目标定位出来，并在连续帧之间进行身份关联，是空情监视和低空态势感知的重要组成部分。',
          points: [
            '检测模型负责找出“哪里有目标”。',
            '跟踪模型负责判断“前后帧是不是同一个目标”。',
            '小目标、遮挡和高速机动是主要难点。'
          ]
        },
        formulas: [
          {
            title: '检测损失函数',
            formula: 'L = Lcls + λ1 Lbox + λ2 Lobj',
            explanation: '联合优化分类、框回归和目标置信度，是主流检测网络的通用结构。'
          },
          {
            title: '卡尔曼预测',
            formula: 'xk|k-1 = A xk-1|k-1',
            explanation: '在跟踪中先用运动模型预测目标位置，再利用检测结果做关联修正。'
          }
        ],
        workflow: [
          '完成数据标注、样本增强与多尺度训练，提升对远距离小目标的识别能力。',
          '结合运动预测和外观特征做多目标关联，形成连续轨迹。',
          '在部署端关注推理时延、漏检率和目标重识别能力。'
        ],
        cases: [
          '无人机视频监控中用检测与跟踪算法持续跟随高速车辆或飞行目标。',
          '港口与海面监视中利用多目标跟踪维持船只轨迹连续性。'
        ],
        evaluation: [
          'mAP、MOTA、IDF1 等指标。',
          '遮挡恢复后的身份保持能力。',
          '边缘设备上的实时推理帧率。'
        ]
      },
      '遥感解译': {
        title: '遥感解译',
        subtitle: '把遥感影像转换成地物语义、变化信息和任务知识',
        overview: {
          description: '遥感解译关注对光学、SAR 和高光谱等卫星数据进行分类、检测、分割和变化分析，使影像从“像素”转化为“可用情报”。',
          points: [
            '常见任务包括地物分类、变化检测、目标提取和语义分割。',
            '多时相、多源数据融合能显著提高解译稳定性。',
            '弱纹理、小样本和跨区域泛化是主要瓶颈。'
          ]
        },
        formulas: [
          {
            title: '贝叶斯后验估计',
            formula: 'p(x|z) ∝ p(z|x) p(x)',
            explanation: '将观测信息与先验知识融合，是遥感反演和变化分析中的基础思想。'
          },
          {
            title: '变化检测差异度',
            formula: 'D = ||Ft1 - Ft2||',
            explanation: '通过不同时相特征差异度量变化区域，Ft1 和 Ft2 表示两个时相的特征向量。'
          }
        ],
        workflow: [
          '完成辐射校正、几何配准和云影处理，统一多源影像尺度。',
          '训练解译模型并结合领域知识做后处理和误检修正。',
          '输出专题图、变化图或目标清单，接入上层决策系统。'
        ],
        cases: [
          '灾害监测中通过变化检测快速识别洪水淹没区和滑坡扩展区。',
          '农业监测中结合多光谱指数估算作物长势与灾情分布。'
        ],
        evaluation: [
          '分类精度、IoU、Kappa 系数等解译指标。',
          '跨地区迁移时的稳定性。',
          '从原始影像到专题产品的处理时延。'
        ]
      },
      '通信与组网': {
        title: '通信与组网',
        subtitle: '在动态链路环境中维持稳定的信息传输和网络协同',
        overview: {
          description: '通信与组网算法决定空天地系统如何分配带宽、功率和链路资源，并在卫星、平台和地面站之间构建可持续的数据通道。',
          points: [
            '核心问题包括信道建模、调制编码、路由调度和资源分配。',
            '高动态环境和异构链路使网络状态随时间剧烈变化。',
            '低时延与高可靠经常需要做折中设计。'
          ]
        },
        formulas: [
          {
            title: '香农容量',
            formula: 'C = B log2(1 + S/N)',
            explanation: '决定在给定带宽 B 和信噪比条件下理论上的最大通信容量。'
          },
          {
            title: '接收功率链路预算',
            formula: 'Pr = Pt + Gt + Gr - Lfs - Lsys',
            explanation: '用于快速判断链路是否可达和余量是否足够，适合星地与星间通信设计。'
          }
        ],
        workflow: [
          '构建链路模型，评估带宽、时延、干扰和覆盖窗口。',
          '设计调制编码与路由策略，在资源约束下优化吞吐和可靠性。',
          '根据链路状态进行在线调度，实现任务优先级感知的数据回传。'
        ],
        cases: [
          '星间激光链路用于高速回传遥感数据并减少中继时延。',
          '卫星互联网通过异构路由和频谱调度保障连续覆盖。'
        ],
        evaluation: [
          '吞吐率、误码率、时延和链路可用率。',
          '高动态场景下的切换成功率。',
          '干扰和拥塞条件下的服务退化程度。'
        ]
      }
    },
    '制造与优化算法': {
      '结构优化': {
        title: '结构优化',
        subtitle: '在强度、重量和制造性之间找到更优结构分布',
        overview: {
          description: '结构优化算法把承载要求、几何边界和制造约束转化为设计变量求解问题，用于减重、提刚和延寿，是航天器轻量化设计的重要工具。',
          points: [
            '拓扑优化适合决定材料“放在哪里”。',
            '尺寸优化与形状优化适合在可制造结构上做细化调整。',
            '工程上通常需要把振动、模态和装配接口一并纳入约束。'
          ]
        },
        formulas: [
          {
            title: '最小柔度目标',
            formula: 'min C(x) = FTu(x)',
            explanation: '在给定载荷下，柔度越小表示结构整体刚度越高，是拓扑优化常用目标。'
          },
          {
            title: '体积分数约束',
            formula: 'V(x)/V0 ≤ f',
            explanation: '限定可用材料总量，防止优化结果通过无限增加材料实现刚度提升。'
          }
        ],
        workflow: [
          '定义设计空间、非设计区和载荷工况，设置重量和模态等约束。',
          '执行拓扑或尺寸优化，结合有限元结果迭代更新设计变量。',
          '对优化结果做可制造性重构和二次验证。'
        ],
        cases: [
          '卫星支架拓扑优化可在保持刚度的前提下降低发射质量。',
          '机翼加强结构优化可提升比刚度并改善疲劳寿命分布。'
        ],
        evaluation: [
          '减重幅度与刚度保持情况。',
          '关键应力区域是否得到合理控制。',
          '结果是否满足制造、装配和检测条件。'
        ]
      },
      '增材制造': {
        title: '增材制造',
        subtitle: '通过逐层成形实现复杂几何快速试制与一体化制造',
        overview: {
          description: '增材制造算法关注路径规划、热输入控制、层间策略和缺陷检测，使复杂零件能够在逐层构建过程中保持尺寸精度和材料性能。',
          points: [
            '路径规划直接影响成形时间、热积累和残余应力。',
            '在线监测用于发现孔隙、未熔合和飞溅等异常。',
            '与传统加工结合常用于复杂航天部件的快速迭代。'
          ]
        },
        formulas: [
          {
            title: '体能量密度',
            formula: 'E = P / (v h t)',
            explanation: '激光功率 P、扫描速度 v、扫描间距 h 和层厚 t 决定单位体积吸收能量，是工艺窗口分析的重要参数。'
          },
          {
            title: '热传导基本式',
            formula: 'ρcp ∂T/∂t = ∇·(k∇T) + Q',
            explanation: '用于分析熔池周围温度演化和热影响区变化，Q 表示外部热源项。'
          }
        ],
        workflow: [
          '根据几何和材料设定分层方案、扫描路径和支撑结构。',
          '联动工艺参数与热仿真预测变形、残余应力和成形缺陷。',
          '通过在线监测和后处理修正制造过程，形成稳定工艺窗口。'
        ],
        cases: [
          '火箭发动机喷注器常用增材制造实现复杂内流道一体成形。',
          '卫星轻量化支架可通过增材制造快速试制并缩短设计迭代。'
        ],
        evaluation: [
          '尺寸偏差、表面质量和内部缺陷率。',
          '材料组织与力学性能的一致性。',
          '工艺稳定性与制造周期收益。'
        ]
      }
    }
  }), []);

  const currentTopic = modelDetails[decodeURIComponent(topic)];
  const currentModel = currentTopic?.[decodeURIComponent(model)];

  if (!currentModel) {
    return (
      <div className="aerospace-model-page">
        <div className="model-shell">
          <div className="model-error">
            <h2>算法模型未找到</h2>
            <Link to="/aerospace-detail" className="model-back-link">返回算法总览</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aerospace-model-page">
      <div className="model-shell">
        <div className="model-header">
          <div className="model-breadcrumbs">
            <Link to="/aerospace-detail" className="model-back-link">关键算法体系</Link>
            <span>/</span>
            <Link to={`/aerospace-algorithm/${encodeURIComponent(decodeURIComponent(topic))}`} className="model-back-link">
              {decodeURIComponent(topic)}
            </Link>
            <span>/</span>
            <span>{currentModel.title}</span>
          </div>
          <h1>{currentModel.title}</h1>
          <p className="model-subtitle">{currentModel.subtitle}</p>
        </div>

        <div className="model-tabs">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>概述</button>
          <button className={activeTab === 'formulas' ? 'active' : ''} onClick={() => setActiveTab('formulas')}>关键公式</button>
          <button className={activeTab === 'workflow' ? 'active' : ''} onClick={() => setActiveTab('workflow')}>实现流程</button>
          <button className={activeTab === 'applications' ? 'active' : ''} onClick={() => setActiveTab('applications')}>应用场景</button>
          <button className={activeTab === 'evaluation' ? 'active' : ''} onClick={() => setActiveTab('evaluation')}>评估重点</button>
        </div>

        <div className="model-document">
          {activeTab === 'overview' && (
            <section>
              <p className="model-description">{currentModel.overview.description}</p>
              <ul className="model-list">
                {currentModel.overview.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === 'formulas' && (
            <section className="model-formula-grid">
              {currentModel.formulas.map((item, index) => (
                <article key={index} className="model-card">
                  <h3>{item.title}</h3>
                  <div className="model-formula-box">
                    <code>{item.formula}</code>
                  </div>
                  <p>{item.explanation}</p>
                </article>
              ))}
            </section>
          )}

          {activeTab === 'workflow' && (
            <section className="model-section-card">
              <h3>典型实现流程</h3>
              <ol className="model-ordered-list">
                {currentModel.workflow.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </section>
          )}

          {activeTab === 'applications' && (
            <section className="model-section-card">
              <h3>典型应用场景</h3>
              <ul className="model-list">
                {currentModel.cases.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === 'evaluation' && (
            <section className="model-section-card">
              <h3>评估与落地关注点</h3>
              <ul className="model-list">
                {currentModel.evaluation.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default AerospaceAlgorithmModelDetail;
