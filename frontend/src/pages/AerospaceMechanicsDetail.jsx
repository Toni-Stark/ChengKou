import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../styles/aerospace-mechanics.css';

function AerospaceMechanicsDetail() {
  const { topic } = useParams();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 力学与工程学主题数据
  const mechanicsData = {
    '理论力学': {
      title: '理论力学',
      subtitle: '研究物体机械运动规律的基础学科',
      overview: {
        description: '理论力学是研究物体机械运动一般规律的科学，是航空航天工程的物理基础。它以牛顿力学为核心，通过矢量力学和分析力学两种方法，描述质点、质点系和刚体的运动规律。',
        keyPoints: [
          '静力学：研究物体平衡条件与受力分析',
          '运动学：描述物体运动的几何性质，不涉及力',
          '动力学：研究力与运动变化的关系',
          '分析力学：拉格朗日方程和哈密顿原理'
        ]
      },
      theory: {
        title: '核心理论与方程',
        content: [
          {
            subtitle: '牛顿运动定律',
            text: '牛顿三定律是经典力学的基础，描述了力与运动的基本关系。',
            formula: 'F = ma = m(d²r/dt²)'
          },
          {
            subtitle: '拉格朗日方程',
            text: '分析力学的核心方程，通过广义坐标和能量函数描述系统运动，适用于复杂约束系统。',
            formula: 'd/dt(∂L/∂q̇ᵢ) - ∂L/∂qᵢ = Qᵢ'
          },
          {
            subtitle: '哈密顿正则方程',
            text: '通过广义坐标和广义动量描述系统演化，是量子力学和统计力学的基础。',
            formula: 'q̇ᵢ = ∂H/∂pᵢ, ṗᵢ = -∂H/∂qᵢ'
          },
          {
            subtitle: '动量定理与动量矩定理',
            text: '描述系统动量和角动量变化与外力的关系，是轨道和姿态动力学的基础。',
            formula: 'dp/dt = F, dL/dt = M'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '轨道动力学分析',
            description: '应用牛顿万有引力定律和运动方程计算卫星轨道，进行轨道设计和机动规划。',
            tech: '开普勒定律、二体问题、轨道根数'
          },
          {
            name: '飞行器姿态动力学',
            description: '使用欧拉方程描述航天器姿态运动，为姿态控制系统设计提供模型。',
            tech: '刚体动力学、欧拉角、四元数'
          },
          {
            name: '机构运动分析',
            description: '分析起落架收放机构、太阳能帆板展开机构的运动学和动力学特性。',
            tech: '约束系统、虚位移原理、达朗贝尔原理'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '多体系统动力学',
            content: '研究多个刚体和柔性体通过约束连接的系统动力学，应用于大型空间结构、机器人系统。'
          },
          {
            name: '非线性动力学与混沌',
            content: '研究非线性系统的复杂运动行为，如航天器姿态混沌运动、轨道混沌转移。'
          },
          {
            name: '分析力学在现代物理中的应用',
            content: '拉格朗日和哈密顿力学是量子力学、相对论、场论的数学基础。'
          }
        ],
        papers: [
          '《Classical Mechanics》- Herbert Goldstein',
          '《Analytical Mechanics》- Grant R. Fowles',
          '《理论力学教程》- 周衍柏'
        ]
      },
      model3D: 'pendulum'
    },
    '固体力学': {
      title: '固体力学',
      subtitle: '研究固体材料变形、强度和失效的学科',
      overview: {
        description: '固体力学研究固体材料在外力作用下的应力、应变、位移响应，以及强度、刚度和稳定性问题。它是飞行器结构设计、强度校核和寿命评估的理论基础。',
        keyPoints: [
          '弹性力学：研究可恢复变形的应力应变关系',
          '塑性力学：研究永久变形和屈服行为',
          '断裂力学：研究裂纹扩展和断裂失效',
          '疲劳力学：研究循环载荷下的损伤累积',
          '复合材料力学：研究各向异性材料的力学行为'
        ]
      },
      theory: {
        title: '核心理论与方程',
        content: [
          {
            subtitle: '胡克定律与广义胡克定律',
            text: '描述线弹性材料的应力应变关系，是弹性力学的基础。',
            formula: 'σ = Eε, τ = Gγ'
          },
          {
            subtitle: '平衡微分方程',
            text: '描述物体内部应力分布与体积力的平衡关系。',
            formula: '∂σₓ/∂x + ∂τₓᵧ/∂y + ∂τₓz/∂z + X = 0'
          },
          {
            subtitle: '冯·米塞斯屈服准则',
            text: '判断金属材料是否进入塑性状态的常用准则。',
            formula: 'σₑ = √[(σ₁-σ₂)² + (σ₂-σ₃)² + (σ₃-σ₁)²]/√2'
          },
          {
            subtitle: 'Paris 裂纹扩展公式',
            text: '描述疲劳裂纹扩展速率与应力强度因子幅值的关系。',
            formula: 'da/dN = C(ΔK)ᵐ'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '机翼结构强度分析',
            description: '计算机翼在气动载荷作用下的应力分布，确保满足强度要求。',
            tech: '有限元分析、应力集中、强度校核'
          },
          {
            name: '发动机涡轮叶片寿命评估',
            description: '考虑高温、高转速离心力和振动载荷，进行蠕变 - 疲劳交互作用分析。',
            tech: '高温力学、蠕变、疲劳寿命'
          },
          {
            name: '航天器结构轻量化设计',
            description: '在满足刚度和强度前提下，通过拓扑优化实现结构减重。',
            tech: '拓扑优化、复合材料、点阵结构'
          },
          {
            name: '热防护系统力学',
            description: '分析再入飞行器热防护瓦在极端温度梯度下的热应力和失效模式。',
            tech: '热应力、热 - 力耦合、烧蚀力学'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '超材料力学',
            content: '设计具有负泊松比、负刚度等奇异力学性能的超材料，用于减振、吸能。'
          },
          {
            name: '多尺度力学',
            content: '从原子、分子、微观、介观到宏观的跨尺度力学行为关联。'
          },
          {
            name: '智能材料力学',
            content: '形状记忆合金、压电材料、磁致伸缩材料的力 - 电 - 磁耦合行为。'
          }
        ],
        papers: [
          '《Theory of Elasticity》- S.P. Timoshenko',
          '《Fracture Mechanics》- T.L. Anderson',
          '《复合材料力学》- 郑百哲'
        ]
      },
      model3D: 'beam'
    },
    '流体力学': {
      title: '流体力学',
      subtitle: '研究流体运动规律及其与固体相互作用的学科',
      overview: {
        description: '流体力学研究流体（液体和气体）的静止和运动规律，以及流体与固体边界的相互作用。它是空气动力学、推进系统、热防护等航空航天核心技术的理论基础。',
        keyPoints: [
          '流体静力学：研究静止流体的压力分布和浮力',
          '流体动力学：研究流体运动的控制方程和求解方法',
          '边界层理论：研究粘性流体在物面附近的流动特性',
          '湍流理论：研究不规则脉动流动的统计特性',
          '可压缩流体力学：研究高速流动的激波和膨胀波'
        ]
      },
      theory: {
        title: '核心理论与方程',
        content: [
          {
            subtitle: '纳维 - 斯托克斯方程',
            text: '描述粘性流体运动的基本方程，是流体力学的核心。',
            formula: 'ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u + ρg'
          },
          {
            subtitle: '连续性方程',
            text: '描述质量守恒，适用于任何流动。',
            formula: '∂ρ/∂t + ∇·(ρu) = 0'
          },
          {
            subtitle: '伯努利方程',
            text: '描述理想流体沿流线的能量守恒关系。',
            formula: 'p + ½ρV² + ρgh = constant'
          },
          {
            subtitle: '边界层动量积分方程',
            text: '描述边界层厚度增长与壁面摩擦的关系。',
            formula: 'dθ/dx + (2θ + δ*)/U · dU/dx = τw/ρU²'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '机翼气动设计',
            description: '通过 CFD 计算和风洞试验优化翼型，提升升阻比和失速特性。',
            tech: 'CFD、风洞试验、优化设计'
          },
          {
            name: '发动机进气道设计',
            description: '确保在各种飞行条件下进气道总压恢复系数和流场畸变满足要求。',
            tech: '内流场分析、激波控制、附面层吹除'
          },
          {
            name: '高超声速热防护',
            description: '分析激波层高温气体与防热材料的热化学相互作用。',
            tech: '高超声速流动、气动加热、烧蚀模型'
          },
          {
            name: '火箭尾焰流场分析',
            description: '计算火箭发射时尾焰对发射台的热冲击和声振环境。',
            tech: '多相流、燃烧、声振耦合'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '湍流直接数值模拟',
            content: '无需湍流模型，直接求解 N-S 方程获得湍流的全部尺度信息。'
          },
          {
            name: '微纳尺度流体力学',
            content: '研究微机电系统、微流控芯片中的稀薄气体效应和表面力主导流动。'
          },
          {
            name: '生物流体力学',
            content: '研究鸟类、昆虫飞行机理，为微型飞行器设计提供灵感。'
          }
        ],
        papers: [
          '《Fluid Mechanics》- Frank M. White',
          '《Boundary Layer Theory》- Hermann Schlichting',
          '《Computational Fluid Dynamics》- John D. Anderson'
        ]
      },
      model3D: 'airflow'
    },
    '计算力学': {
      title: '计算力学',
      subtitle: '以数值方法求解力学问题的交叉学科',
      overview: {
        description: '计算力学是力学、数学和计算机科学的交叉学科，通过数值方法求解力学偏微分方程，为工程问题提供定量分析工具。它已成为航空航天产品设计、性能预测和优化不可或缺的手段。',
        keyPoints: [
          '有限元法（FEM）：求解结构力学、固体力学问题',
          '有限体积法（FVM）：求解流体力学问题',
          '有限差分法（FDM）：早期数值方法，仍用于某些问题',
          '无网格法：避免网格畸变问题',
          '物理信息神经网络（PINNs）：深度学习与物理方程融合'
        ]
      },
      theory: {
        title: '核心理论与方法',
        content: [
          {
            subtitle: '有限元弱形式',
            text: '将微分方程转化为积分形式，通过分片插值函数离散求解。',
            formula: '∫Ω(∇w·σ - w·b)dΩ - ∫Γw·t̄dΓ = 0'
          },
          {
            subtitle: '有限体积离散',
            text: '在控制体上积分守恒方程，保证局部守恒性。',
            formula: '∂/∂t∫VUdV + ∮S F·ndS = ∫VQdV'
          },
          {
            subtitle: '时间积分格式',
            text: '显式和隐式格式的选择影响稳定性和计算效率。',
            formula: 'uⁿ⁺¹ = uⁿ + Δt·f(uⁿ) [显式欧拉]'
          },
          {
            subtitle: '误差估计与自适应',
            text: '通过后验误差估计指导网格自适应加密。',
            formula: '||e|| ≤ C·hᵖ·|u|Hᵖ⁺¹'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '全机结构强度分析',
            description: '建立整机有限元模型，计算极限载荷和损伤容限。',
            tech: '大型 FEM 模型、非线性分析、并行计算'
          },
          {
            name: 'CFD 气动优化',
            description: '结合伴随方法或代理模型进行外形气动优化。',
            tech: 'RANS/LES、伴随方法、贝叶斯优化'
          },
          {
            name: '流固耦合分析',
            description: '计算机翼颤振、贮箱液固耦合、气动弹性问题。',
            tech: '分区/整体耦合、时间同步、数据传递'
          },
          {
            name: '多物理场耦合仿真',
            description: '热 - 力 - 流 - 电多场耦合分析，如发动机叶片、电子设备散热。',
            tech: '多场耦合、协同仿真、降阶模型'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '等几何分析',
            content: '使用 NURBS 等 CAD 精确几何描述进行有限元分析，消除几何离散误差。'
          },
          {
            name: '机器学习辅助计算力学',
            content: '使用深度学习加速本构模型、湍流模型、降阶模型。'
          },
          {
            name: '量子计算在力学中的应用',
            content: '探索量子算法求解线性方程组、优化问题的潜力。'
          }
        ],
        papers: [
          '《The Finite Element Method》- O.C. Zienkiewicz',
          '《Computational Fluid Dynamics》- T.J. Chung',
          '《计算固体力学》- 钟万勰'
        ]
      },
      model3D: 'mesh'
    },
    '飞行力学': {
      title: '飞行力学',
      subtitle: '研究飞行器运动与控制的综合学科',
      overview: {
        description: '飞行力学是研究飞行器在大气层内外运动规律和操纵特性的学科，综合运用理论力学、空气动力学、自动控制等知识，为飞行器设计、飞行控制和任务规划提供理论基础。',
        keyPoints: [
          '飞行性能：航程、航时、升限、爬升率等',
          '稳定性：静稳定性和动稳定性分析',
          '操纵性：舵面效率、响应特性',
          '轨迹优化：最优飞行剖面和制导律',
          '任务仿真：六自由度仿真和人在回路'
        ]
      },
      theory: {
        title: '核心理论与方程',
        content: [
          {
            subtitle: '六自由度运动方程',
            text: '描述飞行器质心运动和绕质心转动的完整动力学方程。',
            formula: 'm(dV/dt + ω×V) = F, I(dω/dt) + ω×(Iω) = M'
          },
          {
            subtitle: '小扰动线性化方程',
            text: '在基准飞行状态附近线性化，得到纵向和横侧向小扰动方程。',
            formula: 'Δu̇ = XuΔu + XwΔw + XqΔq - gΔθ'
          },
          {
            subtitle: '传递函数与状态空间',
            text: '描述输入输出关系的频域和时域方法。',
            formula: 'G(s) = C(sI-A)⁻¹B + D'
          },
          {
            subtitle: '最优控制理论',
            text: '求解性能指标最优的控制律，如庞特里亚金极小值原理。',
            formula: 'H = L + λTf, λ̇ = -∂H/∂x'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '飞机操稳特性分析',
            description: '计算纵向和横侧向模态，评估短周期、长周期、荷兰滚等特性。',
            tech: '特征值分析、根轨迹、频域响应'
          },
          {
            name: '导弹弹道设计',
            description: '设计主动段、中段和末段弹道，优化射程和精度。',
            tech: '弹道优化、制导律、灵敏度分析'
          },
          {
            name: '再入飞行器制导',
            description: '设计再入走廊和制导律，满足热流、过载和落点精度约束。',
            tech: '预测校正制导、滑模制导、凸优化'
          },
          {
            name: '无人机航迹规划',
            description: '在威胁环境和燃油约束下规划最优飞行路径。',
            tech: 'A*算法、RRT、模型预测控制'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '高超声速飞行力学',
            content: '研究高超声速飞行器的气动 - 推进 - 控制一体化设计和飞行力学特性。'
          },
          {
            name: '智能飞行控制',
            content: '应用强化学习、自适应控制实现复杂环境下的自主飞行。'
          },
          {
            name: '分布式飞行器编队',
            content: '多飞行器协同飞行的编队控制、碰撞规避和任务分配。'
          }
        ],
        papers: [
          '《Flight Dynamics》- Robert F. Stengel',
          '《Aircraft Control and Simulation》- Brian L. Stevens',
          '《飞行力学》- 陈士橹'
        ]
      },
      model3D: 'rocket'
    },
    '材料工程': {
      title: '材料工程',
      subtitle: '为航空航天提供高性能材料支撑',
      overview: {
        description: '材料工程研究材料的成分、组织、工艺与性能的关系，为航空航天装备提供轻量化、高强度、耐高温、抗辐射的先进材料。材料是航空航天技术发展的物质基础。',
        keyPoints: [
          '高温合金：航空发动机涡轮叶片材料',
          '复合材料：碳纤维增强树脂/金属基复合材料',
          '陶瓷基复合材料：高超声速防热结构',
          '智能材料：形状记忆合金、压电材料',
          '增材制造材料：3D 打印专用粉末'
        ]
      },
      theory: {
        title: '核心理论与原理',
        content: [
          {
            subtitle: '相图与相变',
            text: '描述材料成分、温度与相组成的关系，指导合金设计。',
            formula: 'Gibbs 相律：F = C - P + 2'
          },
          {
            subtitle: '扩散方程',
            text: '描述原子扩散动力学过程。',
            formula: 'Fick 第二定律：∂C/∂t = D∂²C/∂x²'
          },
          {
            subtitle: '断裂韧性',
            text: '材料抵抗裂纹扩展的能力。',
            formula: 'KIC = Yσ√(πa)'
          },
          {
            subtitle: '复合材料混合法则',
            text: '预测复合材料宏观性能。',
            formula: 'Ec = VfEf + VmEm'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '航空发动机单晶叶片',
            description: '使用镍基单晶高温合金，消除晶界，提高高温蠕变性能。',
            tech: '定向凝固、单晶生长、热障涂层'
          },
          {
            name: '碳纤维复合材料机翼',
            description: '波音 787、空客 A350 机翼使用 CFRP，减重 20% 以上。',
            tech: '自动铺丝、热压罐成型、无损检测'
          },
          {
            name: '航天器防热瓦',
            description: '航天飞机使用陶瓷防热瓦承受再入时 1500°C 高温。',
            tech: '陶瓷基复合材料、烧蚀防热、隔热瓦'
          },
          {
            name: '火箭贮箱铝锂合金',
            description: '使用铝锂合金替代传统铝合金，减重 10%。',
            tech: '铝锂合金、搅拌摩擦焊、超塑成形'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '高熵合金',
            content: '五种以上元素等比例混合，具有高强度、高硬度、耐高温等优异性能。'
          },
          {
            name: '纳米材料',
            content: '碳纳米管、石墨烯增强复合材料，提升力学和功能性能。'
          },
          {
            name: '4D 打印智能材料',
            content: '3D 打印 + 时间维度，材料在外界刺激下发生形状变化。'
          }
        ],
        papers: [
          '《Materials Science and Engineering》- William D. Callister',
          '《Superalloys》- Roger C. Reed',
          '《航空航天材料》- 李成功'
        ]
      },
      model3D: 'crystal'
    },
    '控制工程': {
      title: '控制工程',
      subtitle: '实现飞行器精确操控与自主飞行',
      overview: {
        description: '控制工程研究如何使系统按照期望的方式运行。在航空航天领域，控制工程负责设计飞行控制系统、姿态控制系统、制导导航与控制系统（GNC），确保飞行器稳定、精确、安全地完成任务。',
        keyPoints: [
          '经典控制：PID 控制、频域分析',
          '现代控制：状态空间、最优控制、鲁棒控制',
          '智能控制：自适应控制、模糊控制、神经网络控制',
          '导航系统：惯性导航、卫星导航、组合导航',
          '执行机构：舵机、推力矢量、反作用轮'
        ]
      },
      theory: {
        title: '核心理论与方法',
        content: [
          {
            subtitle: '传递函数与频域分析',
            text: '通过拉普拉斯变换描述线性系统，使用伯德图、奈奎斯特图分析稳定性。',
            formula: 'G(s) = Y(s)/U(s)'
          },
          {
            subtitle: '状态空间方程',
            text: '描述多输入多输出系统的时域模型。',
            formula: 'ẋ = Ax + Bu, y = Cx + Du'
          },
          {
            subtitle: '线性二次型调节器',
            text: '求解最优状态反馈控制律。',
            formula: 'u = -Kx, K = R⁻¹BᵀP'
          },
          {
            subtitle: '卡尔曼滤波',
            text: '最优状态估计方法，用于导航系统。',
            formula: 'x̂ₖ = x̂ₖ⁻ + Kₖ(zₖ - Hx̂ₖ⁻)'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '飞机自动驾驶仪',
            description: '实现姿态保持、航向保持、高度保持、自动着陆等功能。',
            tech: 'PID 控制、增益调度、控制分配'
          },
          {
            name: '卫星姿态控制',
            description: '使用反作用轮、磁力矩器、推力器实现三轴稳定。',
            tech: '动量轮、磁控制、滑模控制'
          },
          {
            name: '火箭回收控制',
            description: 'SpaceX 猎鹰 9 号通过推力矢量控制和栅格舵实现垂直着陆。',
            tech: '推力矢量、轨迹优化、凸优化制导'
          },
          {
            name: '无人机自主飞行',
            description: '实现自主起降、航迹跟踪、编队飞行、避障。',
            tech: '模型预测控制、视觉导航、强化学习'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '数据驱动控制',
            content: '直接从数据学习控制律，无需精确建模。'
          },
          {
            name: '事件触发控制',
            content: '仅在必要时更新控制量，节省通信和计算资源。'
          },
          {
            name: '安全关键控制',
            content: '保证系统在安全集合内运行，避免碰撞和失效。'
          }
        ],
        papers: [
          '《Feedback Control of Dynamic Systems》- Gene F. Franklin',
          '《Optimal Control》- Brian D.O. Anderson',
          '《飞行控制系统》- 吴森堂'
        ]
      },
      model3D: 'satellite'
    },
    '制造工程': {
      title: '制造工程',
      subtitle: '将设计转化为可靠产品的关键技术',
      overview: {
        description: '制造工程研究如何将设计意图高效、精确、经济地转化为实际产品。航空航天制造工程涉及精密加工、复合材料成型、增材制造、装配工艺等，是保证产品质量和可靠性的关键环节。',
        keyPoints: [
          '精密加工：数控加工、超精密加工、特种加工',
          '复合材料制造：铺层、固化、连接',
          '增材制造：金属 3D 打印、连续纤维打印',
          '装配技术：自动钻铆、数字化装配',
          '质量检测：无损检测、在线监测'
        ]
      },
      theory: {
        title: '核心理论与原理',
        content: [
          {
            subtitle: '切削力学',
            text: '描述切削力、切削热、刀具磨损的机理。',
            formula: 'F = kc·A = kc·ap·f'
          },
          {
            subtitle: '复合材料固化动力学',
            text: '描述树脂固化过程中的温度、固化度变化。',
            formula: 'dα/dt = A·exp(-E/RT)·(1-α)ⁿ'
          },
          {
            subtitle: '增材制造热输入',
            text: '能量密度影响熔池尺寸和成形质量。',
            formula: 'E = P/(v·h·t)'
          },
          {
            subtitle: '尺寸链计算',
            text: '保证装配精度的公差分析。',
            formula: 'T₀ = ΣTi [极值法]'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '整体叶盘五轴加工',
            description: '航空发动机整体叶盘使用五轴联动数控加工，一次装夹完成复杂曲面。',
            tech: '五轴联动、刀具路径优化、在机检测'
          },
          {
            name: '复合材料自动铺丝',
            description: '使用自动铺丝机制造大型复合材料构件，如飞机机翼、火箭贮箱。',
            tech: '自动铺丝、在线压实、缺陷检测'
          },
          {
            name: '火箭发动机 3D 打印',
            description: 'SpaceX 使用 3D 打印制造猛禽发动机推力室，减少零件数量。',
            tech: '选区激光熔化、拓扑优化、一体化成形'
          },
          {
            name: '飞机数字化装配',
            description: '使用激光跟踪仪、自动定位器实现大部件精确对接。',
            tech: '激光测量、自动调姿、数字孪生'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '智能制造',
            content: '工业互联网、数字孪生、自适应加工、预测性维护。'
          },
          {
            name: '微纳制造',
            content: 'MEMS 传感器、微流控芯片、微纳卫星制造。'
          },
          {
            name: '可持续制造',
            content: '绿色制造、再制造、轻量化设计降低全生命周期能耗。'
          }
        ],
        papers: [
          '《Manufacturing Engineering and Technology》- Serope Kalpakjian',
          '《Additive Manufacturing Technologies》- Ian Gibson',
          '《航空制造工艺》- 李原'
        ]
      },
      model3D: 'printer'
    },
    '电子工程': {
      title: '电子工程',
      subtitle: '构建航空航天电子信息系统',
      overview: {
        description: '电子工程为航空航天装备提供电子硬件、嵌入式系统、通信导航、信号处理等核心能力。从星载计算机到飞控计算机，从雷达载荷到通信终端，电子工程是航空航天智能化的基础。',
        keyPoints: [
          '嵌入式系统：星载/机载计算机、飞控计算机',
          '射频与微波：雷达、通信、电子战',
          '传感器：惯性传感器、光学传感器、MEMS',
          '信号处理：图像处理、目标识别、数据融合',
          '电源管理：高效电源、功率电子'
        ]
      },
      theory: {
        title: '核心理论与方法',
        content: [
          {
            subtitle: '数字信号处理',
            text: '采样、滤波、变换、检测与估计。',
            formula: 'X[k] = Σx[n]e^(-j2πnk/N) [DFT]'
          },
          {
            subtitle: '通信原理',
            text: '调制解调、编码解码、信道容量。',
            formula: 'C = B·log₂(1+S/N)'
          },
          {
            subtitle: '天线理论',
            text: '辐射方向图、增益、极化。',
            formula: 'G = 4πA/λ²'
          },
          {
            subtitle: '控制硬件',
            text: '微处理器、FPGA、DSP 架构。',
            formula: '——'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '星载计算机',
            description: '航天器的大脑，要求高可靠、抗辐射、低功耗。',
            tech: '抗辐射加固、容错计算、实时操作系统'
          },
          {
            name: '相控阵雷达',
            description: '机载/星载 SAR 雷达，实现高分辨率成像。',
            tech: '相控阵、脉冲压缩、合成孔径'
          },
          {
            name: '惯性导航系统',
            description: '使用激光陀螺、光纤陀螺实现自主导航。',
            tech: '陀螺仪、加速度计、组合导航'
          },
          {
            name: '星间激光通信',
            description: '高速率、低时延的星间链路。',
            tech: '激光通信、APT 跟踪、编码调制'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '软件定义卫星',
            content: '通过软件重构实现功能在轨更新。'
          },
          {
            name: '量子导航',
            content: '使用原子干涉仪实现超高精度惯性测量。'
          },
          {
            name: '太赫兹通信',
            content: '超高速星地通信，速率可达 Tbps。'
          }
        ],
        papers: [
          '《Digital Signal Processing》- John G. Proakis',
          '《Communication Systems》- Simon Haykin',
          '《航空航天电子系统》- 杨小牛'
        ]
      },
      model3D: 'circuit'
    },
    '系统工程': {
      title: '系统工程',
      subtitle: '复杂航空航天项目的总体设计与集成',
      overview: {
        description: '系统工程是从整体出发，对复杂系统进行需求分析、设计综合、验证确认和运行维护的方法论。航空航天项目涉及众多学科和子系统，必须依靠系统工程实现整体优化。',
        keyPoints: [
          '需求工程：需求获取、分析、验证',
          '架构设计：功能架构、物理架构',
          '接口管理：机械、电气、信息接口',
          '可靠性工程：FMEA、FTA、可靠性增长',
          '项目管理：进度、成本、风险管理'
        ]
      },
      theory: {
        title: '核心理论与方法',
        content: [
          {
            subtitle: '系统生命周期模型',
            text: 'V 模型、瀑布模型、敏捷开发。',
            formula: '——'
          },
          {
            subtitle: '故障树分析',
            text: '自上而下分析系统失效模式。',
            formula: 'P(top) = ΣP(minimal cut set)'
          },
          {
            subtitle: '层次分析法',
            text: '多准则决策方法。',
            formula: 'A·w = λmax·w'
          },
          {
            subtitle: '可靠性框图',
            text: '串联、并联系统可靠性计算。',
            formula: 'Rseries = ΠRi, Rparallel = 1-Π(1-Ri)'
          }
        ]
      },
      applications: {
        title: '航空航天应用',
        cases: [
          {
            name: '载人航天工程',
            description: '神舟飞船、空间站工程涉及数万个零部件，需要系统工程管理。',
            tech: '总体设计、接口协调、可靠性保证'
          },
          {
            name: '大飞机研制',
            description: 'C919 涉及 200 多家供应商，需要全球协同和系统集成。',
            tech: '供应商管理、构型管理、适航取证'
          },
          {
            name: '卫星星座',
            description: '星链等巨型星座需要系统级优化设计。',
            tech: '星座设计、频率轨道资源、在轨管理'
          },
          {
            name: '发动机研制',
            description: '航空发动机是复杂系统，需要多学科设计优化。',
            tech: '多学科优化、试验验证、寿命管理'
          }
        ]
      },
      extensions: {
        title: '前沿与拓展',
        topics: [
          {
            name: '基于模型的系统工程',
            content: '使用 SysML 等建模语言进行形式化系统描述。'
          },
          {
            name: '数字孪生',
            content: '建立系统全生命周期数字模型，实现预测性维护。'
          },
          {
            name: '弹性系统设计',
            content: '设计能够应对不确定性和扰动的韧性系统。'
          }
        ],
        papers: [
          '《Systems Engineering Handbook》- INCOSE',
          '《Space Mission Engineering》- James R. Wertz',
          '《系统工程概论》- 汪应洛'
        ]
      },
      model3D: 'system'
    }
  };

  const currentTopic = mechanicsData[decodeURIComponent(topic)];

  // 3D 模型渲染
  useEffect(() => {
    if (!canvasRef.current || !currentTopic) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // 根据主题创建不同的 3D 模型
    let model;
    
    if (currentTopic.model3D === 'pendulum') {
      // 单摆模型
      const group = new THREE.Group();
      const rodGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
      const rodMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const rod = new THREE.Mesh(rodGeometry, rodMaterial);
      rod.position.y = -1.5;
      group.add(rod);
      
      const ballGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.y = -3;
      group.add(ball);
      
      model = group;
    } else if (currentTopic.model3D === 'beam') {
      // 梁模型
      const group = new THREE.Group();
      const beamGeometry = new THREE.BoxGeometry(4, 0.3, 0.5);
      const beamMaterial = new THREE.MeshPhongMaterial({ color: 0x607D8B });
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      group.add(beam);
      
      const supportGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.5);
      const support1 = new THREE.Mesh(supportGeometry, beamMaterial);
      support1.position.set(-1.5, -0.4, 0);
      group.add(support1);
      const support2 = new THREE.Mesh(supportGeometry, beamMaterial);
      support2.position.set(1.5, -0.4, 0);
      group.add(support2);
      
      model = group;
    } else if (currentTopic.model3D === 'airflow') {
      // 机翼绕流简化模型
      const group = new THREE.Group();
      const wingGeometry = new THREE.BoxGeometry(3, 0.1, 1);
      const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
      const wing = new THREE.Mesh(wingGeometry, wingMaterial);
      group.add(wing);
      
      // 流线
      for (let i = -2; i <= 2; i += 0.5) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-3, i, 0),
          new THREE.Vector3(-1, i + 0.2, 0),
          new THREE.Vector3(1, i + 0.2, 0),
          new THREE.Vector3(3, i, 0)
        ]);
        const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({ color: 0x2196F3, transparent: true, opacity: 0.6 });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        group.add(tube);
      }
      
      model = group;
    } else if (currentTopic.model3D === 'mesh') {
      // 网格模型
      const geometry = new THREE.IcosahedronGeometry(2, 1);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x4CAF50, 
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      model = new THREE.Mesh(geometry, material);
    } else if (currentTopic.model3D === 'rocket') {
      // 火箭模型
      const group = new THREE.Group();
      const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      const noseGeometry = new THREE.ConeGeometry(0.3, 1, 16);
      const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
      nose.position.y = 2;
      group.add(nose);
      
      const finGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.05);
      for (let i = 0; i < 4; i++) {
        const fin = new THREE.Mesh(finGeometry, new THREE.MeshPhongMaterial({ color: 0xFF5722 }));
        const angle = (i / 4) * Math.PI * 2;
        fin.position.set(Math.cos(angle) * 0.3, -1.2, Math.sin(angle) * 0.3);
        fin.rotation.y = angle;
        group.add(fin);
      }
      
      model = group;
    } else if (currentTopic.model3D === 'crystal') {
      // 晶体结构模型
      const group = new THREE.Group();
      const atomGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const atomMaterial = new THREE.MeshPhongMaterial({ color: 0x2196F3, metalness: 0.8 });
      
      for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
          for (let z = -1; z <= 1; z += 2) {
            const atom = new THREE.Mesh(atomGeometry, atomMaterial);
            atom.position.set(x, y, z);
            group.add(atom);
          }
        }
      }
      
      model = group;
    } else if (currentTopic.model3D === 'satellite') {
      // 卫星模型
      const group = new THREE.Group();
      const bodyGeometry = new THREE.BoxGeometry(1.5, 1.5, 2);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);
      
      const panelGeometry = new THREE.BoxGeometry(3, 0.05, 1.5);
      const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x1976D2 });
      const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel1.position.set(2, 0, 0);
      group.add(panel1);
      const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel2.position.set(-2, 0, 0);
      group.add(panel2);
      
      model = group;
    } else if (currentTopic.model3D === 'printer') {
      // 3D 打印机模型
      const group = new THREE.Group();
      const baseGeometry = new THREE.BoxGeometry(3, 0.2, 3);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x607D8B });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      group.add(base);
      
      const frameGeometry = new THREE.BoxGeometry(0.1, 4, 0.1);
      const frame1 = new THREE.Mesh(frameGeometry, baseMaterial);
      frame1.position.set(-1.5, 2, -1.5);
      group.add(frame1);
      const frame2 = new THREE.Mesh(frameGeometry, baseMaterial);
      frame2.position.set(1.5, 2, -1.5);
      group.add(frame2);
      const frame3 = new THREE.Mesh(frameGeometry, baseMaterial);
      frame3.position.set(-1.5, 2, 1.5);
      group.add(frame3);
      const frame4 = new THREE.Mesh(frameGeometry, baseMaterial);
      frame4.position.set(1.5, 2, 1.5);
      group.add(frame4);
      
      model = group;
    } else if (currentTopic.model3D === 'circuit') {
      // 电路板模型
      const group = new THREE.Group();
      const pcbGeometry = new THREE.BoxGeometry(3, 0.1, 4);
      const pcbMaterial = new THREE.MeshPhongMaterial({ color: 0x2E7D32 });
      const pcb = new THREE.Mesh(pcbGeometry, pcbMaterial);
      group.add(pcb);
      
      const chipGeometry = new THREE.BoxGeometry(1, 0.2, 1);
      const chipMaterial = new THREE.MeshPhongMaterial({ color: 0x212121 });
      const chip = new THREE.Mesh(chipGeometry, chipMaterial);
      chip.position.y = 0.15;
      group.add(chip);
      
      model = group;
    } else if (currentTopic.model3D === 'system') {
      // 系统框图模型
      const group = new THREE.Group();
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x2196F3 });
      
      const positions = [
        [0, 1.5, 0], [-1.5, 0, 0], [0, 0, 0], [1.5, 0, 0], [0, -1.5, 0]
      ];
      
      positions.forEach((pos, i) => {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(...pos);
        group.add(box);
        
        if (i > 0) {
          const lineGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
          const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
          const line = new THREE.Mesh(lineGeometry, lineMaterial);
          line.position.set(pos[0]/2, pos[1]/2, pos[2]/2);
          line.rotation.z = Math.atan2(pos[0], -pos[1]);
          group.add(line);
        }
      });
      
      model = group;
    } else {
      // 默认模型
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
      model = new THREE.Mesh(geometry, material);
    }

    scene.add(model);

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // 添加轨道控制
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      model.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 清理
    return () => {
      renderer.dispose();
      controls.dispose();
    };
  }, [currentTopic]);

  if (!currentTopic) {
    return (
      <div className="aerospace-mechanics-detail">
        <div className="error-message">
          <h2>主题未找到</h2>
          <Link to="/aerospace-detail" className="back-button">返回列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aerospace-mechanics-detail">
      {/* 顶部导航 */}
      <div className="mechanics-header">
        <Link to="/aerospace-detail" className="back-button">
          <i className="fa fa-arrow-left"></i> 返回列表
        </Link>
        <h1>{currentTopic.title}</h1>
        <p className="subtitle">{currentTopic.subtitle}</p>
      </div>

      {/* 主要内容区域 */}
      <div className="mechanics-content">
        {/* 左侧：3D 模型 */}
        <div className="mechanics-model-section">
          <div className="mechanics-model-container">
            <canvas ref={canvasRef}></canvas>
          </div>
          <p className="mechanics-model-hint">拖动鼠标旋转 | 滚轮缩放</p>
        </div>

        {/* 右侧：文档内容 */}
        <div className="mechanics-document-section">
          {/* 标签页 */}
          <div className="mechanics-tabs">
            <button
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              概述
            </button>
            <button
              className={activeTab === 'theory' ? 'active' : ''}
              onClick={() => setActiveTab('theory')}
            >
              核心理论
            </button>
            <button
              className={activeTab === 'applications' ? 'active' : ''}
              onClick={() => setActiveTab('applications')}
            >
              工程应用
            </button>
            <button
              className={activeTab === 'extensions' ? 'active' : ''}
              onClick={() => setActiveTab('extensions')}
            >
              前沿拓展
            </button>
          </div>

          {/* 标签页内容 */}
          <div className="mechanics-tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <p className="description">{currentTopic.overview.description}</p>
                <h3>核心要点</h3>
                <ul className="key-points">
                  {currentTopic.overview.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'theory' && (
              <div className="theory-content">
                <h3>{currentTopic.theory.title}</h3>
                {currentTopic.theory.content.map((item, index) => (
                  <div key={index} className="theory-item">
                    <h4>{item.subtitle}</h4>
                    <p>{item.text}</p>
                    {item.formula && item.formula !== '——' && (
                      <div className="formula-box">
                        <code>{item.formula}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="applications-content">
                <h3>{currentTopic.applications.title}</h3>
                {currentTopic.applications.cases.map((caseItem, index) => (
                  <div key={index} className="case-item">
                    <h4>{caseItem.name}</h4>
                    <p>{caseItem.description}</p>
                    <div className="tech-tags">
                      {caseItem.tech.split('、').map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'extensions' && (
              <div className="extensions-content">
                <h3>{currentTopic.extensions.title}</h3>
                {currentTopic.extensions.topics.map((topicItem, index) => (
                  <div key={index} className="extension-item">
                    <h4>{topicItem.name}</h4>
                    <p>{topicItem.content}</p>
                  </div>
                ))}
                <h3>推荐阅读</h3>
                <ul className="papers-list">
                  {currentTopic.extensions.papers.map((paper, index) => (
                    <li key={index}>{paper}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AerospaceMechanicsDetail;
