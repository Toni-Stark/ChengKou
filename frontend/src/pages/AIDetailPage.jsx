import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { researchAPI } from '../services/api';
import '../styles/ai-mindmap.css';

function AIDetailPage() {
  const navigate = useNavigate();
  const [mindMapData, setMindMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindMapData = async () => {
      try {
        const response = await researchAPI.getAIMindMap();
        setMindMapData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch AI mind map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMindMapData();
  }, []);

  // 恢复展开状态
  useEffect(() => {
    if (!mindMapData) return;

    // 延迟执行，确保 DOM 已渲染
    setTimeout(() => {
      const savedState = localStorage.getItem('ai-mindmap-state');
      if (savedState) {
        try {
          const openNodes = JSON.parse(savedState);
          openNodes.forEach(nodeId => {
            const collapsible = document.querySelector(`[data-target="${nodeId}"]`);
            const children = document.getElementById(nodeId);
            if (collapsible && children) {
              collapsible.classList.add('open');
              children.classList.add('open');
            }
          });
        } catch (error) {
          console.error('Failed to restore mindmap state:', error);
        }
      }
    }, 100);
  }, [mindMapData]);

  // 保存展开状态
  const saveState = () => {
    const openNodes = [];
    document.querySelectorAll('.collapsible.open').forEach(node => {
      const targetId = node.getAttribute('data-target');
      if (targetId) {
        openNodes.push(targetId);
      }
    });
    localStorage.setItem('ai-mindmap-state', JSON.stringify(openNodes));
  };

  const toggleNode = (e) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.classList.toggle('open');

    const targetId = target.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.classList.toggle('open');
    }

    // 保存状态
    saveState();
  };

  // 判断节点是否可点击跳转
  const isClickableNode = (title) => {
    const clickableNodes = [
      '多层神经网络', '反向传播', '梯度下降',
      '卷积神经网络（CNN）及其变体',
      '循环神经网络（RNN）、LSTM、GRU',
      '生成对抗网络（GAN）',
      'Transformer 架构',
      '正则化（Dropout、BatchNorm）',
      '优化器（Adam、RMSprop）',
      '学习率调度',
      '自监督学习',
      '图神经网络（GNN）',
      '元学习',
      '决策树与随机森林',
      '支持向量机（SVM）',
      'K近邻（KNN）',
      '朴素贝叶斯',
      '聚类算法（K-Means、DBSCAN等）',
      '降维方法（PCA、t-SNE等）',
      'Bagging',
      'Boosting（AdaBoost、GBDT、XGBoost）',
      'Q-learning',
      '策略梯度',
      '深度强化学习（DQN等）',
      '贝叶斯定理与贝叶斯推断',
      '朴素贝叶斯分类器',
      '贝叶斯网络与概率图模型',
      '马尔可夫链蒙特卡洛方法（MCMC）'
    ];
    return clickableNodes.includes(title);
  };

  // 节点标题到路由的映射
  const getRouteForNode = (title) => {
    const routeMap = {
      '多层神经网络': '/neural-network-visualization',
      '反向传播': '/neural-network-visualization',
      '梯度下降': '/neural-network-visualization',
      '卷积神经网络（CNN）及其变体': '/deep-learning/cnn',
      '循环神经网络（RNN）、LSTM、GRU': '/deep-learning/rnn',
      '生成对抗网络（GAN）': '/deep-learning/gan',
      'Transformer 架构': '/deep-learning/transformer',
      '正则化（Dropout、BatchNorm）': '/deep-learning/regularization',
      '优化器（Adam、RMSprop）': '/deep-learning/optimizer',
      '学习率调度': '/deep-learning/learning-rate',
      '自监督学习': '/deep-learning/self-supervised',
      '图神经网络（GNN）': '/deep-learning/gnn',
      '元学习': '/deep-learning/meta-learning',
      '决策树与随机森林': '/machine-learning/decision-tree',
      '支持向量机（SVM）': '/machine-learning/svm',
      'K近邻（KNN）': '/machine-learning/knn',
      '朴素贝叶斯': '/machine-learning/naive-bayes',
      '聚类算法（K-Means、DBSCAN等）': '/machine-learning/clustering',
      '降维方法（PCA、t-SNE等）': '/machine-learning/dimension-reduction',
      'Bagging': '/machine-learning/ensemble',
      'Boosting（AdaBoost、GBDT、XGBoost）': '/machine-learning/ensemble',
      'Q-learning': '/machine-learning/reinforcement-learning',
      '策略梯度': '/machine-learning/reinforcement-learning',
      '深度强化学习（DQN等）': '/machine-learning/reinforcement-learning',
      '贝叶斯定理与贝叶斯推断': '/bayes/bayes-theorem',
      '朴素贝叶斯分类器': '/bayes/naive-bayes',
      '贝叶斯网络与概率图模型': '/bayes/bayesian-network',
      '马尔可夫链蒙特卡洛方法（MCMC）': '/bayes/mcmc'
    };
    return routeMap[title] || '/';
  };

  // 处理节点点击
  const handleNodeClick = (e, title) => {
    if (isClickableNode(title)) {
      e.stopPropagation();
      navigate(getRouteForNode(title));
    }
  };

  const renderNode = (node, level = 1) => {
    const hasChildren = node.children && node.children.length > 0;
    const levelClass = `level-${level}`;
    const clickable = isClickableNode(node.title);

    return (
      <li key={node.id}>
        {hasChildren ? (
          <>
            <span
              className={`collapsible ${levelClass} ${node.defaultOpen ? 'open' : ''}`}
              data-target={`${node.id}-children`}
              onClick={toggleNode}
            >
              {node.title}
            </span>
            <ul
              id={`${node.id}-children`}
              className={`children ${node.defaultOpen ? 'open' : ''}`}
            >
              {node.children.map((child) => renderNode(child, level + 1))}
            </ul>
          </>
        ) : (
          <span
            className={clickable ? 'clickable-node' : ''}
            onClick={(e) => handleNodeClick(e, node.title)}
            style={clickable ? {
              color: '#2196F3',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500'
            } : {}}
          >
            {node.title}
          </span>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-journal-secondary flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-journal-secondary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-journal-highlight hover:text-blue-700 transition"
          >
            <i className="fa fa-arrow-left mr-2"></i>
            返回首页
          </Link>
        </div>

        {/* 主容器 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-journal-primary mb-8">
            人工智能核心概念关系导图
          </h1>

          {mindMapData && (
            <ul className="mind-map">
              {renderNode(mindMapData)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIDetailPage;
