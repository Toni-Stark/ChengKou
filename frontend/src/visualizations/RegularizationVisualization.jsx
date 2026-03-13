import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function RegularizationVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(10, 10, 10);
    scene.add(dLight);

    // 左侧：无 Dropout 的网络（所有神经元都亮）
    const leftGroup = new THREE.Group();
    leftGroup.position.x = -6;
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 5; i++) {
        const geo = new THREE.SphereGeometry(0.3, 16, 16);
        const mat = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
        const neuron = new THREE.Mesh(geo, mat);
        neuron.position.set(layer * 2, i - 2, 0);
        leftGroup.add(neuron);
      }
    }
    scene.add(leftGroup);

    // 右侧：有 Dropout 的网络（部分神经元变暗）
    const rightGroup = new THREE.Group();
    rightGroup.position.x = 6;
    const rightNeurons = [];
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 5; i++) {
        const dropped = Math.random() > 0.5;
        const geo = new THREE.SphereGeometry(0.3, 16, 16);
        const mat = new THREE.MeshPhongMaterial({
          color: dropped ? 0xCCCCCC : 0x2196F3,
          transparent: true,
          opacity: dropped ? 0.3 : 1
        });
        const neuron = new THREE.Mesh(geo, mat);
        neuron.position.set(layer * 2, i - 2, 0);
        neuron.userData.dropped = dropped;
        rightGroup.add(neuron);
        rightNeurons.push(neuron);
      }
    }
    scene.add(rightGroup);

    // BatchNorm 示例（中间的数据流）
    const batchData = [];
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const mat = new THREE.MeshPhongMaterial({ color: 0xFF9800 });
      const cube = new THREE.Mesh(geo, mat);
      cube.position.set(0, i - 3.5, -3);
      scene.add(cube);
      batchData.push(cube);
    }

    // 归一化层（平面）
    const normGeo = new THREE.PlaneGeometry(8, 1);
    const normMat = new THREE.MeshPhongMaterial({
      color: 0x9C27B0,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const normPlane = new THREE.Mesh(normGeo, normMat);
    normPlane.position.set(0, 0, -3);
    scene.add(normPlane);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;

      // Dropout 动画：随机切换神经元状态
      if (Math.floor(time * 2) % 3 === 0) {
        rightNeurons.forEach(neuron => {
          if (Math.random() > 0.9) {
            neuron.userData.dropped = !neuron.userData.dropped;
            neuron.material.color.setHex(neuron.userData.dropped ? 0xCCCCCC : 0x2196F3);
            neuron.material.opacity = neuron.userData.dropped ? 0.3 : 1;
          }
        });
      }

      // BatchNorm 数据流动画
      batchData.forEach((cube, i) => {
        cube.position.z = -3 + Math.sin(time + i * 0.5) * 0.5;
        cube.rotation.y = time + i;
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
          <strong>可视化说明：</strong>左侧绿色网络为无 Dropout，所有神经元都激活；
          右侧蓝色网络应用了 Dropout，部分神经元被随机丢弃（变灰）。
          中间橙色方块和紫色平面展示 Batch Normalization 对数据的归一化处理。
        </p>
      </div>
    </div>
  );
}

export default RegularizationVisualization;