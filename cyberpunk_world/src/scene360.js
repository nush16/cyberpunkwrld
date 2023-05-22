import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import cyberpunkVideo from './cyberpunk_video_4k.mp4';

const Scene = ({ speed }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // create a scene
    const scene = new THREE.Scene();

    // create a perspective camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      100
    );

    // create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // append the renderer to the container
    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    // update renderer size on window resize
    const handleWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleWindowResize);

    // create a sphere geometry
    const geometry = new THREE.SphereGeometry(15, 32, 16);

    // create a VideoTexture
    const videoElement = document.createElement('video');
    videoElement.src = cyberpunkVideo;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.crossOrigin = 'anonymous';
    videoElement.playbackRate = 0.1; // Set the playback rate
    videoElement.play();
    const texture = new THREE.VideoTexture(videoElement);

    // create a material from the texture
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // need to use back side - surface of the sphere is facing outside but we put the camera inside the sphere
    material.side = THREE.BackSide;

    // create a mesh and add it to the scene
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // zoom in / out
    const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
    const handleWheel = (e) => {
      camera.fov = clamp(camera.fov + e.deltaY / 10, 10, 120);
      // need to call this function after changing most of the properties in PerspectiveCamera
      camera.updateProjectionMatrix();
    };
    renderer.domElement.addEventListener('wheel', handleWheel);

    // rotate camera
    let mouseDown = false;
    const handleMouseDown = (e) => {
      if (e.button === 0) mouseDown = true;
    };
    const handleMouseUp = (e) => {
      if (e.button === 0) mouseDown = false;
    };
    const handleMouseMove = (e) => {
      if (!mouseDown) return;

      const { movementX, movementY } = e;

      // rotateX: rotate vertically since x-axis is horizontal
      const rotateX = movementY / 100;
      const rotateY = movementX / 100;

      camera.rotateX(rotateX);
      camera.rotateY(rotateY);
    };
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    // cleanup function
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [speed]);

  return <div ref={containerRef} />;
};

export default Scene;