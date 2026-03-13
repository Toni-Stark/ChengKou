import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function NeuralNetworkVisualization() {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const [activeTab, setActiveTab] = useState('network');

  useEffect(() => {
    if (!mountRef.current) return;

    // 场景设置
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // 相机设置
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    // 渲染器设置
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // 创建神经网络层
    const createNeuralNetwork = () => {
      const layers = [4, 6, 6, 3]; // 输入层、隐藏层1、隐藏层2、输出层
      const layerSpacing = 5;
      const neuronSpacing = 2;
      const neurons = [];
      const connections = [];

      layers.forEach((neuronCount, layerIndex) => {
        const layerNeurons = [];
        const xPos = (layerIndex - layers.length / 2) * layerSpacing;

        for (let i = 0; i < neuronCount; i++) {
          const yPos = (i - neuronCount / 2) * neuronSpacing;

          // 创建神经元球体
          const geometry = new THREE.SphereGeometry(0.3, 32, 32);
          const material = new THREE.MeshPhongMaterial({
            color: layerIndex === 0 ? 0x4CAF50 : layerIndex === layers.length - 1 ? 0xF44336 : 0x2196F3,
            emissive: 0x222222,
            shininess: 100
          });
          const sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(xPos, yPos, 0);
          scene.add(sphere);
          layerNeurons.push(sphere);

          // 创建连接线
          if (layerIndex > 0) {
            neurons[layerIndex - 1].forEach(prevNeuron => {
              const points = [prevNeuron.position, sphere.position];
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
              const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xcccccc,
                transparent: true,
                opacity: 0.3
              });
              const line = new THREE.Line(lineGeometry, lineMaterial);
              scene.add(line);
              connections.push(line);
            });
          }
        }
        neurons.push(layerNeurons);
      });

      return { neurons, connections };
    };

    // 创建3D柱状图
    const createBarChart = () => {
      const data = [
        { label: '准确率', value: 0.95, color: 0x4CAF50 },
        { label: '召回率', value: 0.88, color: 0x2196F3 },
        { label: 'F1分数', value: 0.91, color: 0xFF9800 },
        { label: '精确率', value: 0.93, color: 0x9C27B0 }
      ];

      data.forEach((item, index) => {
        const height = item.value * 10;
        const geometry = new THREE.BoxGeometry(1.5, height, 1.5);
        const material = new THREE.MeshPhongMaterial({
          color: item.color,
          emissive: 0x222222
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set((index - data.length / 2) * 3, height / 2, 0);
        scene.add(bar);

        // 添加标签（使用简单的几何体代替文字）
        const labelGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const labelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set((index - data.length / 2) * 3, -0.5, 0);
        scene.add(label);
      });
    };

    // 创建梯度下降可视化
    const createGradientDescent = () => {
      // 创建损失函数曲面
      const size = 20;
      const segments = 50;
      const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
      const vertices = geometry.attributes.position.array;

      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        // 创建一个简单的抛物面
        vertices[i + 2] = (x * x + y * y) / 20 - 5;
      }

      geometry.computeVertexNormals();
      const material = new THREE.MeshPhongMaterial({
        color: 0x2196F3,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 0.7
      });
      const surface = new THREE.Mesh(geometry, material);
      surface.rotation.x = -Math.PI / 2;
      scene.add(surface);

      // 创建梯度下降路径
      const pathPoints = [];
      let x = 8, y = 8;
      for (let i = 0; i < 30; i++) {
        const z = (x * x + y * y) / 20 - 5;
        pathPoints.push(new THREE.Vector3(x, z + 0.1, y));
        x *= 0.85;
        y *= 0.85;
      }

      const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const pathMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 3 });
      const path = new THREE.Line(pathGeometry, pathMaterial);
      scene.add(path);

      // 添加当前位置标记
      const markerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000, emissive: 0xFF0000 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(pathPoints[0]);
      scene.add(marker);

      return { marker, pathPoints };
    };

    // 根据选项卡渲染不同内容
    let visualizationData;
    if (activeTab === 'network') {
      visualizationData = createNeuralNetwork();
    } else if (activeTab === 'chart') {
      createBarChart();
    } else if (activeTab === 'gradient') {
      visualizationData = createGradientDescent();
    }

    // 动画循环
    let animationFrame = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // 旋转场景
      if (activeTab === 'chart') {
        scene.rotation.y += 0.005;
      }

      // 梯度下降动画
      if (activeTab === 'gradient' && visualizationData) {
        const { marker, pathPoints } = visualizationData;
        const index = Math.floor(animationFrame / 10) % pathPoints.length;
        marker.position.copy(pathPoints[index]);
      }

      animationFrame++;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 窗口大小调整
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-journal-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-journal-primary text-white rounded hover:bg-opacity-80 transition-colors"
        >
          ← 返回首页
        </button>

        {/* 标题 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-journal-primary mb-2">
            深度学习核心机制可视化
          </h1>
          <p className="text-journal-muted">
            通过 Three.js 3D 可视化展示多层神经网络、反向传播和梯度下降算法
          </p>
        </div>

        {/* 选项卡 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'network'
                  ? 'text-journal-primary border-b-2 border-journal-primary bg-blue-50'
                  : 'text-gray-600 hover:text-journal-primary hover:bg-gray-50'
              }`}
            >
              多层神经网络
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'chart'
                  ? 'text-journal-primary border-b-2 border-journal-primary bg-blue-50'
                  : 'text-gray-600 hover:text-journal-primary hover:bg-gray-50'
              }`}
            >
              性能统计图
            </button>
            <button
              onClick={() => setActiveTab('gradient')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'gradient'
                  ? 'text-journal-primary border-b-2 border-journal-primary bg-blue-50'
                  : 'text-gray-600 hover:text-journal-primary hover:bg-gray-50'
              }`}
            >
              梯度下降
            </button>
          </div>
        </div>

        {/* 3D 可视化容器 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div
            ref={mountRef}
            className="w-full rounded-lg overflow-hidden"
            style={{ height: '600px' }}
          />

          {/* 说明文字 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-journal-primary mb-2">
              {activeTab === 'network' && '多层神经网络结构'}
              {activeTab === 'chart' && '模型性能指标'}
              {activeTab === 'gradient' && '梯度下降优化过程'}
            </h3>
            <p className="text-sm text-journal-muted">
              {activeTab === 'network' && '展示了一个典型的多层神经网络结构，包括输入层（绿色）、隐藏层（蓝色）和输出层（红色）。神经元之间的连接表示权重参数。'}
              {activeTab === 'chart' && '3D 柱状图展示了模型在测试集上的各项性能指标，包括准确率、召回率、F1分数和精确率。'}
              {activeTab === 'gradient' && '可视化展示了梯度下降算法在损失函数曲面上的优化路径，红色球体沿着梯度方向逐步移动到最优点。'}
            </p>
          </div>
        </div>

        {/* 技术说明 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-journal-primary mb-3">多层神经网络</h3>
            <p className="text-sm text-journal-muted mb-2">
              通过多层非线性变换，神经网络能够学习复杂的特征表示。
            </p>
            <ul className="text-sm text-journal-muted space-y-1">
              <li>• 输入层：接收原始数据</li>
              <li>• 隐藏层：特征提取与转换</li>
              <li>• 输出层：生成预测结果</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-journal-primary mb-3">反向传播</h3>
            <p className="text-sm text-journal-muted mb-2">
              通过链式法则计算梯度，从输出层向输入层传播误差信号。
            </p>
            <ul className="text-sm text-journal-muted space-y-1">
              <li>• 前向传播：计算预测值</li>
              <li>• 计算损失：评估误差</li>
              <li>• 反向传播：更新权重</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-journal-primary mb-3">梯度下降</h3>
            <p className="text-sm text-journal-muted mb-2">
              迭代优化算法，沿着损失函数梯度的反方向更新参数。
            </p>
            <ul className="text-sm text-journal-muted space-y-1">
              <li>• 学习率：控制步长大小</li>
              <li>• 批量大小：平衡速度与稳定性</li>
              <li>• 动量：加速收敛过程</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeuralNetworkVisualization;
