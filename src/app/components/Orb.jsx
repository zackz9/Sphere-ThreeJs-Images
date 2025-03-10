"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls, } from "three/examples/jsm/controls/OrbitControls";

const Orb = () => {

  const encoding = THREE.LinearSRGBColorSpace;
  const totalImages = 30;
  const totalItems = 100;
  const baseWidth = 1.5;
  const baseHeight = 1
  const sphereRadius = 5;
  const backgroundColor = "#3b3b3b";

  const orbRef = useRef();

  useEffect(() => {
    // Basic Three.js setup (example)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer:true,
        powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(parseInt(backgroundColor, 16), 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.LinearSRGBColorSpace;
    renderer.gammaFactor = 2.2;   
    orbRef.current.appendChild(renderer.domElement);
   
    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 6;
    controls.maxDistance = 10;
    controls.enablePan = false;
    controls.rotateSpeed = 1.2;

    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;

    // const getRandomImagePath = () => {
    //     `/assets/img${Math.floor(Math.random() * totalImages) + 1}.png`;
    // }

    // const getRandomImagePath = () => {
    //     return `/assets/img${Math.floor(Math.random() * totalImages) + 1}.png`;
    // };

    const getRandomImagePath = () => `/assets/img${Math.floor(Math.random() * totalImages) + 1}.png`;

    const createImagePlane = (texture) => {
        const imageAspect = texture.image.width / texture.image.height;
        let width = baseWidth;
        let height = baseHeight;

        if(imageAspect > 1) {
            height = width / imageAspect;
        } else {
            width = height * imageAspect;
        }

        return new THREE.PlaneGeometry(width, height);
    }

    const loadImageMesh = (phi, theta) => {
        textureLoader.load(getRandomImagePath(), (texture) => {
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.encoding = THREE.LinearSRGBColorSpace;
            // texture.flipY = false;

            const geometry = createImagePlane(texture);
            const material = new THREE.MeshBasicMaterial({ 
                map: texture,
                side: THREE.DoubleSide,
                transparent: false,
                depthTest: true,
                depthWrite: true,
                encoding: THREE.LinearSRGBColorSpace,

            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = sphereRadius * Math.cos(theta) * Math.sin(phi);
            mesh.position.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
            mesh.position.z = sphereRadius * Math.cos(phi);

            mesh.lookAt(0, 0, 0);
            mesh.rotateY(Math.PI);

            scene.add(mesh);

            loadedCount++;

            if(loadedCount === totalItems) {
                animate();
            }



        }, undefined, (error) => {
            console.error("Error loading image", error);
        });
    };

    const createSphere = () => {

        for(let i = 0; i < totalItems; i++) {
            const phi = Math.acos(-1 + (2 * i) / totalItems);
            const theta = Math.sqrt(totalItems * Math.PI) * phi;

            loadImageMesh(phi, theta);
        }
    }

     // // Example: Add a sphere
    // const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere);

    camera.position.z = 8;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", () => {
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

    });

    
    createSphere();
    // Cleanup
    return () => {
      orbRef.current.removeChild(renderer.domElement);
    };
  }, [
    totalImages,
    totalItems,
    baseWidth,
    baseHeight,
    sphereRadius,
    backgroundColor,
  ]);

  return <div className="orb" ref={orbRef}></div>;
};

export default Orb;