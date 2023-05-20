import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

const MyScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Camera
    const fov = 50;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Orbiter
    const controls = new OrbitControls(camera, renderer.domElement);

    // Create the scene
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '../public/cyberpunk_city.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      }
    );

    function render() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // Clean up
    return () => {
      controls.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default MyScene;