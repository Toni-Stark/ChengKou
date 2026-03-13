import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function MCMCVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 12, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    const createLabel = (text, pos, color = '#000000', scale = 5) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 64;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 64);
      ctx.fillStyle = color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, 256, 42);
      const texture = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
      sprite.position.copy(pos);
      sprite.scale.set(scale, 1, 1);
      scene.add(sprite);
    };

    // 目标分布（双峰高斯）- 用高度表示概率密度
    const gridSize = 30;
    const gridStep = 0.5;
    const distributionPoints = [];

    for (let i = -gridSize / 2; i < gridSize / 2; i++) {
      for (let j = -gridSize / 2; j < gridSize / 2; j++) {
        const x = i * gridStep;
        const z = j * gridStep;

        // 双峰高斯分布
        const peak1 = Math.exp(-((x + 3) ** 2 + z ** 2) / 8);
        const peak2 = Math.exp(-((x - 3) ** 2 + (z - 2) ** 2) / 6);
        const density = (peak1 + peak2) * 3;

        if (density > 0.05) {
          const geo = new THREE.BoxGeometry(gridStep * 0.9, density, gridStep * 0.9);
          const hue = density / 6;
          const mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.6 - hue * 0.4, 0.8, 0.5),
            transparent: true,
            opacity: 0.6
          });
          const box = new THREE.Mesh(geo, mat);
          box.position.set(x, density / 2 - 2, z);
          scene.add(box);
          distributionPoints.push({ x, z, density });
        }
      }
    }

    // 马尔可夫链采样路径
    const chainLength = 80;
    const chainPositions = [];
    let cx = 0, cz = 0;

    for (let i = 0; i < chainLength; i++) {
      // Metropolis-Hastings 步骤
      const proposalX = cx + (Math.random() - 0.5) * 3;
      const proposalZ = cz + (Math.random() - 0.5) * 3;

      const currentDensity = Math.exp(-((cx + 3) ** 2 + cz ** 2) / 8) +
                             Math.exp(-((cx - 3) ** 2 + (cz - 2) ** 2) / 6);
      const proposalDensity = Math.exp(-((proposalX + 3) ** 2 + proposalZ ** 2) / 8) +
                              Math.exp(-((proposalX - 3) ** 2 + (proposalZ - 2) ** 2) / 6);

      const acceptRatio = proposalDensity / currentDensity;
      if (Math.random() < Math.min(1, acceptRatio)) {
        cx = proposalX;
        cz = proposalZ;
      }

      const density = Math.exp(-((cx + 3) ** 2 + cz ** 2) / 8) +
                      Math.exp(-((cx - 3) ** 2 + (cz - 2) ** 2) / 6);
      chainPositions.push(new THREE.Vector3(cx, density * 3 - 2 + 0.3, cz));
    }

    // 绘制采样路径
    const pathGeo = new THREE.BufferGeometry().setFromPoints(chainPositions);
    const pathLine = new THREE.Line(
      pathGeo,
      new THREE.LineBasicMaterial({ color: 0xFF5252, linewidth: 2 })
    );
    scene.add(pathLine);

    // 采样点
    const sampleMeshes = [];
    chainPositions.forEach((pos, i) => {
      if (i % 5 === 0) {
        const geo = new THREE.SphereGeometry(0.15, 12, 12);
        const mat = new THREE.MeshPhongMaterial({
          color: i < chainLength / 2 ? 0xFF9800 : 0xFFEB3B,
          emissive: 0xFFEB3B,
          emissiveIntensity: 0.3
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        scene.add(mesh);
        sampleMeshes.push(mesh);
      }
    });

    // 当前采样点（动态）
    const currentGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const currentMat = new THREE.MeshPhongMaterial({
      color: 0xF44336,
      emissive: 0xF44336,
      emissiveIntensity: 0.5
    });
    const currentSample = new THREE.Mesh(currentGeo, currentMat);
    scene.add(currentSample);

    createLabel('MCMC 采样 (Metropolis-Hastings)', new THREE.Vector3(0, 6, 0), '#1976D2', 7);
    createLabel('目标分布（双峰高斯）', new THREE.Vector3(0, -5, 0), '#555555', 5);
    createLabel('红线 = 马尔可夫链路径', new THREE.Vector3(-6, 5, 0), '#F44336', 4);

    let time = 0;
    let chainIdx = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 当前采样点沿链移动
      chainIdx = Math.floor(time * 5) % chainPositions.length;
      currentSample.position.copy(chainPositions[chainIdx]);
      currentSample.scale.setScalar(1 + Math.sin(time * 8) * 0.3);

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
          <strong>可视化说明：</strong>展示 MCMC（Metropolis-Hastings 算法）对双峰高斯分布的采样过程。
          彩色柱状图表示目标概率分布（蓝色=低密度，暖色=高密度），
          红色折线为马尔可夫链的采样路径，红色球为当前采样点。
          算法通过接受-拒绝机制，使采样点逐渐集中在高概率区域。
        </p>
      </div>
    </div>
  );
}

export default MCMCVisualization;
