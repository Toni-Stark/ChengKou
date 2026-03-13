import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function SVMVisualization() {
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

    // 创建两类数据点
    const class1Points = [];
    const class2Points = [];

    for (let i = 0; i < 30; i++) {
      const geo = new THREE.SphereGeometry(0.3, 16, 16);
      const mat1 = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
      const point1 = new THREE.Mesh(geo, mat1);
      point1.position.set(
        -5 + Math.random() * 4,
        Math.random() * 8 - 4,
        Math.random() * 4 - 2
      );
      scene.add(point1);
      class1Points.push(point1);

      const mat2 = new THREE.MeshPhongMaterial({ color: 0xF44336 });
      const point2 = new THREE.Mesh(geo.clone(), mat2);
      point2.position.set(
        1 + Math.random() * 4,
        Math.random() * 8 - 4,
        Math.random() * 4 - 2
      );
      scene.add(point2);
      class2Points.push(point2);
    }

    // 决策边界（平面）
    const planeGeo = new THREE.PlaneGeometry(20, 12);
    const planeMat = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.y = Math.PI / 2;
    scene.add(plane);

    // 支持向量（高亮的点）
    const supportVectors = [
      class1Points[5],
      class1Points[12],
      class1Points[20],
      class2Points[3],
      class2Points[15],
      class2Points[25]
    ];

    supportVectors.forEach(sv => {
      const ringGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
      const ringMat = new THREE.MeshPhongMaterial({ color: 0xFFEB3B, emissive: 0xFFEB3B });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(sv.position);
      ring.lookAt(camera.position);
      scene.add(ring);
      sv.userData.ring = ring;
    });

    // 间隔边界（两个平行平面）
    const margin1Geo = new THREE.PlaneGeometry(20, 12);
    const margin1Mat = new THREE.MeshBasicMaterial({
      color: 0x00BCD4,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const margin1 = new THREE.Mesh(margin1Geo, margin1Mat);
    margin1.rotation.y = Math.PI / 2;
    margin1.position.x = -1.5;
    scene.add(margin1);

    const margin2 = margin1.clone();
    margin2.position.x = 1.5;
    scene.add(margin2);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 决策边界轻微波动
      plane.position.y = Math.sin(time) * 0.2;

      // 支持向量环旋转
      supportVectors.forEach((sv, i) => {
        if (sv.userData.ring) {
          sv.userData.ring.rotation.z = time + i;
          sv.userData.ring.lookAt(camera.position);
        }
      });

      // 数据点轻微浮动
      [...class1Points, ...class2Points].forEach((point, i) => {
        point.position.y += Math.sin(time * 2 + i * 0.1) * 0.005;
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
          <strong>可视化说明：</strong>展示 SVM 的分类原理。绿色和红色球为两类数据点，
          蓝色平面为决策边界，黄色环标记的是支持向量（最接近边界的关键点），
          两侧的网格平面表示最大间隔。
        </p>
      </div>
    </div>
  );
}

export default SVMVisualization;