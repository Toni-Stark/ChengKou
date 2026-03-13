import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function GANVisualization() {
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

    // 噪声输入（左侧粒子云）
    const noiseGroup = new THREE.Group();
    for (let i = 0; i < 50; i++) {
      const geo = new THREE.SphereGeometry(0.15, 8, 8);
      const mat = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(
        -10 + (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3
      );
      noiseGroup.add(sphere);
    }
    scene.add(noiseGroup);

    // 生成器（绿色方块）
    const genGeo = new THREE.BoxGeometry(3, 4, 2);
    const genMat = new THREE.MeshPhongMaterial({ color: 0x4CAF50, transparent: true, opacity: 0.8 });
    const generator = new THREE.Mesh(genGeo, genMat);
    generator.position.set(-4, 0, 0);
    scene.add(generator);
    const genEdges = new THREE.LineSegments(new THREE.EdgesGeometry(genGeo), new THREE.LineBasicMaterial({ color: 0x000000 }));
    genEdges.position.copy(generator.position);
    scene.add(genEdges);

    // 生成样本（中间彩色球群）
    const fakeGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.SphereGeometry(0.2, 16, 16);
      const mat = new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5) });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(0 + (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2);
      fakeGroup.add(sphere);
    }
    scene.add(fakeGroup);

    // 真实样本（右侧整齐球群）
    const realGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.SphereGeometry(0.2, 16, 16);
      const mat = new THREE.MeshPhongMaterial({ color: 0x2196F3 });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(8 + (Math.random() - 0.5), (Math.random() - 0.5) * 4, (Math.random() - 0.5));
      realGroup.add(sphere);
    }
    scene.add(realGroup);

    // 判别器（红色方块）
    const disGeo = new THREE.BoxGeometry(3, 4, 2);
    const disMat = new THREE.MeshPhongMaterial({ color: 0xF44336, transparent: true, opacity: 0.8 });
    const discriminator = new THREE.Mesh(disGeo, disMat);
    discriminator.position.set(4, 0, 0);
    scene.add(discriminator);
    const disEdges = new THREE.LineSegments(new THREE.EdgesGeometry(disGeo), new THREE.LineBasicMaterial({ color: 0x000000 }));
    disEdges.position.copy(discriminator.position);
    scene.add(disEdges);

    // 连接线
    const lines = [
      [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(-5.5, 0, 0)], // 噪声→生成器
      [new THREE.Vector3(-2.5, 0, 0), new THREE.Vector3(2.5, 0, 0)], // 生成器→判别器
      [new THREE.Vector3(8, 0, 0), new THREE.Vector3(5.5, 0, 0)],    // 真实→判别器
    ];
    lines.forEach(([start, end]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x666666 })));
    });

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      noiseGroup.rotation.y = time * 0.5;
      fakeGroup.children.forEach((s, i) => {
        s.position.y += Math.sin(time + i) * 0.01;
      });
      generator.material.emissive.setHex(Math.sin(time) > 0 ? 0x1a3a1a : 0x000000);
      discriminator.material.emissive.setHex(Math.sin(time + Math.PI) > 0 ? 0x3a1a1a : 0x000000);
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
          <strong>可视化说明：</strong>左侧灰色粒子为随机噪声输入，绿色方块为生成器，红色方块为判别器，
          蓝色球为真实样本，彩色球为生成的假样本。两者交替闪烁表示对抗训练过程。
        </p>
      </div>
    </div>
  );
}

export default GANVisualization;