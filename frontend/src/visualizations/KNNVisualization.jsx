import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function KNNVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 创建训练数据点（三类）
    const classes = [
      { color: 0x4CAF50, center: [-6, 0, -3], points: [] },
      { color: 0x2196F3, center: [6, 0, -3], points: [] },
      { color: 0xFF9800, center: [0, 0, 5], points: [] }
    ];

    classes.forEach(cls => {
      for (let i = 0; i < 20; i++) {
        const geo = new THREE.SphereGeometry(0.25, 16, 16);
        const mat = new THREE.MeshPhongMaterial({ color: cls.color });
        const point = new THREE.Mesh(geo, mat);
        point.position.set(
          cls.center[0] + (Math.random() - 0.5) * 4,
          cls.center[1] + (Math.random() - 0.5) * 4,
          cls.center[2] + (Math.random() - 0.5) * 4
        );
        scene.add(point);
        cls.points.push(point);
      }
    });

    // 测试点（大球，黄色）
    const testGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const testMat = new THREE.MeshPhongMaterial({
      color: 0xFFEB3B,
      emissive: 0xFFEB3B
    });
    const testPoint = new THREE.Mesh(testGeo, testMat);
    testPoint.position.set(2, 0, 0);
    scene.add(testPoint);

    // K=5 最近邻（连线）
    const knnLines = [];
    const k = 5;

    const updateKNN = () => {
      // 清除旧连线
      knnLines.forEach(line => scene.remove(line));
      knnLines.length = 0;

      // 计算所有点到测试点的距离
      const allPoints = [];
      classes.forEach(cls => {
        cls.points.forEach(point => {
          const dist = testPoint.position.distanceTo(point.position);
          allPoints.push({ point, dist, color: cls.color });
        });
      });

      // 排序并取前 k 个
      allPoints.sort((a, b) => a.dist - b.dist);
      const nearest = allPoints.slice(0, k);

      // 绘制连线
      nearest.forEach(({ point, color }) => {
        const points = [testPoint.position, point.position];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: 0xF44336, linewidth: 2 })
        );
        scene.add(line);
        knnLines.push(line);

        // 高亮最近邻
        point.scale.setScalar(1.3);
      });
    };

    updateKNN();

    // 决策区域可视化（网格）
    const gridSize = 20;
    const gridStep = 1;
    for (let x = -gridSize / 2; x < gridSize / 2; x += gridStep) {
      for (let z = -gridSize / 2; z < gridSize / 2; z += gridStep) {
        // 计算该位置最近的类别
        let minDist = Infinity;
        let nearestClass = classes[0];
        classes.forEach(cls => {
          const dist = Math.sqrt(
            Math.pow(x - cls.center[0], 2) + Math.pow(z - cls.center[2], 2)
          );
          if (dist < minDist) {
            minDist = dist;
            nearestClass = cls;
          }
        });

        const geo = new THREE.PlaneGeometry(gridStep, gridStep);
        const mat = new THREE.MeshBasicMaterial({
          color: nearestClass.color,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide
        });
        const tile = new THREE.Mesh(geo, mat);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(x, -2, z);
        scene.add(tile);
      }
    }

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 测试点移动
      testPoint.position.x = Math.sin(time * 0.5) * 5;
      testPoint.position.z = Math.cos(time * 0.5) * 5;

      // 每隔一段时间更新 KNN
      if (Math.floor(time * 10) % 10 === 0) {
        updateKNN();
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} className="w-full rounded-lg overflow-hidden" style={{ height: '500px' }} />
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-journal-muted">
          <strong>可视化说明：</strong>展示 K 近邻算法（K=5）。三种颜色的小球代表三类训练数据，
          黄色大球为测试点，红色连线连接到最近的 5 个邻居。底部网格显示决策边界。
        </p>
      </div>
    </div>
  );
}

export default KNNVisualization;