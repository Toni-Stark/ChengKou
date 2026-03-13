import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function BayesTheoremVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 创建文本标签
    const createLabel = (text, pos, color = '#000000', size = 24) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = color;
      ctx.font = `bold ${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(text, 256, 70);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      sprite.scale.set(6, 1.5, 1);
      scene.add(sprite);
      return sprite;
    };

    // 贝叶斯公式主体
    createLabel('P(A|B) = P(B|A) · P(A) / P(B)', new THREE.Vector3(0, 6, 0), '#1976D2', 28);

    // 先验概率 P(A)
    const priorGroup = new THREE.Group();
    priorGroup.position.set(-6, 0, 0);

    const priorGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const priorMat = new THREE.MeshPhongMaterial({
      color: 0x4CAF50,
      emissive: 0x2E7D32,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9
    });
    const priorSphere = new THREE.Mesh(priorGeo, priorMat);
    priorGroup.add(priorSphere);
    scene.add(priorGroup);
    createLabel('P(A)', new THREE.Vector3(-6, -2.5, 0), '#2E7D32');
    createLabel('Prior', new THREE.Vector3(-6, 2.5, 0), '#2E7D32', 20);

    // 似然函数 P(B|A)
    const likelihoodGroup = new THREE.Group();
    likelihoodGroup.position.set(0, 0, 0);

    const likelihoodGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const likelihoodMat = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      emissive: 0x1565C0,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9
    });
    const likelihoodCylinder = new THREE.Mesh(likelihoodGeo, likelihoodMat);
    likelihoodGroup.add(likelihoodCylinder);
    scene.add(likelihoodGroup);
    createLabel('P(B|A)', new THREE.Vector3(0, -2.5, 0), '#1565C0');
    createLabel('Likelihood', new THREE.Vector3(0, 2.5, 0), '#1565C0', 20);

    // 后验概率 P(A|B)
    const posteriorGroup = new THREE.Group();
    posteriorGroup.position.set(6, 0, 0);

    const posteriorGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const posteriorMat = new THREE.MeshPhongMaterial({
      color: 0xFF9800,
      emissive: 0xE65100,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.9
    });
    const posteriorSphere = new THREE.Mesh(posteriorGeo, posteriorMat);
    posteriorGroup.add(posteriorSphere);
    scene.add(posteriorGroup);
    createLabel('P(A|B)', new THREE.Vector3(6, -2.5, 0), '#E65100');
    createLabel('Posterior', new THREE.Vector3(6, 2.5, 0), '#E65100', 20);

    // 证据 P(B) - 底部
    const evidenceGeo = new THREE.BoxGeometry(14, 0.3, 3);
    const evidenceMat = new THREE.MeshPhongMaterial({
      color: 0x9C27B0,
      emissive: 0x6A1B9A,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8
    });
    const evidenceBox = new THREE.Mesh(evidenceGeo, evidenceMat);
    evidenceBox.position.set(0, -4.5, 0);
    scene.add(evidenceBox);
    createLabel('P(B) - Evidence', new THREE.Vector3(0, -5.5, 0), '#6A1B9A', 20);

    // 连接箭头
    const createArrow = (from, to, color) => {
      const dir = new THREE.Vector3().subVectors(to, from);
      const length = dir.length();
      const arrowHelper = new THREE.ArrowHelper(
        dir.normalize(),
        from,
        length,
        color,
        0.5,
        0.3
      );
      scene.add(arrowHelper);
    };

    createArrow(
      new THREE.Vector3(-4.5, 0, 0),
      new THREE.Vector3(-1.5, 0, 0),
      0x4CAF50
    );
    createArrow(
      new THREE.Vector3(1.5, 0, 0),
      new THREE.Vector3(4.5, 0, 0),
      0xFF9800
    );

    // 数据流粒子
    const particles = [];
    for (let i = 0; i < 15; i++) {
      const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMat = new THREE.MeshPhongMaterial({
        color: 0xFFEB3B,
        emissive: 0xFFEB3B,
        emissiveIntensity: 0.5
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.userData = {
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01
      };
      scene.add(particle);
      particles.push(particle);
    }

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 先验概率旋转和脉动
      priorSphere.rotation.y = time;
      priorSphere.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      // 似然函数旋转
      likelihoodCylinder.rotation.y = time * 0.8;
      likelihoodCylinder.scale.y = 1 + Math.sin(time * 3) * 0.1;

      // 后验概率旋转和脉动
      posteriorSphere.rotation.y = -time * 0.7;
      posteriorSphere.scale.setScalar(1 + Math.sin(time * 2.5) * 0.12);

      // 证据底座脉动
      evidenceBox.scale.y = 1 + Math.sin(time * 4) * 0.2;

      // 粒子流动画（从先验到后验）
      particles.forEach(particle => {
        particle.userData.progress += particle.userData.speed;
        if (particle.userData.progress > 1) {
          particle.userData.progress = 0;
        }

        const t = particle.userData.progress;
        const x = -6 + t * 12;
        const y = Math.sin(t * Math.PI) * 2;
        const z = Math.sin(t * Math.PI * 2) * 1;

        particle.position.set(x, y, z);
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
          <strong>可视化说明：</strong>展示贝叶斯定理的核心组成部分。
          左侧绿色球为先验概率 P(A)，中间蓝色圆柱为似然函数 P(B|A)，
          右侧橙色球为后验概率 P(A|B)，底部紫色条为证据 P(B)。
          黄色粒子流展示从先验到后验的推断过程。
        </p>
      </div>
    </div>
  );
}

export default BayesTheoremVisualization;
