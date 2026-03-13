import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function TransformerVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 序列 token（底部一排球）
    const seqLen = 8;
    const tokens = [];
    for (let i = 0; i < seqLen; i++) {
      const geo = new THREE.SphereGeometry(0.5, 16, 16);
      const mat = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
      const token = new THREE.Mesh(geo, mat);
      token.position.set((i - seqLen / 2) * 2.5, -5, 0);
      scene.add(token);
      tokens.push(token);
    }

    // 多头注意力连接线（每个 token 与其他 token 的注意力）
    const attentionLines = [];
    for (let i = 0; i < seqLen; i++) {
      for (let j = 0; j < seqLen; j++) {
        if (i !== j) {
          const weight = Math.random();
          if (weight > 0.5) {
            const points = [tokens[i].position.clone(), tokens[j].position.clone()];
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const mat = new THREE.LineBasicMaterial({
              color: new THREE.Color().setHSL(0.6, 1, 0.5),
              transparent: true,
              opacity: weight * 0.5
            });
            const line = new THREE.Line(geo, mat);
            scene.add(line);
            attentionLines.push({ line, weight });
          }
        }
      }
    }

    // 多头注意力层（中间一排方块）
    const heads = 4;
    for (let h = 0; h < heads; h++) {
      const geo = new THREE.BoxGeometry(3, 1.5, 1);
      const mat = new THREE.MeshPhongMaterial({ color: 0x2196F3, transparent: true, opacity: 0.8 });
      const head = new THREE.Mesh(geo, mat);
      head.position.set((h - heads / 2) * 4 + 2, 0, 0);
      scene.add(head);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x000000 }));
      edges.position.copy(head.position);
      scene.add(edges);
    }

    // 前馈层（上方大方块）
    const ffGeo = new THREE.BoxGeometry(14, 2, 1);
    const ffMat = new THREE.MeshPhongMaterial({ color: 0xFF9800, transparent: true, opacity: 0.8 });
    const ffLayer = new THREE.Mesh(ffGeo, ffMat);
    ffLayer.position.set(0, 4, 0);
    scene.add(ffLayer);
    const ffEdges = new THREE.LineSegments(new THREE.EdgesGeometry(ffGeo), new THREE.LineBasicMaterial({ color: 0x000000 }));
    ffEdges.position.copy(ffLayer.position);
    scene.add(ffEdges);

    // 输出层
    const outGeo = new THREE.BoxGeometry(14, 1.5, 1);
    const outMat = new THREE.MeshPhongMaterial({ color: 0x9C27B0, transparent: true, opacity: 0.8 });
    const outLayer = new THREE.Mesh(outGeo, outMat);
    outLayer.position.set(0, 7, 0);
    scene.add(outLayer);
    const outEdges = new THREE.LineSegments(new THREE.EdgesGeometry(outGeo), new THREE.LineBasicMaterial({ color: 0x000000 }));
    outEdges.position.copy(outLayer.position);
    scene.add(outEdges);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;

      // 注意力线动画
      attentionLines.forEach(({ line, weight }, i) => {
        line.material.opacity = (Math.sin(time + i * 0.3) * 0.5 + 0.5) * weight * 0.6;
      });

      // token 脉动
      tokens.forEach((token, i) => {
        token.scale.setScalar(1 + Math.sin(time + i * 0.5) * 0.1);
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
          <strong>可视化说明：</strong>底部绿色球为输入 token，蓝色线为注意力权重（越亮表示注意力越强），
          蓝色方块为多头注意力层，橙色为前馈层，紫色为输出层。
        </p>
      </div>
    </div>
  );
}

export default TransformerVisualization;