/** @format */

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Sun = () => {
  const sunRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Map_of_the_full_sun.jpg/1024px-Map_of_the_full_sun.jpg",
      (loadedTexture) => setTexture(loadedTexture),
      undefined,
      (err) => console.error("Error loading Sun texture:", err)
    );
  }, []);

  useFrame((state, delta) => {
    sunRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group>
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          emissive='#FDB813'
          emissiveIntensity={3}
          color='#FDB813'
          toneMapped={false}
        />
        <pointLight distance={100} intensity={2} color='#ffffff' />
      </mesh>
    </group>
  );
};

export default Sun;
