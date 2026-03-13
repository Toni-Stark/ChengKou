import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function OptimizerVisualization() {
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

    // 创建损失函数曲面
    const size = 30;
    const segments = 60;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    const vertices = geo.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      vertices[i + 2] = (x * x + y * y) / 30 - 8 + Math.sin(x) * 0.5 + Math.cos(y) * 0.5;
    }

    geo.computeVertexNormals();
    const mat = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      wireframe: false
    });
    const surface = new THREE.Mesh(geo, mat);
    surface.rotation.x = -Math.PI / 2;
    scene.add(surface);

    // SGD 路径（红色，直线下降）
    const sgdPath = [];
    let x1 = 12, y1 = 12;
    for (let i = 0; i < 40; i++) {
      const z = (x1 * x1 + y1 * y1) / 30 - 8 + Math.sin(x1) * 0.5 + Math.cos(y1) * 0.5;
      sgdPath.push(new THREE.Vector3(x1, z + 0.2, y1));
      x1 *= 0.88;
      y1 *= 0.88;
    }
    const sgdGeo = new THREE.BufferGeometry().setFromPoints(sgdPath);
    const sgdLine = new THREE.Line(sgdGeo, new THREE.LineBasicMaterial({ color: 0xF44336, linewidth: 3 }));
    scene.add(sgdLine);

    const sgdMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 16),
      new THREE.MeshPhongMaterial({ color: 0xF44336, emissive: 0xF44336 })
    );
    scene.add(sgdMarker);

    // Adam 路径（绿色，更平滑）
    const adamPath = [];
    let x2 = -12, y2 = 12;
    for (let i = 0; i < 40; i++) {
      const z = (x2 * x2 + y2 * y2) / 30 - 8 + Math.sin(x2) * 0.5 + Math.cos(y2) * 0.5;
      adamPath.push(new THREE.Vector3(x2, z + 0.2, y2));
      x2 *= 0.90;
      y2 *= 0.90;
    }
    const adamGeo = new THREE.BufferGeometry().setFromPoints(adamPath);
    const adamLine = new THREE.Line(adamGeo, new THREE.LineBasicMaterial({ color: 0x4CAF50, linewidth: 3 }));
    scene.add(adamLine);

    const adamMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 16),
      new THREE.MeshPhongMaterial({ color: 0x4CAF50, emissive: 0x4CAF50 })
    );
    scene.add(adamMarker);

    // RMSprop 路径（橙色）
    const rmsPath = [];
    let x3 = 12, y3 = -12;
    for (let i = 0; i < 40; i++) {
      const z = (x3 * x3 + y3 * y3) / 30 - 8 + Math.sin(x3) * 0.5 + Math.cos(y3) * 0.5;
      rmsPath.push(new THREE.Vector3(x3, z + 0.2, y3));
      x3 *= 0.89;
      y3 *= 0.89;
    }
    const rmsGeo = new THREE.BufferGeometry().setFromPoints(rmsPath);
    const rmsLine = new THREE.Line(rmsGeo, new THREE.LineBasicMaterial({ color: 0xFF9800, linewidth: 3 }));
    scene.add(rmsLine);

    const rmsMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 16),
      new THREE.MeshPhongMaterial({ color: 0xFF9800, emissive: 0xFF9800 })
    );
    scene.add(rmsMarker);

    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame++;

      const idx = Math.floor(frame / 5) % sgdPath.length;
      sgdMarker.position.copy(sgdPath[idx]);
      adamMarker.position.copy(adamPath[idx]);
      rmsMarker.position.copy(rmsPath[idx]);

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
          <strong>可视化说明：</strong>蓝色曲面为损失函数，三条路径展示不同优化器的下降轨迹：
          红色为 SGD（较直接但可能震荡），绿色为 Adam（平滑且快速），橙色为 RMSprop（介于两者之间）。
        </p>
      </div>
    </div>
  );
}

export default OptimizerVisualization;