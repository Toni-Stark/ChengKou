import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ClusteringVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // K-Means 聚类中心
    const clusterCenters = [
      { pos: new THREE.Vector3(-6, 0, -4), color: 0x4CAF50 },
      { pos: new THREE.Vector3(6, 0, -4), color: 0x2196F3 },
      { pos: new THREE.Vector3(0, 0, 6), color: 0xFF9800 },
      { pos: new THREE.Vector3(-3, 4, 0), color: 0x9C27B0 }
    ];

    const centerMeshes = [];
    clusterCenters.forEach(cluster => {
      const geo = new THREE.OctahedronGeometry(0.8, 0);
      const mat = new THREE.MeshPhongMaterial({
        color: cluster.color,
        emissive: cluster.color,
        emissiveIntensity: 0.5
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(cluster.pos);
      scene.add(mesh);
      centerMeshes.push(mesh);
    });

    // 数据点
    const dataPoints = [];
    clusterCenters.forEach(cluster => {
      for (let i = 0; i < 25; i++) {
        const geo = new THREE.SphereGeometry(0.2, 16, 16);
        const mat = new THREE.MeshPhongMaterial({ color: cluster.color });
        const point = new THREE.Mesh(geo, mat);
        point.position.set(
          cluster.pos.x + (Math.random() - 0.5) * 5,
          cluster.pos.y + (Math.random() - 0.5) * 5,
          cluster.pos.z + (Math.random() - 0.5) * 5
        );
        point.userData = {
          cluster: cluster,
          targetPos: point.position.clone()
        };
        scene.add(point);
        dataPoints.push(point);
      }
    });

    // 连接线（点到聚类中心）
    const connections = [];
    dataPoints.forEach(point => {
      const points = [point.position, point.userData.cluster.pos];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: point.userData.cluster.color,
          transparent: true,
          opacity: 0.2
        })
      );
      scene.add(line);
      connections.push({ line, point });
    });

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 聚类中心旋转
      centerMeshes.forEach((mesh, i) => {
        mesh.rotation.y = time + i;
        mesh.rotation.x = time * 0.5;
      });

      // 数据点轻微移动
      dataPoints.forEach((point, i) => {
        const offset = new THREE.Vector3(
          Math.sin(time + i * 0.1) * 0.3,
          Math.cos(time + i * 0.15) * 0.3,
          Math.sin(time * 0.8 + i * 0.2) * 0.3
        );
        point.position.copy(point.userData.targetPos).add(offset);
      });

      // 更新连接线
      connections.forEach(({ line, point }) => {
        const points = [point.position, point.userData.cluster.pos];
        line.geometry.setFromPoints(points);
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
          <strong>可视化说明：</strong>展示 K-Means 聚类算法。四个八面体为聚类中心，
          彩色小球为数据点，淡色连线表示点到其所属聚类中心的距离。
        </p>
      </div>
    </div>
  );
}

export default ClusteringVisualization;