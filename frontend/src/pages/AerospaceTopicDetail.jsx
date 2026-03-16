import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../styles/aerospace-topic.css';

function AerospaceTopicDetail() {
  const { topic } = useParams();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 主题数据
  const topicData = {
    '气动与推进': {
      title: '气动与推进',
      subtitle: '航空航天飞行器的动力核心',
      overview: {
        description: '气动与推进是航空航天工程的核心领域，研究飞行器在大气层内外的气动特性和推进系统设计。',
        keyPoints: [
          '计算流体力学（CFD）：通过数值模拟求解流体运动方程',
          '高超声速气动：研究马赫数>5的极端飞行条件',
          '航空发动机：涡扇、涡喷、涡轴等动力装置',
          '火箭推进：液体火箭、固体火箭、电推进技术'
        ]
      },
      theory: {
        title: '理论基础',
        content: [
          {
            subtitle: '流体力学基础',
            text: '纳维-斯托克斯方程（N-S方程）是流体力学的核心方程，描述了粘性流体的运动规律。',
            formula: '∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u + f'
          },
          {
            subtitle: '气动力学原理',
            text: '升力和阻力是飞行器设计的关键参数。升力系数CL和阻力系数CD决定了飞行性能。',
            formula: 'L = ½ρV²SCL, D = ½ρV²SCD'
          },
          {
            subtitle: '推进原理',
            text: '根据牛顿第三定律，推力等于单位时间内喷出气体的动量变化。',
            formula: 'F = ṁ(Ve - V0) + (Pe - P0)Ae'
          }
        ]
      },
      applications: {
        title: '工程应用',
        cases: [
          {
            name: 'CFD仿真优化',
            description: '使用ANSYS Fluent进行翼型气动优化，提升升阻比15%',
            tech: 'RANS方程、k-ω SST湍流模型、网格自适应'
          },
          {
            name: '高超声速飞行器',
            description: 'X-51A Waverider采用乘波体设计，实现Ma 5+巡航',
            tech: '激波骑乘、热防护、超燃冲压发动机'
          },
          {
            name: 'SpaceX猛禽发动机',
            description: '全流量分级燃烧循环，推力2200kN，比冲380s',
            tech: '甲烷燃料、3D打印、推力矢量控制'
          }
        ]
      },
      extensions: {
        title: '前沿拓展',
        topics: [
          {
            name: 'AI辅助气动设计',
            content: '使用深度学习代理模型加速CFD计算，训练时间从数周缩短到数小时'
          },
          {
            name: '等离子体流动控制',
            content: '通过等离子体激励器主动控制边界层分离，提升机动性'
          },
          {
            name: '组合循环发动机',
            content: 'SABRE发动机结合吸气式和火箭模式，实现单级入轨'
          }
        ],
        papers: [
          '《Computational Fluid Dynamics》- John D. Anderson',
          '《Gas Turbine Theory》- Saravanamuttoo',
          '《Rocket Propulsion Elements》- George P. Sutton'
        ]
      },
      model3D: 'turbine'
    },
    '飞行器设计': {
      title: '飞行器设计',
      subtitle: '从概念到实现的系统工程',
      overview: {
        description: '飞行器设计是一个多学科优化过程，需要综合考虑气动、结构、推进、控制等多个方面。',
        keyPoints: [
          '总体设计：确定飞行器构型、尺寸和性能指标',
          '结构设计：保证强度、刚度和轻量化',
          '隐身设计：降低雷达、红外特征',
          '智能飞行器：自主感知、决策和执行'
        ]
      },
      theory: {
        title: '理论基础',
        content: [
          {
            subtitle: '飞行器总体设计',
            text: '飞行器设计需要满足任务需求、性能约束和成本限制，是一个多目标优化问题。',
            formula: 'min f(x) s.t. g(x)≤0, h(x)=0'
          },
          {
            subtitle: '结构力学',
            text: '结构设计需要满足强度、刚度和稳定性要求，同时追求轻量化。',
            formula: 'σ = F/A ≤ [σ], δ = FL³/3EI ≤ [δ]'
          }
        ]
      },
      applications: {
        title: '工程应用',
        cases: [
          {
            name: 'F-22隐身战斗机',
            description: '采用菱形截面、锯齿边缘和吸波涂层，RCS<0.0001m²',
            tech: '隐身外形、复合材料、推力矢量'
          },
          {
            name: 'C919大型客机',
            description: '国产大飞机，采用超临界翼型和复合材料，降低油耗12%',
            tech: '超临界翼、复合材料机身、FADEC'
          }
        ]
      },
      extensions: {
        title: '前沿拓展',
        topics: [
          {
            name: '拓扑优化',
            content: '使用SIMP方法进行结构优化，在保证强度的前提下减重30%'
          },
          {
            name: '数字孪生',
            content: '建立飞行器全生命周期数字模型，实现预测性维护'
          }
        ],
        papers: [
          '《Aircraft Design: A Conceptual Approach》- Daniel P. Raymer',
          '《Fundamentals of Aircraft Structural Analysis》- Howard D. Curtis'
        ]
      },
      model3D: 'aircraft'
    }
  };

  // 添加更多主题数据...
  const allTopics = {
    ...topicData,
    '动力学与控制': {
      title: '动力学与控制',
      subtitle: '精确控制飞行器姿态与轨迹',
      overview: {
        description: '动力学与控制研究飞行器的运动规律和控制方法，是实现精确飞行的关键。',
        keyPoints: [
          '轨道动力学：研究飞行器在引力场中的运动',
          '姿态动力学：研究飞行器的旋转运动',
          '飞行控制：设计控制律实现期望的飞行状态',
          '制导技术：规划最优飞行轨迹'
        ]
      },
      theory: {
        title: '理论基础',
        content: [
          {
            subtitle: '轨道力学',
            text: '开普勒定律描述了天体运动的基本规律，是轨道设计的基础。',
            formula: 'r = a(1-e²)/(1+e·cosθ)'
          },
          {
            subtitle: '姿态动力学',
            text: '欧拉方程描述了刚体的旋转运动。',
            formula: 'Iω̇ + ω×(Iω) = M'
          }
        ]
      },
      applications: {
        title: '工程应用',
        cases: [
          {
            name: 'SpaceX火箭回收',
            description: '通过推力矢量控制和网格舵实现垂直着陆',
            tech: 'PID控制、推力矢量、姿态传感器'
          },
          {
            name: '天问一号火星探测',
            description: '自主导航、精确着陆，误差<100m',
            tech: '光学导航、惯性导航、地形匹配'
          }
        ]
      },
      extensions: {
        title: '前沿拓展',
        topics: [
          {
            name: '强化学习控制',
            content: '使用DQN训练火箭着陆控制器，超越传统PID性能'
          },
          {
            name: '集群协同控制',
            content: '无人机编队飞行，实现分布式协同决策'
          }
        ],
        papers: [
          '《Orbital Mechanics for Engineering Students》- Howard D. Curtis',
          '《Spacecraft Dynamics and Control》- Marcel J. Sidi'
        ]
      },
      model3D: 'satellite'
    },
    '空天信息': {
      title: '空天信息',
      subtitle: '构建空天地一体化感知、通信与认知体系',
      overview: {
        description: '空天信息聚焦导航、通信、遥感、测控和智能载荷协同，是航天系统实现“看得见、传得回、算得动、用得上”的关键环节。',
        keyPoints: [
          '导航与定位：北斗、组合导航与高动态授时同步',
          '遥感与载荷：光学、SAR、高光谱等多模态对地观测',
          '测控与数传：星地链路、星间链路和任务调度体系',
          '在轨智能：边缘计算、目标识别与自主任务规划'
        ]
      },
      theory: {
        title: '理论基础',
        content: [
          {
            subtitle: '遥感成像与反演',
            text: '空天信息系统通过多源载荷获取目标辐射、纹理和时序特征，再结合反演模型生成地表参数、目标状态和变化信息。',
            formula: 'L = f(ρ, E, θ, λ)'
          },
          {
            subtitle: '通信与链路预算',
            text: '卫星通信链路设计需要综合考虑发射功率、自由空间损耗、天线增益和误码率，以保证高动态环境下的稳定数传。',
            formula: 'Pr = Pt + Gt + Gr - Lfs - Lsys'
          },
          {
            subtitle: '多源信息融合',
            text: '惯导、GNSS、视觉与遥感数据常采用滤波与图优化方法进行融合，以提升定位、识别和态势理解精度。',
            formula: 'x̂k = x̂k-1 + Kk(zk - Hx̂k-1)'
          }
        ]
      },
      applications: {
        title: '工程应用',
        cases: [
          {
            name: '高分遥感智能解译',
            description: '面向海洋监测、灾害评估和资源普查，构建从星上预处理到地面智能解译的一体化链路。',
            tech: '高分辨率遥感、变化检测、目标识别、时空数据融合'
          },
          {
            name: '北斗高精度时空服务',
            description: '利用卫星导航与增强系统提供厘米级定位和纳秒级授时，支撑航空航天任务协同与装备调度。',
            tech: 'GNSS增强、组合导航、完整性监测、授时同步'
          },
          {
            name: '星间激光通信网络',
            description: '通过高速低时延星间链路构建天地一体化信息通道，提高遥感数据回传与在轨协同效率。',
            tech: '激光通信、链路跟踪、星座组网、自主路由'
          }
        ]
      },
      extensions: {
        title: '前沿拓展',
        topics: [
          {
            name: '在轨智能计算',
            content: '将模型压缩、边缘推理和事件驱动处理部署到卫星平台，实现目标筛选、异常告警和优先回传。'
          },
          {
            name: '空天地一体化网络',
            content: '通过卫星互联网、临近空间平台和地面边缘节点协同，形成全域覆盖、按需组网的信息基础设施。'
          },
          {
            name: '遥感大模型',
            content: '面向多模态遥感数据构建基础模型，统一支撑分类、检测、变化分析和知识问答。'
          }
        ],
        papers: [
          '《Remote Sensing Digital Image Analysis》- John A. Richards',
          '《Satellite Communications Systems》- Gérard Maral',
          '《Principles of GNSS, Inertial, and Multisensor Integrated Navigation Systems》- Paul D. Groves'
        ]
      },
      model3D: 'satellite'
    },
    '制造与材料': {
      title: '制造与材料',
      subtitle: '以先进材料和制造工艺支撑高可靠航天装备',
      overview: {
        description: '制造与材料关注飞行器从原材料、构件成形到整机装配的全流程能力，是实现轻量化、高强度、高可靠和可批量制造的基础。',
        keyPoints: [
          '先进材料：高温合金、复合材料、陶瓷基与智能材料',
          '精密制造：高精度加工、装配与尺寸一致性控制',
          '增材制造：复杂内流道、轻量化结构和快速试制',
          '质量保障：无损检测、过程监测与寿命评估'
        ]
      },
      theory: {
        title: '理论基础',
        content: [
          {
            subtitle: '材料力学与失效',
            text: '航天构件服役环境复杂，设计时需综合考虑静强度、疲劳、蠕变、冲击和热循环等失效机理。',
            formula: 'σ = F/A,  Nf = f(Δσ, R, T)'
          },
          {
            subtitle: '复合材料层合设计',
            text: '复合材料通过铺层角度、层间界面和树脂体系设计实现定向承载，在减重和抗损伤之间寻求平衡。',
            formula: '[N M]T = [A B D][ε0 κ]T'
          },
          {
            subtitle: '增材制造过程控制',
            text: '金属增材制造需要控制热输入、熔池稳定性和残余应力，以避免孔隙、裂纹和变形等质量问题。',
            formula: 'Q = ηP/v'
          }
        ]
      },
      applications: {
        title: '工程应用',
        cases: [
          {
            name: '复合材料主承力结构',
            description: '在机翼、整流罩和卫星支撑结构中使用碳纤维复材，实现减重与刚度提升的协同优化。',
            tech: '自动铺丝、热压罐成型、层合板设计、无损检测'
          },
          {
            name: '发动机增材制造部件',
            description: '通过3D打印一体化成形复杂喷注器和冷却流道，缩短制造周期并降低零件数量。',
            tech: '金属增材制造、拓扑优化、熔池监测、后处理热处理'
          },
          {
            name: '热防护与耐高温材料',
            description: '面向再入返回和高超声速任务开发耐烧蚀、抗热震材料，保障极端热环境下的结构完整性。',
            tech: '陶瓷基复合材料、烧蚀防热、热结构一体化、寿命评估'
          }
        ]
      },
      extensions: {
        title: '前沿拓展',
        topics: [
          {
            name: '数字化制造闭环',
            content: '将设计仿真、制造执行、在线检测和工艺优化联通，形成面向航天复杂构件的数字闭环工厂。'
          },
          {
            name: '智能材料与结构健康监测',
            content: '在结构内嵌光纤传感、压电器件和自感知网络，实现状态识别、损伤定位和剩余寿命预测。'
          },
          {
            name: '可制造性驱动设计',
            content: '在概念设计阶段同步引入工艺、成本和装配约束，减少后期返工并提升工程落地效率。'
          }
        ],
        papers: [
          '《Composite Materials for Aircraft Structures》- Alan A. Baker',
          '《Additive Manufacturing Technologies》- Ian Gibson',
          '《Mechanical Behavior of Materials》- Norman E. Dowling'
        ]
      },
      model3D: 'aircraft'
    },
    '生命保障与空间科学': {
      title: '生命保障与空间科学',
      subtitle: '面向长期在轨驻留与深空探测的生存和科学体系',
      overview: {
        description: '生命保障与空间科学聚焦航天员生存环境构建、健康风险控制以及微重力和深空环境下的科学探索，是载人航天与深空任务持续推进的重要支柱。',
        keyPoints: [
          '环境控制与生命保障：空气、水、温湿度与废弃物闭环管理',
          '空间医学：失重、辐射、隔离环境对人体的影响评估与干预',
          '空间科学实验：微重力流体、材料、生物和基础物理研究',
          '深空任务支持：月球、火星及更远任务的人因与资源系统设计'
        ]
      },
      theory: {
        title: '理论基础',
        content: [
          {
            subtitle: '环境控制与生命保障系统',
            text: 'ECLSS需要在受限资源条件下维持舱内气体成分、水循环、热控制和污染物去除，实现长期稳定的生存支持。',
            formula: 'Rloop = Rwater + Rair + Rwaste'
          },
          {
            subtitle: '空间医学与辐射防护',
            text: '失重会引发骨量流失、肌肉萎缩和体液重分布，深空辐射则对神经系统、造血系统和生殖系统造成长期风险。',
            formula: 'D = E/m'
          },
          {
            subtitle: '微重力科学机理',
            text: '微重力环境下，对流减弱、沉降消失和界面效应增强，为流体、燃烧、晶体生长和生命过程研究提供独特条件。',
            formula: 'Bo = ΔρgL²/γ'
          }
        ]
      },
      applications: {
        title: '工程应用',
        cases: [
          {
            name: '空间站再生式生命保障',
            description: '通过再生水处理、二氧化碳去除和氧气补给系统支撑长期在轨驻留，提高资源循环利用率。',
            tech: 'ECLSS、水回收、CO2去除、热控管理'
          },
          {
            name: '航天员健康监测与干预',
            description: '结合可穿戴传感器、远程医学评估和运动处方管理，降低长期失重带来的健康风险。',
            tech: '生理监测、远程医疗、抗阻训练、风险评估'
          },
          {
            name: '微重力科学实验平台',
            description: '在轨开展材料凝固、蛋白结晶、燃烧与植物培养实验，为深空生存和基础科学提供数据支持。',
            tech: '微重力实验柜、自动化载荷、样本分析、科学数据管理'
          }
        ]
      },
      extensions: {
        title: '前沿拓展',
        topics: [
          {
            name: '闭环生态生保系统',
            content: '通过植物栽培、微生物处理和资源再生构建更高闭合度的生命保障系统，服务月面和火星长期驻留。'
          },
          {
            name: '深空人因工程',
            content: '围绕孤立封闭、高时延通信和高风险决策环境，重构乘组协同、任务界面和心理支持体系。'
          },
          {
            name: '空间科学交叉研究',
            content: '将材料、生物、医学和天体科学实验数据融合，形成服务载人航天与深空探测的综合知识体系。'
          }
        ],
        papers: [
          '《Bioastronautics Data Book》- NASA',
          '《Fundamentals of Space Medicine》- Gilles Clément',
          '《Spacecraft Systems Engineering》- Peter Fortescue'
        ]
      },
      model3D: 'satellite'
    }
  };

  const currentTopic = allTopics[decodeURIComponent(topic)];

  // 3D模型渲染
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

    // 根据主题创建不同的3D模型
    let model;
    if (currentTopic.model3D === 'turbine') {
      // 涡轮发动机模型
      const group = new THREE.Group();

      // 外壳
      const shellGeometry = new THREE.CylinderGeometry(1.5, 1.2, 4, 32);
      const shellMaterial = new THREE.MeshPhongMaterial({
        color: 0x2196F3,
        metalness: 0.8,
        roughness: 0.2
      });
      const shell = new THREE.Mesh(shellGeometry, shellMaterial);
      group.add(shell);

      // 涡轮叶片
      for (let i = 0; i < 12; i++) {
        const bladeGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.5);
        const bladeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFEB3B });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        const angle = (i / 12) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8);
        blade.rotation.y = angle;
        group.add(blade);
      }

      model = group;
    } else if (currentTopic.model3D === 'aircraft') {
      // 飞机模型
      const group = new THREE.Group();

      // 机身
      const fuselageGeometry = new THREE.CylinderGeometry(0.3, 0.2, 4, 16);
      const fuselageMaterial = new THREE.MeshPhongMaterial({ color: 0x607D8B });
      const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
      fuselage.rotation.z = Math.PI / 2;
      group.add(fuselage);

      // 机翼
      const wingGeometry = new THREE.BoxGeometry(6, 0.1, 1.5);
      const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x9E9E9E });
      const wing = new THREE.Mesh(wingGeometry, wingMaterial);
      wing.position.y = 0;
      group.add(wing);

      // 尾翼
      const tailGeometry = new THREE.BoxGeometry(2, 0.8, 0.1);
      const tail = new THREE.Mesh(tailGeometry, wingMaterial);
      tail.position.set(-1.8, 0.4, 0);
      group.add(tail);

      model = group;
    } else {
      // 卫星模型
      const group = new THREE.Group();

      // 主体
      const bodyGeometry = new THREE.BoxGeometry(1.5, 1.5, 2);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);

      // 太阳能板
      const panelGeometry = new THREE.BoxGeometry(3, 0.05, 1.5);
      const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x1976D2 });
      const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel1.position.set(2, 0, 0);
      group.add(panel1);
      const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel2.position.set(-2, 0, 0);
      group.add(panel2);

      model = group;
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
      <div className="aerospace-topic-detail">
        <div className="error-message">
          <h2>主题未找到</h2>
          <Link to="/aerospace-detail" className="back-button">返回列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aerospace-topic-detail">
      {/* 顶部导航 */}
      <div className="topic-header">
        <Link to="/aerospace-detail" className="back-button">
          <i className="fa fa-arrow-left"></i> 返回列表
        </Link>
        <h1>{currentTopic.title}</h1>
        <p className="subtitle">{currentTopic.subtitle}</p>
      </div>

      {/* 主要内容区域 */}
      <div className="topic-content">
        {/* 左侧：3D模型 */}
        <div className="model-section">
          <div className="model-container">
            <canvas ref={canvasRef}></canvas>
          </div>
          <p className="model-hint">拖动鼠标旋转 | 滚轮缩放</p>
        </div>

        {/* 右侧：文档内容 */}
        <div className="document-section">
          {/* 标签页 */}
          <div className="tabs">
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
              理论基础
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
          <div className="tab-content">
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
                    {item.formula && (
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
                {currentTopic.extensions.topics.map((topic, index) => (
                  <div key={index} className="extension-item">
                    <h4>{topic.name}</h4>
                    <p>{topic.content}</p>
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

export default AerospaceTopicDetail;
