import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function DecisionTreeVisualization() {
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

    // 创建决策树结构
    const createTreeNode = (x, y, z, level, isLeaf = false) => {
      const geo = isLeaf
        ? new THREE.BoxGeometry(1.5, 1, 0.5)
        : new THREE.SphereGeometry(0.6, 16, 16);
      const mat = new THREE.MeshPhongMaterial({
        color: isLeaf ? 0x4CAF50 : 0x2196F3,
        transparent: true,
        opacity: 0.8
      });
      const node = new THREE.Mesh(geo, mat);
      node.position.set(x, y, z);
      scene.add(node);

      const edges = new THREE.EdgesGeometry(geo);
      const wireframe = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
      wireframe.position.copy(node.position);
      scene.add(wireframe);

      return node;
    };

    const createConnection = (from, to) => {
      const points = [from.position, to.position];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x666666, linewidth: 2 }));
      scene.add(line);
    };

    // 根节点
    const root = createTreeNode(0, 6, 0, 0);

    // 第二层
    const level2_1 = createTreeNode(-4, 3, 0, 1);
    const level2_2 = createTreeNode(4, 3, 0, 1);
    createConnection(root, level2_1);
    createConnection(root, level2_2);

    // 第三层
    const level3_1 = createTreeNode(-6, 0, 0, 2);
    const level3_2 = createTreeNode(-2, 0, 0, 2);
    const level3_3 = createTreeNode(2, 0, 0, 2);
    const level3_4 = createTreeNode(6, 0, 0, 2);
    createConnection(level2_1, level3_1);
    createConnection(level2_1, level3_2);
    createConnection(level2_2, level3_3);
    createConnection(level2_2, level3_4);

    // 叶子节点
    const leaves = [
      createTreeNode(-7, -3, 0, 3, true),
      createTreeNode(-5, -3, 0, 3, true),
      createTreeNode(-3, -3, 0, 3, true),
      createTreeNode(-1, -3, 0, 3, true),
      createTreeNode(1, -3, 0, 3, true),
      createTreeNode(3, -3, 0, 3, true),
      createTreeNode(5, -3, 0, 3, true),
      createTreeNode(7, -3, 0, 3, true)
    ];
    createConnection(level3_1, leaves[0]);
    createConnection(level3_1, leaves[1]);
    createConnection(level3_2, leaves[2]);
    createConnection(level3_2, leaves[3]);
    createConnection(level3_3, leaves[4]);
    createConnection(level3_3, leaves[5]);
    createConnection(level3_4, leaves[6]);
    createConnection(level3_4, leaves[7]);

    // 数据点（在树周围飘动）
    const dataPoints = [];
    for (let i = 0; i < 30; i++) {
      const geo = new THREE.SphereGeometry(0.15, 8, 8);
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5)
      });
      const point = new THREE.Mesh(geo, mat);
      point.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 5
      );
      point.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      };
      scene.add(point);
      dataPoints.push(point);
    }

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 节点脉动
      root.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      // 数据点移动
      dataPoints.forEach(point => {
        point.position.add(point.userData.velocity);
        if (Math.abs(point.position.x) > 10) point.userData.velocity.x *= -1;
        if (Math.abs(point.position.y) > 6) point.userData.velocity.y *= -1;
        if (Math.abs(point.position.z) > 3) point.userData.velocity.z *= -1;
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
          <strong>可视化说明：</strong>展示决策树的层次结构。蓝色球为决策节点，绿色方块为叶子节点（分类结果），
          彩色小球代表数据点在特征空间中的分布。
        </p>
      </div>
    </div>
  );
}

export default DecisionTreeVisualization;