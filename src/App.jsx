/** @format */

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Sun from "./components/Sun";
import Planet from "./components/Planet";
import Background from "./components/Background";
import SpaceSound from "./components/SpaceSound";

const solarSystemData = [
  {
    name: "Mercury",
    size: 0.4,
    distance: 5,
    speed: 1.2,
    color: "#A0522D",
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Mercury_messanger_globe_cylindrical_projection_ngs.jpg/1024px-Mercury_messanger_globe_cylindrical_projection_ngs.jpg",
  },
  {
    name: "Venus",
    size: 0.9,
    distance: 8,
    speed: 0.9,
    color: "#DEB887",
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Venus_Magellan_C3-MDIR_Global_Mosaic_2048.jpg",
  },
  {
    name: "Earth",
    size: 1,
    distance: 12,
    speed: 0.6,
    color: "#4169E1",
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg/2048px-Solarsystemscope_texture_2k_earth_daymap.jpg",
  },
  {
    name: "Mars",
    size: 0.5,
    distance: 16,
    speed: 0.5,
    color: "#CD5C5C",
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
  },
  {
    name: "Jupiter",
    size: 2.2,
    distance: 24,
    speed: 0.3,
    color: "#DAA520",
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
  },
  {
    name: "Saturn",
    size: 1.8,
    distance: 32,
    speed: 0.2,
    color: "#F4A460",
    ring: { color: "#C0C0C0" },
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Saturn_%28planet%29_large.jpg",
  },
  {
    name: "Uranus",
    size: 1.2,
    distance: 40,
    speed: 0.15,
    color: "#87CEEB",
    ring: { color: "#E0FFFF" },
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
  },
  {
    name: "Neptune",
    size: 1.1,
    distance: 48,
    speed: 0.1,
    color: "#4682B4",
    textureUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
  },
];

function App() {
  return (
    <div className='w-full h-screen bg-black'>
      <SpaceSound />
      <Canvas camera={{ position: [0, 20, 40], fov: 60 }}>
        <Suspense
          fallback={
            <Html>
              <div className='text-white text-xl'>Loading Solar System...</div>
            </Html>
          }
        >
          <ambientLight intensity={0.4} />
          {/* Sunlight originating from the center */}
          <pointLight
            position={[0, 0, 0]}
            intensity={1000}
            distance={100}
            decay={2}
            color='#ffffff'
          />
          <Sun />
          {solarSystemData.map((planet) => (
            <Planet key={planet.name} {...planet} />
          ))}
          <Background />
          <OrbitControls enableZoom={true} maxDistance={100} minDistance={5} />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
