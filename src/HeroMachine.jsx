import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './hero-machine.css';

/** Decorative GLB viewer for the VYOMRA homepage hero. */
export default function HeroMachine() {
  const hostRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    let frameId;
    let controls;
    let model;
    let resizeObserver;
    let disposed = false;

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1000);
    camera.position.set(4, 2.6, 6);

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);
    } catch (error) {
      setLoadError(true);
      return undefined;
    }

    scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x233747, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x9fc8e2, 1.8);
    fillLight.position.set(-5, 2, -3);
    scene.add(fillLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 0.7, 0);

    const resize = () => {
      if (!renderer || !host) return;
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    new GLTFLoader().load(
      '/models/lab-machine.glb',
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        model.scale.setScalar(3.2 / maxDimension);
        model.position.sub(center.multiplyScalar(model.scale.x));
        model.position.y -= box.min.y * model.scale.x;
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              node.material.side = THREE.DoubleSide;
              if ('metalness' in node.material) node.material.metalness = Math.min(node.material.metalness ?? 0.2, 0.65);
            }
          }
        });
        scene.add(model);
        setLoadError(false);
      },
      undefined,
      () => { if (!disposed) setLoadError(true); }
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      controls?.dispose();
      if (model) {
        model.traverse((node) => {
          if (node.geometry) node.geometry.dispose();
          if (node.material) {
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach((material) => material.dispose());
          }
        });
      }
      renderer?.dispose();
      if (renderer?.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="hero-machine-stage" aria-label="Interactive 3D equipment model">
      <div className="hero-machine-glow" />
      <div className="hero-machine-canvas" ref={hostRef} />
      {loadError && (
        <div className="hero-machine-error">
          <strong>3D model could not load</strong>
          <span>Check that public/models/lab-machine.glb exists and is a valid GLB file.</span>
        </div>
      )}
      <div className="hero-machine-hint">Drag to rotate · Scroll to zoom</div>
    </div>
  );
}
