"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls, } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

const Orb = () => {

    const [isLoading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [showModal, setShowModal] = useState(false);

    const encoding = THREE.LinearSRGBColorSpace;
    const totalImages = 30;
    const totalItems = 100;
    const baseWidth = 1.5;
    const baseHeight = 1
    const sphereRadius = 5;
    const backgroundColor = "#3b3b3b";

    const orbRef = useRef();

    const images = [
        { path: '/assets/img1.png', description: 'Snipercar image 1' },
        { path: '/assets/img2.png', description: 'Snipercar image 2' },
        { path: '/assets/img3.png', description: 'Snipercar image 3' },
        { path: '/assets/img4.png', description: 'Snipercar image 4' },
        { path: '/assets/img5.png', description: 'Snipercar image 5' },
        { path: '/assets/img6.png', description: 'Snipercar image 6' },
        { path: '/assets/img7.png', description: 'Snipercar image 7' },
        { path: '/assets/img8.png', description: 'Snipercar image 8' },
        { path: '/assets/img9.png', description: 'Snipercar image 9' },
        { path: '/assets/img10.png', description: 'Snipercar image 10' },
        { path: '/assets/img11.png', description: 'Snipercar image 11' },
        { path: '/assets/img12.png', description: 'Snipercar image 12' },
        { path: '/assets/img13.png', description: 'Snipercar image 13' },
        { path: '/assets/img14.png', description: 'Snipercar image 14' },
        { path: '/assets/img15.png', description: 'Snipercar image 15' },
        { path: '/assets/img16.png', description: 'Snipercar image 16' },
        { path: '/assets/img17.png', description: 'Snipercar image 17' },
        { path: '/assets/img18.png', description: 'Snipercar image 18' },
        { path: '/assets/img19.png', description: 'Snipercar image 19' },
        { path: '/assets/img20.png', description: 'Snipercar image 20' },
        { path: '/assets/img21.png', description: 'Snipercar image 21' },
        { path: '/assets/img22.png', description: 'Snipercar image 22' },
        { path: '/assets/img23.png', description: 'Snipercar image 23' },
        { path: '/assets/img24.png', description: 'Snipercar image 24' },
        { path: '/assets/img25.png', description: 'Snipercar image 25' },
        { path: '/assets/img26.png', description: 'Snipercar image 26' },
        { path: '/assets/img27.png', description: 'Snipercar image 27' },
        { path: '/assets/img28.png', description: 'Snipercar image 28' },
        { path: '/assets/img29.png', description: 'Snipercar image 29' },
        { path: '/assets/img30.png', description: 'Snipercar image 30' }
    ]

  useEffect(() => {

    // Setup Scene and Camera and Renderer
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

    // Add Raycasting for Click Events

    const raycast = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycast.setFromCamera(mouse, camera);
        const intersects = raycast.intersectObjects(scene.children);
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            if (clickedMesh.imageData) {
                setSelectedImage(clickedMesh.imageData);
                setShowModal(true);
            }
        }
    });
   
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

        const randomIndex = Math.floor(Math.random() * totalImages);
        const selectedImage = images[randomIndex];

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
            mesh.imageData = selectedImage;

            mesh.position.x = sphereRadius * Math.cos(theta) * Math.sin(phi);
            mesh.position.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
            mesh.position.z = sphereRadius * Math.cos(phi);

            mesh.lookAt(0, 0, 0);
            mesh.rotateY(Math.PI);

            scene.add(mesh);

            loadedCount++;

            if(loadedCount === totalItems) {
                animate();
                setLoading(false);
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


  

  return <div className="orb" ref={orbRef}>
    {isLoading && <div className="loading-indicator">Loading...</div>}
    
    {showModal && (
        <div className="modal">
            <img src={selectedImage.path} alt={selectedImage.description} />
            <div className="modal-content">
                <p><span>Description:</span>
                    <span>
                        {selectedImage.description} 
                    </span>
                </p>
                <button onClick={() => setShowModal(false)}>X</button>
            </div>
        </div>
    )}
    </div>;
};

export default Orb;