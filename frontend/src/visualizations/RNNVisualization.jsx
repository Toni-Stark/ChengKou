import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function RNNVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // 创建 LSTM 单元序列
    const timeSteps = 6;
    const cellSpacing = 4;
    const cells = [];

    for (let t = 0; t < timeSteps; t++) {
      const xPos = (t - timeSteps / 2) * cellSpacing;

      // LSTM 单元主体
      const cellGeometry = new THREE.BoxGeometry(2.5, 3, 2.5);
      const cellMaterial = new THREE.MeshPhongMaterial({
        color: 0x2196F3,
        transparent: true,
        opacity: 0.7
      });
      const cell = new THREE.Mesh(cellGeometry, cellMaterial);
      cell.position.set(xPos, 0, 0);
      scene.add(cell);
      cells.push(cell);

      // 边框
      const edges = new THREE.EdgesGeometry(cellGeometry);
      const wireframe = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      wireframe.position.copy(cell.position);
      scene.add(wireframe);

      // 门控机制（小球表示）
      const gateColors = [0xFF9800, 0x4CAF50, 0xF44336]; // 遗忘门、输入门、输出门
      const gatePositions = [-0.8, 0, 0.8];

      gateColors.forEach((color, i) => {
        const gateGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const gateMaterial = new THREE.MeshPhongMaterial({ color });
        const gate = new THREE.Mesh(gateGeometry, gateMaterial);
        gate.position.set(xPos + gatePositions[i], 0, 1.5);
        scene.add(gate);
      });

      // 隐藏状态连接（水平箭头）
      if (t < timeSteps - 1) {
        const nextX = xPos + cellSpacing;
        const arrowPoints = [
          new THREE.Vector3(xPos + 1.25, 1.5, 0),
          new THREE.Vector3(nextX - 1.25, 1.5, 0)
        ];
        const arrowGeometry = new THREE.BufferGeometry().setFromPoints(arrowPoints);
        const arrow = new THREE.Line(
          arrowGeometry,
          new THREE.LineBasicMaterial({ color: 0x9C27B0, linewidth: 2 })
        );
        scene.add(arrow);

        // 箭头头部
        const arrowHead = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 0.5, 8),
          new THREE.MeshBasicMaterial({ color: 0x9C27B0 })
        );
        arrowHead.position.set(nextX - 1.25, 1.5, 0);
        arrowHead.rotation.z = -Math.PI / 2;
        scene.add(arrowHead);
      }

      // 细胞状态连接（顶部线）
      if (t < timeSteps - 1) {
        const nextX = xPos + cellSpacing;
        const statePoints = [
          new THREE.Vector3(xPos + 1.25, 3, 0),
          new THREE.Vector3(nextX - 1.25, 3, 0)
        ];
        const stateGeometry = new THREE.BufferGeometry().setFromPoints(statePoints);
        const stateLine = new THREE.Line(
          stateGeometry,
          new THREE.LineBasicMaterial({ color: 0x00BCD4, linewidth: 3 })
        );
        scene.add(stateLine);
      }

      // 输入箭头（从下方）
      const inputPoints = [
        new THREE.Vector3(xPos, -3, 0),
        new THREE.Vector3(xPos, -1.5, 0)
      ];
      const inputGeometry = new THREE.BufferGeometry().setFromPoints(inputPoints);
      const inputLine = new THREE.Line(
        inputGeometry,
        new THREE.LineBasicMaterial({ color: 0x4CAF50 })
      );
      scene.add(inputLine);
    }

    // 动画
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;

      // 单元脉动效果
      cells.forEach((cell, index) => {
        const phase = time + index * 0.5;
        cell.scale.y = 1 + Math.sin(phase) * 0.1;
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
          <strong>可视化说明：</strong>展示了 LSTM 的时间展开结构。蓝色方块代表 LSTM 单元，
          顶部青色线表示细胞状态（Cell State），紫色箭头表示隐藏状态传递，
          三个彩色小球分别代表遗忘门（橙）、输入门（绿）、输出门（红）。
        </p>
      </div>
    </div>
  );
}

export default RNNVisualization;