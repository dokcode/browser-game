import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AffirmationScene = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Store the current mountRef value to avoid issues in cleanup
    const mountElement = mountRef.current;
    if (!mountElement) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountElement.appendChild(renderer.domElement);

    // Create particle system
    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Set up positions and rainbow colors with spherical distribution
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = Math.random() * 400;
      const theta = Math.random() * Math.PI;
      const phi = Math.random() * 2 * Math.PI;

      positions[i] = radius * Math.sin(theta) * Math.cos(phi);     // X
      positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi); // Y
      positions[i + 2] = radius * Math.cos(theta);                // Z

      const hue = (i / (particleCount * 3)) * 360;
      const color = new THREE.Color();
      color.setHSL(hue / 360, 0.8, 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.set(0, 0, 150);

    // Animation
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate particles with floating effect
      const positionsArray = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        positionsArray[i] += Math.sin(elapsedTime * 0.5 + i * 0.1) * 0.02;     // X drift
        positionsArray[i + 1] += Math.cos(elapsedTime * 0.5 + i * 0.1) * 0.05; // Y drift
        positionsArray[i + 2] += Math.sin(elapsedTime * 0.5 + i * 0.1) * 0.02; // Z drift
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Rotate the system
      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.x = elapsedTime * 0.02;

      // Dynamic rainbow effect
      const colorsArray = particleSystem.geometry.attributes.color.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        const hue = ((i / (particleCount * 3)) * 360 + elapsedTime * 30) % 360;
        const color = new THREE.Color();
        color.setHSL(hue / 360, 0.8, 0.5);
        colorsArray[i] = color.r;
        colorsArray[i + 1] = color.g;
        colorsArray[i + 2] = color.b;
      }
      particleSystem.geometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!renderer.domElement.parentElement) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Use the stored mountElement instead of mountRef.current
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }

      scene.remove(particleSystem);
      particles.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default AffirmationScene;