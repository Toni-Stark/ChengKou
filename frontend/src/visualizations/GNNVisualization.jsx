import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function GNNVisualization() {
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

    // 创建图结构
    const nodeCount = 15;
    const nodes = [];
    const nodePositions = [];

    // 生成节点位置（圆形布局）
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      nodePositions.push(new THREE.Vector3(x, y, 0));
    }

    // 创建节点
    nodePositions.forEach((pos, i) => {
      const geo = new THREE.SphereGeometry(0.5, 16, 16);
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / nodeCount, 0.8, 0.5)
      });
      const node = new THREE.Mesh(geo, mat);
      node.position.copy(pos);
      scene.add(node);
      nodes.push(node);
    });

    // 创建边（连接相邻节点和一些随机连接）
    const edges = [];
    for (let i = 0; i < nodeCount; i++) {
      // 连接相邻节点
      const next = (i + 1) % nodeCount;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        nodePositions[i],
        nodePositions[next]
      ]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.5 })
      );
      scene.add(line);
      edges.push(line);

      // 随机连接
      if (Math.random() > 0.7) {
        const target = Math.floor(Math.random() * nodeCount);
        if (target !== i && Math.abs(target - i) > 2) {
          const randLineGeo = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[target]
          ]);
          const randLine = new THREE.Line(
            randLineGeo,
            new THREE.LineBasicMaterial({ color: 0x999999, transparent: true, opacity: 0.3 })
          );
          scene.add(randLine);
          edges.push(randLine);
        }
      }
    }

    // 消息传递动画（小球沿边移动）
    const messages = [];
    for (let i = 0; i < 8; i++) {
      const msgGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const msgMat = new THREE.MeshPhongMaterial({
        color: 0xFFEB3B,
        emissive: 0xFFEB3B
      });
      const msg = new THREE.Mesh(msgGeo, msgMat);
      const startNode = Math.floor(Math.random() * nodeCount);
      const endNode = (startNode + 1 + Math.floor(Math.random() * 3)) % nodeCount;
      msg.userData = {
        start: nodePositions[startNode].clone(),
        end: nodePositions[endNode].clone(),
        progress: Math.random()
      };
      scene.add(msg);
      messages.push(msg);
    }

    // 注意力权重可视化（高亮某些边）
    const attentionEdges = [];
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * edges.length);
      attentionEdges.push(edges[idx]);
    }

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 节点脉动
      nodes.forEach((node, i) => {
        node.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
      });

      // 消息传递动画
      messages.forEach(msg => {
        msg.userData.progress += 0.01;
        if (msg.userData.progress > 1) {
          msg.userData.progress = 0;
          // 随机选择新的起点和终点
          const startNode = Math.floor(Math.random() * nodeCount);
          const endNode = (startNode + 1 + Math.floor(Math.random() * 3)) % nodeCount;
          msg.userData.start = nodePositions[startNode].clone();
          msg.userData.end = nodePositions[endNode].clone();
        }
        msg.position.lerpVectors(msg.userData.start, msg.userData.end, msg.userData.progress);
      });

      // 注意力边高亮
      attentionEdges.forEach((edge, i) => {
        edge.material.opacity = 0.5 + Math.sin(time * 3 + i) * 0.3;
        edge.material.color.setHex(Math.sin(time + i) > 0 ? 0x4CAF50 : 0x666666);
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
          <strong>可视化说明：</strong>彩色球为图中的节点，灰色线为边连接。
          黄色小球沿边移动表示消息传递过程，绿色高亮的边表示注意力权重较高的连接。
        </p>
      </div>
    </div>
  );
}

export default GNNVisualization;