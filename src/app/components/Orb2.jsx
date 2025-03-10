



"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Orb = () => {
  const totalImages = 30;
  const totalItems = 100;
  const baseWidth = 1;
  const baseHeight = 0.6;
  const sphereRadius = 5;
  const backgroundColor = "#3b3b3b";

  const orbRef = useRef();

  useEffect(() => {
    // Basic Three.js setup (example)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    orbRef.current.appendChild(renderer.domElement);

    // Set background color
    renderer.setClearColor(backgroundColor);

    // Example: Add a sphere
    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      orbRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="orb" ref={orbRef}></div>;
};

export default Orb;