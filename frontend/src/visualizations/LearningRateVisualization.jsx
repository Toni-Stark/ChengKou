import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function LearningRateVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 创建学习率曲线
    const epochs = 100;
    const curves = [
      { name: '固定学习率', color: 0xF44336, fn: (t) => 0.1 },
      { name: '阶梯衰减', color: 0xFF9800, fn: (t) => 0.1 * Math.pow(0.5, Math.floor(t / 30)) },
      { name: '余弦退火', color: 0x4CAF50, fn: (t) => 0.1 * (1 + Math.cos(Math.PI * t / epochs)) / 2 },
      { name: '指数衰减', color: 0x2196F3, fn: (t) => 0.1 * Math.exp(-t / 30) }
    ];

    curves.forEach((curve, idx) => {
      const points = [];
      for (let t = 0; t <= epochs; t++) {
        const lr = curve.fn(t);
        const x = (t / epochs) * 20 - 10;
        const y = lr * 30;
        points.push(new THREE.Vector3(x, y, -idx * 2));
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: curve.color, linewidth: 3 }));
      scene.add(line);

      // 添加移动的标记球
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshPhongMaterial({ color: curve.color, emissive: curve.color })
      );
      marker.userData = { points, index: 0 };
      scene.add(marker);
      curve.marker = marker;
    });

    // 坐标轴
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(10, 0, 0)
    ]);
    scene.add(new THREE.Line(axisGeo, new THREE.LineBasicMaterial({ color: 0x000000 })));

    const yAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-10, 5, 0)
    ]);
    scene.add(new THREE.Line(yAxisGeo, new THREE.LineBasicMaterial({ color: 0x000000 })));

    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame++;

      curves.forEach(curve => {
        const idx = Math.floor(frame / 2) % curve.marker.userData.points.length;
        curve.marker.position.copy(curve.marker.userData.points[idx]);
      });

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
          <strong>可视化说明：</strong>展示了四种学习率调度策略随训练轮次的变化：
          红色为固定学习率，橙色为阶梯衰减，绿色为余弦退火，蓝色为指数衰减。
        </p>
      </div>
    </div>
  );
}

export default LearningRateVisualization;