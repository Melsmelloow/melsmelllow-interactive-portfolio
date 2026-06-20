"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";

/**
 * TeleportEffect component that displays visual effects during teleportation.
 * Shows a particle burst at the start and end positions.
 */
export default function TeleportEffect() {
  const { isTeleporting, teleportTarget } = useGameStore();
  const { scene } = useThree();
  
  // Particle systems for teleport effects
  const startParticlesRef = useRef<THREE.Points | null>(null);
  const endParticlesRef = useRef<THREE.Points | null>(null);
  const effectStartTime = useRef<number>(0);
  const effectActive = useRef<boolean>(false);
  const lastTarget = useRef<THREE.Vector3 | null>(null);

  // Create particle texture
  const particleTexture = useRef<THREE.Texture | null>(null);
  
  useEffect(() => {
    // Create a simple circular gradient texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 200, 100, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    particleTexture.current = new THREE.CanvasTexture(canvas);
  }, []);

  // Create particle system
  const createParticleSystem = (position: THREE.Vector3, count: number = 50) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      // Random velocity in all directions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 2 + Math.random() * 3;
      
      velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta) + 2;
      velocities[i * 3 + 2] = speed * Math.cos(phi);
      
      // Orange/gold colors
      colors[i * 3] = 1; // R
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // G
      colors[i * 3 + 2] = 0; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.3,
      map: particleTexture.current || undefined,
      transparent: true,
      opacity: 1,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const points = new THREE.Points(geometry, material);
    points.userData = { velocities, startTime: performance.now() };
    
    return points;
  };

  // Watch for teleportation start
  useEffect(() => {
    if (isTeleporting && teleportTarget && !effectActive.current) {
      effectActive.current = true;
      effectStartTime.current = performance.now();
      lastTarget.current = teleportTarget.clone();
      
      // Get current player position for start effect
      // We'll use a rough estimate since we don't have direct access to player ref
      const startPosition = new THREE.Vector3(0, 0, 0); // Will be updated
      
      // Create start particles
      if (startParticlesRef.current) {
        scene.remove(startParticlesRef.current);
      }
      startParticlesRef.current = createParticleSystem(startPosition, 80);
      scene.add(startParticlesRef.current);
      
      // Create end particles (will be shown at the end)
      if (endParticlesRef.current) {
        scene.remove(endParticlesRef.current);
      }
      endParticlesRef.current = createParticleSystem(teleportTarget, 80);
      endParticlesRef.current.visible = false;
      scene.add(endParticlesRef.current);
    }
  }, [isTeleporting, teleportTarget, scene]);

  // Animate particles
  useFrame(() => {
    if (!effectActive.current) return;
    
    const elapsed = (performance.now() - effectStartTime.current) / 1000;
    
    // Animate start particles
    if (startParticlesRef.current) {
      const positions = startParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = startParticlesRef.current.userData.velocities as Float32Array;
      
      for (let i = 0; i < 80; i++) {
        positions[i * 3] += velocities[i * 3] * 0.016;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.016;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.016;
        
        // Gravity
        velocities[i * 3 + 1] -= 9.8 * 0.016;
      }
      
      startParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Fade out
      (startParticlesRef.current.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - elapsed * 2);
      
      if (elapsed > 0.5) {
        scene.remove(startParticlesRef.current);
        startParticlesRef.current = null;
      }
    }
    
    // Show end particles after teleport completes (around 0.8s)
    if (elapsed > 0.7 && endParticlesRef.current && lastTarget.current) {
      endParticlesRef.current.visible = true;
      
      const positions = endParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = endParticlesRef.current.userData.velocities as Float32Array;
      const targetElapsed = elapsed - 0.7;
      
      for (let i = 0; i < 80; i++) {
        positions[i * 3] = lastTarget.current!.x + velocities[i * 3] * targetElapsed;
        positions[i * 3 + 1] = lastTarget.current!.y + velocities[i * 3 + 1] * targetElapsed - 4.9 * targetElapsed * targetElapsed;
        positions[i * 3 + 2] = lastTarget.current!.z + velocities[i * 3 + 2] * targetElapsed;
      }
      
      endParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Fade out
      (endParticlesRef.current.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - targetElapsed * 2);
    }
    
    // Clean up
    if (elapsed > 1.5) {
      if (endParticlesRef.current) {
        scene.remove(endParticlesRef.current);
        endParticlesRef.current = null;
      }
      effectActive.current = false;
    }
  });

  return null;
}