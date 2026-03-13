import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 导入各个可视化组件
import DecisionTreeVisualization from '../visualizations/DecisionTreeVisualization';
import SVMVisualization from '../visualizations/SVMVisualization';
import KNNVisualization from '../visualizations/KNNVisualization';
import NaiveBayesVisualization from '../visualizations/NaiveBayesVisualization';
import ClusteringVisualization from '../visualizations/ClusteringVisualization';
import DimensionReductionVisualization from '../visualizations/DimensionReductionVisualization';
import EnsembleLearningVisualization from '../visualizations/EnsembleLearningVisualization';
import ReinforcementLearningVisualization from '../visualizations/ReinforcementLearningVisualization';

const visualizationConfig = {
  'decision-tree': {
    title: '决策树与随机森林',
    component: DecisionTreeVisualization,
    description: '决策树通过树形结构进行分类和回归，随机森林是多个决策树的集成。',
    features: [
      '树形结构：根节点、内部节点、叶子节点',
      '分裂标准：信息增益、基尼系数',
      '随机森林：Bagging + 特征随机选择',
      '优点：可解释性强，处理非线性关系'
    ]
  },
  'svm': {
    title: '支持向量机（SVM）',
    component: SVMVisualization,
    description: 'SVM 通过寻找最大间隔超平面来分类数据，支持向量是最接近边界的关键点。',
    features: [
      '最大间隔：最大化类别间的距离',
      '支持向量：决定边界的关键样本',
      '核技巧：处理非线性可分问题',
      '应用：文本分类、图像识别'
    ]
  },
  'knn': {
    title: 'K近邻（KNN）',
    component: KNNVisualization,
    description: 'KNN 基于距离度量，通过 K 个最近邻居的投票来分类新样本。',
    features: [
      '懒惰学习：不需要训练过程',
      '距离度量：欧氏距离、曼哈顿距离',
      'K 值选择：影响分类效果',
      '应用：推荐系统、异常检测'
    ]
  },
  'naive-bayes': {
    title: '朴素贝叶斯',
    component: NaiveBayesVisualization,
    description: '朴素贝叶斯基于贝叶斯定理，假设特征之间相互独立，通过先验概率和似然函数计算后验概率进行分类。',
    features: [
      '贝叶斯定理：P(A|B) = P(B|A)·P(A) / P(B)',
      '条件独立假设：特征之间相互独立',
      '先验概率：类别的初始概率',
      '应用：文本分类、垃圾邮件过滤'
    ]
  },
  'clustering': {
    title: '聚类算法（K-Means、DBSCAN等）',
    component: ClusteringVisualization,
    description: '聚类是无监督学习，将相似的数据点分组到同一簇中。',
    features: [
      'K-Means：基于距离的划分聚类',
      'DBSCAN：基于密度的聚类',
      '层次聚类：自底向上或自顶向下',
      '应用：客户分群、图像分割'
    ]
  },
  'dimension-reduction': {
    title: '降维方法（PCA、t-SNE等）',
    component: DimensionReductionVisualization,
    description: '降维将高维数据映射到低维空间，保留主要信息。',
    features: [
      'PCA：主成分分析，线性降维',
      't-SNE：非线性降维，保持局部结构',
      'UMAP：快速的流形学习方法',
      '应用：数据可视化、特征提取'
    ]
  },
  'ensemble': {
    title: '集成学习（Bagging、Boosting）',
    component: EnsembleLearningVisualization,
    description: '集成学习组合多个弱学习器，形成强学习器。',
    features: [
      'Bagging：并行训练，降低方差',
      'Boosting：串行训练，降低偏差',
      'AdaBoost、GBDT、XGBoost：经典算法',
      '应用：Kaggle 竞赛、工业预测'
    ]
  },
  'reinforcement-learning': {
    title: '强化学习',
    component: ReinforcementLearningVisualization,
    description: '强化学习通过与环境交互，学习最优策略以最大化累积奖励。',
    features: [
      'Q-learning：值函数学习',
      '策略梯度：直接优化策略',
      'DQN：深度 Q 网络',
      '应用：游戏 AI、机器人控制、自动驾驶'
    ]
  }
};

function MachineLearningVisualization() {
  const navigate = useNavigate();
  const { topic } = useParams();
  const config = visualizationConfig[topic] || visualizationConfig['decision-tree'];
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

export default MachineLearningVisualization;