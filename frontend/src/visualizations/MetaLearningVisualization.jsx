import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function MetaLearningVisualization() {
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

    // 元模型（中心大球）
    const metaGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const metaMat = new THREE.MeshPhongMaterial({
      color: 0x9C27B0,
      emissive: 0x4A148C,
      shininess: 100
    });
    const metaModel = new THREE.Mesh(metaGeo, metaMat);
    scene.add(metaModel);

    // 多个任务（围绕中心的小球群）
    const tasks = [];
    const taskCount = 6;
    for (let i = 0; i < taskCount; i++) {
      const angle = (i / taskCount) * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // 任务组
      const taskGroup = new THREE.Group();
      taskGroup.position.set(x, 0, z);

      // 任务中心球
      const taskGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const taskMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / taskCount, 0.8, 0.5)
      });
      const taskSphere = new THREE.Mesh(taskGeo, taskMat);
      taskGroup.add(taskSphere);

      // 任务的少量样本（小球）
      for (let j = 0; j < 5; j++) {
        const sampleGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const sampleMat = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(i / taskCount, 0.6, 0.7)
        });
        const sample = new THREE.Mesh(sampleGeo, sampleMat);
        sample.position.set(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        taskGroup.add(sample);
      }

      scene.add(taskGroup);
      tasks.push({ group: taskGroup, sphere: taskSphere, angle });

      // 连接线到元模型
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, 0, z)
      ]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.4 })
      );
      scene.add(line);
    }

    // 知识传递粒子（从元模型到任务）
    const particles = [];
    for (let i = 0; i < 12; i++) {
      const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMat = new THREE.MeshPhongMaterial({
        color: 0xFFEB3B,
        emissive: 0xFFEB3B
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      const targetTask = tasks[Math.floor(Math.random() * tasks.length)];
      particle.userData = {
        start: new THREE.Vector3(0, 0, 0),
        end: targetTask.group.position.clone(),
        progress: Math.random()
      };
      scene.add(particle);
      particles.push(particle);
    }

    // 适应过程可视化（任务周围的轨迹）
    const adaptationPaths = [];
    tasks.forEach(task => {
      const pathPoints = [];
      for (let t = 0; t < 20; t++) {
        const angle = (t / 20) * Math.PI * 2;
        const r = 1.5 + t * 0.05;
        pathPoints.push(new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(t * 0.5) * 0.5,
          Math.sin(angle) * r
        ));
      }
      const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const pathLine = new THREE.Line(
        pathGeo,
        new THREE.LineBasicMaterial({ color: 0x00BCD4, transparent: true, opacity: 0.5 })
      );
      pathLine.position.copy(task.group.position);
      scene.add(pathLine);
      adaptationPaths.push(pathLine);
    });

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 元模型旋转和脉动
      metaModel.rotation.y = time * 0.5;
      metaModel.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      // 任务旋转
      tasks.forEach((task, i) => {
        task.group.rotation.y = time + i;
        task.sphere.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.05);
      });

      // 知识传递粒子动画
      particles.forEach(particle => {
        particle.userData.progress += 0.008;
        if (particle.userData.progress > 1) {
          particle.userData.progress = 0;
          const targetTask = tasks[Math.floor(Math.random() * tasks.length)];
          particle.userData.end = targetTask.group.position.clone();
        }
        particle.position.lerpVectors(
          particle.userData.start,
          particle.userData.end,
          particle.userData.progress
        );
      });

      // 适应路径动画
      adaptationPaths.forEach((path, i) => {
        path.rotation.y = time * 0.5 + i;
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
          <strong>可视化说明：</strong>中心紫色大球为元模型，周围彩色球群代表不同任务，
          每个任务只有少量样本（小球）。黄色粒子表示元知识从元模型传递到各个任务，
          青色轨迹展示模型快速适应新任务的过程。
        </p>
      </div>
    </div>
  );
}

export default MetaLearningVisualization;