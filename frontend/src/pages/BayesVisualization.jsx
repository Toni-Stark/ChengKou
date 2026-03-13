import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 导入各个可视化组件
import BayesTheoremVisualization from '../visualizations/BayesTheoremVisualization';
import NaiveBayesVisualization from '../visualizations/NaiveBayesVisualization';
import BayesianNetworkVisualization from '../visualizations/BayesianNetworkVisualization';
import MCMCVisualization from '../visualizations/MCMCVisualization';

const visualizationConfig = {
  'bayes-theorem': {
    title: '贝叶斯定理与贝叶斯推断',
    component: BayesTheoremVisualization,
    description: '贝叶斯定理描述了在已知某些条件下，事件发生的概率。贝叶斯推断是一种统计推断方法，通过先验概率和似然函数计算后验概率。',
    features: [
      '贝叶斯定理：P(A|B) = P(B|A)·P(A) / P(B)',
      '先验概率：事件发生前的初始概率',
      '似然函数：观测数据在给定参数下的概率',
      '后验概率：结合观测数据后更新的概率'
    ]
  },
  'naive-bayes': {
    title: '朴素贝叶斯分类器',
    component: NaiveBayesVisualization,
    description: '朴素贝叶斯基于贝叶斯定理，假设特征之间相互独立，通过先验概率和似然函数计算后验概率进行分类。',
    features: [
      '条件独立假设：特征之间相互独立',
      '多项式朴素贝叶斯：用于文本分类',
      '高斯朴素贝叶斯：假设特征服从正态分布',
      '应用：文本分类、垃圾邮件过滤、情感分析'
    ]
  },
  'bayesian-network': {
    title: '贝叶斯网络与概率图模型',
    component: BayesianNetworkVisualization,
    description: '贝叶斯网络是一种概率图模型，用有向无环图表示变量之间的条件依赖关系，可以进行概率推理和因果分析。',
    features: [
      '有向无环图（DAG）：节点表示变量，边表示依赖关系',
      '条件概率表（CPT）：每个节点的条件概率分布',
      '概率推理：计算边缘概率和条件概率',
      '应用：医疗诊断、风险评估、决策支持'
    ]
  },
  'mcmc': {
    title: '马尔可夫链蒙特卡洛方法（MCMC）',
    component: MCMCVisualization,
    description: 'MCMC是一类基于马尔可夫链的随机采样算法，用于从复杂的概率分布中抽样，广泛应用于贝叶斯推断。',
    features: [
      'Metropolis-Hastings算法：接受-拒绝采样',
      'Gibbs采样：逐个更新变量',
      '收敛诊断：判断采样是否达到平稳分布',
      '应用：贝叶斯参数估计、后验分布采样'
    ]
  }
};

function BayesVisualization() {
  const navigate = useNavigate();
  const { topic } = useParams();
  const config = visualizationConfig[topic] || visualizationConfig['bayes-theorem'];
  const VisualizationComponent = config.component;

  return (
    <div className="min-h-screen bg-journal-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/ai-detail')}
          className="mb-6 px-4 py-2 bg-journal-primary text-white rounded hover:bg-opacity-80 transition-colors"
        >
          ← 返回 AI 详情页
        </button>

        {/* 标题 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-journal-primary mb-2">
            {config.title}
          </h1>
          <p className="text-journal-muted">
            {config.description}
          </p>
        </div>

        {/* 3D 可视化容器 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <VisualizationComponent />
        </div>

        {/* 特性说明 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-journal-primary mb-4 text-xl">核心特性</h3>
          <ul className="space-y-3">
            {config.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-journal-highlight rounded-full mt-2 mr-3"></span>
                <span className="text-journal-muted">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BayesVisualization;
