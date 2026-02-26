import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/aerospace.css';

function AerospaceDetailPage() {
  const [expandedAccordions, setExpandedAccordions] = useState({
    accordion1: true,
    accordion2: false,
    accordion3: false,
    accordion4: false,
    accordion5: false,
    accordion6: false
  });

  const toggleAccordion = (accordionId) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [accordionId]: !prev[accordionId]
    }));
  };

  // 核心研究方向数据
  const researchDirections = [
    {
      category: '气动与推进',
      subdivisions: '计算空气动力学、高超声速气动、航空发动机、火箭推进',
      coreTasks: '升阻特性、热防护、推力/效率优化'
    },
    {
      category: '飞行器设计',
      subdivisions: '总体设计、结构设计、隐身设计、智能飞行器',
      coreTasks: '构型优化、强度/刚度/寿命、低可探测、自主飞行'
    },
    {
      category: '动力学与控制',
      subdivisions: '轨道动力学、姿态动力学、飞控/制导、交会对接',
      coreTasks: '轨迹规划、姿态稳定、高精度机动'
    },
    {
      category: '空天信息',
      subdivisions: '导航与通信、遥感与载荷、测控与数传、AI感知',
      coreTasks: '定位授时、数据链、目标检测、在轨智能'
    },
    {
      category: '制造与材料',
      subdivisions: '精密制造、复合材料、增材制造、智能结构',
      coreTasks: '轻量化、高可靠、快速试制、健康监测'
    },
    {
      category: '生命保障与空间科学',
      subdivisions: '环控生保、空间医学、深空探测、在轨实验',
      coreTasks: '载人生存、空间环境适应、科学探测'
    }
  ];

  // 气动与推进算法数据
  const aerodynamicAlgorithms = [
    {
      algorithm: 'CFD核心求解',
      capability: '有限体积法（FVM）求解RANS/欧拉方程，用于亚/跨声速整机气动设计',
      bottleneck: '高超声速热化学非平衡流、激波-边界层耦合的高精度模拟'
    },
    {
      algorithm: '湍流模型',
      capability: 'k-ω SST、LES用于工程湍流模拟',
      bottleneck: '高雷诺数转捩、分离流的通用湍流模型；跨尺度耦合'
    },
    {
      algorithm: 'AI气动代理',
      capability: 'PINNs/ML代理模型加速流场预测与优化',
      bottleneck: '物理约束泛化性、少样本跨构型迁移；全链路AI设计闭环'
    },
    {
      algorithm: '发动机控制',
      capability: '模型预测控制（MPC）、健康管理（PHM）用于涡扇发动机',
      bottleneck: '组合循环发动机（TBCC/SABRE）模态切换控制；极端工况容错'
    }
  ];

  // 动力学与控制算法数据
  const dynamicsAlgorithms = [
    {
      algorithm: '轨道力学',
      capability: '二体轨道计算、摄动修正、引力弹弓规划',
      bottleneck: '多体系统（小行星、深空编队）高精度轨道预报；燃料最优全局规划'
    },
    {
      algorithm: '姿态控制',
      capability: '反作用轮+推力器的PID/滑模控制；大角度机动',
      bottleneck: '大柔性结构（巨型天线/薄膜）刚柔耦合控制；微扰动自适应抑制'
    },
    {
      algorithm: '制导与导航',
      capability: '捷联惯导+GPS融合；再入轨迹规划',
      bottleneck: '深空自主导航（星光/脉冲星）；高超声速黑障区通信与导航'
    },
    {
      algorithm: '集群控制',
      capability: '无人机编队避障、协同侦察',
      bottleneck: '异构集群自组织；强对抗环境下的鲁棒协同决策'
    }
  ];

  // 感知与信息处理算法数据
  const perceptionAlgorithms = [
    {
      algorithm: '目标检测与跟踪',
      capability: '无人机航拍YOLO/DETR；多目标关联（SORT/DeepSORT）',
      bottleneck: '低空强遮挡、高速运动目标的实时跟踪；小样本泛化'
    },
    {
      algorithm: '遥感解译',
      capability: '卫星图像分类、变化检测；AI农业/灾害监测',
      bottleneck: '高分辨率弱纹理目标识别；实时在轨智能处理'
    },
    {
      algorithm: '通信与组网',
      capability: '卫星通信TDMA/FDMA；星间激光通信',
      bottleneck: '空天地一体化异构组网；高动态高干扰下的自适应调制编码'
    }
  ];

  // 制造与优化算法数据
  const manufacturingAlgorithms = [
    {
      algorithm: '结构优化',
      capability: '拓扑优化（SIMP）、尺寸优化；复合材料铺层优化',
      bottleneck: '多尺度多目标（强度/重量/寿命/成本）协同优化；制造约束嵌入'
    },
    {
      algorithm: '增材制造',
      capability: '路径规划、工艺参数优化；缺陷检测',
      bottleneck: '超大尺寸金属件无变形打印；在线质量闭环控制'
    }
  ];

  // 核心力学分支数据
  const mechanicsBranches = [
    {
      branch: '理论力学',
      application: '轨道动力学、姿态动力学、机构运动学',
      equations: '牛顿-欧拉方程、拉格朗日方程、开普勒定律',
      painPoint: '多体耦合、大范围运动与柔性变形的耦合建模'
    },
    {
      branch: '固体力学',
      application: '结构强度、疲劳寿命、热防护、振动控制',
      equations: '胡克定律、弹性力学方程、断裂力学（Paris公式）、振动力学',
      painPoint: '极端温度（-270℃~2000℃）下的材料性能退化；疲劳裂纹扩展预测'
    },
    {
      branch: '流体力学',
      application: '空气动力学、发动机内流、热防护',
      equations: '纳维-斯托克斯（N-S）方程、欧拉方程、边界层理论、湍流理论',
      painPoint: '高超声速热化学非平衡流；激波与边界层相互作用的分离与烧蚀'
    },
    {
      branch: '计算力学',
      application: '数值仿真、结构优化、流固耦合',
      equations: '有限元法（FEM）、有限体积法（FVM）、无网格法、PINNs',
      painPoint: '计算效率与精度的平衡；跨尺度（分子→连续体）耦合模拟'
    },
    {
      branch: '飞行力学',
      application: '飞控设计、性能计算、操稳特性',
      equations: '六自由度方程、气动力模型、传递函数、状态空间方程',
      painPoint: '高超声速时变气动特性；大迎角非线性操稳'
    }
  ];

  // 工程学核心交叉知识点数据
  const engineeringFields = [
    {
      field: '材料工程',
      content: '高温合金、复合材料、智能材料、热防护材料',
      cases: '航空发动机涡轮叶片（镍基高温合金）；航天器防热瓦（陶瓷基复合材料）'
    },
    {
      field: '控制工程',
      content: '现代控制理论、最优控制、鲁棒控制、智能控制',
      cases: '无人机飞控（PID+自适应）；火箭回收（变推力控制）；发动机MPC'
    },
    {
      field: '制造工程',
      content: '精密加工、复合材料成型、增材制造、装配工艺',
      cases: 'C919大飞机复合材料机身；火箭箭体3D打印；卫星精密装配'
    },
    {
      field: '电子工程',
      content: '射频通信、集成电路、传感器、嵌入式系统',
      cases: '星载计算机；惯性导航系统（IMU）；激光通信终端'
    },
    {
      field: '系统工程',
      content: '总体设计、可靠性工程、全生命周期管理',
      cases: '长征火箭总体集成；空间站系统级协同；航空发动机PHM'
    }
  ];

  return (
    <div className="aerospace-page">
      {/* 返回链接 */}
      <Link to="/" className="back-link">
        <i className="fa fa-arrow-left"></i> 返回首页
      </Link>

      {/* 页面标题 */}
      <h1 className="page-title">航空航天领域知识体系</h1>

      {/* 1. 核心研究方向 */}
      <section id="direction" className="card">
        <div className="card-header">
          <h2>核心研究方向全景（按工程链路）</h2>
        </div>
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>一级方向</th>
                <th>二级细分</th>
                <th>核心任务</th>
              </tr>
            </thead>
            <tbody>
              {researchDirections.map((item, index) => (
                <tr key={index}>
                  <td><span className="tag">{item.category}</span></td>
                  <td>{item.subdivisions}</td>
                  <td>{item.coreTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. 关键算法 */}
      <section id="algorithm" className="card">
        <div className="card-header">
          <h2>关键算法体系</h2>
        </div>
        <div className="card-body">
          {/* 气动与推进算法 */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion('accordion1')}
            >
              <span>气动与推进算法</span>
              <span>{expandedAccordions.accordion1 ? '▲' : '▼'}</span>
            </div>
            {expandedAccordions.accordion1 && (
              <div className="accordion-content active">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>算法/模型</th>
                      <th>核心能力</th>
                      <th>应用瓶颈</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aerodynamicAlgorithms.map((item, index) => (
                      <tr key={index}>
                        <td>{item.algorithm}</td>
                        <td>{item.capability}</td>
                        <td>{item.bottleneck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 动力学与控制算法 */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion('accordion2')}
            >
              <span>动力学与控制算法</span>
              <span>{expandedAccordions.accordion2 ? '▲' : '▼'}</span>
            </div>
            {expandedAccordions.accordion2 && (
              <div className="accordion-content active">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>算法/模型</th>
                      <th>核心能力</th>
                      <th>应用瓶颈</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dynamicsAlgorithms.map((item, index) => (
                      <tr key={index}>
                        <td>{item.algorithm}</td>
                        <td>{item.capability}</td>
                        <td>{item.bottleneck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 感知与信息处理算法 */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion('accordion3')}
            >
              <span>感知与信息处理算法</span>
              <span>{expandedAccordions.accordion3 ? '▲' : '▼'}</span>
            </div>
            {expandedAccordions.accordion3 && (
              <div className="accordion-content active">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>算法/模型</th>
                      <th>核心能力</th>
                      <th>应用瓶颈</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perceptionAlgorithms.map((item, index) => (
                      <tr key={index}>
                        <td>{item.algorithm}</td>
                        <td>{item.capability}</td>
                        <td>{item.bottleneck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 制造与优化算法 */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion('accordion4')}
            >
              <span>制造与优化算法</span>
              <span>{expandedAccordions.accordion4 ? '▲' : '▼'}</span>
            </div>
            {expandedAccordions.accordion4 && (
              <div className="accordion-content active">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>算法/模型</th>
                      <th>核心能力</th>
                      <th>应用瓶颈</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manufacturingAlgorithms.map((item, index) => (
                      <tr key={index}>
                        <td>{item.algorithm}</td>
                        <td>{item.capability}</td>
                        <td>{item.bottleneck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. 力学与工程学核心知识点 */}
      <section id="mechanics" className="card">
        <div className="card-header">
          <h2>力学与工程学核心知识点（按学科体系）</h2>
        </div>
        <div className="card-body">
          {/* 核心力学分支 */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion('accordion5')}
            >
              <span>核心力学分支</span>
              <span>{expandedAccordions.accordion5 ? '▲' : '▼'}</span>
            </div>
            {expandedAccordions.accordion5 && (
              <div className="accordion-content active">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>力学分支</th>
                      <th>航空航天核心应用</th>
                      <th>关键方程/理论</th>
                      <th>工程痛点</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mechanicsBranches.map((item, index) => (
                      <tr key={index}>
                        <td>{item.branch}</td>
                        <td>{item.application}</td>
                        <td>{item.equations}</td>
                        <td>{item.painPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 工程学核心交叉知识点 */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion('accordion6')}
            >
              <span>工程学核心交叉知识点</span>
              <span>{expandedAccordions.accordion6 ? '▲' : '▼'}</span>
            </div>
            {expandedAccordions.accordion6 && (
              <div className="accordion-content active">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>工程领域</th>
                      <th>核心内容</th>
                      <th>航空航天应用案例</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engineeringFields.map((item, index) => (
                      <tr key={index}>
                        <td>{item.field}</td>
                        <td>{item.content}</td>
                        <td>{item.cases}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. 知识体系核心逻辑总结 */}
      <section id="summary" className="card">
        <div className="card-header">
          <h2>知识体系核心逻辑</h2>
        </div>
        <div className="card-body">
          <div className="summary-panel">
            <ul>
              <li><strong>底层基础</strong>：力学是航空航天的核心物理基础，涵盖理论力学、固体力学、流体力学、计算力学、飞行力学五大核心分支。</li>
              <li><strong>技术核心</strong>：算法是航空航天技术落地的关键工具，覆盖气动与推进、动力学与控制、感知与信息处理、制造与优化四大方向。</li>
              <li><strong>落地路径</strong>：工程学是力学与算法的交叉应用载体，包含材料、控制、制造、电子、系统工程五大核心领域。</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AerospaceDetailPage;
