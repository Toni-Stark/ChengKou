import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function SelfSupervisedVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 原始图像（左侧）
    const originalGeo = new THREE.BoxGeometry(3, 3, 0.2);
    const originalMat = new THREE.MeshPhongMaterial({ color: 0x2196F3 });
    const original = new THREE.Mesh(originalGeo, originalMat);
    original.position.set(-8, 0, 0);
    scene.add(original);

    // 数据增强后的多个视图
    const augmentations = [
      { pos: [-3, 2, 0], color: 0x4CAF50, label: '旋转' },
      { pos: [-3, -2, 0], color: 0xFF9800, label: '裁剪' },
      { pos: [0, 2, 0], color: 0x9C27B0, label: '颜色变换' },
      { pos: [0, -2, 0], color: 0xF44336, label: '模糊' }
    ];

    const augViews = [];
    augmentations.forEach(aug => {
      const geo = new THREE.BoxGeometry(2, 2, 0.2);
      const mat = new THREE.MeshPhongMaterial({ color: aug.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...aug.pos);
      scene.add(mesh);
      augViews.push(mesh);

      // 连接线
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        original.position,
        mesh.position
      ]);
      scene.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x666666 })));
    });

    // 编码器（中间）
    const encoderGeo = new THREE.CylinderGeometry(1, 1.5, 4, 32);
    const encoderMat = new THREE.MeshPhongMaterial({ color: 0x00BCD4, transparent: true, opacity: 0.8 });
    const encoder = new THREE.Mesh(encoderGeo, encoderMat);
    encoder.position.set(5, 0, 0);
    encoder.rotation.z = Math.PI / 2;
    scene.add(encoder);

    // 特征空间（右侧球群）
    const featureGroup = new THREE.Group();
    featureGroup.position.set(10, 0, 0);
    const featureSpheres = [];
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.SphereGeometry(0.2, 16, 16);
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 20, 0.8, 0.5)
      });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
      featureGroup.add(sphere);
      featureSpheres.push(sphere);
    }
    scene.add(featureGroup);

    // 对比学习连接线（相似样本拉近，不同样本推远）
    const contrastLines = [];
    for (let i = 0; i < 10; i++) {
      const s1 = featureSpheres[Math.floor(Math.random() * featureSpheres.length)];
      const s2 = featureSpheres[Math.floor(Math.random() * featureSpheres.length)];
      if (s1 !== s2) {
        const similar = Math.random() > 0.5;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          s1.position.clone().add(featureGroup.position),
          s2.position.clone().add(featureGroup.position)
        ]);
        const line = new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({
            color: similar ? 0x4CAF50 : 0xF44336,
            transparent: true,
            opacity: 0.3
          })
        );
        scene.add(line);
        contrastLines.push({ line, similar });
      }
    }

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 增强视图旋转
      augViews.forEach((view, i) => {
        view.rotation.y = time + i;
      });

      // 编码器脉动
      encoder.scale.x = 1 + Math.sin(time * 2) * 0.1;

      // 特征空间旋转
      featureGroup.rotation.y = time * 0.5;

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
          <strong>可视化说明：</strong>左侧蓝色方块为原始图像，经过多种数据增强生成不同视图（彩色方块），
          通过编码器（青色圆柱）映射到特征空间（右侧彩色球群）。绿色线连接相似样本，红色线推远不同样本。
        </p>
      </div>
    </div>
  );
}

export default SelfSupervisedVisualization;