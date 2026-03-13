import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入各个可视化组件
import CNNVisualization from '../visualizations/CNNVisualization';
import RNNVisualization from '../visualizations/RNNVisualization';
import GANVisualization from '../visualizations/GANVisualization';
import TransformerVisualization from '../visualizations/TransformerVisualization';
import RegularizationVisualization from '../visualizations/RegularizationVisualization';
import OptimizerVisualization from '../visualizations/OptimizerVisualization';
import LearningRateVisualization from '../visualizations/LearningRateVisualization';
import SelfSupervisedVisualization from '../visualizations/SelfSupervisedVisualization';
import GNNVisualization from '../visualizations/GNNVisualization';
import MetaLearningVisualization from '../visualizations/MetaLearningVisualization';

const visualizationConfig = {
  'cnn': {
    title: '卷积神经网络（CNN）及其变体',
    component: CNNVisualization,
    description: 'CNN 通过卷积核提取图像特征，具有局部连接和权值共享的特性。',
    features: [
      '卷积层：使用卷积核提取局部特征',
      '池化层：降低特征维度，增强鲁棒性',
      '全连接层：整合特征进行分类',
      '经典变体：LeNet、AlexNet、VGG、ResNet、Inception'
    ]
  },
  'rnn': {
    title: '循环神经网络（RNN）、LSTM、GRU',
    component: RNNVisualization,
    description: 'RNN 处理序列数据，LSTM 和 GRU 通过门控机制解决长期依赖问题。',
    features: [
      'RNN：循环连接处理序列信息',
      'LSTM：长短期记忆网络，包含遗忘门、输入门、输出门',
      'GRU：门控循环单元，简化的 LSTM 结构',
      '应用：自然语言处理、时间序列预测、语音识别'
    ]
  },
  'gan': {
    title: '生成对抗网络（GAN）',
    component: GANVisualization,
    description: 'GAN 由生成器和判别器组成，通过对抗训练生成逼真数据。',
    features: [
      '生成器：从噪声生成假样本',
      '判别器：区分真实样本和生成样本',
      '对抗训练：两者相互博弈，共同提升',
      '变体：DCGAN、StyleGAN、CycleGAN、Pix2Pix'
    ]
  },
  'transformer': {
    title: 'Transformer 架构',
    component: TransformerVisualization,
    description: 'Transformer 基于自注意力机制，并行处理序列数据，是现代 NLP 的基础。',
    features: [
      '自注意力机制：计算序列内部的关联性',
      '多头注意力：从多个角度捕获特征',
      '位置编码：保留序列位置信息',
      '应用：BERT、GPT、ViT、DALL-E'
    ]
  },
  'regularization': {
    title: '正则化（Dropout、BatchNorm）',
    component: RegularizationVisualization,
    description: '正则化技术防止过拟合，提高模型泛化能力。',
    features: [
      'Dropout：随机丢弃神经元，防止过拟合',
      'Batch Normalization：归一化批次数据，加速训练',
      'L1/L2 正则化：约束权重大小',
      'Early Stopping：提前停止训练'
    ]
  },
  'optimizer': {
    title: '优化器（Adam、RMSprop）',
    component: OptimizerVisualization,
    description: '优化器控制参数更新策略，影响训练速度和效果。',
    features: [
      'SGD：随机梯度下降，基础优化算法',
      'Momentum：加入动量，加速收敛',
      'Adam：自适应学习率，结合动量和 RMSprop',
      'RMSprop：自适应学习率，适合 RNN'
    ]
  },
  'learning-rate': {
    title: '学习率调度',
    component: LearningRateVisualization,
    description: '动态调整学习率，平衡训练速度和收敛精度。',
    features: [
      '固定学习率：简单但可能不够灵活',
      '阶梯衰减：按周期降低学习率',
      '余弦退火：平滑降低学习率',
      '预热策略：初期逐步增加学习率'
    ]
  },
  'self-supervised': {
    title: '自监督学习',
    component: SelfSupervisedVisualization,
    description: '从无标注数据中自动生成监督信号，减少标注成本。',
    features: [
      '对比学习：拉近相似样本，推远不同样本',
      '掩码预测：预测被遮挡的部分',
      '预训练-微调：先自监督预训练，再有监督微调',
      '应用：BERT、SimCLR、MoCo、MAE'
    ]
  },
  'gnn': {
    title: '图神经网络（GNN）',
    component: GNNVisualization,
    description: 'GNN 处理图结构数据，通过消息传递聚合邻居信息。',
    features: [
      '图卷积：在图上进行卷积操作',
      '消息传递：节点间传递和聚合信息',
      '图注意力：加权聚合邻居特征',
      '应用：社交网络、分子预测、推荐系统'
    ]
  },
  'meta-learning': {
    title: '元学习',
    component: MetaLearningVisualization,
    description: '元学习让模型学会如何学习，快速适应新任务。',
    features: [
      '少样本学习：从��量样本中快速学习',
      'MAML：模型无关的元学习算法',
      '度量学习：学习样本间的相似度',
      '应用：快速适应、迁移学习、个性化推荐'
    ]
  }
};

function DeepLearningVisualization() {
  const navigate = useNavigate();
  const { topic } = useParams();
  const config = visualizationConfig[topic] || visualizationConfig['cnn'];
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

export default DeepLearningVisualization;
