import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function NaiveBayesVisualization() {
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

    // 先验概率（左侧）
    const priorGroup = new THREE.Group();
    priorGroup.position.set(-8, 0, 0);

    // 先验概率球
    const priorGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const priorMat = new THREE.MeshPhongMaterial({
      color: 0x4CAF50,
      emissive: 0x2E7D32,
      emissiveIntensity: 0.3
    });
    const priorSphere = new THREE.Mesh(priorGeo, priorMat);
    priorGroup.add(priorSphere);

    // 先验概率标签
    const createLabel = (text, pos, color = '#000000') => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      sprite.scale.set(4, 1, 1);
      scene.add(sprite);
    };

    createLabel('P(A)', new THREE.Vector3(-8, -3, 0));
    scene.add(priorGroup);

    // 似然函数（中间）
    const likelihoodGroup = new THREE.Group();
    likelihoodGroup.position.set(0, 0, 0);

    // 似然函数 - 多个条件概率
    const conditions = 3;
    const conditionSpheres = [];
    for (let i = 0; i < conditions; i++) {
      const angle = (i / conditions) * Math.PI * 2 - Math.PI / 2;
      const radius = 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const condGeo = new THREE.SphereGeometry(0.8, 24, 24);
      const condMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 + i * 0.1, 0.7, 0.5)
      });
      const condSphere = new THREE.Mesh(condGeo, condMat);
      condSphere.position.set(x, 0, z);
      likelihoodGroup.add(condSphere);
      conditionSpheres.push(condSphere);

      // 连线到中心
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x666666 }));
      likelihoodGroup.add(line);
    }

    // 中心似然球
    const centerGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const centerMat = new THREE.MeshPhongMaterial({
      color: 0x2196F3,
      emissive: 0x1565C0,
      emissiveIntensity: 0.3
    });
    const centerSphere = new THREE.Mesh(centerGeo, centerMat);
    likelihoodGroup.add(centerSphere);

    createLabel('P(B|A)', new THREE.Vector3(0, -3, 0));
    scene.add(likelihoodGroup);

    // 后验概率（右侧）
    const posteriorGroup = new THREE.Group();
    posteriorGroup.position.set(8, 0, 0);

    const posteriorGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const posteriorMat = new THREE.MeshPhongMaterial({
      color: 0xFF9800,
      emissive: 0xE65100,
      emissiveIntensity: 0.4
    });
    const posteriorSphere = new THREE.Mesh(posteriorGeo, posteriorMat);
    posteriorGroup.add(posteriorSphere);

    createLabel('P(A|B)', new THREE.Vector3(8, -3, 0));
    scene.add(posteriorGroup);

    // 贝叶斯公式连接线
    const arrow1Points = [priorGroup.position, likelihoodGroup.position];
    const arrow1Geo = new THREE.BufferGeometry().setFromPoints(arrow1Points);
    const arrow1 = new THREE.Line(
      arrow1Geo,
      new THREE.LineBasicMaterial({
        color: 0x4CAF50,
        linewidth: 2
      })
    );
    scene.add(arrow1);

    const arrow2Points = [likelihoodGroup.position, posteriorGroup.position];
    const arrow2Geo = new THREE.BufferGeometry().setFromPoints(arrow2Points);
    const arrow2 = new THREE.Line(
      arrow2Geo,
      new THREE.LineBasicMaterial({
        color: 0xFF9800,
        linewidth: 2
      })
    );
    scene.add(arrow2);

    // 数据点（分类示例）
    const dataPoints = [];
    const classColors = [0xFF5252, 0x4CAF50, 0x2196F3];

    for (let i = 0; i < 30; i++) {
      const classIdx = Math.floor(Math.random() * 3);
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 4;

      const pointGeo = new THREE.SphereGeometry(0.15, 12, 12);
      const pointMat = new THREE.MeshPhongMaterial({
        color: classColors[classIdx],
        transparent: true,
        opacity: 0.7
      });
      const point = new THREE.Mesh(pointGeo, pointMat);
      point.position.set(x, y, z);
      scene.add(point);
      dataPoints.push({ mesh: point, class: classIdx });
    }

    // 贝叶斯公式标签
    createLabel('Naive Bayes', new THREE.Vector3(0, 5, 0));
    createLabel('Prior', new THREE.Vector3(-8, 2.5, 0));
    createLabel('Likelihood', new THREE.Vector3(0, 2.5, 0));
    createLabel('Posterior', new THREE.Vector3(8, 2.5, 0));

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // 先验概率旋转
      priorSphere.rotation.y = time;
      priorSphere.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      // 似然函数条件概率旋转
      conditionSpheres.forEach((sphere, i) => {
        sphere.rotation.y = time + i;
        sphere.position.y = Math.sin(time * 2 + i) * 0.5;
      });

      // 中心似然球旋转
      centerSphere.rotation.y = -time * 0.5;
      centerSphere.scale.setScalar(1 + Math.sin(time * 3) * 0.08);

      // 后验概率脉动
      posteriorSphere.rotation.y = time * 0.7;
      posteriorSphere.scale.setScalar(1 + Math.sin(time * 2.5) * 0.12);

      // 数据点浮动
      dataPoints.forEach((point, i) => {
        point.mesh.position.y += Math.sin(time * 2 + i * 0.5) * 0.01;
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
          <strong>可视化说明：</strong>展示朴素贝叶斯分类原理。
          左侧绿色球为先验概率 P(A)，中间蓝色区域为似然函数 P(B|A)（包含多个条件概率），
          右侧橙色球为后验概率 P(A|B)。周围的彩色小球代表不同类别的数据点。
          朴素贝叶斯假设特征之间相互独立，通过贝叶斯定理计算后验概率进行分类。
        </p>
      </div>
    </div>
  );
}

export default NaiveBayesVisualization;
