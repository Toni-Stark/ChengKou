import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function DimensionReductionVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(15, 10, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 高维数据（3D 空间中的点云）
    const highDimPoints = [];
    for (let i = 0; i < 100; i++) {
      const geo = new THREE.SphereGeometry(0.15, 8, 8);
      const hue = i / 100;
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.5)
      });
      const point = new THREE.Mesh(geo, mat);

      // 螺旋分布
      const t = i / 100 * Math.PI * 4;
      point.position.set(
        Math.cos(t) * (5 + t * 0.5),
        t * 0.8 - 5,
        Math.sin(t) * (5 + t * 0.5)
      );

      point.userData = {
        originalPos: point.position.clone(),
        lowDimPos: new THREE.Vector3(
          Math.cos(t) * 8,
          0,
          Math.sin(t) * 8
        ),
        hue: hue
      };

      scene.add(point);
      highDimPoints.push(point);
    }

    // 降维后的平面
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const planeMat = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -8;
    scene.add(plane);

    // 投影线
    const projectionLines = [];
    highDimPoints.forEach(point => {
      const projectedPos = point.userData.lowDimPos.clone();
      projectedPos.y = -8;

      const points = [point.position, projectedPos];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: point.material.color,
          transparent: true,
          opacity: 0.3
        })
      );
      scene.add(line);
      projectionLines.push({ line, point, projectedPos });
    });

    // 降维后的点（在平面上）
    const lowDimPoints = [];
    highDimPoints.forEach(point => {
      const geo = new THREE.SphereGeometry(0.2, 8, 8);
      const mat = new THREE.MeshPhongMaterial({
        color: point.material.color
      });
      const lowPoint = new THREE.Mesh(geo, mat);
      lowPoint.position.copy(point.userData.lowDimPos);
      lowPoint.position.y = -7.8;
      scene.add(lowPoint);
      lowDimPoints.push(lowPoint);
    });

    let time = 0;
    let transitionProgress = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      transitionProgress = (Math.sin(time * 0.5) + 1) / 2;

      // 点在高维和低维之间过渡
      highDimPoints.forEach((point, i) => {
        const target = new THREE.Vector3().lerpVectors(
          point.userData.originalPos,
          point.userData.lowDimPos,
          transitionProgress
        );
        point.position.copy(target);
      });

      // 更新投影线
      projectionLines.forEach(({ line, point, projectedPos }) => {
        const points = [point.position, projectedPos];
        line.geometry.setFromPoints(points);
        line.material.opacity = 0.3 * (1 - transitionProgress);
      });

      // 低维点可见性
      lowDimPoints.forEach(point => {
        point.material.opacity = transitionProgress;
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
          <strong>可视化说明：</strong>展示降维过程（如 PCA、t-SNE）。彩色球从高维空间（3D 螺旋）
          投影到低维平面（2D 圆环），保持数据的主要结构特征。动画展示降维的过渡过程。
        </p>
      </div>
    </div>
  );
}

export default DimensionReductionVisualization;