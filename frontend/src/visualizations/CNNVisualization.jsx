import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function CNNVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 场景设置
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // 相机
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 10, 15);

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // 创建 CNN 层结构
    const layers = [
      { width: 8, height: 8, depth: 0.5, color: 0x4CAF50, label: '输入层 (28x28)' },
      { width: 6, height: 6, depth: 1, color: 0x2196F3, label: '卷积层1 (24x24x32)' },
      { width: 3, height: 3, depth: 1, color: 0xFF9800, label: '池化层1 (12x12x32)' },
      { width: 4, height: 4, depth: 1.5, color: 0x2196F3, label: '卷积层2 (8x8x64)' },
      { width: 2, height: 2, depth: 1.5, color: 0xFF9800, label: '池化层2 (4x4x64)' },
      { width: 1, height: 4, depth: 0.3, color: 0x9C27B0, label: '全连接层' },
      { width: 1, height: 2, depth: 0.3, color: 0xF44336, label: '输出层' }
    ];

    const layerSpacing = 3;
    let xOffset = -layers.length * layerSpacing / 2;

    layers.forEach((layer, index) => {
      // 创建层
      const geometry = new THREE.BoxGeometry(layer.width, layer.height, layer.depth);
      const material = new THREE.MeshPhongMaterial({
        color: layer.color,
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(xOffset, 0, 0);
      scene.add(mesh);

      // 添加边框
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      wireframe.position.copy(mesh.position);
      scene.add(wireframe);

      // 连接线到下一层
      if (index < layers.length - 1) {
        const nextX = xOffset + layerSpacing;
        const points = [
          new THREE.Vector3(xOffset + layer.width / 2, 0, 0),
          new THREE.Vector3(nextX - layers[index + 1].width / 2, 0, 0)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0x666666 }));
        scene.add(line);
      }

      xOffset += layerSpacing;
    });

    // 添加卷积核示例（小立方体）
    const kernelGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.2);
    const kernelMaterial = new THREE.MeshPhongMaterial({ color: 0xFFEB3B });
    const kernel = new THREE.Mesh(kernelGeometry, kernelMaterial);
    kernel.position.set(-8, 5, 2);
    scene.add(kernel);

    // 动画
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 卷积核移动动画
      kernel.position.x = -8 + Math.sin(time) * 2;
      kernel.rotation.y = time;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 窗口调整
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <div
        ref={mountRef}
        className="w-full rounded-lg overflow-hidden"
        style={{ height: '500px' }}
      />
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-journal-muted">
          <strong>可视化说明：</strong>展示了 CNN 的典型层次结构，从输入层经过多次卷积和池化，最后通过全连接层输出结果。
          黄色小方块代表卷积核在输入上滑动提取特征。
        </p>
      </div>
    </div>
  );
}

export default CNNVisualization;