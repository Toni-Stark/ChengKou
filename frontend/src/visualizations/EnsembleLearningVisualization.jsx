import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function EnsembleLearningVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 多个弱学习器（小决策树）
    const weakLearners = [];
    const learnerCount = 8;
    const radius = 10;

    for (let i = 0; i < learnerCount; i++) {
      const angle = (i / learnerCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // 创建简单的树结构
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);

      // 根节点
      const rootGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const rootMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / learnerCount, 0.7, 0.5)
      });
      const root = new THREE.Mesh(rootGeo, rootMat);
      root.position.y = 1;
      treeGroup.add(root);

      // 子节点
      [-1, 1].forEach(dir => {
        const childGeo = new THREE.SphereGeometry(0.25, 12, 12);
        const child = new THREE.Mesh(childGeo, rootMat.clone());
        child.position.set(dir * 0.8, -0.5, 0);
        treeGroup.add(child);

        // 连线
        const points = [root.position, child.position];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x666666 }));
        treeGroup.add(line);
      });

      scene.add(treeGroup);
      weakLearners.push({ group: treeGroup, root, angle: i / learnerCount });
    }

    // 中心的强学习器（大球）
    const strongGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const strongMat = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      emissive: 0x1565C0,
      emissiveIntensity: 0.3
    });
    const strongLearner = new THREE.Mesh(strongGeo, strongMat);
    strongLearner.position.y = 3;
    scene.add(strongLearner);

    // 连接线（弱学习器到强学习器）
    const connections = [];
    weakLearners.forEach(({ group }) => {
      const start = group.position.clone();
      start.y = 1;
      const end = strongLearner.position;
      const points = [start, end];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: 0x4CAF50,
          transparent: true,
          opacity: 0.4
        })
      );
      scene.add(line);
      connections.push(line);
    });

    // 投票/权重可视化（粒子流）
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.SphereGeometry(0.1, 8, 8);
      const mat = new THREE.MeshPhongMaterial({
        color: 0xFFEB3B,
        emissive: 0xFFEB3B
      });
      const particle = new THREE.Mesh(geo, mat);
      const learner = weakLearners[Math.floor(Math.random() * weakLearners.length)];
      particle.userData = {
        start: learner.group.position.clone(),
        end: strongLearner.position.clone(),
        progress: Math.random()
      };
      scene.add(particle);
      particles.push(particle);
    }

    // Bagging/Boosting 标签
    const createLabel = (text, pos) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      sprite.scale.set(4, 1, 1);
      scene.add(sprite);
    };

    createLabel('Weak Learners', new THREE.Vector3(0, -3, 0));
    createLabel('Strong Learner', new THREE.Vector3(0, 5, 0));

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 弱学习器轻微浮动
      weakLearners.forEach(({ group, angle }, i) => {
        group.position.y = Math.sin(time * 2 + angle * Math.PI * 2) * 0.5;
        group.rotation.y = time + i;
      });

      // 强学习器旋转和脉动
      strongLearner.rotation.y = time * 0.5;
      strongLearner.scale.setScalar(1 + Math.sin(time * 3) * 0.1);

      // 粒子流动画
      particles.forEach(particle => {
        particle.userData.progress += 0.01;
        if (particle.userData.progress > 1) {
          particle.userData.progress = 0;
          const learner = weakLearners[Math.floor(Math.random() * weakLearners.length)];
          particle.userData.start = learner.group.position.clone();
        }
        particle.position.lerpVectors(
          particle.userData.start,
          particle.userData.end,
          particle.userData.progress
        );
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
          <strong>可视化说明：</strong>展示集成学习（Bagging/Boosting）原理。
          周围的彩色小树为多个弱学习器，中心的蓝色大球为集成后的强学习器，
          黄色粒子流表示各弱学习器的预测结果汇聚到强学习器。
        </p>
      </div>
    </div>
  );
}

export default EnsembleLearningVisualization;