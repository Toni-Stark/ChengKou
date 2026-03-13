import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function BayesianNetworkVisualization() {
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

    const createLabel = (text, pos, color = '#000000', scale = 4) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = color;
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, 128, 40);
      const texture = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
      sprite.position.copy(pos);
      sprite.scale.set(scale, 1, 1);
      scene.add(sprite);
    };

    // 贝叶斯网络节点定义（DAG结构）
    const nodes = [
      { id: 'rain',     label: '下雨',     pos: new THREE.Vector3(-4, 4, 0),  color: 0x2196F3 },
      { id: 'sprinkler',label: '洒水器',   pos: new THREE.Vector3(4, 4, 0),   color: 0x4CAF50 },
      { id: 'wet',      label: '草地湿润', pos: new THREE.Vector3(0, 0, 0),   color: 0xFF9800 },
      { id: 'slip',     label: '地面滑',   pos: new THREE.Vector3(-4, -4, 0), color: 0xF44336 },
      { id: 'umbrella', label: '带伞',     pos: new THREE.Vector3(4, -4, 0),  color: 0x9C27B0 }
    ];

    const meshes = {};
    nodes.forEach(node => {
      const geo = new THREE.SphereGeometry(1, 32, 32);
      const mat = new THREE.MeshPhongMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(node.pos);
      scene.add(mesh);
      meshes[node.id] = mesh;

      createLabel(node.label, new THREE.Vector3(node.pos.x, node.pos.y - 1.8, node.pos.z), '#333333');
    });

    // 有向边（DAG）
    const edges = [
      ['rain', 'wet'],
      ['sprinkler', 'wet'],
      ['wet', 'slip'],
      ['wet', 'umbrella'],
      ['rain', 'umbrella']
    ];

    edges.forEach(([from, to]) => {
      const fromPos = meshes[from].position;
      const toPos = meshes[to].position;
      const dir = new THREE.Vector3().subVectors(toPos, fromPos);
      const length = dir.length() - 2;
      const start = fromPos.clone().addScaledVector(dir.clone().normalize(), 1);
      const arrowHelper = new THREE.ArrowHelper(
        dir.normalize(),
        start,
        length,
        0x666666,
        0.5,
        0.3
      );
      scene.add(arrowHelper);
    });

    // 条件概率表（CPT）可视化 - 小方块
    const cptPositions = [
      new THREE.Vector3(-4, 4, 3),
      new THREE.Vector3(4, 4, 3),
      new THREE.Vector3(0, 0, 3)
    ];
    const cptColors = [0x2196F3, 0x4CAF50, 0xFF9800];

    cptPositions.forEach((pos, i) => {
      const rows = 2;
      const cols = 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const prob = Math.random();
          const boxGeo = new THREE.BoxGeometry(0.4, prob * 1.5 + 0.2, 0.4);
          const boxMat = new THREE.MeshPhongMaterial({
            color: cptColors[i],
            transparent: true,
            opacity: 0.7
          });
          const box = new THREE.Mesh(boxGeo, boxMat);
          box.position.set(
            pos.x + (c - 0.5) * 0.6,
            pos.y + (prob * 1.5 + 0.2) / 2,
            pos.z + (r - 0.5) * 0.6
          );
          scene.add(box);
        }
      }
    });

    createLabel('贝叶斯网络 (DAG)', new THREE.Vector3(0, 7, 0), '#1976D2', 5);

    // 信念传播粒子
    const beliefParticles = [];
    edges.forEach(([from, to]) => {
      for (let i = 0; i < 3; i++) {
        const geo = new THREE.SphereGeometry(0.12, 8, 8);
        const mat = new THREE.MeshPhongMaterial({
          color: 0xFFEB3B,
          emissive: 0xFFEB3B,
          emissiveIntensity: 0.6
        });
        const particle = new THREE.Mesh(geo, mat);
        particle.userData = {
          from: meshes[from].position.clone(),
          to: meshes[to].position.clone(),
          progress: Math.random()
        };
        scene.add(particle);
        beliefParticles.push(particle);
      }
    });

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 节点脉动
      nodes.forEach((node, i) => {
        meshes[node.id].scale.setScalar(1 + Math.sin(time * 2 + i) * 0.08);
      });

      // 信念传播粒子
      beliefParticles.forEach(p => {
        p.userData.progress += 0.008;
        if (p.userData.progress > 1) p.userData.progress = 0;
        p.position.lerpVectors(p.userData.from, p.userData.to, p.userData.progress);
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
          <strong>可视化说明：</strong>展示经典的"草地湿润"贝叶斯网络。
          节点表示随机变量（下雨、洒水器、草地湿润、地面滑、带伞），
          有向箭头表示条件依赖关系，右侧小方块表示条件概率表（CPT）。
          黄色粒子展示信念传播过程。
        </p>
      </div>
    </div>
  );
}

export default BayesianNetworkVisualization;
