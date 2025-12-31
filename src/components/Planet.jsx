/** @format */

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const Planet = ({ size, color, distance, speed, name, ring, textureUrl }) => {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        textureUrl,
        (loadedTexture) => {
          setTexture(loadedTexture);
        },
        undefined,
        (err) => {
          console.error(`Error loading texture for ${name}:`, err);
        }
      );
    }
  }, [textureUrl, name]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const x = distance * Math.sin(t);
    const z = distance * Math.cos(t);
    planetRef.current.position.set(x, 0, z);
    planetRef.current.rotation.y += 0.01;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
        <meshBasicMaterial color='#ffffff' opacity={0.1} transparent side={2} />
      </mesh>

      <mesh
        ref={planetRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} color={texture ? "white" : color} />
        {ring && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size + 0.5, size + 2, 64]} />
            <meshStandardMaterial
              color={ring.color}
              side={2}
              opacity={0.5}
              transparent
            />
          </mesh>
        )}
        {hovered && (
          <Html distanceFactor={15}>
            <div className='bg-black/80 text-white px-2 py-1 rounded text-sm border border-white/20 whitespace-nowrap backdrop-blur-sm pointer-events-none select-none'>
              {name}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};

export default Planet;
