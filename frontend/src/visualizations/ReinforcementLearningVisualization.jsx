import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ReinforcementLearningVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 创建网格世界（环境）
    const gridSize = 8;
    const cellSize = 2;
    const grid = [];

    for (let x = 0; x < gridSize; x++) {
      grid[x] = [];
      for (let z = 0; z < gridSize; z++) {
        const geo = new THREE.BoxGeometry(cellSize * 0.9, 0.2, cellSize * 0.9);
        const mat = new THREE.MeshPhongMaterial({
          color: 0xEEEEEE,
          transparent: true,
          opacity: 0.8
        });
        const cell = new THREE.Mesh(geo, mat);
        cell.position.set(
          (x - gridSize / 2) * cellSize,
          0,
          (z - gridSize / 2) * cellSize
        );
        scene.add(cell);
        grid[x][z] = { mesh: cell, reward: 0 };
      }
    }

    // 设置奖励和惩罚
    const rewardCells = [
      { x: 6, z: 6, reward: 10, color: 0x4CAF50 },
      { x: 2, z: 5, reward: 5, color: 0x8BC34A }
    ];
    const penaltyCells = [
      { x: 3, z: 3, reward: -5, color: 0xF44336 },
      { x: 5, z: 2, reward: -3, color: 0xFF5722 }
    ];

    [...rewardCells, ...penaltyCells].forEach(({ x, z, reward, color }) => {
      grid[x][z].mesh.material.color.setHex(color);
      grid[x][z].reward = reward;

      // 添加奖励标记
      const markerGeo = new THREE.CylinderGeometry(0.3, 0.3, reward > 0 ? 2 : 1, 16);
      const markerMat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(grid[x][z].mesh.position);
      marker.position.y = reward > 0 ? 1.5 : 0.8;
      scene.add(marker);
    });

    // 智能体（Agent）
    const agentGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const agentMat = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      emissive: 0x1565C0,
      emissiveIntensity: 0.5
    });
    const agent = new THREE.Mesh(agentGeo, agentMat);
    agent.position.set(-6, 1, -6);
    scene.add(agent);

    // Q值可视化（箭头）
    const arrows = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const directions = [
          { dir: new THREE.Vector3(1, 0, 0), color: 0xFF9800 },
          { dir: new THREE.Vector3(-1, 0, 0), color: 0xFF9800 },
          { dir: new THREE.Vector3(0, 0, 1), color: 0xFF9800 },
          { dir: new THREE.Vector3(0, 0, -1), color: 0xFF9800 }
        ];

        directions.forEach(({ dir, color }) => {
          const arrowHelper = new THREE.ArrowHelper(
            dir,
            grid[x][z].mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)),
            0.8,
            color,
            0.3,
            0.2
          );
          arrowHelper.userData = { baseLength: Math.random() * 0.5 + 0.3 };
          scene.add(arrowHelper);
          arrows.push(arrowHelper);
        });
      }
    }

    // 轨迹路径
    const pathPoints = [
      new THREE.Vector3(-6, 1, -6),
      new THREE.Vector3(-4, 1, -6),
      new THREE.Vector3(-2, 1, -4),
      new THREE.Vector3(0, 1, -2),
      new THREE.Vector3(2, 1, 0),
      new THREE.Vector3(4, 1, 2),
      new THREE.Vector3(6, 1, 4),
      new THREE.Vector3(6, 1, 6)
    ];

    const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathLine = new THREE.Line(
      pathGeo,
      new THREE.LineBasicMaterial({
        color: 0x9C27B0,
        linewidth: 3,
        transparent: true,
        opacity: 0.6
      })
    );
    scene.add(pathLine);

    let time = 0;
    let pathProgress = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      pathProgress += 0.005;

      // Agent 沿路径移动
      const idx = Math.floor(pathProgress) % pathPoints.length;
      const nextIdx = (idx + 1) % pathPoints.length;
      const t = pathProgress % 1;
      agent.position.lerpVectors(pathPoints[idx], pathPoints[nextIdx], t);

      // Agent 旋转
      agent.rotation.y = time * 2;

      // Q值箭头动画
      arrows.forEach((arrow, i) => {
        const scale = arrow.userData.baseLength + Math.sin(time * 3 + i * 0.1) * 0.1;
        arrow.setLength(scale, 0.3, 0.2);
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
          <strong>可视化说明：</strong>展示强化学习的网格世界环境。蓝色球为智能体（Agent），
          绿色柱为正奖励，红色柱为负奖励，橙色箭头表示各状态的 Q 值（动作价值），
          紫色路径为学习到的最优策略。
        </p>
      </div>
    </div>
  );
}

export default ReinforcementLearningVisualization;